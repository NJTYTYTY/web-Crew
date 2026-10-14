# 🚨 Monolithic Files Warning (800+ Lines)

The following files in the workspace exceed the **800-line AI-Native boundary** (`view_file` single-read limit):

| File Path | Line Count | Status / Action Plan |
| :--- | :---: | :--- |
| `store/code.html` | **1,880 lines** | UI Prototype Reference — When converting to `/frontend`, split into modular Next.js pages and components (< 300 lines each). |
| `admin-dashboard/top_up_games_packages/code.html` | **895 lines** | UI Prototype Reference — Split into modular Admin Top-Up components (< 300 lines each). |
| `admin-dashboard/orders_iq_bank_queue/code.html` | **860 lines** | UI Prototype Reference — Split into modular Admin Orders & Webhook Log components (< 300 lines each). |
| `admin-dashboard/game_accounts_inventory/code.html` | **856 lines** | UI Prototype Reference — Split into modular Admin Accounts Inventory components (< 300 lines each). |

> **Recommendation:** Keep static `.html` files as design references only. All new TypeScript/React files created inside `/frontend` and `/backend` should stay under **300 lines per file** for optimal AI-Native performance and maintainability.
