# API Specification

## Overview

This document defines the shared MVP API contract for all backend implementations. Every backend should expose the same request and response shapes so the frontend and test cases can be reused.

## Base Rules

- Base path: `/api/v1`
- Content type: `application/json`
- Authentication: Bearer JWT for protected endpoints
- Time format: ISO 8601 in UTC
- IDs: integer primary keys

## Auth Endpoints

### `POST /auth/register`

Creates a new user account.

Request body:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "Password123!",
  "role": "admin"
}
```

Success response: `201 Created`

```json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin",
  "created_at": "2026-04-30T00:00:00Z"
}
```

### `POST /auth/login`

Authenticates a user and returns a token.

Request body:

```json
{
  "email": "admin@example.com",
  "password": "Password123!"
}
```

Success response: `200 OK`

```json
{
  "access_token": "jwt-token",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### `GET /auth/me`

Returns the currently authenticated user.

Success response: `200 OK`

```json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin",
  "created_at": "2026-04-30T00:00:00Z",
  "updated_at": "2026-04-30T00:00:00Z"
}
```

## Bus Endpoints

### `POST /buses`

Creates a bus.

Request body:

```json
{
  "bus_number": "A-01",
  "name": "North Loop Bus",
  "status": "active",
  "route_id": 1
}
```

### `GET /buses`

Returns all buses with optional route information.

Success response:

```json
[
  {
    "id": 1,
    "bus_number": "A-01",
    "name": "North Loop Bus",
    "status": "active",
    "route_id": 1,
    "created_at": "2026-04-30T00:00:00Z",
    "updated_at": "2026-04-30T00:00:00Z"
  }
]
```

## Route Endpoints

### `POST /routes`

Creates a route.

Request body:

```json
{
  "name": "North Loop",
  "description": "Main campus clockwise route"
}
```

### `GET /routes`

Returns all routes.

## Stop Endpoints

### `POST /stops`

Creates a stop.

Request body:

```json
{
  "name": "Library",
  "latitude": 1.2966,
  "longitude": 103.7764
}
```

### `GET /stops`

Returns all stops.

## Route Stop Endpoint

### `POST /routes/{route_id}/stops`

Assigns a stop to a route.

Request body:

```json
{
  "stop_id": 2,
  "stop_order": 1,
  "estimated_minutes_from_start": 0
}
```

Success response: `201 Created`

```json
{
  "id": 1,
  "route_id": 1,
  "stop_id": 2,
  "stop_order": 1,
  "estimated_minutes_from_start": 0,
  "created_at": "2026-04-30T00:00:00Z",
  "updated_at": "2026-04-30T00:00:00Z"
}
```

## Location Endpoints

### `POST /buses/{bus_id}/location`

Stores the latest bus location.

Request body:

```json
{
  "latitude": 1.2967,
  "longitude": 103.7765,
  "speed": 28.5,
  "recorded_at": "2026-04-30T09:30:00Z"
}
```

### `GET /buses/{bus_id}/location`

Returns the latest known location for the bus.

Success response:

```json
{
  "id": 10,
  "bus_id": 1,
  "latitude": 1.2967,
  "longitude": 103.7765,
  "speed": 28.5,
  "recorded_at": "2026-04-30T09:30:00Z",
  "created_at": "2026-04-30T09:30:01Z"
}
```

## ETA Endpoint

### `GET /buses/{bus_id}/eta?stop_id=2`

Returns a simple ETA from the current bus location to a target stop.

Success response:

```json
{
  "bus_id": 1,
  "stop_id": 2,
  "estimated_arrival_minutes": 4,
  "distance_km": 1.2,
  "based_on_recorded_at": "2026-04-30T09:30:00Z"
}
```

## Error Format

All backends should normalize errors into this shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": {
      "field": "email"
    }
  }
}
```
