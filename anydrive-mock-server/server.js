/**
 * AnyDrive MOCK auth server — development helper, NOT the real backend.
 * Zero dependencies (Node >= 18). User data is stored in ./data/users.json.
 *
 *   node server.js            -> http://localhost:5001/api
 *
 * Implements the contract described in the frontend's README_AUTH.md.
 */
import http from 'node:http'
import crypto from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const PORT = Number(process.env.PORT || 5001)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const JWT_SECRET = process.env.JWT_SECRET || 'mock-secret-do-not-use-anywhere-real'
const TOKEN_TTL_SECONDS = 60 * 60 // 1 hour
const DELAY_MS = Number(process.env.DELAY_MS ?? 250) // fake latency
const USERS_FILE = fileURLToPath(new URL('./data/users.json', import.meta.url))

// ---------- tiny helpers ----------
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
const sign = (data) => crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url')
function signJwt(payload) {
  const head = b64({ alg: 'HS256', typ: 'JWT' })
  const body = b64({ ...payload, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS })
  return `${head}.${body}.${sign(`${head}.${body}`)}`
}
function verifyJwt(token) {
  const [head, body, sig] = String(token).split('.')
  if (!head || !body || !sig || sign(`${head}.${body}`) !== sig) return null
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
  return payload.exp > Date.now() / 1000 ? payload : null
}

// ---------- data ----------
const users = JSON.parse(readFileSync(USERS_FILE, 'utf8'))
const resetTokens = new Map() // token -> userId
let nextId = Math.max(0, ...users.map(({ id }) => Number(id.slice(2)) || 0)) + 1

function saveUsers() {
  writeFileSync(USERS_FILE, `${JSON.stringify(users, null, 2)}\n`)
}

function addUser(data) {
  const { password = '', ...profile } = data
  const user = {
    id: `u-${nextId++}`,
    phone: '',
    permissions: [],
    ...profile,
    password,
  }
  users.push(user)
  saveUsers()
  return user
}

const publicUser = ({ password: _password, ...rest }) => rest
const findByEmail = (email) => users.find((u) => u.email.toLowerCase() === String(email || '').trim().toLowerCase())

// ---------- http plumbing ----------
class HttpError extends Error {
  constructor(status, message) { super(Array.isArray(message) ? message.join(' ') : message); this.status = status; this.payload = message }
}

const corsHeaders = (req) => ({
  'Access-Control-Allow-Origin': req.headers.origin || '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  Vary: 'Origin',
})

function send(req, res, status, body, extra = {}) {
  const isString = typeof body === 'string'
  res.writeHead(status, {
    ...corsHeaders(req),
    'Content-Type': isString ? 'text/html; charset=utf-8' : 'application/json',
    ...extra,
  })
  res.end(body === undefined ? '' : isString ? body : JSON.stringify(body))
}

const readJson = (req) =>
  new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (c) => { raw += c; if (raw.length > 1e6) req.destroy() })
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}) } catch { reject(new HttpError(400, 'Invalid JSON body.')) } })
  })

function authUser(req) {
  const header = req.headers.authorization || ''
  const payload = header.startsWith('Bearer ') ? verifyJwt(header.slice(7)) : null
  const user = payload && users.find((u) => u.id === payload.sub)
  if (!user) throw new HttpError(401, 'Unauthorized')
  return user
}

const issue = (user) => ({ token: signJwt({ sub: user.id, role: user.role }), user: publicUser(user) })

