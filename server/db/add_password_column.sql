-- Migration script to add password column to Employee table
-- Run this if the Employee table already exists without a password column

PRAGMA foreign_keys = ON;

-- Add password column if it doesn't exist
-- SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN directly
-- So we'll use a workaround or just add it (will fail if column exists, which is fine)

-- For existing databases, you may need to recreate the table or use a migration tool
-- This script assumes you're adding the column to an existing table

-- If column doesn't exist, this will add it
-- If it exists, you'll get an error (which you can ignore)
ALTER TABLE Employee ADD COLUMN password TEXT NOT NULL DEFAULT 'changeme';

-- Update existing employees with default password (empID as password)
-- In production, these should be changed immediately
UPDATE Employee SET password = CAST(empID AS TEXT) WHERE password = 'changeme' OR password IS NULL;

