# 🚨 Monolithic Files Warning (> 800 Lines Audit)

> **Audit Date:** 2026-10-16  
> **Threshold:** 800 lines per file (AI-Native modular design & `view_file` single-chunk limit)

---

## 1. Active Production Codebase (`frontend/src/**` & `backend/src/**`)
✅ **0 Active Code Files Exceed 800 Lines!**  
All active TypeScript and React files in `frontend/src/` and `backend/src/` adhere to modular design (every active `.ts` / `.tsx` file is between **17 and 317 lines**).

---

## 2. Flagged Legacy / Static HTML Reference Files (> 800 Lines)
The following **static `.html` design reference files** in the workspace exceed 800 lines:

| File Path | Line Count | Status / Recommendation |
| :--- | :---: | :--- |
| `store-ui/code.html` | **1,880 lines** | Legacy static HTML prototype (already migrated into modular Next.js components under `frontend/src/`). Exceeds AI single-view boundary (800 lines). |
| `admin-dashboard-ui/top_up_games_packages/code.html` | **895 lines** | Legacy static HTML prototype (migrated to `frontend/src/app/admin/(dashboard)/topup/page.tsx` + `components/admin/packages/*`). |
| `admin-dashboard-ui/orders_iq_bank_queue/code.html` | **860 lines** | Legacy static HTML prototype (migrated to `frontend/src/app/admin/(dashboard)/orders/page.tsx` + `OrderInspectModal.tsx`). |
| `admin-dashboard-ui/game_accounts_inventory/code.html` | **856 lines** | Legacy static HTML prototype (migrated to `frontend/src/app/admin/(dashboard)/accounts/page.tsx` + `components/admin/accounts/*`). |

### Recommendation
- Keep all active `.ts` and `.tsx` source files in `frontend/src/` and `backend/src/` strictly **under 300 lines** to guarantee fast AI-Native tool inspection and low token usage.
- The legacy `.html` folders (`store-ui/` and `admin-dashboard-ui/`) are retained only as static visual references and are not bundled into the Next.js or Express production builds.
