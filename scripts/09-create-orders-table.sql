CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    customer_first_name TEXT NOT NULL, -- Denormalized for quick reference
    customer_last_name TEXT NOT NULL,  -- Denormalized for quick reference
    customer_email TEXT NOT NULL,      -- Denormalized for quick reference
    total_amount NUMERIC(10, 2) NOT NULL,
    shipping_cost NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL, -- e.g., 'mpesa', 'paypal'
    order_notes TEXT,
    ordered_products JSONB NOT NULL, -- Stores an array of product details: [{ product_id, title, quantity, price }]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
