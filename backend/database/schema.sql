CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS digital_pins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    state BOOLEAN,
    number INTEGER NOT NULL,
    host TEXT NOT NULL,
    port TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS analog_sensors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    number INTEGER NOT NULL,
    host TEXT NOT NULL,
    port TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date TEXT NOT NULL,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    question TEXT NOT NULL,
    number TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    skills TEXT[] NOT NULL DEFAULT '{}',
    organization TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    "group" TEXT NOT NULL DEFAULT 'участник',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_digital_pins (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    digital_pin_id UUID NOT NULL REFERENCES digital_pins(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, digital_pin_id)
);

CREATE TABLE IF NOT EXISTS user_analog_sensors (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    analog_sensor_id UUID NOT NULL REFERENCES analog_sensors(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, analog_sensor_id)
);

CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(date DESC);
CREATE INDEX IF NOT EXISTS idx_team_members_created_at ON team_members(created_at);
