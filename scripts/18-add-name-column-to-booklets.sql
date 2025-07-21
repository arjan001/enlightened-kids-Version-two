-- Add the 'name' column to the 'booklets' table if it does not exist.
-- This script ensures the 'name' column is present, which is required for booklet uploads.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'booklets'
        AND column_name = 'name'
    ) THEN
        ALTER TABLE public.booklets
        ADD COLUMN name TEXT NOT NULL DEFAULT '';
        -- If there are existing rows, you might want to update them with meaningful names
        -- For example: UPDATE public.booklets SET name = 'Default Booklet Name' WHERE name = '';
    END IF;
END
$$;
