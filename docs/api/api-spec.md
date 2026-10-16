# API & Webhook Catalog (Real-Time Implementation)

Base URL: `http://localhost:4000` (configured via `NEXT_PUBLIC_API_URL`)
Body Limit: `15mb` (supports Base64 image uploads from Admin Dashboard)

---

## 1. Health & Diagnostics
- `GET /api/health` — Returns service status, gateway version (`IQ-BANK-DYNAMIC-QR-V2`), and ISO timestamp.

## 2. Authentication Endpoints (`/api/auth`)
- `POST /api/auth/register` — Validates `{ username, password, confirmPassword }` via `zod`. Creates `CUSTOMER` in `users` (or signs in if `username` already exists) and returns `{ token, user }`.
- `POST /api/auth/login` — Authenticates `{ username, password }`. Verifies password against PostgreSQL `passwordHash` via `bcrypt.compare`. Returns 7-day JWT `{ token, user }` on success, or `401 Unauthorized` (`{ error: 'Invalid username or password' }`) if credentials are invalid. Supports seeded default accounts (`alex_gamer` / `password123` as `CUSTOMER`, `admin_iq` / `admin123` as `ADMIN`).
- `POST /api/auth/logout` — Clears `token` cookie.
- `GET /api/auth/me` — Verifies Bearer / Cookie JWT and returns `{ user }`.

## 3. Storefront Public Catalog (`/api/*`)
- `GET /api/banners` — Lists active homepage hero banners ordered by `sortOrder ASC`.
- `GET /api/accounts` — Lists marketplace accounts (`ROBLOX` and `ROV`) with `specs` JSONB, `highlightTags`, `price`, `imageUrl`, and `status`. **Never** exposes `accountUsername` or `accountPassword`.
- `GET /api/topup/games` — Lists active top-up games (`rov`, `freefire`, `roblox`) including custom `iconUrl`, `inputMode` (`UID` | `ID_PASS`), and nested active `packages`.

## 4. Customer Orders & Live Status Polling (`/api/orders`)
- `POST /api/orders` — Creates an `ACCOUNT` or `TOPUP` order. Looks up authoritative price in PostgreSQL, inserts `orders` (`PENDING`) and `payments` (`WAITING`) with `IQB-TX-xxxxxx` and EMVCo PromptPay `qrPayload`.
- `GET /api/orders` — Returns order history for the current customer. Reveals `credentials: { accountUsername, accountPassword }` **only** when `order.status === 'PAID'`.
- `GET /api/orders/:id/status` — Polled every 2 seconds by `PaymentCheckoutModal`. Supports numeric `id`, `orderNumber` (`ORD-...`), or `transactionRef` (`IQB-TX-...`).

## 5. IQ-Bank Webhook & Simulator (`/api/webhooks/iqbank`)
- `POST /api/webhooks/iqbank` — Production-style webhook receiver.
  - Verifies `x-iqbank-signature` using `HMAC-SHA256` (`IQBANK_WEBHOOK_SECRET`).
  - Enforces idempotency on `transactionRef`.
  - On `SUCCESS`: Updates `payments.status = 'SUCCESS'`, `orders.status = 'PAID'`, `orders.fulfillmentStatus = 'COMPLETED'`, and marks purchased `gameAccounts.status = 'SOLD'`.
- `POST /api/webhooks/iqbank/simulate` (alias `POST /api/simulator/trigger`) — Signs the simulator payload with `HMAC-SHA256` and executes the webhook verification & settlement pipeline.

## 6. Admin Backoffice Endpoints (`/api/admin/*`)
- `GET /api/admin/overview` — Returns live PostgreSQL KPIs (`totalRevenue`, `accountsSold`, `totalAccounts`, `inStockAccounts`, `rovAccountsCount`, `robloxAccountsCount`, `pendingTopups`, `completedOrdersCount`, `totalOrdersCount`, `activeBanners`, `totalBanners`, `firstActiveBannerTitle`) and enriched `recentTransactions`.
- `GET /api/admin/accounts` — Returns all game accounts including secret `accountUsername`, `accountPassword`, and `specs`.
- `POST /api/admin/accounts` — Creates a new game account listing.
- `PATCH / PUT /api/admin/accounts/:id` — Updates an existing game account (image upload, price, specs, credentials, or status).
- `DELETE /api/admin/accounts/:id` — Deletes a game account listing.
- `GET /api/admin/topup` — Returns all top-up games (`games`) and denomination packages (`packages`).
- `PATCH / PUT /api/admin/topup/games/:slug` — Updates a top-up game's `name`, `iconUrl` (logo image upload/URL), `inputMode`, or `isActive`.
- `POST /api/admin/topup` — Creates a new top-up denomination package.
- `PATCH / PUT /api/admin/topup/:id` — Updates a top-up package (`packageName`, `bonusTag`, `price`, `isActive`).
- `DELETE /api/admin/topup/:id` — Deletes a top-up package.
- `GET /api/admin/orders` — Returns all orders enriched with customer `username`, `itemTitle`, `gameName`, `accountUsername`, `accountPassword`, and `payment` record.
- `PATCH /api/admin/orders/:id` — Updates `status` (`PENDING` | `PAID` | `CANCELLED`) and `fulfillmentStatus` (`PENDING` | `PROCESSING` | `COMPLETED` | `FAILED`) by numeric ID or `orderNumber`.
- `GET / POST / PATCH / PUT / DELETE /api/admin/banners` — Full CRUD and `sortOrder` management for homepage promotional banners.
