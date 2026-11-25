# 🚗 Car Rental Platform — Frontend

A multi-role car rental web application built with **React + JavaScript + Vite + Tailwind CSS** (Node.js for tooling).

The platform serves **4 profiles**:

| Profile      | Who they are                          | What they can do                                                |
| ------------ | ------------------------------------- | --------------------------------------------------------------- |
| **Guest**    | Visitor, not logged in                | Browse cars, search, view details, register / login             |
| **Customer** | Registered user who rents cars        | Book cars, pay, manage bookings, favorites, reviews, profile    |
| **Agency**   | Car rental company / owner            | Manage fleet, accept/reject bookings, calendar, earnings        |
| **Admin**    | Platform administrator                | Manage users, approve agencies, moderate content, reports       |

---

## 1. Tech Stack

- **React 18** — UI library
- **JavaScript (ES6+)** — no TypeScript
- **Vite** — dev server and build tool
- **Tailwind CSS** — utility-first styling
- **React Router** — routing and role-based access
- **Axios** — HTTP client
- **Node.js (18+)** — runs Vite and npm tooling

---

## 2. Getting Started

```bash
# install dependencies
npm install

# copy env variables
cp .env.example .env

# start dev server
npm run dev

# production build
npm run build

# preview production build
npm run preview
```

### Environment variables (`.env`)

```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CarRental
```

> Only variables starting with `VITE_` are exposed to the frontend.

---

## 3. Architecture Overview

The project uses a **feature-based architecture**: code is grouped by **business feature** (cars, bookings, agency...) instead of by technical type (all components together, all pages together).

```
┌──────────────────────────────────────────────────────┐
│                       app/                           │  Router, providers, guards
├──────────────────────────────────────────────────────┤
│                     layouts/                         │  Page shells per role
├──────────────────────────────────────────────────────┤
│                    features/                         │  Business logic per domain
│  home · auth · cars · bookings · payments            │
│  customer · agency · admin · shared                  │
├──────────────────────────────────────────────────────┤
│   components/  hooks/  utils/  constants/            │  Reusable, no business logic
├──────────────────────────────────────────────────────┤
│                 services/api/                        │  Axios client (single entry)
└──────────────────────────────────────────────────────┘
```

### Dependency rules (important)

1. `app/` can import from anything.
2. `layouts/` can import from `components/`, `features/auth`, `constants/`.
3. A **feature** can import from `components/`, `hooks/`, `utils/`, `constants/`, `services/api/`.
4. A feature should **not** import from another feature, except:
   - `auth` (anyone may use `useAuth`)
   - `cars` (shared by guest, customer, agency, admin)
5. `components/ui`, `hooks`, `utils`, `constants` **never** import from `features/`.

---

## 4. Folder Structure

```
car-rental-frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── public/
└── src/
    ├── main.jsx
    ├── index.css
    ├── app/
    ├── layouts/
    ├── features/
    ├── components/
    ├── hooks/
    ├── services/
    ├── constants/
    ├── utils/
    ├── assets/
    └── styles/
```

---

## 5. Root Files

| File                  | Purpose                                                                 |
| --------------------- | ----------------------------------------------------------------------- |
| `index.html`          | HTML entry; contains `<div id="root">` and loads `src/main.jsx`.        |
| `package.json`        | Dependencies and npm scripts.                                           |
| `vite.config.js`      | Vite config: React plugin, `@` path alias to `src/`, dev server proxy.  |
| `tailwind.config.js`  | Tailwind config: content paths, theme colors, fonts, plugins.           |
| `postcss.config.js`   | PostCSS plugins (Tailwind + Autoprefixer).                              |
| `.env.example`        | Template of environment variables.                                      |
| `.eslintrc.cjs`       | Linting rules.                                                          |
| `.prettierrc`         | Code formatting rules.                                                  |

---

## 6. `src/` — Detailed Explanation

### 6.1 Entry files

| File         | Purpose                                                              |
| ------------ | -------------------------------------------------------------------- |
| `main.jsx`   | Mounts React into the DOM, imports `index.css`.                      |
| `index.css`  | Tailwind directives (`@tailwind base/components/utilities`) + globals. |

### 6.2 `app/` — Application core

Global setup that doesn't belong to a feature.

