CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    phone_number TEXT,
    shipping_address_line1 TEXT NOT NULL,
    shipping_address_line2 TEXT,
    shipping_city TEXT NOT NULL,
    shipping_state TEXT,
    shipping_zip_code TEXT,
    shipping_country TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    shipping_cost NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    ordered_products JSONB NOT NULL,
    order_notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending_payment',
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
