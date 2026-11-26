# 🧭 AnyDrive: Authentication (Frontend Guide)

This is **my** guide for the React frontend. It explains how authentication works in the app, which files are responsible for what, what the backend must return, and how to test and debug.

The backend contract is in `README_BACKEND_AUTH_API.md`. That file is the source of truth for request/response shapes. This one explains how the frontend uses them.

---

## Table of contents

1. [What is already done](#1-what-is-already-done)
2. [Files and their job](#2-files-and-their-job)
3. [Flows step by step](#3-flows-step-by-step)
4. [What the frontend expects from the backend](#4-what-the-frontend-expects-from-the-backend)
5. [Roles, redirects and permissions](#5-roles-redirects-and-permissions)
6. [Axios interceptors](#6-axios-interceptors)
7. [Client-side validation](#7-client-side-validation)
8. [Environment](#8-environment)
9. [How to test](#9-how-to-test)
10. [Troubleshooting](#10-troubleshooting)
11. [Known limitations / TODO](#11-known-limitations--todo)
12. [Rules when changing auth code](#12-rules-when-changing-auth-code)

---

## 1. What is already done

- Login for all roles (customer, agency, admin) with one form
- Customer register (auto login) and agency register (pending approval)
- Session restore on page refresh (`GET /auth/me`)
- Logout (local cleanup always happens, even if the server call fails)
- Forgot password and reset password
- Login with Google (backend-driven OAuth, token returned in the URL fragment)
- Role-based redirect and route protection (customer / agency / admin)
- Permission check for adding / editing cars (`fleet:manage`)
- Automatic token header + automatic logout on expired token

---

## 2. Files and their job

These are the files the contract refers to. Paths may differ slightly in the project.

| File | Job |
| ---- | --- |
| `authService.js` | All auth API calls: login, register, register-agency, me, logout, forgot-password, reset-password |
| `interceptors.js` | Axios interceptors: adds the token to every request, handles `401`, normalizes error messages |
| `AuthContext.jsx` | Global auth state: current `user`, loading state, and the login / register / logout actions |
| `LoginForm.jsx` | Login screen (email + password + Google button) |
| `RegisterForm.jsx` | Customer and agency registration forms |
| `OAuthCallbackPage.jsx` | Page at `/auth/callback`. Reads the Google token from `#token=`, then finishes the login |
| `roles.js` | Defines the 4 UI roles (`ROLES`), their labels (`ROLE_LABELS`), and `normalizeRole()` which maps a backend role to a UI role. It has **no** permission helpers |
| `routes.js` | The `ROUTES` object with every path (`ROUTES.CUSTOMER.BOOKINGS`, `ROUTES.ADMIN.APPROVALS`, ...) |
| Navigation config (has `navFor` and `FOOTER_ACCOUNT`) | Navbar links, user-menu links and footer "Account" links for each role |
| `validators.js` | All client-side validation rules and messages |

---

## 3. Flows step by step

### 3.1 App start / page refresh

```
App loads
  └─ token in localStorage (anydrive_token)?
       ├─ No  → user = guest
       └─ Yes → GET /auth/me
                  ├─ 200 → user = response (the user object directly)
                  └─ any error → delete token, user = guest, go to /login
```

### 3.2 Login

```
LoginForm → validate (email format, password not empty)
         → POST /auth/login { email, password }
              ├─ 200 { token, user } → save token, save user, redirect by role
              ├─ 401 → show "Invalid email or password." (NO logout)
              ├─ 403 → show the message (pending / rejected / suspended)
              └─ 429 → show "Too many attempts..."
```

### 3.3 Customer register

```
RegisterForm → validate → POST /auth/register { firstName, lastName, email, phone, password }
            → 201 { token, user } → save token + user → redirect to /customer
```

- `confirmPassword` is checked in the browser and **never sent**.
- Empty phone is sent as `""` (empty string).

### 3.4 Agency register

```
RegisterForm (agency) → POST /auth/register-agency { ...customer fields, companyName, licenseNumber, address }
                     → 201 { message } → show "Request received" screen
```

There is **no token** and **no auto login**. The agency must wait for admin approval.

### 3.5 Forgot password

```
Enter email → POST /auth/forgot-password { email }
           → always show: "If an account exists for X, you will receive a reset link shortly."
```

The frontend ignores errors here on purpose (no user enumeration).

### 3.6 Reset password

```
Email link: /reset-password?token=XXXX
Enter new password → POST /auth/reset-password { token, password }
                  ├─ 200 → redirect to /login (no auto login)
                  └─ 400 → show "This link is invalid or expired." / password rule message
```

### 3.7 Google login

```
Click "Continue with Google"
  └─ window.location.assign(VITE_API_URL + "/auth/google")      (full page navigation)
       └─ backend → Google → backend callback
            └─ 302 → /auth/callback#token=<JWT>                 (success)
               302 → /auth/callback                             (failure)

OAuthCallbackPage:
  ├─ has #token → save token, remove the fragment from the address bar,
  │               GET /auth/me, redirect by role
  └─ no #token  → show "Login with Google failed. Please try again." + "Back to login"
```

### 3.8 Logout

```
POST /auth/logout (errors ignored) → delete token → user = guest → go to /login
```

---

## 4. What the frontend expects from the backend

### 4.1 Responses

| Endpoint | Success response | Notes |
| -------- | ---------------- | ----- |
| `POST /auth/login` | `{ token, user }` | |
| `POST /auth/register` | `{ token, user }` | `200` or `201` accepted |
| `POST /auth/register-agency` | `{ message }` | no token |
| `GET /auth/me` | `user` | **not wrapped** in `{ user }` |
| `POST /auth/logout` | anything (`200` / `204`) | body ignored |
| `POST /auth/forgot-password` | `{ message }` | always `200` |
| `POST /auth/reset-password` | `{ message }` | |

### 4.2 The `user` object (what each field does in the UI)

```json
{
  "id": "b3f0c0f2-...",
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

| Field | Used for |
| ----- | -------- |
| `id` | Identify the user |
| `email` | Display / profile |
| `firstName`, `lastName` | Navbar, greeting, profile |
| `phone` | Profile (can be `null` or `""`) |
| `role` | Backend sends e.g. `AGENCY_ADMIN`. The frontend runs it through `normalizeRole()` to get a UI role (`customer`, `agency`, `admin`, `guest`) that **decides the area** (`/customer`, `/agency`, `/admin`). The original backend value is kept in `user.backendRole` for fine-grained checks |
| `permissions` | **Must be an array.** Controls buttons and routes (`fleet:manage`, `*`) |
| `companyName` | Agency dashboard |
| `agencyStatus` | Informational (`PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`) |

> If `permissions` is missing or not an array, permission checks may break. Ask the backend to always send `[]` at minimum.

### 4.3 Error body

```json
{ "message": "text" }          // or
{ "message": ["text1", "text2"] }
```

Only `message` is used. Arrays are joined with a space. If missing, a generic message is shown.

---

## 5. Roles, redirects and permissions

### 5.1 UI roles (`roles.js`)

The UI only knows 4 roles:

| Constant | Value | Label (`ROLE_LABELS`) |
| -------- | ----- | --------------------- |
| `ROLES.GUEST` | `'guest'` | Guest |
| `ROLES.CUSTOMER` | `'customer'` | Customer |
| `ROLES.AGENCY` | `'agency'` | Agency |
| `ROLES.ADMIN` | `'admin'` | Admin |

`normalizeRole(backendRole)`:
- Empty / missing role → `guest`
- Converts to UPPERCASE first, so `agency_admin` and `AGENCY_ADMIN` both work
- Looks the value up in `BACKEND_ROLE_MAP`; anything not in the map → `guest`

The original backend role is kept in `user.backendRole`, so you can still tell an `AGENCY_EMPLOYEE` from an `AGENCY_ADMIN` when needed.

### 5.2 Mapping and redirects

| Backend `role` | UI area | Redirect after login |
| -------------- | ------- | -------------------- |
| `CUSTOMER` | customer | `/customer` |
| `AGENCY`, `AGENCY_EMPLOYEE`, `AGENCY_MANAGER`, `AGENCY_ADMIN` | agency | `/agency` |
| `ADMIN`, `SUPER_ADMIN` | admin | `/admin` |
| anything else | guest | `/` |

Permissions (inside the agency area):

| Permission | Effect |
| ---------- | ------ |
| `fleet:manage` | Allows `/agency/fleet/new` and `/agency/fleet/:id/edit`. Without it, the 403 page is shown |
| `*` | Allows everything (admin) |

Route protection behaviour:

| Situation | What the user sees |
| --------- | ------------------ |
| Not logged in, opens a protected page | Redirect to `/login` |
| Logged in but wrong area (e.g. customer opens `/admin`) | 403 page |
| Agency without `fleet:manage` opens add/edit car | 403 page |

> This is **UI protection only**. The real security is in the backend. Never rely on the frontend to protect data.

### 5.3 Navigation per role

`navFor(role)` returns three lists: `primary` (always visible on desktop), `more` (the "More" dropdown) and `menu` (the user menu). `end: true` means exact match for the active link. An unknown role falls back to the guest navigation. `FOOTER_ACCOUNT[role]` gives the footer "Account" column.

| Role | `primary` | `more` | `menu` |
| ---- | --------- | ------ | ------ |
| guest | Home, Cars, About, Contact | none | none |
| customer | Home, Cars, Dashboard, My Bookings, Favorites | Payments, My Reviews | Dashboard, My Profile |
| agency | Dashboard, Fleet, Bookings, Calendar | Earnings, Reviews, Agency Profile | Dashboard, Agency Profile |
| admin | Dashboard, Users, Agencies, Approvals | Cars, Bookings, Payments, Reports, Reviews, Settings | Dashboard, Settings |

Footer "Account" column:

| Role | Links |
| ---- | ----- |
| guest | Login, Create an account, Become a partner agency |
| customer | My bookings, Favorites, My profile |
| agency | Fleet, Booking requests, Agency profile |
| admin | Users, Agency approvals, Settings |

Notes:
- The agency **Fleet** link is shown to every agency role, including employees. Only the add/edit pages need `fleet:manage`, so hide the "Add car" / "Edit" buttons when the permission is missing.
- Navigation only controls what is **visible**. Route guards and the backend still decide what is **allowed**.

---

## 6. Axios interceptors

| Behaviour | Detail |
| --------- | ------ |
| Request | Adds `Authorization: Bearer <token>` if `anydrive_token` exists |
| Timeout | 15 seconds |
| `401` on any URL **except** `/auth/login` | Delete token, user = null, go to `/login` |
| `401` on `/auth/login` | Show the message under the form (no logout) |
| `403` | Show the message (login) or the 403 page (route/API) |
| `400`, `409`, `429` | Show `message` |
| `5xx` | "Something went wrong" |
| No network / timeout | "Cannot reach the server. Please try again." |

Token storage: `localStorage`, key **`anydrive_token`**.

---

## 7. Client-side validation

Defined in `validators.js`. The backend repeats the same rules.

| Field | Rule | Message |
| ----- | ---- | ------- |
| `email` | `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$` | `Enter a valid email address.` |
| `password` (login) | required | `Password is required.` |
| `password` (register / reset) | ≥ 8 chars, 1 lowercase, 1 uppercase, 1 digit | `Password must be at least 8 characters.` / `Password needs a lowercase letter.` / `Password needs an uppercase letter.` / `Password needs a number.` |
| `firstName` | required | `First name is required.` |
| `lastName` | required | `Last name is required.` |
| `phone` | optional, `^\+?[0-9 ()-]{8,18}$` | `Enter a valid phone number.` |
| `companyName` | required (agency) | `Company name is required.` |
| `licenseNumber` | required (agency) | `License number is required.` |
| `address` | required (agency) | `Address is required.` |

If the backend changes a rule, update `validators.js` too so the messages stay consistent.

---

## 8. Environment

`.env`:

```
VITE_API_URL=https://api.anydrive.com/api
VITE_APP_NAME=AnyDrive
```

- In **development**, Vite proxies `/api` to the backend, so there is no CORS problem locally.
- In **production**, `VITE_API_URL` must be an **absolute URL** (or the same origin). The Google button needs it to reach the backend.

---

## 9. How to test

### 9.1 Test accounts (password for all: `Demo1234`)

| Email | Expected result |
| ----- | --------------- |
| `customer@demo.com` | Login OK → `/customer` |
| `agency@demo.com` | Login OK → `/agency`, can add/edit cars |
| `employee@demo.com` | Login OK → `/agency`, **403 page** on add/edit car |
| `admin@demo.com` | Login OK → `/admin` |
| `pending@demo.com` | Login **403**: "Your agency is waiting for admin approval." |

### 9.2 Manual test checklist

- [ ] Login with each test account → correct redirect
- [ ] Wrong password → error message, still on login page, **not logged out**
- [ ] Unknown email → same message as wrong password
- [ ] Customer register → logged in and redirected to `/customer`
- [ ] Register with an existing email → "already exists" message
- [ ] Agency register → "Request received" screen, no login
- [ ] Refresh the page while logged in → still logged in
- [ ] Delete / edit the token in `localStorage` → refresh → sent to `/login`
- [ ] Open `/admin` as a customer → 403 page
- [ ] Employee opens add-car page → 403 page
- [ ] Logout → token removed from `localStorage`, redirected to `/login`
- [ ] Forgot password with an existing and a non-existing email → same message
- [ ] Reset link with a valid token → success → `/login`
- [ ] Reset link with an invalid token → "invalid or expired" message
- [ ] Google login success → lands on the right area, `#token` removed from the URL
- [ ] Google cancel → "Login with Google failed" + "Back to login"

### 9.3 Quick debug tips

- Open DevTools → **Application → Local Storage** and check `anydrive_token`.
- Open DevTools → **Network** and look at `/auth/me` and `/auth/login` responses.
- Paste the token into jwt.io to see its payload and expiry (`exp`).

---

## 10. Troubleshooting

| Problem | Likely cause | Fix |
| ------- | ------------ | --- |
| Logged out after every refresh | `/auth/me` returns `401` or returns `{ user }` instead of `user` | Ask backend to return the user object directly and accept the token |
| User gets logged out when opening a page they are not allowed to | Backend returns `401` for wrong role | Backend must return `403` |
| User redirected to `/` after login | `role` value is not in `BACKEND_ROLE_MAP`, so `normalizeRole()` returns `guest` | Fix the role name on the backend, or add the new role to `BACKEND_ROLE_MAP` in `roles.js` (see section 5) |
| Agency buttons missing | `permissions` missing or lacks `fleet:manage` | Backend must send `permissions` array |
| Error shows `[object Object]` or is empty | `message` has a wrong shape | Backend must send `message` as string or string[] |
| Reset password sends user to `/login` immediately | Backend returned `401` for an invalid token | Backend must return `400` |
| Google button goes to a 404 | `VITE_API_URL` is relative in production | Use an absolute URL |
| Google login returns but user is not logged in | Redirect has `?token=` instead of `#token=` | Backend must use the fragment (`#`) |
| CORS error in browser | Backend does not allow the frontend origin | Backend CORS config (see backend README, section 14) |
| "Cannot reach the server" | Backend down, wrong `VITE_API_URL`, or request took > 15s | Check URL and backend |

---

## 11. Known limitations / TODO

- No refresh-token flow. When the token expires the user must log in again.
- If `/auth/me` fails for any reason, the token is deleted.
- Google failure details (`#error=`) are ignored for now.
- The JWT is in `localStorage` (readable by XSS). A cookie-based approach would need a frontend change (`withCredentials`).
- The project is plain JavaScript (no TypeScript).
- The project spec lists 5 backend roles while the UI uses 4 areas (see section 5).
- Admin "Approvals" has a navbar link (`ROUTES.ADMIN.APPROVALS`) and a footer link. Check that the page itself is connected to the backend endpoints (`/admin/agencies...`), which are only suggested for now.

---

## 12. Rules when changing auth code

1. Do not change field names or response shapes without telling the backend team. Update `README_BACKEND_AUTH_API.md` at the same time.
2. Keep `validators.js` in sync with the backend rules.
3. Never show raw server errors. Always use the `message` field or a generic text.
4. Never store the password, and never log the token.
5. Remember: hiding a button is not security. The backend must enforce roles and permissions.
6. When the backend adds a new role, add it to `BACKEND_ROLE_MAP` in `roles.js`, and update the backend README (section 4) at the same time.
7. When you add a new page for a role, add its path to `ROUTES` and, if it needs a link, to the navigation config for that role.
