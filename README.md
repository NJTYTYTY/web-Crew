# CEDT-Crew — Gaming E-Commerce & Automated Game Top-Up Platform

Full-stack **Gaming Account Marketplace** (Roblox, RoV) and **Automated Game Top-Up Platform** (RoV, Free Fire, Roblox) featuring the **IQ-Bank Dynamic QR & HMAC-SHA256 Webhook Architecture**.

## 📁 Repository Structure

```
cedt-crew/
├── frontend/          # Next.js (App Router) + TypeScript + Tailwind CSS (Storefront, IQ-Bank Simulator, Admin UI)
├── backend/           # Node.js + Express.js + TypeScript + Drizzle ORM + Zod (REST API & Webhook Engine)
├── docs/              # Project Documentation
│   ├── product/       # Product Requirements Document (PRD.md)
│   ├── technical/     # System Architecture, Database Schema, Design System
│   ├── api/           # REST API & IQ-Bank Webhook Specification
│   ├── operations/    # Docker & Deployment Guides
│   └── legacy-over-800/ # Monolithic file audit warnings
├── store/             # Storefront HTML/Tailwind UI Reference Prototypes
└── admin-dashboard/   # Admin Backoffice HTML/Tailwind UI Reference Prototypes
```

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide React
* **Backend:** Node.js, Express.js, TypeScript, `bcrypt`, `jsonwebtoken` (JWT), `zod`, `cors`, Node `crypto` (HMAC-SHA256)
* **Database:** PostgreSQL 16 + Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
* **DevOps:** Docker & Docker Compose
