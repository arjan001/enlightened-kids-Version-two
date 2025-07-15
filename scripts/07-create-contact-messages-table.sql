CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' NOT NULL, -- e.g., 'new', 'read', 'archived'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Add RLS policies if you want to restrict access
-- For now, we'll assume admin access via service_role_key for server actions.
-- If you enable RLS, ensure your service_role_key bypasses it or create appropriate policies.
