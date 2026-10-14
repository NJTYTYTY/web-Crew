# Database Schema Specification (PostgreSQL 16 + Drizzle ORM)

Target implementation path: `/backend/src/db/schema.ts`

## Tables Overview

1. **`users`**: Stores `username`, `passwordHash` (`bcrypt`), and `role` (`CUSTOMER` | `ADMIN`). No email or OAuth fields.
2. **`banners`**: Promotional homepage banners ordered by `sortOrder` and toggled via `isActive`.
3. **`game_accounts`**: Marketplace inventory for `ROBLOX` and `ROV` accounts, including `price` (THB), `highlightTags`, `status` (`AVAILABLE` | `RESERVED` | `SOLD`), and secret credentials (`accountUsername`, `accountPassword`).
4. **`topup_games`**: Supported top-up games (`rov`, `freefire`, `roblox`) and their required input mode (`UID` | `ID_PASS`).
5. **`topup_packages`**: Selectable top-up packages linked to `topup_games` (`packageName`, `bonusTag`, `price`, `isActive`).
6. **`orders`**: Customer orders (`ACCOUNT` | `TOPUP`), storing `targetMetadata` (UID or Roblox credentials), `totalAmount`, `status` (`PENDING` | `PAID` | `CANCELLED`), and `fulfillmentStatus` (`PENDING` | `PROCESSING` | `COMPLETED` | `FAILED`).
7. **`payments`**: IQ-Bank transactions linked to `orders`, tracking `transactionRef` (e.g., `IQB-TX-994821`), `qrPayload`, `status` (`WAITING` | `SUCCESS` | `FAILED`), and `rawWebhookPayload` for audit logging.
