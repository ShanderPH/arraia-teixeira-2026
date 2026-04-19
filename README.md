# Arraia Teixeira 🎉

Full-stack RSVP app for the Teixeira family's Festa Junina. Guests confirm attendance, pick a dish to bring, and everything is persisted in real time via a FastAPI backend backed by Supabase.

---

## Monorepo Structure

```
arraia-teixeira/
├── apps/
│   ├── web/          # Next.js 16 frontend (App Router, TypeScript, Tailwind v4, HeroUI v3)
│   └── api/          # FastAPI backend (Python 3.11+, Pydantic v2, Supabase)
├── infra/
│   └── docker-compose.yml
├── packages/
│   └── types/        # (reserved) shared TypeScript types
├── .env.example      # combined env reference
└── package.json      # root monorepo scripts
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, HeroUI v3 |
| Backend | FastAPI, Uvicorn, Pydantic v2 |
| Database | Supabase (PostgreSQL) with Row Level Security |
| Dev tooling | ruff, black (Python) · ESLint (TS) · concurrently |

---

## Setup

### Prerequisites

- Node.js 20+
- Python 3.11+
- A Supabase project (already provisioned — `amcqwkmfciykfapeywfi`)

### 1. Clone & install frontend deps

```bash
git clone <repo-url>
cd arraia-teixeira

# Install root dev tools (concurrently)
npm install

# Install Next.js dependencies
npm run install:web
```

### 2. Set up the Python backend

```bash
cd apps/api

# Create & activate virtual environment
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate

# Install dependencies
pip install -e ".[dev]"
```

### 3. Configure environment variables

```bash
# Backend
cp apps/api/.env.example apps/api/.env
# Fill in SUPABASE_URL and SUPABASE_KEY

# Frontend
cp apps/web/.env.example apps/web/.env.local
# NEXT_PUBLIC_API_URL defaults to http://localhost:8000
```

### 4. Run locally

```bash
# From the repo root — starts both apps in one terminal
npm run dev
```

Or run them separately:

```bash
# Terminal 1 — frontend (http://localhost:3000)
npm run web

# Terminal 2 — backend (http://localhost:8000)
npm run api
```

---

## Environment Variables

### `apps/api/.env`

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase anon/service key |
| `API_PORT` | Port for Uvicorn (default: `8000`) |
| `CORS_ORIGINS` | JSON array of allowed origins (default: `["http://localhost:3000"]`) |

### `apps/web/.env.local`

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | FastAPI base URL (default: `http://localhost:8000`) |

---

## Architecture

```
Browser
  └─► Next.js (apps/web)
        └─► fetch → FastAPI (apps/api)
              ├─ /v1/rsvp     → GuestService → GuestRepository
              ├─ /v1/dishes   → DishService  → DishRepository
              └─ /v1/guests   → GuestService → GuestRepository
                                    └─► Supabase (PostgreSQL)
```

**Clean architecture layers:**

- **API layer** (`app/api/v1/endpoints/`) — FastAPI route handlers, no business logic
- **Services** (`app/services/`) — business logic, orchestration
- **Repositories** (`app/repositories/`) — all Supabase/DB access
- **Schemas** (`app/schemas/`) — Pydantic request/response models

---

## API Reference

Base URL: `http://localhost:8000`

Interactive docs: `http://localhost:8000/docs`

### `POST /v1/rsvp`
Create a guest RSVP.

```json
// Request
{
  "name": "João Silva",
  "attending": true,
  "dish_name": "Canjica"   // optional; creates dish if new
}

// Response 201
{
  "id": "uuid",
  "name": "João Silva",
  "attending": true,
  "dish_id": "uuid",
  "created_at": "2026-06-13T10:00:00Z"
}
```

### `GET /v1/dishes`
List all dishes with guest count.

```json
[
  { "id": "uuid", "name": "Canjica", "guest_count": 3, "created_at": "..." }
]
```

### `POST /v1/dishes`
Create a new dish (idempotent by name).

### `GET /v1/guests`
List all guests with their dish assignment.

---

## Database Schema

```sql
dishes (id uuid PK, name text, created_at timestamptz)
guests (id uuid PK, name text, attending boolean, dish_id uuid FK→dishes, created_at timestamptz)
```

Row Level Security is enabled with open read/write policies (suitable for a family event).

---

## Future Improvements

- [ ] Auth: add a simple admin password to protect `GET /v1/guests`
- [ ] Realtime: subscribe to Supabase realtime channels in the frontend for live updates
- [ ] Duplicate detection: warn users if a dish is already claimed by someone else before submitting
- [ ] Email/WhatsApp confirmation: send a reminder message after RSVP
- [ ] Pagination: add cursor-based pagination to guest list for larger events
- [ ] CI/CD: GitHub Actions pipeline for lint + test on PR
