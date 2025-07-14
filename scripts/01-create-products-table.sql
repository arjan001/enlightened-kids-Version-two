CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  title text NOT NULL,
  author text NOT NULL,
  description text,
  price numeric NOT NULL,
  category text,
  stock integer NOT NULL DEFAULT 0,
  image_url text,
  age_range text,
  pages integer,
  status text NOT NULL DEFAULT 'active',
  sales integer NOT NULL DEFAULT 0,
  revenue numeric NOT NULL DEFAULT 0,
  is_hot boolean NOT NULL DEFAULT false
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (for website display)
CREATE POLICY "Public products are viewable by everyone." ON products
  FOR SELECT USING (true);

-- Policy for authenticated users to insert (for admin panel)
CREATE POLICY "Authenticated users can create products." ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for authenticated users to update (for admin panel)
CREATE POLICY "Authenticated users can update products." ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy for authenticated users to delete (for admin panel)
CREATE POLICY "Authenticated users can delete products." ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Optional: Add a trigger to update `updated_at` on every row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
