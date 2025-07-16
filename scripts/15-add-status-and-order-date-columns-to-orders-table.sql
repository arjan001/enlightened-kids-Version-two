-- Adds the two missing columns required by app/checkout/actions.ts
-- Safe to run multiple times: uses IF NOT EXISTS guards.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending_payment';

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS order_date TIMESTAMPTZ NOT NULL DEFAULT NOW();
