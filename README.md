# CEDT-Crew — Gaming E-Commerce & Automated Game Top-Up Platform

Full-stack **Gaming Account Marketplace** (Roblox, RoV) and **Automated Game Top-Up Platform** (RoV, Free Fire, Roblox) featuring the **IQ-Bank Dynamic QR & HMAC-SHA256 Webhook Architecture**.

## 📁 Repository Structure

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
└── docker-compose.yml # PostgreSQL 16 Alpine, Backend & Frontend multi-service orchestration
```

## 🛠️ Tech Stack

* **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, NEXUS PLAY branding (`/logopic.webp`), bilingual `EN | TH` support
* **Backend:** Node.js, Express.js, TypeScript, Drizzle ORM, `bcrypt` password verification, `jsonwebtoken` (JWT), `zod`, Node `crypto` (HMAC-SHA256)
* **Database:** PostgreSQL 16 Alpine (`postgres:16-alpine`) + Drizzle Kit
* **DevOps:** Docker, Docker Compose, Colima compatibility