| File                          | Purpose                                                                 |
| ----------------------------- | ----------------------------------------------------------------------- |
| `App.jsx`                     | Root component: renders providers + router.                             |
| `providers.jsx`               | Wraps the app with all global providers (AuthProvider, Toast, Router).  |
| `router/index.jsx`            | Combines all route groups into one router.                              |
| `router/publicRoutes.jsx`     | Routes for **guests**: home, cars, car details, login, register, about. |
| `router/customerRoutes.jsx`   | Routes for **customers** (`/customer/*`).                               |
| `router/agencyRoutes.jsx`     | Routes for **agencies** (`/agency/*`).                                  |
| `router/adminRoutes.jsx`      | Routes for **admins** (`/admin/*`).                                     |
| `router/guards/ProtectedRoute.jsx` | Redirects to login if the user is not authenticated.               |
| `router/guards/RoleRoute.jsx`      | Allows access only to specific roles; otherwise → 403 page.        |
| `router/guards/GuestOnlyRoute.jsx` | Blocks logged-in users from login/register pages (redirects to their dashboard). |

### 6.3 `layouts/` — Page shells

A layout defines the **structure around a page** (navbar, sidebar, footer). Pages render inside `<Outlet />`.

| File                  | Used by  | Description                                      |
| --------------------- | -------- | ------------------------------------------------ |
| `PublicLayout.jsx`    | Guest    | Top navbar + footer. Marketing-style pages.      |
| `AuthLayout.jsx`      | Guest    | Minimal centered layout for login/register.      |
| `CustomerLayout.jsx`  | Customer | Navbar + customer sidebar/tabs.                  |
| `AgencyLayout.jsx`    | Agency   | Sidebar dashboard layout for fleet management.   |
| `AdminLayout.jsx`     | Admin    | Sidebar dashboard layout with admin menu.        |
| `parts/Navbar.jsx`    | Shared   | Top navigation (adapts to role / auth state).    |
| `parts/Footer.jsx`    | Shared   | Site footer.                                     |
| `parts/Sidebar.jsx`   | Dashboards | Side navigation, menu items passed by props.   |
| `parts/Topbar.jsx`    | Dashboards | Dashboard header: user menu, notifications.    |

---

## 7. `features/` — Business Features

Each feature follows the same internal structure:

```
feature-name/
├── pages/        # Route-level components (one per URL)
├── components/   # UI pieces used only by this feature
├── hooks/        # Custom hooks (state + data fetching logic)
├── services/     # API calls for this feature
└── store/        # (optional) Context / state for this feature
```

### 🏠 `home/` — Landing page (Guest)

| File                          | What it does                                            |
| ----------------------------- | ------------------------------------------------------- |
| `pages/HomePage.jsx`          | Landing page assembling all sections.                   |
| `components/Hero.jsx`         | Big banner with title and call-to-action.               |
| `components/SearchBar.jsx`    | Search by location, pickup date, return date.           |
| `components/FeaturedCars.jsx` | Shows popular / featured cars.                          |

### 🔐 `auth/` — Authentication (All)

Handles login, registration, session and token.

| File                                  | What it does                                                    |
| ------------------------------------- | --------------------------------------------------------------- |
| `pages/LoginPage.jsx`                 | Login screen for all roles.                                     |
| `pages/RegisterCustomerPage.jsx`      | Sign-up for customers.                                          |
| `pages/RegisterAgencyPage.jsx`        | Sign-up for agencies (extra fields: company, license, address). Needs admin approval. |
| `pages/ForgotPasswordPage.jsx`        | Request password reset email.                                   |
| `pages/ResetPasswordPage.jsx`         | Set a new password from email link.                             |
| `components/LoginForm.jsx`            | Login form UI + validation.                                     |
| `components/RegisterForm.jsx`         | Reusable registration form.                                     |
| `hooks/useAuth.js`                    | Gives access to `user`, `role`, `login()`, `logout()`, `isAuthenticated`. |
| `services/authService.js`             | API: login, register, logout, refresh token, forgot/reset password, get current user. |
| `store/AuthContext.jsx`               | Global auth state (current user + role) shared across the app.  |
| `utils/tokenStorage.js`               | Save / read / remove the JWT token (localStorage).              |

### 🚘 `cars/` — Car catalog (Guest + shared)

