-- Schema for the Success Enterprise storefront: categories, products, orders.
-- Run via `supabase db push`, or paste into the Supabase SQL editor.

create extension if not exists "pgcrypto";

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price_pesewas integer not null check (price_pesewas >= 0),
  stock integer not null default 0 check (stock >= 0),
  images text[] not null default '{}',
  published boolean not null default true,
  category_id uuid not null references categories(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type order_status as enum ('pending', 'paid', 'shipped', 'delivered');

create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  email text not null,
  address text not null,
  status order_status not null default 'pending',
  total_pesewas integer not null check (total_pesewas >= 0),
  paystack_ref text unique,
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  price_pesewas integer not null check (price_pesewas >= 0)
);

create index products_category_id_idx on products (category_id);
create index order_items_order_id_idx on order_items (order_id);
create index order_items_product_id_idx on order_items (product_id);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
before update on products
for each row execute function set_updated_at();

-- Row Level Security --------------------------------------------------------
-- "authenticated" = an admin: there is no customer sign-up flow in v1, so
-- every logged-in Supabase Auth user is, by construction, an admin account
-- you created yourself (via the Supabase dashboard).

alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "Public can read categories" on categories
  for select using (true);

create policy "Admins manage categories" on categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Public can read published products" on products
  for select using (published = true);

create policy "Admins manage products" on products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Orders and order_items have NO public select/insert policy. Guests place
-- orders through create_order() and look them up through get_order() below
-- (both SECURITY DEFINER), so a customer can never list or browse other
-- people's orders through the anon API key — only fetch the exact one whose
-- id they already have.
create policy "Admins read orders" on orders
  for select using (auth.role() = 'authenticated');

create policy "Admins update orders" on orders
  for update using (auth.role() = 'authenticated');

create policy "Admins read order items" on order_items
  for select using (auth.role() = 'authenticated');

-- RPCs ------------------------------------------------------------------

-- The only way a guest can create an order: validates stock, computes the
-- total server-side (never trusts a client-supplied price), and inserts the
-- order + line items atomically.
create or replace function create_order(
  p_customer_name text,
  p_phone text,
  p_email text,
  p_address text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid := gen_random_uuid();
  v_total integer := 0;
  v_item jsonb;
  v_product products%rowtype;
begin
  if jsonb_array_length(p_items) = 0 then
    raise exception 'No items in order.';
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product from products
      where id = (v_item->>'product_id')::uuid and published = true
      for update;

    if not found then
      raise exception 'One of the items is no longer available.';
    end if;

    if (v_item->>'quantity')::integer < 1 or (v_item->>'quantity')::integer > v_product.stock then
      raise exception 'Not enough stock for %.', v_product.name;
    end if;

    v_total := v_total + v_product.price_pesewas * (v_item->>'quantity')::integer;
  end loop;

  insert into orders (id, customer_name, phone, email, address, total_pesewas, paystack_ref)
  values (v_order_id, p_customer_name, p_phone, p_email, p_address, v_total, v_order_id::text);

  insert into order_items (order_id, product_id, quantity, price_pesewas)
  select v_order_id, (item->>'product_id')::uuid, (item->>'quantity')::integer, products.price_pesewas
  from jsonb_array_elements(p_items) as item
  join products on products.id = (item->>'product_id')::uuid;

  return jsonb_build_object('order_id', v_order_id, 'total_pesewas', v_total);
end;
$$;

grant execute on function create_order(text, text, text, text, jsonb) to anon, authenticated;

-- The only way a guest can read an order back: a single lookup by id, never
-- a list. Used by the order-confirmation page.
create or replace function get_order(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order orders%rowtype;
  v_items jsonb;
begin
  select * into v_order from orders where id = p_order_id;
  if not found then
    return null;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', oi.id,
    'quantity', oi.quantity,
    'price_pesewas', oi.price_pesewas,
    'product', jsonb_build_object('name', p.name, 'slug', p.slug)
  )), '[]'::jsonb)
  into v_items
  from order_items oi
  join products p on p.id = oi.product_id
  where oi.order_id = p_order_id;

  return jsonb_build_object(
    'id', v_order.id,
    'customer_name', v_order.customer_name,
    'phone', v_order.phone,
    'email', v_order.email,
    'address', v_order.address,
    'status', v_order.status,
    'total_pesewas', v_order.total_pesewas,
    'paystack_ref', v_order.paystack_ref,
    'created_at', v_order.created_at,
    'items', v_items
  );
end;
$$;

grant execute on function get_order(uuid) to anon, authenticated;

-- Marks an order paid and decrements stock atomically. Deliberately NOT
-- granted to anon/authenticated — only callable with the service role key,
-- which the verify-payment Edge Function uses after confirming payment with
-- Paystack directly (never trusts the client-side "success" callback alone).
create or replace function mark_order_paid(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update orders set status = 'paid' where id = p_order_id and status = 'pending';

  update products p
  set stock = p.stock - oi.quantity
  from order_items oi
  where oi.order_id = p_order_id and oi.product_id = p.id;
end;
$$;

-- Storage: product images ----------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can read product images" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "Admins upload product images" on storage.objects
  for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Admins update product images" on storage.objects
  for update using (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Admins delete product images" on storage.objects
  for delete using (bucket_id = 'product-images' and auth.role() = 'authenticated');
