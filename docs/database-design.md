# Database Design

## Database Choice

The project uses PostgreSQL as the shared database for every backend implementation. This keeps behavior consistent across FastAPI, Express, and Next.js API handlers.

## Tables

### `users`

Purpose: stores application users who can manage buses, routes, stops, and location updates.

Columns:

- `id`: primary key
- `name`: user display name
- `email`: unique login identifier
- `password_hash`: hashed password
- `role`: authorization role such as `admin` or `operator`
- `created_at`: creation timestamp
- `updated_at`: last update timestamp

### `buses`

Purpose: stores shuttle buses operating on campus routes.

Columns:

- `id`: primary key
- `bus_number`: unique bus code
- `name`: human-friendly bus name
- `status`: current bus status such as `active`, `inactive`, or `maintenance`
- `route_id`: optional current assigned route
- `created_at`: creation timestamp
- `updated_at`: last update timestamp

### `routes`

Purpose: stores shuttle route definitions.

Columns:

- `id`: primary key
- `name`: route name
- `description`: route summary
- `created_at`: creation timestamp
- `updated_at`: last update timestamp

### `stops`

Purpose: stores latitude and longitude for each campus stop.

Columns:

- `id`: primary key
- `name`: stop name
- `latitude`: stop latitude
- `longitude`: stop longitude
- `created_at`: creation timestamp
- `updated_at`: last update timestamp

### `route_stops`

Purpose: stores the ordered relationship between routes and stops.

Columns:

- `id`: primary key
- `route_id`: foreign key to `routes.id`
- `stop_id`: foreign key to `stops.id`
- `stop_order`: order of stop within the route
- `estimated_minutes_from_start`: simple ETA baseline from route origin
- `created_at`: creation timestamp
- `updated_at`: last update timestamp

Constraints:

- Unique on `route_id + stop_id`
- Unique on `route_id + stop_order`

### `bus_locations`

Purpose: stores recorded bus positions over time.

Columns:

- `id`: primary key
- `bus_id`: foreign key to `buses.id`
- `latitude`: recorded latitude
- `longitude`: recorded longitude
- `speed`: bus speed in km/h
- `recorded_at`: time the location reading was recorded
- `created_at`: insertion timestamp

## Relationships

- One `route` can have many `buses`
- One `route` can have many `route_stops`
- One `stop` can belong to many `route_stops`
- One `bus` can have many `bus_locations`

## Indexing Strategy

- Unique index on `users.email`
- Unique index on `buses.bus_number`
- Index on `buses.route_id`
- Composite indexes on `route_stops(route_id, stop_order)`
- Composite index on `bus_locations(bus_id, recorded_at desc)`

## ETA Strategy For MVP

The MVP ETA can be intentionally simple:

1. Read the latest bus location.
2. Read the target stop coordinates.
3. Estimate straight-line distance using the haversine formula.
4. Use reported bus speed when available.
5. Fall back to a default speed when bus speed is zero or missing.

This is enough for comparing backend implementations before introducing route-aware ETA logic later.
