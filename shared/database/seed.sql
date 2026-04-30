INSERT INTO users (name, email, password_hash, role)
VALUES
    ('Admin User', 'admin@example.com', '$2b$12$replace.with.real.hash', 'admin');

INSERT INTO routes (name, description)
VALUES
    ('North Loop', 'Main campus clockwise route');

INSERT INTO stops (name, latitude, longitude)
VALUES
    ('Library', 1.296600, 103.776400),
    ('Engineering', 1.297300, 103.770800);

INSERT INTO route_stops (route_id, stop_id, stop_order, estimated_minutes_from_start)
VALUES
    (1, 1, 1, 0),
    (1, 2, 2, 5);

INSERT INTO buses (bus_number, name, status, route_id)
VALUES
    ('A-01', 'North Loop Bus', 'active', 1);

INSERT INTO bus_locations (bus_id, latitude, longitude, speed, recorded_at)
VALUES
    (1, 1.296700, 103.776500, 28.50, NOW());
