# 🔐 Authentication & Authorization — AnyDrive Frontend

This document explains how **login, sessions, roles, route protection and the role-based navbar** work in the frontend.
The frontend talks **only to a real REST API** (`VITE_API_URL`). Until the NestJS backend exists, you can use the separate **mock server** (kept *outside* this project, see section 1).

---

## 1. Quick start

```bash
# 1) the fake backend (separate folder, NOT in this repo)
cd ../anydrive-mock-server && node server.js        # http://localhost:5001/api

# 2) the frontend
cd car-rental-frontend
npm install
cp .env.example .env                                  # Vite proxies /api to the mock server
npm run dev
```

Vite proxies frontend `/api` requests to `MOCK_API_TARGET` (default `http://localhost:5001`). When the real backend is ready, only change `VITE_API_URL` in `.env`. **No frontend code changes** and nothing to delete: this repo contains no mock code.

### Demo accounts (provided by the mock server, password `Demo1234`)

| Role     | Email               | Lands on    | Notes                                                    |
| -------- | ------------------- | ----------- | -------------------------------------------------------- |
| Customer | `customer@demo.com` | `/customer` |                                                          |
| Agency (admin) | `agency@demo.com` | `/agency` | Has `fleet:manage` → can add/edit cars                  |
| Agency (employee) | `employee@demo.com` | `/agency` | No `fleet:manage` → **403** on add/edit car        |
| Admin    | `admin@demo.com`    | `/admin`    | Backend role `SUPER_ADMIN`                               |
| Pending agency | `pending@demo.com` | —        | Login **refused** (waiting for approval)                 |

You can also register a customer, register an agency (stays *pending*), or use **Continue with Google** (a fake Google page served by the mock server).

---

## 2. The four profiles

| Profile  | Who                         | Logged in? |
| -------- | --------------------------- | ---------- |
| **Guest**    | Visitor                 | No         |
| **Customer** | Rents cars              | Yes        |
| **Agency**   | Rental company staff    | Yes        |
| **Admin**    | Platform administrator  | Yes        |

The UI works with these 4 roles (`src/constants/roles.js`).
The backend may use finer roles; `normalizeRole()` groups them:

| Backend role                                   | Frontend role |
| ---------------------------------------------- | ------------- |
| `CUSTOMER`                                     | `customer`    |
| `AGENCY`, `AGENCY_EMPLOYEE`, `AGENCY_MANAGER`, `AGENCY_ADMIN` | `agency` |
| `ADMIN`, `SUPER_ADMIN`                         | `admin`       |
| anything else / not logged in                  | `guest`       |

The original role is kept in `user.backendRole`, and the user's `permissions` array allows **fine-grained checks** inside one area (e.g. an agency *employee* vs an agency *admin*).

---

## 3. What is the role-based navbar?

One `Navbar` component. It reads the role from `useAuth()` and gets its links from `src/constants/navigation.js`.
Links change **automatically** on login/logout — no page reload.

| Role         | Always visible                                       | "More" dropdown                                         | Right side                               |
| ------------ | ---------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------- |
| **Guest**    | Home · Cars · About · Contact                        | —                                                       | **Login** · **Sign up** (orange)         |
| **Customer** | Home · Cars · Dashboard · My Bookings · Favorites    | Payments · My Reviews                                   | Avatar menu: Dashboard, My Profile, Log out |
| **Agency**   | Dashboard · Fleet · Bookings · Calendar              | Earnings · Reviews · Agency Profile                     | Avatar menu: Dashboard, Agency Profile, Log out |
| **Admin**    | Dashboard · Users · Agencies · Approvals             | Cars · Bookings · Payments · Reports · Reviews · Settings | Avatar menu: Dashboard, Settings, Log out |

- The active link has an **orange underline**.
- On mobile (< 1024 px) a hamburger opens a panel with **all** links + logout.
- The avatar menu shows name, email and a **role badge**.
- The **Footer** also adapts: its "Your account" column changes per role.
- Customer / Agency / Admin pages show a thin strip under the navbar ("Customer area", "Agency workspace", "Admin console").

To add or rename a link, edit **only** `constants/navigation.js`.

---

## 4. Route access (who can open what)

| URL                              | Guest | Customer | Agency | Admin | Layout           |
| -------------------------------- | :---: | :------: | :----: | :---: | ---------------- |
| `/`, `/cars`, `/cars/:id`, `/about`, `/contact`, `/403`, `/500` | ✅ | ✅ | ✅ | ✅ | `PublicLayout` |
| `/login`, `/register/*`, `/forgot-password`, `/reset-password`  | ✅ | ↪ dashboard | ↪ dashboard | ↪ dashboard | `AuthLayout` |
| `/auth/callback` (Google return) | ✅ | ✅ | ✅ | ✅ | `AuthLayout` |
| `/customer/*` (incl. checkout & booking confirmation) | ↪ login | ✅ | 403 | 403 | `CustomerLayout` |
| `/agency/*`                      | ↪ login | 403 | ✅ | 403 | `AgencyLayout` |
| `/agency/fleet/new`, `/agency/fleet/:id/edit` | ↪ login | 403 | ✅ **only with `fleet:manage`** | 403 | `AgencyLayout` |
| `/admin/*`                       | ↪ login | 403 | 403 | ✅ | `AdminLayout` |
| unknown URL                      | 404 page | 404 | 404 | 404 | `PublicLayout` |

