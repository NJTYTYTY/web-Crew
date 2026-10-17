# Project Verification & Acceptance Checklist

## Overview
This document enforces a two-tier Definition of Done (DoD) verification process across the NEXUS PLAY project.
All automated pre-flight checks (Step 1) must execute and pass with zero failures before submitting for manual user verification (Step 2).

---

### Task: Multi-Layer Defect Resolution, Race-Condition Locking & Payment Flow Sync
- Date: 2026-10-17
- Scope: Backend routes (`admin.routes.ts`, `orders.routes.ts`, `webhook.routes.ts`), Storefront (`StoreContext.tsx`, `PaymentCheckoutModal.tsx`, `SimulatorView.tsx`, `HomeView.tsx`, `api.ts`), and Admin Backoffice (`TransactionInspectorDrawer.tsx`, `orders/page.tsx`, `topup/page.tsx`, `page.tsx`).

#### Step 1: AI Automated Verification (Pre-Flight) - PASSED
- [x] TypeScript Static Compilation (Backend): `npx tsc --noEmit` executed in `/backend` - Result: 0 errors.
- [x] TypeScript Static Compilation (Frontend): `npx tsc --noEmit` executed in `/frontend` - Result: 0 errors.
- [x] Automated Test Suite Execution: `npm run test:verify` (`backend/scripts/verify-fixes.ts`) executed against live PostgreSQL - Result: 18/18 tests passed.
  - [x] Test 1.1: Webhook HMAC-SHA256 signature verification with raw buffer succeeds.
  - [x] Test 1.2: Invalid signature rejected with status 401.
  - [x] Test 1.3: Mismatched length signature rejected safely without throwing Buffer length errors.
  - [x] Test 1.4: Missing signature rejected.
  - [x] Test 2.1: Empty update payload detected to protect Drizzle ORM query builder from empty .set() crash.
  - [x] Test 2.2: Partial account update schema validation succeeds with valid fields.
  - [x] Test 2.3: Invalid order status rejected by Zod schema.
  - [x] Test 3.1: Game account created with status AVAILABLE.
  - [x] Test 3.2: First checkout request atomically reserves account with `status = 'RESERVED' WHERE status = 'AVAILABLE'`.
  - [x] Test 3.3: Concurrent second checkout request blocked (0 rows updated), returning 409 Conflict.
  - [x] Test 3.4: Test account cleaned up cleanly.
  - [x] Test 4.1: Order status updated to PAID synchronizes linked game account status to SOLD.
  - [x] Test 4.2: Order status updated to PAID synchronizes linked payment status to SUCCESS.
  - [x] Test 4.3: Order status updated to PAID records paidAt timestamp in database.
  - [x] Test 4.4: Order status updated to CANCELLED restores linked game account status to AVAILABLE.
  - [x] Test 4.5: Order status updated to CANCELLED transitions linked payment status to FAILED.
  - [x] Test 4.6: Test sync records cleaned up cleanly.
  - [x] Test 5.1: pendingTopups KPI calculation filters strictly `orderType === 'TOPUP'` and non-cancelled/non-completed orders.
- [x] Modularity Standard: All modified files verified strictly under 800 lines (max file size: 431 lines).

---

#### Step 2: User Verification Steps (Acceptance Test)

##### 1. Payment Dynamic PromptPay QR Rendering & Download
1. Open the storefront at `http://localhost:3000/topup` or `http://localhost:3000/accounts`.
2. Select any product and click to initiate checkout.
3. Observe the PromptPay QR checkout modal:
   - Dynamic QR code is generated and rendered crisp onto the screen using the `qrcode` library.
   - Click "Download / Save QR" button and observe browser downloading `PromptPay-QR-IQB-TX-XXXXXX.png`.
   - Wait or test the 00:00 countdown state to verify the expiration screen with "Close & Retry".

##### 2. IQ-Bank Webhook Payment Simulator
1. In the QR checkout modal, click "Open IQ-Bank Demo Payment Simulator".
2. On `/iq-bank-simulator`:
   - Click on the pending orders list pill to load the active transaction reference.
   - Click "Confirm Payment & Dispatch Webhook".
   - Return to the storefront tab and verify the modal immediately advances to "Payment Verified" and then "Instant Order Delivery".

##### 3. Admin Backoffice Order Management & Data Synchronization
1. Navigate to `/admin/login` and log in with operator credentials (`admin_iq` / `admin123`).
2. Navigate to `/admin/orders`:
   - Verify client-side pagination (10 items per page) with Previous, page numbers, and Next buttons.
   - Click "Export Logs" and verify browser downloads `IQ-Bank-Audit-Logs.csv` with full ledger records.
   - Inspect any pending order and click "Mark Completed" or "Force Manual Resolve".
   - Verify the linked payment status updates to `SUCCESS` and game account status updates to `SOLD` in PostgreSQL.
