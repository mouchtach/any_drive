# 🔐 AnyDrive: Authentication API Guide (for the Backend team)

This document explains **what the frontend sends**, **what the backend must respond**, and **what every field in every object means**.

If the backend follows this guide exactly, **the frontend needs no code change**.

> If you want to change a field name, a response shape, or a status code, please talk to the frontend team first. The frontend reads these fields directly.

---

## Table of contents

1. [How it works (big picture)](#1-how-it-works-big-picture)
2. [General rules](#2-general-rules)
3. [Objects explained (what each element means)](#3-objects-explained-what-each-element-means)
4. [Roles and permissions](#4-roles-and-permissions)
5. [Endpoints summary](#5-endpoints-summary)
6. [Endpoint details](#6-endpoint-details)
7. [Validation rules](#7-validation-rules)
8. [Status code rules (very important)](#8-status-code-rules-very-important)
9. [All scenarios table](#9-all-scenarios-table)
10. [JWT details](#10-jwt-details)
11. [Agency approval workflow](#11-agency-approval-workflow)
12. [Authorization on other endpoints](#12-authorization-on-other-endpoints)
13. [Security checklist](#13-security-checklist)
14. [Environment and CORS](#14-environment-and-cors)
15. [Test accounts to seed](#15-test-accounts-to-seed)
16. [Implementation checklist](#16-implementation-checklist)

---

## 1. How it works (big picture)

```
Login / Register / Google  ──►  backend returns a JWT token (+ the user object)
                                       │
Frontend saves the token in localStorage (key: anydrive_token)
                                       │
Every next request  ──►  Authorization: Bearer <token>
                                       │
Page refresh  ──►  frontend calls GET /auth/me to restore the session
                                       │
Token invalid / expired  ──►  backend returns 401  ──►  frontend logs the user out
```

Three kinds of users log in through the same screen:

| Type | Can register from the app? | Needs approval? |
| ---- | :------------------------: | :-------------: |
| Customer | ✅ yes (`/auth/register`) | No, logged in immediately |
| Agency | ✅ yes (`/auth/register-agency`) | **Yes**, admin must approve |
| Admin | ❌ no (created by the team / seed) | No |

---

## 2. General rules

| Item | Value | Meaning |
| ---- | ----- | ------- |
| Base URL | `VITE_API_URL` (e.g. `https://api.anydrive.com/api`) | All paths in this document are relative to it |
| Format | JSON in, JSON out | Header `Content-Type: application/json` |
| Auth header | `Authorization: Bearer <JWT>` | Sent automatically on **every** request when a token exists |
| Timeout | 15 seconds | After this the frontend cancels the request |
| Token storage | `localStorage`, key `anydrive_token` | Where the frontend keeps the JWT |

---

## 3. Objects explained (what each element means)

### 3.1 The auth response: `{ token, user }`

Returned by `POST /auth/login` and `POST /auth/register`.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "...": "see 3.2" }
}
```

| Element | Type | Meaning | What the frontend does with it |
| ------- | ---- | ------- | ------------------------------ |
| `token` | string | The JWT that proves who the user is | Saves it in `localStorage` and sends it in the `Authorization` header on every request |
| `user` | object | The logged-in user's profile | Stores it in the app state (shown in the navbar, used for role-based redirect and menus) |

### 3.2 The `user` object

Every endpoint that returns a user must return exactly this shape:

```json
{
  "id": "b3f0c0f2-6d6e-4a49-9b8b-1d8a4e5d9c01",
  "email": "customer@demo.com",
  "firstName": "Sara",
  "lastName": "Alaoui",
  "phone": "+212600000000",
  "role": "CUSTOMER",
  "permissions": [],
  "companyName": null,
  "agencyStatus": null
}
```

| Field | Type | Required | Meaning | How the frontend uses it |
| ----- | ---- | :------: | ------- | ------------------------ |
| `id` | string or number | ✅ | Unique id of the user | Identify the user, ownership display |
| `email` | string | ✅ | Login email, **always lowercase** | Shown in profile |
| `firstName` | string | ✅ | First name | Shown in navbar / greetings |
| `lastName` | string | ✅ | Last name | Shown in navbar / greetings |
| `phone` | string or null | ❌ | Phone number. Use `null` (or `""`) if the user has none | Shown in profile |
| `role` | string | ✅ | The user's role (see section 4). UPPERCASE recommended, but case-insensitive | **Decides which area the user can open** (`/customer`, `/agency`, `/admin`) |
| `permissions` | string[] | ✅ | List of fine-grained rights. **Must always be an array**, use `[]` if none. `["*"]` means everything | Decides which buttons/pages are visible (e.g. `fleet:manage` to add or edit cars) |
| `companyName` | string or null | ❌ | Name of the agency's company. `null` for customers and admins | Shown in the agency dashboard |
| `agencyStatus` | string or null | ❌ | Approval state of an agency: `PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`. `null` for non-agency users | Informational |

**Never** return: `password`, `passwordHash`, reset tokens, refresh tokens, or any internal field.

### 3.3 The message response: `{ message }`

Returned by `register-agency`, `forgot-password`, `reset-password`.

```json
{ "message": "Request received. An admin will review your agency." }
```

| Element | Type | Meaning |
| ------- | ---- | ------- |
| `message` | string | A short human-readable confirmation. In some screens the frontend shows its own text, but the field must exist |

### 3.4 The error response

```json
{ "statusCode": 400, "message": "Human readable text", "error": "Bad Request" }
```

| Element | Type | Meaning | Used by the frontend? |
| ------- | ---- | ------- | :-------------------: |
| `statusCode` | number | Same number as the HTTP status | ❌ (the real HTTP status is used) |
| `message` | string **or** string[] | The text shown to the user. If it is an array (NestJS validation default), the frontend joins the items with a space | ✅ **Yes, this is the only field used** |
| `error` | string | Short name of the HTTP error | ❌ |

Rules for `message`:
- It must be **user-friendly**. Never return stack traces, SQL errors, or internal details.
- If `message` is missing, the frontend shows a generic text.

---

## 4. Roles and permissions

### 4.1 Roles (`user.role`)

The frontend groups the backend roles into 4 areas:

| Backend role | Frontend area | Where the user lands after login |
| ------------ | ------------- | -------------------------------- |
| `CUSTOMER` | customer | `/customer` |
| `AGENCY` | agency | `/agency` |
| `AGENCY_EMPLOYEE` | agency | `/agency` |
| `AGENCY_MANAGER` | agency | `/agency` |
| `AGENCY_ADMIN` | agency | `/agency` |
| `ADMIN` | admin | `/admin` |
| `SUPER_ADMIN` | admin | `/admin` |
| any other value | guest (nothing works) | `/` |

> ⚠️ A role that is not in this table is treated as "guest" and the user cannot use the app. Do not invent new role names without telling us (the frontend has a fixed role map and must be updated).
>
> The frontend converts `role` to UPPERCASE before matching, so `agency_admin` and `AGENCY_ADMIN` both work. It also keeps your original value (`AGENCY_EMPLOYEE`, `AGENCY_ADMIN`, ...) for fine-grained checks, so always send the exact backend role.

### 4.2 Permissions (`user.permissions`)

| Permission | Meaning | Effect in the frontend |
| ---------- | ------- | ---------------------- |
| `fleet:manage` | Can add and edit cars | Needed for `/agency/fleet/new` and `/agency/fleet/:id/edit`. Without it the frontend shows the 403 page |
| `*` | Can do everything | For admin / super admin |

Suggested defaults:

| Role | `permissions` |
| ---- | ------------- |
| `CUSTOMER` | `[]` |
| `AGENCY_ADMIN` / `AGENCY_MANAGER` | `["fleet:manage"]` |
| `AGENCY_EMPLOYEE` | `[]` |
| `ADMIN` / `SUPER_ADMIN` | `["*"]` |

> ⚠️ The frontend only **hides** things. The backend **must enforce** role, permission, and ownership on every protected endpoint (section 12).

---

## 5. Endpoints summary

| # | Method | URL | Auth | Purpose | Success |
| - | ------ | --- | :--: | ------- | ------- |
| 1 | POST | `/auth/login` | ❌ | Login (all roles) | `200` `{ token, user }` |
| 2 | POST | `/auth/register` | ❌ | Register a **customer** (auto login) | `201` `{ token, user }` |
| 3 | POST | `/auth/register-agency` | ❌ | Register an **agency** (pending approval) | `201` `{ message }` |
| 4 | GET | `/auth/me` | ✅ | Get the current user (restore session) | `200` `user` |
| 5 | POST | `/auth/logout` | ✅ | Logout | `200` or `204` |
| 6 | POST | `/auth/forgot-password` | ❌ | Send reset email | `200` always |
| 7 | POST | `/auth/reset-password` | ❌ | Set a new password | `200` |
| 8 | GET | `/auth/google` | ❌ | Start Google OAuth (browser redirect) | `302` redirect |

---

## 6. Endpoint details

### 6.1 `POST /auth/login`

Used by the login form for **all roles**.

**Request body**

```json
{ "email": "customer@demo.com", "password": "Demo1234" }
```

| Field | Type | Required | Meaning |
| ----- | ---- | :------: | ------- |
| `email` | string | ✅ | The account email. The frontend trims it; the backend should also do `trim().toLowerCase()` |
| `password` | string | ✅ | The password exactly as typed (not trimmed) |

**Success `200`**: `{ token, user }` (see 3.1 and 3.2).

**Errors**

| Status | When | Example body |
| ------ | ---- | ------------ |
| `400` | Missing or malformed fields | `{ "message": ["email must be an email"] }` |
| `401` | Wrong email **or** wrong password (**same message for both**) | `{ "message": "Invalid email or password." }` |
| `403` | Agency is `PENDING` | `{ "message": "Your agency is waiting for admin approval." }` |
| `403` | Agency is `REJECTED` | `{ "message": "Your agency request was rejected. Please contact support." }` |
| `403` | User is blocked / suspended | `{ "message": "Your account has been suspended. Please contact support." }` |
| `429` | Too many attempts | `{ "message": "Too many attempts. Please try again later." }` |

Notes:
- The frontend shows `message` **as is** above the form.
- A `401` on `/auth/login` does **not** log anyone out (special case). Any other `401` does.
- Google-only users (no password) who try a password login: return `401` (generic message or "This account uses Google sign-in.").

---

### 6.2 `POST /auth/register` (customer)

**Request body**

```json
{
  "firstName": "Sara",
  "lastName": "Alaoui",
  "email": "sara@example.com",
  "phone": "+212600000000",
  "password": "Demo1234"
}
```

| Field | Type | Required | Meaning |
| ----- | ---- | :------: | ------- |
| `firstName` | string | ✅ | First name |
| `lastName` | string | ✅ | Last name |
| `email` | string | ✅ | Unique login email. **Not trimmed** by the frontend here, so the backend must `trim().toLowerCase()` |
| `phone` | string | ❌ | Optional. When empty the frontend sends **`""`** (empty string, not `null`, not absent). Accept `""` and store it as `null` |
| `password` | string | ✅ | Must follow the password rules (section 7) |

Important:
- `confirmPassword` is **never** sent (the frontend checks it locally).
- The role is **always `CUSTOMER`**. **Ignore or reject** any `role`, `permissions`, or `agencyStatus` sent by the client.

**Success `201`**: `{ token, user }`. The user is **logged in immediately**. `200` is also accepted. Then the frontend redirects to `/customer`.

**Errors**

| Status | When | Example body |
| ------ | ---- | ------------ |
| `400` | Validation failed | `{ "message": ["Password needs an uppercase letter."] }` |
| `409` | Email already registered | `{ "message": "An account with this email already exists." }` |
| `429` | Rate limited | `{ "message": "Too many attempts. Please try again later." }` |

---

### 6.3 `POST /auth/register-agency`

**Request body**

```json
{
  "firstName": "Youssef",
  "lastName": "Benani",
  "email": "contact@fastcars.ma",
  "phone": "+212611223344",
  "password": "Demo1234",
  "companyName": "Fast Cars Rental",
  "licenseNumber": "RC-123456",
  "address": "12 Bd Zerktouni, Casablanca"
}
```

| Field | Type | Required | Meaning |
| ----- | ---- | :------: | ------- |
| `firstName`, `lastName`, `email`, `phone`, `password` | | | Same meaning and rules as `/auth/register`. The person who manages the agency account |
| `companyName` | string | ✅ | Commercial name of the agency |
| `licenseNumber` | string | ✅ | Business registration / license number (should be unique) |
| `address` | string | ✅ | Physical address of the agency |

**What the backend must do**
- Create the user with role `AGENCY_ADMIN` (or `AGENCY`) and `agencyStatus = "PENDING"`.
- **Do NOT return a token.** The agency cannot log in until an admin approves it.
- Notify admins (email or dashboard). The future admin "Agency approvals" page lists pending agencies.

**Success `201`**

```json
{ "message": "Request received. An admin will review your agency." }
```

The frontend shows its own "Request received" screen. The `message` is not displayed, but it must exist.

**Errors**

| Status | When | Example body |
| ------ | ---- | ------------ |
| `400` | Validation failed | `{ "message": ["Company name is required."] }` |
| `409` | Email already used (or license number already used) | `{ "message": "An account with this email already exists." }` |

---

### 6.4 `GET /auth/me`

Called on **every page load / refresh** when a token exists, and after a Google login. It restores the session.

**Request**: header only, no body.

```
GET /auth/me
Authorization: Bearer <token>
```

**Success `200`**: the **`user` object directly**, **NOT** wrapped in `{ user }`.

**Errors**

| Status | When | Effect in the frontend |
| ------ | ---- | ---------------------- |
| `401` | Token missing / invalid / expired, **or the user was deleted / blocked** | Token deleted, user becomes guest, redirect to `/login` |

> Always return the **fresh** role and permissions from the database (not from the token), so changes apply on the next refresh.

---

### 6.5 `POST /auth/logout`

**Request**: header only, empty body.

**Success**: `200` or `204` (body ignored).

The frontend **ignores any error** from this call and deletes the token locally anyway. Recommended: blacklist the token (or its `jti`) until it expires, or simply return `204` for stateless JWT.

---

### 6.6 `POST /auth/forgot-password`

**Request body**

```json
{ "email": "customer@demo.com" }
```

| Field | Type | Required | Meaning |
| ----- | ---- | :------: | ------- |
| `email` | string | ✅ | Email of the account that wants a reset link |

**Success `200`: ALWAYS**, whether the email exists or not (prevents user enumeration):

```json
{ "message": "If an account exists, a reset link has been sent." }
```

The frontend also ignores errors from this call and always shows its own neutral message.

**Backend behavior**
1. If the user exists (and is not Google-only): generate a random token, **store only its hash**, expiry ~**1 hour**, single use.
2. Send an email with this exact link format:

```
https://<FRONTEND_URL>/reset-password?token=<RESET_TOKEN>
```

3. If the email does not exist: do nothing and return the same `200`.
4. Rate-limit by IP and by email (e.g. 5 per hour).

---

### 6.7 `POST /auth/reset-password`

**Request body**

```json
{ "token": "a1b2c3d4e5f6...", "password": "NewPass1234" }
```

| Field | Type | Required | Meaning |
| ----- | ---- | :------: | ------- |
| `token` | string | ✅ | The value of the `?token=` parameter from the email link |
| `password` | string | ✅ | The new password. Must follow the password rules (section 7) |

**Success `200`**

```json
{ "message": "Password updated. You can now log in." }
```

The frontend then redirects to `/login`. It does **not** log the user in automatically.

**Errors**

| Status | When | Example body |
| ------ | ---- | ------------ |
| `400` | Token invalid, expired, or already used | `{ "message": "This link is invalid or expired." }` |
| `400` | Weak password | `{ "message": ["Password needs a number."] }` |

> ⚠️ Use **`400`** (not `401`) for an invalid reset token. A `401` makes the frontend clear the session.

**Backend behavior**: hash the new password, mark the token as used, and **invalidate all existing sessions/tokens** of that user.

---

### 6.8 `GET /auth/google` (Google OAuth: the backend owns the flow)

**Step 1: Start.** The "Continue with Google" button does a full browser navigation (not an AJAX call):

```
window.location.assign("<VITE_API_URL>/auth/google")
```

The backend answers with a `302` redirect to Google's consent screen.

> In production `VITE_API_URL` must be an **absolute URL**, or the same origin as the frontend.

**Step 2: Google calls the backend callback** (e.g. `GET /auth/google/callback?code=...`). The backend then:
1. Gets the Google profile (`email`, `given_name`, `family_name`, `sub`).
2. **Finds the user by email**, or **creates a new `CUSTOMER`** (no password, email verified).
3. Applies the same checks as login (blocked → refuse; pending agency → refuse).
4. Generates **our own JWT** (same as login).

**Step 3: Redirect back to the frontend with the token in the URL _fragment_ (`#`, not `?`)**

```
302 → https://<FRONTEND_URL>/auth/callback#token=<JWT>
```

Why a fragment: browsers never send the `#...` part to any server, so it does not appear in logs or referrers. The frontend reads it, removes it from the address bar, calls `GET /auth/me`, then redirects by role.

**Failure case** (user cancelled, Google error, account blocked, pending agency):

```
302 → https://<FRONTEND_URL>/auth/callback
```

(no `#token`). The frontend shows "Login with Google failed. Please try again." You may add `#error=<code>`; the frontend currently ignores it.

---

## 7. Validation rules

The frontend validates first (for UX). **The backend must validate again** with the same rules and return `400` with readable messages.

| Field | Rule | Frontend message |
| ----- | ---- | ---------------- |
| `email` | Regex `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$`. Store lowercase. Unique | `Enter a valid email address.` |
| `password` (login) | Required only (no rule check) | `Password is required.` |
| `password` (register / reset) | ≥ 8 chars, ≥ 1 lowercase, ≥ 1 uppercase, ≥ 1 digit | `Password must be at least 8 characters.` / `Password needs a lowercase letter.` / `Password needs an uppercase letter.` / `Password needs a number.` |
| `firstName` | Required, non-empty after trim | `First name is required.` |
| `lastName` | Required, non-empty after trim | `Last name is required.` |
| `phone` | Optional. If present: `^\+?[0-9 ()-]{8,18}$`. `""` allowed | `Enter a valid phone number.` |
| `companyName` | Required (agency) | `Company name is required.` |
| `licenseNumber` | Required (agency) | `License number is required.` |
| `address` | Required (agency) | `Address is required.` |

Recommendations:
- Reject unknown fields (`whitelist` + `forbidNonWhitelisted` in NestJS), **especially `role`, `permissions`, `agencyStatus`** on register endpoints.
- Set max lengths (e.g. names 100, email 254, password 128).

---

## 8. Status code rules (very important)

The frontend Axios interceptor reacts to status codes. Wrong codes break the UX.

| Status | Frontend reaction | Use it for |
| ------ | ----------------- | ---------- |
| `401` (any URL **except** `/auth/login`) | **Deletes the token, sets user = null, sends the user to `/login`** | Only: token missing / invalid / expired / revoked, or user no longer exists / is blocked |
| `401` on `/auth/login` | Shows the message under the form (no logout) | Wrong credentials |
| `403` | Shows the message (login) or the 403 page (API calls) | Authenticated but not allowed: wrong role, missing permission, pending agency |
| `400` | Shows `message` | Validation errors, invalid reset token |
| `409` | Shows `message` | Email already exists |
| `429` | Shows `message` | Rate limit |
| `5xx` / no network | Generic "Something went wrong" / "Cannot reach the server. Please try again." | Server errors |

> ❗ **Never return `401` for "wrong role" or "validation".** It would log the user out. Use `403` / `400`.

---

## 9. All scenarios table

| # | Scenario | Endpoint | Status | Message (suggested) |
| - | -------- | -------- | :----: | ------------------- |
| 1 | Valid customer credentials | login | 200 | `{token, user}` |
| 2 | Valid agency (approved) | login | 200 | `{token, user}` |
| 3 | Valid admin | login | 200 | `{token, user}` |
| 4 | Wrong password | login | 401 | `Invalid email or password.` |
| 5 | Email not found | login | 401 | `Invalid email or password.` (**same** as #4) |
| 6 | Agency `PENDING` | login | 403 | `Your agency is waiting for admin approval.` |
| 7 | Agency `REJECTED` | login | 403 | `Your agency request was rejected. Please contact support.` |
| 8 | User blocked / suspended | login | 403 | `Your account has been suspended. Please contact support.` |
| 9 | Google-only account tries password login | login | 401 | `Invalid email or password.` (or "use Google") |
| 10 | Too many failed attempts | login | 429 | `Too many attempts. Please try again later.` |
| 11 | Missing / invalid body | login / register | 400 | validation messages |
| 12 | New customer | register | 201 | `{token, user}` (role `CUSTOMER`) |
| 13 | Email already exists | register / register-agency | 409 | `An account with this email already exists.` |
| 14 | Weak password | register / reset | 400 | rule message |
| 15 | Client sends `role: "ADMIN"` in body | register | n/a | **Ignore / reject (400).** Never accept it |
| 16 | New agency | register-agency | 201 | `{message}`, status `PENDING`, **no token** |
| 17 | Token valid | me | 200 | `user` |
| 18 | Token missing / expired / invalid | me (or any protected) | 401 | `Unauthorized` |
| 19 | User deleted or blocked after token issued | me | 401 | `Unauthorized` |
| 20 | Logout | logout | 200/204 | n/a |
| 21 | Forgot password, email exists | forgot-password | 200 | generic message + email sent |
| 22 | Forgot password, email does NOT exist | forgot-password | 200 | **same** generic message, no email |
| 23 | Reset with valid token | reset-password | 200 | `{message}` |
| 24 | Reset with expired / used / invalid token | reset-password | 400 | `This link is invalid or expired.` |
| 25 | Google login, existing user | google callback | 302 | `→ /auth/callback#token=<jwt>` |
| 26 | Google login, new user | google callback | 302 | create `CUSTOMER`, then same redirect |
| 27 | Google cancelled / error / blocked | google callback | 302 | `→ /auth/callback` (no token) |
| 28 | Google login of a `PENDING` agency email | google callback | 302 | `→ /auth/callback` (no token) |
| 29 | Customer calls an agency/admin endpoint | any protected | 403 | `Forbidden` |
| 30 | Agency employee calls "add/edit car" (no `fleet:manage`) | fleet endpoints | 403 | `Forbidden` |
| 31 | Agency A edits agency B's car | fleet endpoints | 403 / 404 | ownership check |

---

## 10. JWT details

- Algorithm: HS256 (or RS256).
- Suggested payload:

```json
{
  "sub": "b3f0c0f2-6d6e-4a49-9b8b-1d8a4e5d9c01",
  "role": "CUSTOMER",
  "iat": 1764163260,
  "exp": 1764768060,
  "jti": "optional-token-id"
}
```

| Claim | Meaning |
| ----- | ------- |
| `sub` | The user id (subject) |
| `role` | The user's role at the time the token was created (the guard should still reload the user from the DB) |
| `iat` | Issued-at time (Unix seconds) |
| `exp` | Expiry time (Unix seconds) |
| `jti` | Optional unique token id, useful for blacklisting on logout |

- **Expiry:** the frontend has **no refresh-token flow yet**. When the token expires, the next call returns `401` and the user goes to `/login`. Use a comfortable lifetime for now (e.g. **1 to 7 days**). If you want to add refresh tokens later, tell the frontend team first.
- The secret must be in environment variables only, never in the repo.
- Same token format for password login, register, and Google login.
- In the auth guard, always reload the user (role, status, permissions) from the DB.

---

## 11. Agency approval workflow

```
Register agency ──► status PENDING (no token) ──► Admin reviews
                                                    ├─ Approve → APPROVED → agency can log in
                                                    └─ Reject  → REJECTED → login returns 403
```

| `agencyStatus` | Meaning | Login result |
| -------------- | ------- | ------------ |
| `PENDING` | Waiting for admin review | `403` "waiting for admin approval" |
| `APPROVED` | Accepted by admin | `200` |
| `REJECTED` | Refused by admin | `403` "request was rejected" |
| `SUSPENDED` | Disabled after being approved | `403` "account suspended" |

Suggested admin endpoints (for the admin "Approvals" page, which already has a link in the frontend admin navbar; not used by the auth screens):

| Method | URL | Role | Purpose |
| ------ | --- | ---- | ------- |
| GET | `/admin/agencies?status=PENDING` | ADMIN | List pending agencies |
| PATCH | `/admin/agencies/:id/approve` | ADMIN | Approve (send an email to the agency) |
| PATCH | `/admin/agencies/:id/reject` | ADMIN | Reject with `{ "reason": "..." }` (send an email) |
| PATCH | `/admin/users/:id/block` | ADMIN | Block / unblock a user |

---

## 12. Authorization on other endpoints

For **every** non-auth endpoint the backend must:

1. Read `Authorization: Bearer`, verify the JWT, load the user. Otherwise return `401`.
2. Check the role. Otherwise return `403`.
3. Check the permission when needed (e.g. `fleet:manage`). Otherwise return `403`.
4. Check **ownership** (an agency can only touch its own cars/bookings; a customer only their own bookings).

| Area | Allowed roles |
| ---- | ------------- |
| `/customer/*` endpoints | `CUSTOMER` |
| `/agency/*` endpoints | `AGENCY`, `AGENCY_EMPLOYEE`, `AGENCY_MANAGER`, `AGENCY_ADMIN` |
| Add / edit / delete car | agency roles **with** `fleet:manage` |
| `/admin/*` endpoints | `ADMIN`, `SUPER_ADMIN` |
| Public (cars list / details) | everyone (token optional) |

---

## 13. Security checklist

- [ ] Hash passwords with **bcrypt (cost ≥ 10) or argon2**. Never log or return them.
- [ ] Same error for wrong email and wrong password (no user enumeration).
- [ ] `forgot-password` always returns `200` with the same message.
- [ ] Reset tokens: random (≥ 32 bytes), stored **hashed**, expire ~1h, single use; invalidate sessions after reset.
- [ ] Rate-limit login, register, forgot-password, reset-password (per IP and per email).
- [ ] Validate all input on the server; whitelist fields (ignore `role`, `permissions`, `agencyStatus` from the client).
- [ ] Normalize emails (`trim` + lowercase) and keep a unique index.
- [ ] Google: verify the `state` parameter, use HTTPS, accept only verified Google emails.
- [ ] JWT secret in env, strong, rotated when needed.
- [ ] CORS limited to the frontend origin(s).
- [ ] HTTPS in production; add security headers (Helmet).
- [ ] Do not leak internal errors; return friendly `message`.
- [ ] Log auth events (login success/failure, reset requested) without secrets.

> The frontend stores the JWT in `localStorage` (simple, but readable by XSS). A more secure production option is an **httpOnly + Secure + SameSite cookie** (then CSRF protection is required). If you choose cookies, tell the frontend team because it needs a small change (`withCredentials`).

---

## 14. Environment and CORS

Frontend `.env`:

```
VITE_API_URL=https://api.anydrive.com/api
VITE_APP_NAME=AnyDrive
```

Backend `.env` (suggested):

```
PORT=5000
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://app.anydrive.com          # used in emails + Google redirect
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://api.anydrive.com/api/auth/google/callback
```

CORS (if the frontend is on a different origin than the API):

```
Access-Control-Allow-Origin: <FRONTEND_URL>
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
```

In development the Vite dev server proxies `/api` to the backend, so CORS is not needed locally.

Frontend URLs the backend must link to:

| Purpose | Frontend URL |
| ------- | ------------ |
| Reset password email link | `<FRONTEND_URL>/reset-password?token=<token>` |
| Google return | `<FRONTEND_URL>/auth/callback#token=<jwt>` |

---

## 15. Test accounts to seed

Please seed these accounts (password for all: `Demo1234`):

| Email | Role | Permissions | Agency status | Expected result |
| ----- | ---- | ----------- | ------------- | --------------- |
| `customer@demo.com` | `CUSTOMER` | `[]` | n/a | Login OK → `/customer` |
| `agency@demo.com` | `AGENCY_ADMIN` | `["fleet:manage"]` | `APPROVED` | Login OK → `/agency`, can add/edit cars |
| `employee@demo.com` | `AGENCY_EMPLOYEE` | `[]` | `APPROVED` | Login OK → `/agency`, **403** on add/edit car |
| `admin@demo.com` | `SUPER_ADMIN` | `["*"]` | n/a | Login OK → `/admin` |
| `pending@demo.com` | `AGENCY_ADMIN` | `["fleet:manage"]` | `PENDING` | Login **403** (waiting approval) |

---

## 16. Implementation checklist

- [ ] `POST /auth/login` → `{ token, user }`, errors 400 / 401 / 403 / 429
- [ ] `POST /auth/register` → `{ token, user }`, role forced to `CUSTOMER`, `409` on duplicate
- [ ] `POST /auth/register-agency` → `{ message }`, status `PENDING`, **no token**
- [ ] `GET /auth/me` → `user` (not wrapped), `401` if invalid
- [ ] `POST /auth/logout`
- [ ] `POST /auth/forgot-password` → always `200`
- [ ] `POST /auth/reset-password` → `200` / `400`
- [ ] `GET /auth/google` + callback → `302 /auth/callback#token=<jwt>` (or without token on failure)
- [ ] `user` object always has `permissions: string[]`
- [ ] Role / permission / ownership guards on all protected endpoints (`401` vs `403` rules)
- [ ] Seed the 5 test accounts
- [ ] Emails: reset password, agency approved / rejected
- [ ] Rate limiting + validation + CORS
