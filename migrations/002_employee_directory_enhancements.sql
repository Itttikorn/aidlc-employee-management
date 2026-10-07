-- Migration 002: Employee Directory Enhancements
-- Adds birthdate column and drops redundant stored age column (dynamically computed from birthdate)

ALTER TABLE employees ADD COLUMN IF NOT EXISTS birthdate DATE;
ALTER TABLE employees DROP COLUMN IF EXISTS age;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS position VARCHAR(100);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS full_name VARCHAR(150);

-- Sync initial data if any
UPDATE employees SET full_name = name WHERE full_name IS NULL AND name IS NOT NULL;
UPDATE employees SET position = role WHERE position IS NULL AND role IS NOT NULL;
UPDATE employees SET name = full_name WHERE name IS NULL AND full_name IS NOT NULL;
UPDATE employees SET role = position WHERE role IS NULL AND position IS NOT NULL;
