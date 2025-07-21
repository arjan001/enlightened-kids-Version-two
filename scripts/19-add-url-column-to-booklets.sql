-- Ensure the `url` column exists on the public.booklets table.
-- This migration is idempotent: it only adds the column if it doesn't exist.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'booklets'
      AND column_name  = 'url'
  ) THEN
    ALTER TABLE public.booklets
      ADD COLUMN url TEXT NOT NULL DEFAULT '';
    -- Optionally back-fill existing rows here.
    -- UPDATE public.booklets SET url = '' WHERE url = '';
  END IF;
END
$$;
