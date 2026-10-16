# System Architecture & Data Flows

## 1. High-Level Overview

**CEDT-Crew (NEXUS PLAY / ApexPay)** is a full-stack Gaming E-Commerce & Automated Game Top-Up Platform consisting of:
1. **Frontend (`/frontend` — Port `3000`)**: Next.js 14 (App Router) + TypeScript + Tailwind CSS (Clean Minimal Light Storefront + Precision Slate Admin Backoffice) with bilingual `EN | ไทย` support (`LanguageContext`).
2. **Backend (`/backend` — Port `4000`)**: Node.js + Express.js + TypeScript + Drizzle ORM + Zod validation (`express.json({ limit: '15mb' })` for direct image uploads).
3. **Database (`postgres` — Port `5432`)**: PostgreSQL 16 (`postgres:16-alpine`) running in Docker (`nexusplay-postgres`) with persistent volume `postgres_data`.
4. **Mock Banking Gateway (`IQ-Bank`)**: Dynamic PromptPay QR generator + HMAC-SHA256 webhook verification + cross-tab new-window simulator (`/iq-bank-simulator`).

---

## 2. Core Business & Technical Flows

### Flow A: Persistent Authentication (`/login`, `/register`, `/admin/login`)
- **Username + Password Only**: Hashed with `bcrypt` and stored in PostgreSQL `users` table (`CUSTOMER` and `ADMIN` roles).
- **Session Persistence**: Returns a 7-day JWT token stored in both an HTTP-only cookie (`token`) and `localStorage` (`nexus_play_token` + `nexus_play_user`).
- **SSR-Safe Hydration**: `StoreContext` initializes `user` to `null` for Next.js SSR compatibility and hydrates from `localStorage` + verifies via `GET /api/auth/me` inside `useEffect` on mount.

### Flow B: 100% Dynamic Admin CMS -> Storefront Sync
All images, game logos, banners, accounts, and packages are database-driven with zero hardcoded lock-in:
- **Homepage Hero Slider (`/admin/banners` -> `/`)**: Supports computer file upload (Base64 data URL), custom URL, or `/pic-banner-slide/*` presets via `/api/admin/banners`.
- **Game Accounts Marketplace (`/admin/accounts` -> `/accounts` & Home 3-Card Fan)**: Supports computer image upload, `/game-account_sale/*` presets, structured `specs` JSONB (`levelOrRank`, `heroesOrFruitsCount`, `skinsOrWeaponsCount`, `serverRegion`, `emailStatus`), and AES-vaulted `accountUsername` / `accountPassword` via `/api/admin/accounts`.
- **Top-Up Games & Logos (`/admin/topup` -> `/topup` & Home 3-Card Logo Fan)**: Supports editing each game's display name and logo image (`PATCH /api/admin/topup/games/:slug`) as well as denomination package CRUD (`/api/admin/topup`).

### Flow C: IQ-Bank Dynamic QR & Cross-Tab Webhook Verification
```
[Storefront Tab (/accounts or /topup)]
  │
  ├── 1. POST /api/orders ──> [Express Backend] ──> [PostgreSQL: orders (PENDING) + payments (WAITING)]
  │     Opens QR Checkout Modal (State 1: Waiting for Payment)
  │     Starts 2s polling (GET /api/orders/:id/status) + listens on BroadcastChannel('nexusplay_payment_channel')
  │
  ├── 2. Click "Open IQ-Bank Demo Payment Simulator ↗"
  │     Opens /iq-bank-simulator in a NEW TAB (_blank) while keeping QR Modal open on Storefront Tab
  ▼
[IQ-Bank Simulator Tab (/iq-bank-simulator)]
  │
  └── 3. Click "Confirm Payment (Trigger Webhook)"
        ├── Dispatches POST /api/webhooks/iqbank/simulate (HMAC-SHA256 verified)
        │     └── Backend marks payments.status = 'SUCCESS', orders.status = 'PAID', gameAccounts.status = 'SOLD'
        └── Broadcasts PAYMENT_SUCCESS via BroadcastChannel & localStorage
              └── Storefront Tab QR Modal automatically advances to State 2 (Payment Verified!) -> State 3 (Credentials Revealed!)
```