3. Navigate to `/admin` (Overview Command):
   - Click "Export CSV" on the Recent Transactions table and verify browser downloads `NexusPlay-Ledger.csv`.
   - Click on any transaction row and verify "Force Manual Resolve / Complete in DB" executes via authorized API request without 401 errors.
4. Navigate to `/admin/topup`:
   - Click "+ Add Package".
   - Select game and fill in denomination and price.
   - Save and verify package links dynamically to the database game ID (`dbGameId`) rather than hardcoded index numbers.

---

#### Acceptance Sign-off
- Status: [x] Step 1 Automated Tests Passed (18/18) | [x] User Verification Step 2 Completed

---

### Task: Dynamic Game Titles & Multi-Category Architecture (Admin Backoffice & Storefront)
- Date: 2026-10-17
- Scope: Database schema migration (`game_accounts.game_category` to `varchar(50)`), backend routes (`admin.routes.ts`, `admin.schemas.ts`, `store.routes.ts`, `orders.routes.ts`), automated verification suite (`verify-fixes.ts`), storefront types and normalizers (`types/store.ts`, `lib/api.ts`, `StoreContext.tsx`), storefront views (`GameTopupView.tsx`, `AccountMarketplaceView.tsx`), and admin backoffice (`GameCreateModal.tsx`, `PackageFormDrawer.tsx`, `PackagesTable.tsx`, `topup/page.tsx`, `AccountFormDrawer.tsx`, `accounts/page.tsx`).

#### Step 1: AI Automated Verification (Pre-Flight) - PASSED
- [x] TypeScript Static Compilation (Backend): `npx tsc --noEmit` executed in `/backend` - Result: 0 errors.
- [x] TypeScript Static Compilation (Frontend): `npx tsc --noEmit` executed in `/frontend` - Result: 0 errors.
- [x] Automated Test Suite Execution: `npm run test:verify` (`backend/scripts/verify-fixes.ts`) executed against live PostgreSQL - Result: 29/29 tests passed.
  - [x] Test 6.1: `gameCreateSchema` validates valid game definition and rejects slugs containing invalid characters or uppercase.
  - [x] Test 6.2: Dynamic game title inserted into `topup_games` with slug persistence.
  - [x] Test 6.3: Database query detects existing slug to prevent duplicates (409 Conflict protection).
  - [x] Test 6.4: Dynamic top-up package created and linked to custom game ID.
  - [x] Test 6.5: Game account created with arbitrary dynamic category (e.g. `VALORANT`) without enum restriction.
  - [x] Test 6.6: Distinct categories query discovers and returns newly added game category.
  - [x] Test 6.7: Dynamic test game, package, and account cleaned up cleanly.
- [x] Modularity Standard: All modified files verified strictly under 800 lines (backend max: 493 lines, frontend max: 479 lines).

---

#### Step 2: User Verification Steps (Acceptance Test)

##### 1. Adding a New Game Title in Admin Top-Up Management
1. Navigate to `/admin/login` and log in with operator credentials (`admin_iq` / `admin123`).
2. Navigate to `/admin/topup`.
3. Click the "+ Add Game Title" button in the header.
4. Fill in the modal:
   - Game Name: e.g. `Valorant`
   - URL Slug: `valorant`
   - Input Mode: `Player UID / Riot ID`
   - Icon / Logo URL: Select an icon or enter a custom path
5. Click "Create Game Title". Verify the new game card appears in the provider list with 0 active SKUs.

##### 2. Creating a Top-Up Package for the New Game
1. In `/admin/topup`, click "+ Add Package".
2. Open the "Target Game Provider" dropdown and select the newly created game (e.g. `Valorant`).
3. Fill in Package Name (e.g. `1,000 Valorant Points`), Denomination, and Pricing.
4. Save the package. Verify it appears in the SKU table under the new game provider.

##### 3. Verifying the Dynamic Game on Customer Storefront
1. Navigate to `http://localhost:3000/topup`.
2. Verify that the new game appears dynamically in the game selection list alongside existing games.
3. Select the new game and verify the package created in Step 2 is displayed and selectable for checkout.

##### 4. Adding a Game Account Under a Custom Game Category
1. In Admin Backoffice, navigate to `/admin/accounts`.
2. Click "+ Add Game Account".
3. In the Platform Selector, choose "+ Other Game" and type a custom title (e.g. `Valorant` or `Genshin Impact`).
4. Fill in title, price, credentials, and save.
5. Verify the account appears in the inventory table with the custom category tag.

##### 5. Verifying the Dynamic Category on Account Marketplace
1. Navigate to `http://localhost:3000/accounts`.
2. Verify that the dynamic category filter pill (e.g. `VALORANT`) appears in the category bar.
3. Click the pill and verify only accounts belonging to that category are filtered and displayed.

---

#### Acceptance Sign-off
- Status: [x] Step 1 Automated Tests Passed (29/29) | [ ] Pending User Verification Step 2