`↪ login` = redirected to `/login` (the wanted page is remembered). `↪ dashboard` = redirected to the user's own home.

> Every page that exists today is a **title-only placeholder** with an **"Access: …" badge**, so you can see who is allowed to open it. Real content will replace them feature by feature.

---

## 5. How it works

### 5.1 Files

```
src/
├── constants/
│   ├── roles.js            ROLES + normalizeRole() (backend role -> UI role)
│   ├── routes.js           ROUTES, roleHome(), canAccessPath(), postLoginPath()
│   ├── navigation.js       Navbar + footer links per role
│   └── config.js           API_URL, APP_NAME ...
├── services/api/
│   ├── axiosClient.js      The single Axios instance
│   ├── interceptors.js     Adds "Authorization: Bearer <token>", handles 401, normalizes errors
│   └── endpoints.js        /auth/* URLs
├── features/auth/
│   ├── store/AuthContext.jsx   Global state: user, role, isLoading, login(), logout(), can() ...
│   ├── hooks/useAuth.js        const { user, role, isAuthenticated, ... } = useAuth()
│   ├── services/authService.js API calls + normalizeUser()
│   ├── utils/tokenStorage.js   Save / read / clear the JWT
│   ├── components/LoginForm.jsx, RegisterForm.jsx
│   └── pages/ Login, RegisterCustomer, RegisterAgency, ForgotPassword, ResetPassword, OAuthCallback
├── app/router/
│   ├── guards/ProtectedRoute.jsx   must be logged in
│   ├── guards/RoleRoute.jsx        must have the right role (+ optional permission)
│   ├── guards/GuestOnlyRoute.jsx   only for logged-out users
│   └── publicRoutes / customerRoutes / agencyRoutes / adminRoutes / index
└── layouts/
    ├── parts/Navbar.jsx, Footer.jsx, AppShell.jsx
    └── PublicLayout, AuthLayout, CustomerLayout, AgencyLayout, AdminLayout
```

### 5.2 Login flow

```
LoginForm (validates email/password)
   │ login({email, password})
   ▼
AuthContext.login ──► authService.login ──► POST /auth/login ──► { token, user }
   │
   ├─ tokenStorage.set(token)           (session survives a reload)
   ├─ setUser(normalizeUser(user))      (role = normalizeRole(user.role))
   ▼
Navigate to: the page the user wanted (if their role may open it)  — otherwise roleHome(role)
             customer → /customer · agency → /agency · admin → /admin
```

### 5.3 Restoring the session (page refresh)

On app start `AuthProvider` finds a token in storage → calls `GET /auth/me` → fills `user`.
While this runs `isLoading = true`, and the guards show a spinner. **This prevents a flash of the login page** for logged-in users.
If `/auth/me` fails, the token is deleted and the user is a guest.

### 5.4 Protecting routes (three guards, nested)

```jsx
<Route element={<ProtectedRoute />}>                                  // 1. logged in?  no → /login
  <Route element={<RoleRoute allowed={[ROLES.AGENCY]} />}>            // 2. right role? no → /403
    <Route element={<AgencyLayout />}>
      <Route path="/agency" element={<AgencyDashboardPage />} />
      <Route element={<RoleRoute allowed={[ROLES.AGENCY]} permission="fleet:manage" />}>  // 3. permission? no → /403
        <Route path="/agency/fleet/new" element={<AddCarPage />} />
      </Route>
    </Route>
  </Route>
</Route>
```

| Guard            | Question it answers                         | If not allowed          |
| ---------------- | ------------------------------------------- | ----------------------- |
| `ProtectedRoute` | Is the user logged in?                      | → `/login` (remembers `from`) |
| `RoleRoute`      | Is the role allowed? (+ `permission`?)      | → `/403`                |
| `GuestOnlyRoute` | Is the user logged **out**?                 | → their dashboard (or the page they wanted) |

### 5.5 Registration

- **Customer**: validated form → `POST /auth/register` → logged in immediately → `/customer`.
- **Agency**: extra fields (company, license, address) → `POST /auth/register-agency` → "Request received".
  The account is **pending**; login returns *"waiting for admin approval"* until an admin approves it (admin approvals page = future work).
- Password rule: ≥ 8 chars, upper + lower case, digit (`utils/validators.js`). `confirmPassword` is never sent to the API.

### 5.6 Google OAuth

1. The button sends the browser to `GET {API_URL}/auth/google` (the **backend** owns the OAuth flow).
2. After Google, the backend redirects to `https://<frontend>/auth/callback#token=<jwt>`.
3. `OAuthCallbackPage` reads the token from the **URL fragment** (`#`, never sent to servers), removes it from the address bar, calls `/auth/me`, and redirects by role.