| File                              | What it does                                            |
| --------------------------------- | ------------------------------------------------------- |
| `pages/CarListPage.jsx`           | Browse all cars with filters, sorting, pagination.      |
| `pages/CarDetailsPage.jsx`        | Full details of one car + "Book now" button.            |
| `components/CarCard.jsx`          | Single car preview card.                                |
| `components/CarGrid.jsx`          | Grid of CarCards.                                       |
| `components/CarFilters.jsx`       | Filters: brand, price, fuel, transmission, seats, city. |
| `components/CarGallery.jsx`       | Image gallery / slider.                                 |
| `components/CarSpecs.jsx`         | Technical specs list.                                   |
| `hooks/useCars.js`                | Fetches cars with filters, loading and error state.     |
| `services/carService.js`          | API: get cars, get car by id, search, check availability. |

### 📅 `bookings/` — Booking flow

| File                                   | What it does                                          |
| -------------------------------------- | ----------------------------------------------------- |
| `pages/CheckoutPage.jsx`               | Final step: review booking and pay.                   |
| `pages/BookingConfirmationPage.jsx`    | Success page after booking.                           |
| `components/BookingForm.jsx`           | Pickup/return location, dates, options.               |
| `components/BookingSummary.jsx`        | Recap of car, dates, and total.                       |
| `components/DateRangePicker.jsx`       | Select rental period (blocks unavailable dates).      |
| `components/PriceBreakdown.jsx`        | Daily price, extras, taxes, deposit, total.           |
| `hooks/useBooking.js`                  | Booking flow state (selected car, dates, price calc). |
| `services/bookingService.js`           | API: create booking, check availability, calculate price. |

### 💳 `payments/` — Payments

| File                          | What it does                                   |
| ----------------------------- | ---------------------------------------------- |
| `components/PaymentForm.jsx`  | Card / payment method form.                    |
| `services/paymentService.js`  | API: create payment, confirm, get history, refund. |

### 👤 `customer/` — Customer dashboard

| File                                   | What it does                                       |
| -------------------------------------- | -------------------------------------------------- |
| `pages/CustomerDashboardPage.jsx`      | Overview: upcoming rentals, recent activity.       |
| `pages/MyBookingsPage.jsx`             | List of all bookings (upcoming / past / cancelled).|
| `pages/BookingDetailsPage.jsx`         | One booking in detail + cancel option.             |
| `pages/FavoritesPage.jsx`              | Saved cars.                                        |
| `pages/PaymentHistoryPage.jsx`         | Past payments and invoices.                        |
| `pages/CustomerProfilePage.jsx`        | Edit personal info, driver license, password.      |
| `pages/CustomerReviewsPage.jsx`        | Reviews written by the customer.                   |
| `components/BookingList.jsx`            | Reusable list of bookings.                         |
| `components/ProfileForm.jsx`            | Profile edit form.                                 |
| `hooks/useCustomerBookings.js`          | Fetch and manage the customer's bookings.          |
| `services/customerService.js`           | API: profile, favorites, my bookings, reviews.     |

### 🏢 `agency/` — Agency dashboard

| File                                      | What it does                                      |
| ----------------------------------------- | ------------------------------------------------- |
| `pages/AgencyDashboardPage.jsx`           | KPIs: active rentals, revenue, fleet status.      |
| `pages/FleetPage.jsx`                     | List/manage all agency cars.                      |
| `pages/AddCarPage.jsx`                    | Add a new car with photos and specs.              |
| `pages/EditCarPage.jsx`                   | Edit an existing car.                             |
| `pages/AgencyBookingsPage.jsx`            | Booking requests: accept / reject / complete.     |
| `pages/AgencyBookingDetailsPage.jsx`      | Full details of one booking.                      |
| `pages/AgencyCalendarPage.jsx`            | Calendar of reservations and availability.        |
| `pages/AgencyEarningsPage.jsx`            | Revenue statistics and payouts.                   |
| `pages/AgencyReviewsPage.jsx`             | Reviews received; reply to customers.             |
| `pages/AgencyProfilePage.jsx`             | Company info, logo, locations, working hours.     |
| `components/CarForm.jsx`                  | Shared form for add/edit car.                     |
| `components/FleetTable.jsx`               | Table of cars with actions (edit, hide, delete).  |
| `components/BookingRequestCard.jsx`       | Card with accept/reject buttons.                  |
| `components/AvailabilityCalendar.jsx`     | Calendar UI.                                      |
| `components/EarningsChart.jsx`            | Revenue chart.                                    |
| `hooks/useAgencyFleet.js`                 | Fleet data + CRUD actions.                        |
| `hooks/useAgencyBookings.js`              | Bookings data + status actions.                   |
| `services/agencyService.js`               | API: fleet CRUD, bookings, earnings, profile.     |

