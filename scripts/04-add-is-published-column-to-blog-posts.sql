-- This script is intended to add the 'is_published' column if it was somehow missed.
-- If the '03-create-blog-posts-table.sql' script is run, this column will already exist.
-- This script is safe to run multiple times.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'blog_posts'
        AND column_name = 'is_published'
    ) THEN
        ALTER TABLE public.blog_posts
        ADD COLUMN is_published boolean NOT NULL DEFAULT false;
    END IF;
END
$$;
