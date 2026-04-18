-- Supabase table schema for pending invoices
create table if not exists pending_invoices (
  id bigint generated always as identity primary key,
  invoice_id text not null unique,
  customer_id text,
  customer_info jsonb,
  items jsonb,
  total_amount numeric,
  payment_type text,
  status text,
  created_date timestamptz,
  printed_date timestamptz,
  completed_date timestamptz
);
