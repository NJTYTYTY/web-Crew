# Deployment & Docker Operations

## Container Architecture (`docker-compose.yml`)

The platform runs across three containerized services connected on an isolated Docker bridge network:

1. **`postgres` (PostgreSQL 16)**
   * Port: `5432:5432`
   * Persistent volume for database storage (`postgres_data`).
2. **`backend` (Node.js + Express.js + Drizzle ORM)**
   * Directory: `/backend`
   * Runs schema migrations (`drizzle-kit`) and serves REST/SSE APIs and IQ-Bank webhooks.
3. **`frontend` (Next.js App Router)**
   * Directory: `/frontend`
   * Serves Storefront, IQ-Bank Simulator, and Admin Backoffice UI.