### 🛡️ `admin/` — Admin dashboard

| File                                      | What it does                                      |
| ----------------------------------------- | ------------------------------------------------- |
| `pages/AdminDashboardPage.jsx`            | Global platform statistics.                       |
| `pages/UsersManagementPage.jsx`           | List, search, block/unblock, delete users.        |
| `pages/AgenciesManagementPage.jsx`        | List and manage all agencies.                     |
| `pages/AgencyApprovalPage.jsx`            | Review pending agency registrations (approve/reject). |
| `pages/CarsModerationPage.jsx`            | Review/remove car listings.                       |
| `pages/AllBookingsPage.jsx`               | View all bookings across the platform.            |
| `pages/PaymentsPage.jsx`                  | All transactions, commissions, refunds.           |
| `pages/ReportsPage.jsx`                   | Analytics and exports.                            |
| `pages/ReviewsModerationPage.jsx`         | Moderate reviews / reported content.              |
| `pages/SettingsPage.jsx`                  | Platform settings: commission, taxes, categories. |
| `components/StatsCards.jsx`               | KPI cards.                                        |
| `components/UsersTable.jsx`               | Users table with actions.                         |
| `components/AgencyApprovalCard.jsx`       | Agency request card with documents.               |
| `components/AnalyticsCharts.jsx`          | Charts for the dashboard and reports.             |
| `hooks/useAdminStats.js`                  | Fetch dashboard statistics.                       |
| `services/adminService.js`                | API: users, agencies, moderation, stats, settings.|

### 🌐 `shared/` — Common pages

| File                         | What it does                                  |
| ---------------------------- | --------------------------------------------- |
| `pages/NotFoundPage.jsx`     | 404 — page not found.                         |
| `pages/ForbiddenPage.jsx`    | 403 — role not allowed.                       |
| `pages/ServerErrorPage.jsx`  | 500 — server error.                           |
| `pages/AboutPage.jsx`        | About the company.                            |
| `pages/ContactPage.jsx`      | Contact form.                                 |

---

## 8. `components/` — Reusable UI (no business logic)

### `components/ui/` — Design-system primitives

`Button`, `Input`, `Select`, `Textarea`, `Checkbox`, `Modal`, `Dropdown`, `Badge`, `Card`, `Table`, `Tabs`, `Pagination`, `Spinner`, `Skeleton`, `Toast`

Small, generic, styled with Tailwind, configurable by props. They know nothing about cars or bookings.

### `components/common/` — Shared composed components

| File                 | Purpose                                              |
| -------------------- | ---------------------------------------------------- |
| `PageHeader.jsx`     | Page title + breadcrumbs + action button.            |
| `EmptyState.jsx`     | "No results" placeholder.                            |
| `ErrorBoundary.jsx`  | Catches React rendering errors.                      |
| `ConfirmDialog.jsx`  | "Are you sure?" modal.                               |
| `ImageUploader.jsx`  | Upload + preview images.                             |
| `RatingStars.jsx`    | Display/select star rating.                          |
| `StatusBadge.jsx`    | Colored badge for booking/car/user status.           |
| `ScrollToTop.jsx`    | Scrolls to top on route change.                      |

---

## 9. `hooks/` — Global custom hooks

| Hook                   | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| `useDebounce.js`       | Delay a value (search input).                        |
| `useLocalStorage.js`   | State synced with localStorage.                      |
| `useMediaQuery.js`     | Responsive logic in JS.                              |
| `usePagination.js`     | Page, limit, next/prev helpers.                      |
| `useClickOutside.js`   | Detect clicks outside (dropdowns, modals).           |

---

## 10. `services/api/` — API layer

All HTTP requests go through this layer. **Components never call `axios` directly.**

| File               | What it does                                                                 |
| ------------------ | ---------------------------------------------------------------------------- |
| `axiosClient.js`   | Creates the Axios instance (`baseURL` from `VITE_API_URL`, headers, timeout).|
| `interceptors.js`  | Request: attach JWT token. Response: handle `401` (logout/refresh), `403`, `500`, format errors. |
| `endpoints.js`     | Central list of all API URLs (no hard-coded URLs elsewhere).                 |

### Service summary (feature services)

