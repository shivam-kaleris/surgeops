-- Seed data for SurgeOps backend

-- Insert yard blocks
INSERT INTO yard_blocks (id, code, category, capacity, current_count, status)
VALUES
  (uuid_generate_v4(), 'B1', 'Standard', 1200, 800, 'normal'),
  (uuid_generate_v4(), 'B5', 'Standard', 1400, 700, 'normal'),
  (uuid_generate_v4(), 'R1', 'Reefer',   800, 600, 'warning');

-- Insert yard utilization history for the last 24 hours (hourly snapshots)
DO $$
DECLARE
  i INT;
  ts TIMESTAMPTZ;
BEGIN
  FOR i IN 0..23 LOOP
    ts := now() - (i * INTERVAL '1 hour');
    INSERT INTO yard_utilization_history (id, time, utilization, threshold)
    VALUES (uuid_generate_v4(), ts, 70 + (random() * 20), 95);
  END LOOP;
END $$;

-- Insert vessels
INSERT INTO vessels (vessel_id, name, imo, expected_teu, eta, status)
VALUES
  (uuid_generate_v4(), 'MV Alpha', 'IMO1234567', 1500, now() + INTERVAL '4 hour', 'Waiting'),
  (uuid_generate_v4(), 'MV Beta',  'IMO2345678', 1200, now() + INTERVAL '8 hour', 'Berthing');

-- Insert berths
INSERT INTO berths (berth_id, code, status)
VALUES
  (uuid_generate_v4(), 'BERTH-1', 'Available'),
  (uuid_generate_v4(), 'BERTH-2', 'Occupied');

-- Assign vessels to berths
INSERT INTO berth_assignments (assignment_id, berth_code, vessel_id, planned_start, planned_end, actual_start, actual_end)
SELECT uuid_generate_v4(), 'BERTH-1', vessel_id, now(), now() + INTERVAL '1 day', now(), NULL FROM vessels WHERE name = 'MV Alpha';
INSERT INTO berth_assignments (assignment_id, berth_code, vessel_id, planned_start, planned_end, actual_start, actual_end)
SELECT uuid_generate_v4(), 'BERTH-2', vessel_id, now() + INTERVAL '1 day', now() + INTERVAL '2 day', NULL, NULL FROM vessels WHERE name = 'MV Beta';

-- Container move history (simple example)
INSERT INTO container_moves (move_id, from_block, to_block, teu, ts)
VALUES (uuid_generate_v4(), 'B1', 'B5', 100, now() - INTERVAL '2 hour');

-- Insert an alert
INSERT INTO alerts (alert_id, surge_id, created_at, severity, message, acknowledged, suggestion_action, suggestion_from_block, suggestion_to_block, suggestion_teu)
VALUES (
  uuid_generate_v4(),
  NULL,
  now(),
  'HIGH',
  'Yard block B1 nearing capacity threshold',
  FALSE,
  'Move containers',
  'B1',
  'B5',
  150
);

-- Insert sample events
INSERT INTO events (event_id, created_at, type, severity, message, payload)
VALUES
  (uuid_generate_v4(), now(), 'vessel', 'info', 'MV Alpha ETA updated', NULL),
  (uuid_generate_v4(), now() - INTERVAL '30 minutes', 'weather', 'warning', 'High winds at port', NULL),
  (uuid_generate_v4(), now() - INTERVAL '1 hour', 'system', 'info', 'Yard utilization snapshot completed', NULL);

-- Insert a weather observation
INSERT INTO weather_observations (id, location, temperature, wind_speed, humidity, condition, icon, operational_impact, observed_at)
VALUES (
  uuid_generate_v4(),
  'Port Alpha',
  29.5,
  5.0,
  70.0,
  'Clear',
  '🌤️',
  'Low',
  now()
);

-- Insert a dummy surge and action plan for demonstration
INSERT INTO surges (surge_id, detected_at, window_start, window_end, reason, status, metrics)
VALUES (
  uuid_generate_v4(),
  now() - INTERVAL '1 day',
  now() - INTERVAL '1 day',
  now(),
  'Seed surge for demonstration',
  'open',
  '{"arrivalsNext6h":3,"projectedTeuNext12h":4200}'::jsonb
);

-- Link an action plan to the surge
INSERT INTO action_plans (plan_id, surge_id, generated_at, status, payload)
SELECT uuid_generate_v4(), surge_id, now(), 'ready', '{"id":"plan-seed","title":"Seed Plan","severity":"Medium","estimatedTime":"2h","impact":"Medium","description":"Move containers from B1 to B5","steps":["Identify containers","Prepare trucks","Move containers"],"resourcesRequired":["Trucks","Labor"],"beforeData":{},"afterData":{}}'::jsonb FROM surges LIMIT 1;