// ---------- validation (the real backend must do this too) ----------
function validateRegistration(b, { agency = false } = {}) {
  const errors = []
  if (!b.firstName?.trim()) errors.push('firstName should not be empty.')
  if (!b.lastName?.trim()) errors.push('lastName should not be empty.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(b.email || '')) errors.push('email must be a valid email.')
  const p = b.password || ''
  if (p.length < 8 || !/[a-z]/.test(p) || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) {
    errors.push('password must be at least 8 characters with upper case, lower case and a number.')
  }
  if (agency) {
    for (const f of ['companyName', 'licenseNumber', 'address']) if (!b[f]?.trim()) errors.push(`${f} should not be empty.`)
  }
  if (errors.length) throw new HttpError(400, errors)
  if (findByEmail(b.email)) throw new HttpError(409, 'An account with this email already exists.')
}

// ---------- routes ----------
const routes = {
  'POST /api/auth/login': async (req) => {
    const b = await readJson(req)
    const user = findByEmail(b.email)
    if (!user || user.password !== (b.password || '')) throw new HttpError(401, 'Invalid email or password.')
    if (user.agencyStatus === 'PENDING') throw new HttpError(403, 'Your agency account is still waiting for admin approval.')
    if (user.agencyStatus === 'REJECTED') throw new HttpError(403, 'Your agency registration was rejected.')
    return [200, issue(user)]
  },

  'POST /api/auth/register': async (req) => {
    const b = await readJson(req)
    validateRegistration(b)
    const user = addUser({ email: b.email.trim(), password: b.password, firstName: b.firstName.trim(), lastName: b.lastName.trim(), phone: b.phone?.trim() || '', role: 'CUSTOMER' })
    return [201, issue(user)]
  },

  'POST /api/auth/register-agency': async (req) => {
    const b = await readJson(req)
    validateRegistration(b, { agency: true })
    addUser({
      email: b.email.trim(), password: b.password, firstName: b.firstName.trim(), lastName: b.lastName.trim(), phone: b.phone?.trim() || '',
      companyName: b.companyName.trim(), licenseNumber: b.licenseNumber.trim(), address: b.address.trim(),
      role: 'AGENCY_ADMIN', agencyStatus: 'PENDING',
    })
    return [201, { message: 'Registration received. An admin will review your agency.' }]
  },

  'GET /api/auth/me': async (req) => [200, publicUser(authUser(req))],

  'POST /api/auth/logout': async () => [200, { message: 'Logged out.' }],

  'POST /api/auth/forgot-password': async (req) => {
    const b = await readJson(req)
    const user = findByEmail(b.email)
    if (user) {
      const token = crypto.randomBytes(16).toString('hex')
      resetTokens.set(token, user.id)
      console.log(`\n[mock mail] Reset link for ${user.email}:\n  ${FRONTEND_URL}/reset-password?token=${token}\n`)
    }
    return [200, { message: 'If the account exists, an email was sent.' }] // same answer either way
  },

  'POST /api/auth/reset-password': async (req) => {
    const b = await readJson(req)
    const userId = resetTokens.get(b.token)
    if (!userId) throw new HttpError(400, 'This link is invalid or expired.')
    const p = b.password || ''
    if (p.length < 8 || !/[a-z]/.test(p) || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) throw new HttpError(400, 'password is too weak.')
    users.find((u) => u.id === userId).password = p
    saveUsers()
    resetTokens.delete(b.token)
    return [200, { message: 'Password updated.' }]
  },

  // --- fake Google OAuth: /auth/google -> consent page -> callback -> frontend/#token=
  'GET /api/auth/google': async () => [302, '', { Location: '/api/auth/google/consent' }],

  'GET /api/auth/google/consent': async () => [200, `<!doctype html><meta charset="utf-8"><title>Fake Google</title>
<body style="font-family:system-ui;display:grid;place-items:center;min-height:100vh;background:#f1f3f4">
<form method="get" action="/api/auth/google/callback" style="background:#fff;padding:32px;border-radius:12px;box-shadow:0 2px 12px #0003;max-width:360px;text-align:center">
<h2 style="margin:0 0 8px">Sign in with Google <small style="color:#999">(mock)</small></h2>
<p style="color:#555">Choose the fake account to continue to AnyDrive.</p>
<select name="email" style="width:100%;padding:10px;margin:12px 0"><option value="google.user@gmail.com">google.user@gmail.com</option></select>
<button style="width:100%;padding:12px;border:0;border-radius:8px;background:#1a73e8;color:#fff;font-weight:600;cursor:pointer">Continue</button>
</form></body>`],

  'GET /api/auth/google/callback': async (req, url) => {
    const email = url.searchParams.get('email') || 'google.user@gmail.com'
    const user = findByEmail(email) ?? addUser({ email, firstName: 'Google', lastName: 'User', role: 'CUSTOMER', provider: 'google' })
    const { token } = issue(user)
    return [302, '', { Location: `${FRONTEND_URL}/auth/callback#token=${token}` }]
  },

  // --- dev helpers (not part of the real API) ---
  'GET /api/_dev/users': async () => [200, users.map(publicUser)],
  'POST /api/_dev/approve-agency': async (req) => {
    const b = await readJson(req)
    const user = findByEmail(b.email)
    if (!user || user.agencyStatus !== 'PENDING') throw new HttpError(404, 'No pending agency with this email.')
    user.agencyStatus = 'APPROVED'
    user.permissions = ['fleet:manage', 'bookings:manage', 'employees:manage']
    saveUsers()
    return [200, publicUser(user)]
  },
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  if (req.method === 'OPTIONS') return send(req, res, 204)

  const handler = routes[`${req.method} ${url.pathname}`]
  if (!handler) return send(req, res, 404, { statusCode: 404, message: `Cannot ${req.method} ${url.pathname}` })

  try {
    await new Promise((r) => setTimeout(r, DELAY_MS))
    const [status, body, headers] = await handler(req, url)
    send(req, res, status, body, headers)
  } catch (err) {
    if (err instanceof HttpError) return send(req, res, err.status, { statusCode: err.status, message: err.payload })
    console.error(err)
    send(req, res, 500, { statusCode: 500, message: 'Internal server error' })
  }
})

server.listen(PORT, () => {
  console.log(`AnyDrive MOCK server on http://localhost:${PORT}/api  (frontend expected at ${FRONTEND_URL})`)
  console.log('Demo accounts (password Demo1234): customer@ / agency@ / employee@ / admin@ / pending@  demo.com')
})
