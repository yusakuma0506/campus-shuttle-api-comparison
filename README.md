# Campus Shuttle API Comparison

This repository compares three backend implementations for the same campus shuttle MVP:

- `backend-fastapi`: Python + FastAPI
- `backend-express`: Node.js + Express + Prisma
- `backend-nextjs`: Next.js Route Handlers + Prisma
- `frontend-nextjs`: Shared frontend that calls the active backend API

The project uses PostgreSQL as the common database and aligns all implementations around the same MVP contract.

## MVP Scope

- User register
- User login
- Get current user
- Create bus
- Get buses
- Create route
- Get routes
- Create stop
- Get stops
- Assign stop to route
- Post bus location
- Get latest bus location
- Get simple ETA

## Repository Layout

- `docs/`: Specs, architecture notes, validation rules, testing plan, and implementation comparison
- `shared/openapi/`: Shared API contract
- `shared/database/`: Shared SQL schema and seed data
- `shared/postman/`: API collection for manual testing
- `frontend-nextjs/`: Web frontend for MVP flows
- `backend-fastapi/`: FastAPI implementation
- `backend-express/`: Express implementation
- `backend-nextjs/`: Next.js API implementation

## Quick Start

1. Start PostgreSQL with Docker Compose.
2. Apply the shared schema and seed data.
3. Build the FastAPI backend first.
4. Connect the Next.js frontend to FastAPI.
5. Re-implement the same contract in Express and Next.js API routes.

See [docs/api-spec.md](/c:/Users/YU%20SAKUMA/bus-tracking-app/campus-shuttle-api-comparison/docs/api-spec.md) and [docs/database-design.md](/c:/Users/YU%20SAKUMA/bus-tracking-app/campus-shuttle-api-comparison/docs/database-design.md) for the initial contract.