| Service                | Responsibility                                                         |
| ---------------------- | ---------------------------------------------------------------------- |
| `authService`          | Login, register, logout, refresh token, reset password, current user.  |
| `carService`           | Fetch cars, details, search, availability.                             |
| `bookingService`       | Create booking, price calculation, availability check.                 |
| `paymentService`       | Create/confirm payments, history, refunds.                             |
| `customerService`      | Customer profile, favorites, bookings, reviews.                        |
| `agencyService`        | Fleet CRUD, booking management, earnings, agency profile.              |
| `adminService`         | Users, agencies approval, moderation, stats, platform settings.        |

**Flow:** `Page → Hook → Service → axiosClient → Backend API`

---

## 11. `constants/`

| File                  | Purpose                                                       |
| --------------------- | ------------------------------------------------------------- |
| `roles.js`            | `GUEST`, `CUSTOMER`, `AGENCY`, `ADMIN` role names.            |
| `routes.js`           | All route paths (avoid typing URLs manually).                 |
| `bookingStatus.js`    | `PENDING`, `CONFIRMED`, `ACTIVE`, `COMPLETED`, `CANCELLED`.   |
| `config.js`           | App-wide config (pagination size, currency, etc.).            |

## 12. `utils/`

| File               | Purpose                                         |
| ------------------ | ----------------------------------------------- |
| `formatDate.js`    | Date formatting helpers.                        |
| `formatPrice.js`   | Currency formatting.                            |
| `validators.js`    | Email, phone, password validation.              |
| `cn.js`            | Merge Tailwind class names conditionally.       |
| `helpers.js`       | Misc small helpers.                             |

## 13. `assets/` and `styles/`

- `assets/images/` — logos, banners, placeholders.
- `assets/icons/` — SVG icons.
- `styles/components.css` — custom Tailwind `@layer components` classes if needed.

---

## 14. Routing & Access Control

| Prefix        | Roles allowed   | Layout           |
| ------------- | --------------- | ---------------- |
| `/`           | Everyone        | `PublicLayout`   |
| `/cars/*`     | Everyone        | `PublicLayout`   |
| `/login`, `/register/*` | Guest only | `AuthLayout` |
| `/customer/*` | Customer        | `CustomerLayout` |
| `/agency/*`   | Agency          | `AgencyLayout`   |
| `/admin/*`    | Admin           | `AdminLayout`    |
| `/403`, `*`   | Everyone        | `PublicLayout`   |

Example composition:

```jsx
<Route element={<ProtectedRoute />}>
  <Route element={<RoleRoute allowed={[ROLES.CUSTOMER]} />}>
    <Route element={<CustomerLayout />}>
      <Route path="/customer/bookings" element={<MyBookingsPage />} />
    </Route>
  </Route>
</Route>
```

## 15. Authentication Flow

1. User submits `LoginForm` → `authService.login()`.
2. Backend returns `{ token, user }`.
3. `tokenStorage` saves the token; `AuthContext` stores `user` and `role`.
4. `interceptors.js` attaches `Authorization: Bearer <token>` to every request.
5. After login, redirect by role:
   - customer → `/customer`
   - agency → `/agency`
   - admin → `/admin`
6. On `401`, the interceptor clears the session and redirects to `/login`.

## 16. Booking Flow (Customer)

```
Home (search) → Car list → Car details → Booking form
    → Checkout (summary + payment) → Confirmation → My bookings
                                             ↓
                         Agency receives request → accept / reject
```

## 17. Conventions

- **Components & pages:** `PascalCase.jsx`
- **Hooks:** `useSomething.js`
- **Services / utils / constants:** `camelCase.js`
- One component per file; default export for components.
- Use the `@` alias: `import Button from '@/components/ui/Button'`
- Keep pages thin: logic goes in hooks, API calls in services, UI in components.
- No hard-coded URLs or role strings; use `endpoints.js`, `routes.js`, `roles.js`.
- Style only with Tailwind utilities; use `cn()` for conditional classes.

## 18. Suggested Next Steps

1. Configure `vite.config.js` (alias `@`) and `tailwind.config.js`.
2. Implement `roles.js`, `routes.js`, `axiosClient.js`.
3. Build `AuthContext`, guards, and the router.
4. Build UI primitives (`Button`, `Input`, `Modal`...).
5. Implement features in this order: `auth → cars → bookings → customer → agency → admin`.
