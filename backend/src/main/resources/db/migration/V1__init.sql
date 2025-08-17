-- Initialize database schema for SurgeOps backend

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  alert_id UUID PRIMARY KEY,
  surge_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  severity TEXT CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  message TEXT NOT NULL,
  acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
  suggestion_action TEXT,
  suggestion_from_block TEXT,
  suggestion_to_block TEXT,
  suggestion_teu INT
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  event_id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  type TEXT CHECK (type IN ('surge','weather','reroute','vessel','system')),
  severity TEXT CHECK (severity IN ('info','warning','error')),
  message TEXT,
  payload JSONB
);

-- Yard Blocks
CREATE TABLE IF NOT EXISTS yard_blocks (
  id UUID PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  category TEXT CHECK (category IN ('Standard','Reefer','Hazard')) NOT NULL,
  capacity INT NOT NULL,
  current_count INT NOT NULL,
  status TEXT CHECK (status IN ('normal','warning','critical')) NOT NULL
);

-- Yard Utilization History
CREATE TABLE IF NOT EXISTS yard_utilization_history (
  id UUID PRIMARY KEY,
  time TIMESTAMPTZ NOT NULL,
  utilization DOUBLE PRECISION NOT NULL,
  threshold DOUBLE PRECISION NOT NULL
);

-- Vessels
CREATE TABLE IF NOT EXISTS vessels (
  vessel_id UUID PRIMARY KEY,
  name TEXT,
  imo TEXT,
  expected_teu INT,
  eta TIMESTAMPTZ,
  status TEXT CHECK (status IN ('Waiting','Berthing','Loading','Departed'))
);

-- Berths
CREATE TABLE IF NOT EXISTS berths (
  berth_id UUID PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('Available','Occupied','Maintenance')) NOT NULL
);

-- Berth Assignments
CREATE TABLE IF NOT EXISTS berth_assignments (
  assignment_id UUID PRIMARY KEY,
  berth_code TEXT REFERENCES berths(code),
  vessel_id UUID REFERENCES vessels(vessel_id),
  planned_start TIMESTAMPTZ,
  planned_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ
);

-- Container Moves
CREATE TABLE IF NOT EXISTS container_moves (
  move_id UUID PRIMARY KEY,
  from_block TEXT,
  to_block TEXT,
  teu INT,
  ts TIMESTAMPTZ
);

-- Weather Observations
CREATE TABLE IF NOT EXISTS weather_observations (
  id UUID PRIMARY KEY,
  location TEXT,
  temperature DOUBLE PRECISION,
  wind_speed DOUBLE PRECISION,
  humidity DOUBLE PRECISION,
  condition TEXT,
  icon TEXT,
  operational_impact TEXT CHECK (operational_impact IN ('Low','Medium','High')),
  observed_at TIMESTAMPTZ
);

-- Surges
CREATE TABLE IF NOT EXISTS surges (
  surge_id UUID PRIMARY KEY,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  window_start TIMESTAMPTZ,
  window_end TIMESTAMPTZ,
  reason TEXT,
  status TEXT CHECK (status IN ('open','accepted','closed')) NOT NULL DEFAULT 'open',
  metrics JSONB
);

-- Action Plans
CREATE TABLE IF NOT EXISTS action_plans (
  plan_id UUID PRIMARY KEY,
  surge_id UUID REFERENCES surges(surge_id),
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT CHECK (status IN ('ready','accepted','superseded')) NOT NULL DEFAULT 'ready',
  payload JSONB NOT NULL
);

-- Vector Knowledge Base (DB-derived chunks)
CREATE TABLE IF NOT EXISTS kb_chunks (
  id UUID PRIMARY KEY,
  kind TEXT,
  source_key TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  uri TEXT,
  meta JSONB DEFAULT '{}'::jsonb,
  embedding VECTOR(1536),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_kb_kind_key_title ON kb_chunks(kind, source_key, title);
CREATE INDEX IF NOT EXISTS idx_kb_chunks_embedding ON kb_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists=100);