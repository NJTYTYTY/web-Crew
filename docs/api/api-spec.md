# API & Webhook Specification

## 1. Authentication Endpoints (`/api/auth`)
* `POST /api/auth/register` — Register with `username`, `password`, and `confirmPassword` (validated via `zod`).
* `POST /api/auth/login` — Authenticate with `username` and `password`; returns JWT (HTTP-only cookie or Bearer token).
* `POST /api/auth/logout` — Clear session token.
* `GET /api/auth/me` — Return current authenticated user profile and role (`CUSTOMER` | `ADMIN`).

## 2. Storefront Public Endpoints (`/api/*`)
* `GET /api/banners` — Fetch active homepage banners ordered by `sortOrder`.
* `GET /api/accounts` — List marketplace game accounts (supports filtering by `gameCategory`, `status`, and price sorting; **never** returns secret credentials).
* `GET /api/topup/games` — List active top-up games and their selectable packages.

## 3. Customer Orders & Checkout (`/api/orders`)
* `POST /api/orders` — Create a new `ACCOUNT` or `TOPUP` order; calculates exact price from PostgreSQL and returns Dynamic QR payload + `transactionRef`.
* `GET /api/orders` — List authenticated customer's order history (reveals `accountUsername` and `accountPassword` only when `status === 'PAID'`).
* `GET /api/orders/:id/status` — Poll or stream live payment & fulfillment status for the Checkout Modal.

## 4. IQ-Bank Webhook & Simulator (`/api/webhooks/iqbank`)
* `POST /api/webhooks/iqbank` — Receives payment status callbacks signed with `HMAC-SHA256` (`x-iqbank-signature`).
  * Verifies signature using Node `crypto`.
  * Enforces idempotency on `transactionRef`.
  * Updates `payments.status` to `SUCCESS` and `orders.status` to `PAID`.

## 5. Admin Backoffice Endpoints (`/api/admin/*`)
* Requires `role === 'ADMIN'`.
* `GET /api/admin/overview` — Dashboard KPIs and recent transactions.
* `CRUD /api/admin/accounts` — Manage Roblox/RoV account inventory and secret credentials.
* `CRUD /api/admin/topup` — Manage top-up games and denomination packages.
* `GET & PATCH /api/admin/orders` — Inspect orders, raw webhook payloads, and update `fulfillmentStatus`.
* `CRUD /api/admin/banners` — Manage and reorder homepage banners.
