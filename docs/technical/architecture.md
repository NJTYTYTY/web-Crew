# System Architecture

## 1. High-Level Overview

**CEDT-Crew Gaming E-Commerce & Automated Game Top-Up Platform** is a full-stack web application consisting of:
1. **Frontend (`/frontend`)**: Next.js (App Router) + TypeScript + Tailwind CSS (Precision Slate Light Theme).
2. **Backend (`/backend`)**: Node.js + Express.js + TypeScript + Drizzle ORM + Zod.
3. **Database**: PostgreSQL 16.
4. **Mock Banking Service (`IQ-Bank`)**: Built-in Dynamic QR PromptPay & HMAC-SHA256 Webhook Simulator.

---

## 2. Core Business Flows

### Flow A: Game Account Marketplace (`/accounts`)
* Supports **Roblox** and **RoV** ready-to-play accounts.
* Secret credentials (`accountUsername` and `accountPassword`) are stored in PostgreSQL and never exposed on public endpoints.
* Immediately unlocked and revealed to the buyer once the IQ-Bank payment webhook transitions the order to `PAID`.

### Flow B: Automated Game Top-Up (`/topup`)
* **UID Mode (`RoV` & `Free Fire`)**: Customer inputs `playerUid` and selects a top-up denomination package.
* **ID-Pass Mode (`Roblox`)**: Customer inputs `robloxUsername` and `robloxPassword` (with a 2FA disable warning) and selects a Robux package.

---

## 3. IQ-Bank Dynamic QR & Webhook Payment Flow

```
[Customer UI] ──(1. POST /api/orders)──> [Express Backend] ──> [PostgreSQL]
      │                                         │
      │ <──(2. Returns QR + transactionRef)─────┘
      │
      ├──(Polls GET /api/orders/:id/status or SSE)
      │
[IQ-Bank Simulator (/iq-bank-simulator)]
      │
      └──(3. POST /api/webhooks/iqbank + HMAC-SHA256 Signature)──> [Express Backend]
                                                                          │
                                     (4. Verifies HMAC & Idempotency,     │
                                         Marks Order PAID & Delivers) <───┘
```
