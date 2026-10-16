# Legacy Prototype Migration Notes

## 1. Overview
The original UI design prototypes for **CEDT-Crew (NEXUS PLAY)** were initially designed in:
- `store-ui/code.html` (Customer Storefront, Checkout Modal, and IQ-Bank Simulator)
- `admin-dashboard-ui/*/code.html` (6 Admin Backoffice screens)

These monolithic prototype HTML files have been completely migrated into modular Next.js components and removed from the active codebase.

## 2. Migration into Modular Next.js + Express + PostgreSQL
All static `.html` screens have been converted into modular **Next.js 14 (App Router) + TypeScript + Tailwind CSS** components under `frontend/src/` and wired to the live **Express.js + Drizzle ORM + PostgreSQL 16** backend under `backend/src/`:
- **Storefront Routes**: `/`, `/accounts`, `/topup`, `/orders`, `/login`, `/register`, `/iq-bank-simulator`
- **Admin Backoffice Routes**: `/admin/login`, `/admin`, `/admin/accounts`, `/admin/topup` (and `/admin/packages`), `/admin/orders`, `/admin/banners`
- **Bilingual Support**: Full `EN | ไทย` translation switcher (`LanguageContext.tsx`) across both Storefront and Admin Backoffice.
