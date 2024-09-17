------------
-- TABLES --
------------
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    category TEXT,
    time_spent INTEGER,
    start TIMESTAMP,
    end_time TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- Adding the status column with a default value
    CONSTRAINT status_check CHECK (status IN ('ACTIVE', 'COMPLETE')) -- Enforce only 'ACTIVE' or 'COMPLETE' values
);

-----------------------
-- TRIGGER FUNCTIONS --
-----------------------
CREATE OR REPLACE FUNCTION enforce_single_active()
RETURNS TRIGGER as $$
BEGIN
    IF (SELECT COUNT(*) FROM tasks WHERE status = 'ACTIVE') > 0 THEN
        RAISE EXCEPTION 'Only one row can be marked as ACTIVE.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--------------
-- TRIGGERS --
--------------
CREATE TRIGGER enforce_single_active_insert
BEFORE INSERT ON tasks
FOR EACH ROW
WHEN (NEW.status = 'ACTIVE')
EXECUTE FUNCTION enforce_single_active();

CREATE TRIGGER enforce_single_active_update
BEFORE UPDATE ON tasks
FOR EACH ROW
WHEN (NEW.status = 'ACTIVE' AND OLD.status != 'ACTIVE')
EXECUTE FUNCTION enforce_single_active();
