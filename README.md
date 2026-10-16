# CEDT-Crew — NEXUS PLAY Gaming E-Commerce & Automated Game Top-Up Platform

Full-stack Gaming Account Marketplace (Roblox, RoV) and Automated Game Top-Up Platform (RoV, Free Fire, Roblox) featuring IQ-Bank Dynamic PromptPay QR and HMAC-SHA256 Webhook Architecture.

## Repository Structure

```
cedt-crew/
├── frontend/          # Next.js 14 (App Router) + TypeScript + Tailwind CSS (Storefront, IQ-Bank Simulator, Admin Dashboard)
├── backend/           # Node.js + Express.js + TypeScript + Drizzle ORM + Zod (REST API & Webhook Engine)
├── docs/              # Project Documentation Suite
│   ├── product/       # Product Requirements Document (PRD.md)
│   ├── technical/     # System Architecture, Database Schema, Design System
│   ├── api/           # REST API & IQ-Bank Webhook Specification
│   ├── operations/    # Docker & Deployment Guides
│   └── legacy-over-800/ # Monolithic file audit & modularity reports
├── mark.md            # Security audit report and 19 resolved vulnerability records
└── docker-compose.yml # PostgreSQL 16 Alpine, Backend, and Frontend orchestration
```

## Tech Stack

* **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, NEXUS PLAY branding, bilingual EN and TH support
* **Backend:** Node.js, Express.js, TypeScript, Drizzle ORM, bcrypt password hashing, jsonwebtoken (JWT), Zod validation, Node crypto (HMAC-SHA256)
* **Database:** PostgreSQL 16 Alpine (postgres:16-alpine) with Drizzle Kit migrations and automated seeding
* **DevOps & Containers:** Docker, Docker Compose, Colima compatibility

## Quick Start with Docker

### Prerequisites

* Docker Desktop or Colima + Docker CLI
* Docker Compose v2+

### 1. Clone Repository

```bash
git clone https://github.com/NJTYTYTY/web-Crew.git
cd web-Crew
```

### 2. Start All Services with Docker Compose

Run the following command in the project root:

```bash
docker compose up --build
```

This single command automatically:
1. Starts PostgreSQL 16 Alpine and initializes persistent storage (`postgres_data`).
2. Waits for database healthcheck (`pg_isready`).
3. Runs database schema migrations (`drizzle-kit push`).
4. Seeds initial game accounts, top-up packages, banners, and default user accounts.
5. Builds and launches the Backend REST API on port 4000.
6. Builds and launches the Next.js Frontend on port 3000.

To run in the background (detached mode):

```bash
docker compose up -d --build
```

To stop all services:

```bash
docker compose down
```

To stop services and remove volumes (clean database state):

```bash
docker compose down -v
```

## Service URLs and Port Mapping

| Service | URL | Description |
| :--- | :--- | :--- |
| Storefront | http://localhost:3000 | Customer marketplace, top-up catalog, and order history |
| Admin Dashboard | http://localhost:3000/admin | Backoffice inventory, package management, and orders queue |
| IQ-Bank Simulator | http://localhost:3000/iq-bank-simulator | Webhook trigger sandbox for PromptPay QR payment testing |
| Backend API | http://localhost:4000 | REST API endpoints and health check (/api/health) |
| PostgreSQL Database | localhost:5432 | Database connection (User: postgres, DB: nexusplay) |

## Default Accounts

The database seed provides initial verified test accounts:

### Admin Backoffice
* URL: `http://localhost:3000/admin/login`
* Username: `admin_iq`
* Password: `admin123`
* Permissions: Full access to accounts inventory, top-up packages, banners, and orders queue

### Customer Account
* URL: `http://localhost:3000/login`
* Username: `alex_gamer`
* Password: `password123`
* Role: Customer (can place account and top-up orders)

You can also register a new customer account directly from the storefront registration form.

## Running Locally Without Docker

If you prefer to run services natively on your machine:

### 1. Database Setup

Ensure PostgreSQL is running locally on port 5432 with database name `nexusplay`.

### 2. Backend Setup

```bash
cd backend
npm install
npm run db:push
npm run db:seed
npm run dev
```

The backend server starts at `http://localhost:4000`.

### 3. Frontend Setup

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The Next.js storefront starts at `http://localhost:3000`.

## Architecture and Security Highlights

* **Zero Monolithic Bloat:** All TypeScript (.ts and .tsx) files are modularized under 300 lines.
* **Strict Authentication:** Passwords hashed with bcrypt; unauthenticated admin fallback removed; duplicate username registration returns 409 Conflict.
* **IDOR and Credential Protection:** Delivered game account credentials in order status endpoints are strictly restricted to authenticated order owners and administrators.
* **Race Condition Prevention:** Account checkout sets account status to RESERVED to prevent concurrent double-sales before payment confirmation.
* **HMAC-SHA256 Webhook Verification:** IQ-Bank payment webhooks require valid cryptographic signature and payload amount matching before transitioning orders to PAID.
* **Audit Compliance:** 19/19 vulnerabilities from security scanning are fully resolved and cataloged in mark.md.
