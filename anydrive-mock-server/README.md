# AnyDrive — Mock auth server

A throw-away fake backend so the **AnyDrive frontend** can be developed and demoed before the real NestJS API exists.
It is **not part of the frontend project** and must never be deployed. User accounts and changes are stored in plain text in `data/users.json`; this is mock-only and must not be used for real credentials.

## Run

```bash
node server.js              # Node >= 18, no npm install needed
# or: npm start
```

Listens on `http://localhost:5001/api`. Options (env vars): `PORT` (5001), `FRONTEND_URL` (`http://localhost:5173`), `DELAY_MS` (250, fake latency).

## Use it from the frontend

In `car-rental-frontend/.env`:

```
VITE_API_URL=/api
MOCK_API_TARGET=http://localhost:5001
```

The Vite dev server proxies `/api` requests to the mock server. If the mock server uses another port, set `MOCK_API_TARGET` to that server's origin and restart Vite.
When the real backend is ready, change `VITE_API_URL` to its URL — no frontend code changes.

## Demo accounts (password `Demo1234`)

| Email                | Backend role      | Frontend area | Notes                                  |
| -------------------- | ----------------- | ------------- | -------------------------------------- |
| `customer@demo.com`  | `CUSTOMER`        | customer      |                                        |
| `agency@demo.com`    | `AGENCY_ADMIN`    | agency        | `fleet:manage`, `bookings:manage`, `employees:manage` |
| `employee@demo.com`  | `AGENCY_EMPLOYEE` | agency        | only `bookings:manage` → gets 403 on add/edit car |
| `admin@demo.com`     | `SUPER_ADMIN`     | admin         | permission `*`                         |
| `pending@demo.com`   | `AGENCY_ADMIN`    | —             | login refused (403, waiting approval)  |

## Endpoints

| Endpoint                         | Behaviour                                                              |
| -------------------------------- | ---------------------------------------------------------------------- |
| `POST /api/auth/login`           | `{token,user}`; 401 wrong credentials; 403 agency pending/rejected     |
| `POST /api/auth/register`        | validates, 409 if email exists, returns `{token,user}` (CUSTOMER)      |
| `POST /api/auth/register-agency` | creates a **PENDING** agency, returns `{message}`                      |
| `GET  /api/auth/me`              | needs `Authorization: Bearer <jwt>`, else 401                          |
| `POST /api/auth/logout`          | 200                                                                    |
| `POST /api/auth/forgot-password` | always 200; the reset link is **printed in this terminal**             |
| `POST /api/auth/reset-password`  | `{token,password}`                                                     |
| `GET  /api/auth/google`          | fake Google page → redirects to `FRONTEND_URL/auth/callback#token=…`   |

Passwords are stored as plain text in `data/users.json` for this local mock only; never use real credentials or deploy this server. Tokens are HS256 JWTs that expire after 1 hour (so the frontend's 401 handling can be tested).

### Dev helpers (not in the real API)

```bash
curl localhost:5001/api/_dev/users                                   # list users
curl -X POST localhost:5001/api/_dev/approve-agency \
     -H 'Content-Type: application/json' -d '{"email":"pending@demo.com"}'   # approve an agency
```
