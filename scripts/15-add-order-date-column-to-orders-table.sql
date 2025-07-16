-- Add the order_date column to the orders table if it doesn't already exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'orders' AND column_name = 'order_date'
    ) THEN
        ALTER TABLE orders
        ADD COLUMN order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END
$$;