### 5.7 Logout & expired sessions

- **Logout**: `POST /auth/logout` (errors ignored) → token deleted → user = `null` → navbar becomes the guest one → redirect to `/`.
- **401 from any API call**: the Axios interceptor deletes the token and fires an `auth:unauthorized` event; `AuthContext` sets `user = null`, so `ProtectedRoute` sends the user to `/login`. No hard reload.
- **403 page** tells a logged-in user which role they have.

### 5.8 Checking permissions in a component

```jsx
const { role, can } = useAuth()
{can('fleet:manage') && <Button>Add car</Button>}   // '*' (admin) means everything
```

---

## 6. Switching to the real backend

Set `VITE_API_URL=<your API>` in `.env`. The frontend (and the mock server) follow this contract:

| Method & URL                       | Body                                   | Response                                                                 |
| ---------------------------------- | -------------------------------------- | ------------------------------------------------------------------------ |
| `POST /auth/login`                 | `{ email, password }`                  | `{ token, user }` — `401` if wrong credentials, `403` + `message` if agency pending |
| `POST /auth/register`              | `{ firstName, lastName, email, phone?, password }` | `{ token, user }` — `409` if email exists                  |
| `POST /auth/register-agency`       | customer fields + `{ companyName, licenseNumber, address }` | `{ message }` (account created as pending) |
| `GET  /auth/me`                    | — (Bearer token)                       | `user`                                                                   |
| `POST /auth/logout`                | —                                      | any                                                                      |
| `POST /auth/forgot-password`       | `{ email }`                            | `200` always (never reveal if the email exists)                          |
| `POST /auth/reset-password`        | `{ token, password }`                  | `200`                                                                    |
| `GET  /auth/google`                | —                                      | redirect → Google → `…/auth/callback#token=<jwt>`                        |

`user` = `{ id, email, firstName, lastName, phone?, role, permissions: string[], companyName?, agencyStatus? }`.
Error bodies: `{ message: string | string[] }` (NestJS default) — shown to the user via `error.userMessage`.

---

## 7. Security — what to say at the evaluation

1. **Frontend guards are UX, not security.** A user can edit localStorage or the JS. The real protection is the **backend** (JWT verification + role/permission guards on every endpoint). The frontend only hides what the user can't use anyway.
2. **Token storage.** The JWT is in `localStorage`: simple, but readable by any XSS. The safer production option is an **httpOnly, Secure, SameSite cookie** (then CSRF protection becomes necessary). React escapes output by default; never use `dangerouslySetInnerHTML` with user data.
3. **Passwords** are never stored or logged by the frontend; the backend must hash them (bcrypt/argon2).
4. **Validation** happens in the browser (UX) **and** must happen again in the backend (the real rule).
5. **No user enumeration**: forgot-password shows the same message whether or not the email exists.
6. **OAuth token in the URL fragment**, removed immediately from history.
7. **Safe errors**: the user sees friendly messages, never stack traces.

---

## 8. How to add a new protected page

1. Add the path to `constants/routes.js`.
2. Create the page in the right feature (`features/<area>/pages/`).
3. Add a `<Route>` inside the right group (`customerRoutes.jsx`, `agencyRoutes.jsx`, `adminRoutes.jsx`).
   Need a permission? Wrap it in `<RoleRoute allowed={[...]} permission="..." />`.
4. Add a link in `constants/navigation.js` (if it should appear in the navbar).

---

## 9. Manual test checklist

- [ ] Guest navbar shows Home / Cars / About / Contact + Login / Sign up.
- [ ] Guest opening `/customer`, `/agency`, `/admin` is sent to `/login`.
- [ ] Wrong password shows an error; empty form shows validation messages.
- [ ] Customer, Agency, Admin each get **their own** navbar and land on their own dashboard.
- [ ] Customer opening `/agency` or `/admin` sees the **403** page (same for the other roles).
- [ ] Logged-in user opening `/login` is redirected to their dashboard.
- [ ] Opening `/customer/bookings` as guest → login → returned to `/customer/bookings`.
- [ ] Reload keeps the session; Log out returns to the guest navbar and blocks protected pages.
- [ ] Pending agency cannot log in; agency employee gets 403 on `/agency/fleet/new`. New agency registration shows "Request received".
- [ ] Mobile: hamburger menu lists all links and Log out.

---

## 10. Known limitations / next steps

- No refresh-token flow yet (the backend decides: short JWT + refresh cookie is recommended).
- Admin "Agency approvals" page is a placeholder (with the mock server you can approve an agency using its `_dev/approve-agency` helper).
- No automated frontend tests yet (suggested: Vitest + React Testing Library for guards and `normalizeRole`, Playwright for the role flows).
- The project spec lists TypeScript and five backend roles (Customer / Employee / Manager / Agency Admin / Super Admin). This frontend scaffold is **JavaScript** with **four UI areas**; the five backend roles are mapped into them (section 2) and `permissions` carry the finer rules.
