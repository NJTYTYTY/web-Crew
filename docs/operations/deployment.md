# Deployment, Colima & Docker Operations Runbook

## 1. Container Architecture (`docker-compose.yml`)

The platform defines three services connected on the `nexusplay_net` bridge network:
1. **`postgres` (`nexusplay-postgres`)**
   - Image: `postgres:16-alpine` (PostgreSQL v16 on lightweight Alpine Linux)
   - Port: `5432:5432`
   - Credentials: `POSTGRES_USER=postgres`, `POSTGRES_PASSWORD=postgres`, `POSTGRES_DB=nexusplay`
   - Persistent Volume: `postgres_data:/var/lib/postgresql/data`
2. **`backend` (`nexusplay-backend`)**
   - Context: `./backend` (`Dockerfile`)
   - Port: `4000:4000`
   - Startup command: `npx drizzle-kit push && npm run db:seed && npm start`
3. **`frontend` (`nexusplay-frontend`)**
   - Context: `./frontend` (`Dockerfile`)
   - Port: `3000:3000`

---

## 2. Running on macOS with Colima & Docker CLI

### Option A: Hybrid Development Mode (Recommended while coding)
Runs PostgreSQL in Docker and Backend/Frontend with live hot-reload in your terminal:
```bash
# 1. Start Colima VM & PostgreSQL container
colima start
docker start nexusplay-postgres || docker compose up -d postgres

# 2. Terminal 1 — Start Backend (Port 4000)
cd backend
npm run dev

# 3. Terminal 2 — Start Frontend (Port 3000)
cd frontend
npm run dev
```

### Option B: All-in-One Docker Compose Mode
Runs `postgres`, `backend`, and `frontend` together inside Docker containers:
```bash
colima start
docker compose up -d --build
```

---

## 3. Monitoring & Stopping Services (`lazydocker` & CLI)
- **Visual Terminal UI**: Run `lazydocker` (`s` = stop container, `r` = restart, `q` = quit).
- **Clean status table**: `docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"`
- **Stop PostgreSQL container**: `docker stop nexusplay-postgres`
- **Stop all compose services**: `docker compose stop`
- **Stop Colima VM completely**: `colima stop`
