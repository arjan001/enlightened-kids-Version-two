ALTER TABLE products
ADD COLUMN author text NOT NULL DEFAULT 'Unknown',
ADD COLUMN description text,
ADD COLUMN age_range text,
ADD COLUMN pages integer,
ADD COLUMN status text NOT NULL DEFAULT 'active',
ADD COLUMN sales integer NOT NULL DEFAULT 0,
ADD COLUMN revenue numeric NOT NULL DEFAULT 0,
ADD COLUMN is_hot boolean NOT NULL DEFAULT false;

-- Update existing rows with default values if needed, or handle in your application logic
UPDATE products SET author = 'Cheryl Nyakio' WHERE author IS NULL;
UPDATE products SET status = 'active' WHERE status IS NULL;
UPDATE products SET sales = 0 WHERE sales IS NULL;
UPDATE products SET revenue = 0 WHERE revenue IS NULL;
UPDATE products SET is_hot = FALSE WHERE is_hot IS NULL;
