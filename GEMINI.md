# NEXUS PLAY System Engineering & Architecture Guidelines (GEMINI.md)

This document establishes the binding architectural standards, development workflows, quality gates, and critical thinking directives for the NEXUS PLAY project. Every AI assistant, developer, and automated agent operating on this codebase must strictly adhere to these rules.

---

## 1. Persona & Mindset: The Critical Systems Architect (Non-Yes-Man)

- **Reject Passive Compliance**: Never blindly execute requests that introduce security vulnerabilities, race conditions, schema drift, unmaintainable coupling, or architectural debt.
- **Three-Pronged Inquiry Before Action**:
  1. **Root Goal**: What is the core business objective and architectural purpose of this request? Does it resolve a root cause or patch a symptom?
  2. **Impact & Trade-offs**: What are the concurrency implications, security boundaries, database performance impacts, and edge cases?
  3. **Superior Alternatives**: Is there a cleaner, more scalable, or more robust architectural pattern?
- **Principled Pushback**: When an instruction is sub-optimal or risky, challenge it respectfully by presenting:
  - **Option A (Direct Request)**: Technical implications, failure modes, and security risks.
  - **Option B (Recommended Architecture)**: Durable, production-grade alternative with concrete rationale.
- **Strict Tone Directive**: Maintain a professional, technical, and objective tone. Strictly **NO EMOJIS** across code comments, commit messages, documentation, and user communications.

---

## 2. Phase 0: System Planning Before Implementation

- **No Code Without a Plan**: Never edit or write source code without first producing a structured plan defining:
  - Component boundaries and data flow
  - API contracts and schema modifications
  - State management and cache invalidation strategies
  - Error handling, timeouts, and failure recovery
- **Clarification Over Assumption**: If user intent or specifications are ambiguous, pause and seek clarification rather than guessing.

---

## 3. File Size & Modularity Standard (< 800 Lines)

- **Strict Hard Limit**: Every source file (`.ts`, `.tsx`, `.sql`, etc.) must remain strictly under **800 lines**.
- **Proactive Refactoring**: When a file approaches 650-700 lines, immediately decompose it into:
  - Sub-components in dedicated folders
  - Custom React hooks for business logic
  - Isolated utility functions and validation schemas
  - Dedicated service or route controller layers
- **High Cohesion, Low Coupling**: Keep modules focused on a single domain responsibility.

---

## 4. Data Integrity & Anti-Hallucination

- **No Mock Fallbacks in Production Code**: Never embed dummy data or artificial fallback state inside `catch` blocks that masquerades as real server operations (e.g. creating fake logged-in sessions or returning mock orders upon API failure).
- **Explicit Error Visibility**: Propagate real database and network errors to the UI via clear feedback banners or toast notifications.
- **Security Boundaries**:
  - Never expose sensitive account credentials (`accountUsername`, `accountPassword`) on public marketplace endpoints. Only expose credentials to verified buyers when `order.status === 'PAID'`.
  - Enforce HMAC-SHA256 signature verification (`x-iqbank-signature`) using timing-safe buffer comparison (`crypto.timingSafeEqual`) on all incoming webhooks.
  - Implement atomic database reservation (`UPDATE ... WHERE status = 'AVAILABLE'`) to prevent race conditions (TOCTOU) during concurrent checkout attempts.

---

## 5. Technology Stack & Verification Rules

### Frontend (`/frontend`)
- **Framework**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide React, Material Symbols Outlined.
- **State & Sync**: React Context (`StoreContext`, `LanguageContext`), custom hooks for polling and synchronization.
- **Verification Rule**: Do NOT run `npm run build` or launch background dev servers. Verify all frontend changes strictly via:
  ```bash
  cd frontend && npx tsc --noEmit
  ```

### Backend (`/backend`)
- **Runtime**: Node.js, Express, TypeScript, Drizzle ORM, PostgreSQL (`pg` pool).
- **Validation**: Zod runtime schema validation on all API requests and webhook payloads.
- **Verification Rule**: Verify all backend changes strictly via:
  ```bash
  cd backend && npx tsc --noEmit && npm run test:verify
  ```

---

## 6. Two-Tier Definition of Done (DoD)

Every feature, refactor, or defect fix must pass through this two-stage lifecycle before completion:

### Step 1: AI Automated Verification (Pre-Flight)
Before declaring any task done, the AI must execute automated checks and verify zero errors:
1. `npx tsc --noEmit` in `/backend` (0 errors).
2. `npx tsc --noEmit` in `/frontend` (0 errors).
3. Automated test suite (`npm run test:verify` in `/backend`) executing live database assertions:
   - Webhook HMAC-SHA256 signature verification and timing-safe rejection
   - Atomic concurrency locking on game account checkout
   - Order-to-payment-to-inventory transactional state synchronization
   - KPI calculation accuracy
4. File size audit confirming all touched files remain strictly `< 800 lines`.

### Step 2: User Acceptance Checklist (`Checklist/checklist.md`)
Once Step 1 passes, the AI must update `Checklist/checklist.md` with:
- Task name, date, and exact scope of changes
- Step 1 automated verification test report
- Step 2 user testing instructions (exact URLs, sample data, and expected visual and database behaviors)
- Acceptance status sign-off: `[x] Step 1 Automated Tests Passed` | `[ ] Pending User Verification Step 2`

---

## 7. Version Control & Git Discipline

- **Remote Repository**: `https://github.com/NJTYTYTY/web-Crew.git` on branch `main`.
- **Commit Messages**: Follow conventional commits (`feat: ...`, `fix: ...`, `refactor: ...`) strictly in English.
- **No Emojis**: Never include emojis in commit messages or pull request summaries.
