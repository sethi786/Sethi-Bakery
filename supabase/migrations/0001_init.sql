-- Sethi Bakery — initial schema
-- All money is stored as integer paise. All localizable text is jsonb
-- {"en": "...", "pa": "...", "hi": "..."} with only "en" required.
-- Every domain table carries shop_id: the multi-vendor escape hatch for the
-- future local-shops platform. Today there is exactly one row in shops.

-- ============ tenancy ============
create table shops (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name jsonb not null,
  phone text,
  whatsapp_phone text,
  address text,
  currency text not null default 'INR',
  is_active boolean not null default true,
  settings jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table shop_members (
  user_id uuid not null references auth.users(id) on delete cascade,
  shop_id uuid not null references shops(id) on delete cascade,
  role text not null check (role in ('owner','manager','staff')),
  primary key (user_id, shop_id)
);

-- ============ catalog ============
create table categories (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id),
  slug text not null,
  name jsonb not null,
  image_path text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  unique (shop_id, slug)
);

create table products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id),
  category_id uuid not null references categories(id),
  slug text not null,
  name jsonb not null,
  description jsonb,
  product_type text not null default 'simple'
    check (product_type in ('simple','variant','custom_cake')),
  base_price int,
  compare_at_price int,
  unit jsonb,
  is_eggless boolean,
  stock_status text not null default 'in_stock'
    check (stock_status in ('in_stock','out_of_stock','hidden')),
  track_inventory boolean not null default false,
  stock_qty int,
  is_featured boolean not null default false,
  tags text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (shop_id, slug)
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name jsonb not null,
  price int not null,
  compare_at_price int,
  stock_qty int,
  is_default boolean not null default false,
  sort_order int not null default 0
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  path text not null,
  thumb_path text not null,
  width int,
  height int,
  alt jsonb,
  sort_order int not null default 0
);

-- ============ cake builder ============
create table option_groups (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id),
  product_id uuid references products(id),  -- NULL = applies to all custom cakes
  code text not null,
  name jsonb not null,
  input_type text not null
    check (input_type in ('single_select','text','image_upload','datetime')),
  required boolean not null default false,
  sort_order int not null default 0
);

create table options (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references option_groups(id) on delete cascade,
  code text not null,
  name jsonb not null,
  weight_kg numeric(4,2),
  price_effect text not null default 'none'
    check (price_effect in ('none','flat','per_kg','multiplier')),
  amount numeric(12,4) not null default 0,
  is_default boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0
);

-- ============ ordering ============
create table delivery_zones (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id),
  name jsonb not null,
  villages text[] not null default '{}',
  fee int not null,
  free_above int,
  is_active boolean not null default true,
  sort_order int not null default 0
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id),
  phone text not null,
  name text,
  default_address text,
  created_at timestamptz not null default now(),
  unique (shop_id, phone)
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id),
  order_number text not null unique,
  access_token text not null,
  customer_id uuid references customers(id),
  customer_name text not null,
  customer_phone text not null,
  locale text not null default 'en',
  fulfillment_type text not null check (fulfillment_type in ('pickup','delivery')),
  delivery_zone_id uuid references delivery_zones(id),
  address_text text,
  landmark text,
  scheduled_date date,
  scheduled_slot text,
  status text not null default 'received' check (status in
    ('pending_payment','received','preparing','ready','out_for_delivery','delivered','cancelled')),
  payment_method text not null check (payment_method in ('cod','razorpay')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid','paid','failed','refunded')),
  subtotal int not null,
  delivery_fee int not null default 0,
  total int not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  customer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_shop_created_idx on orders (shop_id, created_at desc);
create index orders_razorpay_idx on orders (razorpay_order_id);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id),
  variant_id uuid references product_variants(id),
  name_snapshot text not null,
  unit_price int not null,
  qty int not null,
  line_total int not null,
  customization jsonb
);

create table order_events (
  id bigint generated always as identity primary key,
  order_id uuid not null references orders(id) on delete cascade,
  from_status text,
  to_status text not null,
  actor text not null default 'system',
  created_at timestamptz not null default now()
);

create table payment_events (
  id bigint generated always as identity primary key,
  provider text not null default 'razorpay',
  event_id text not null unique,
  payload jsonb not null,
  processed_at timestamptz not null default now()
);

-- ============ RLS ============
alter table shops enable row level security;
alter table shop_members enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table product_images enable row level security;
alter table option_groups enable row level security;
alter table options enable row level security;
alter table delivery_zones enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_events enable row level security;
alter table payment_events enable row level security;

-- Catalog: public read of active rows. No public writes anywhere.
create policy "public read shops" on shops for select using (is_active);
create policy "public read categories" on categories for select using (is_active);
create policy "public read products" on products for select using (stock_status <> 'hidden');
create policy "public read variants" on product_variants for select using (true);
create policy "public read images" on product_images for select using (true);
create policy "public read option_groups" on option_groups for select using (true);
create policy "public read options" on options for select using (is_active);
create policy "public read zones" on delivery_zones for select using (is_active);

-- Orders: no anon access. Admin (authenticated shop member) may read —
-- this policy exists specifically so Supabase Realtime can stream new
-- orders to the admin phone. All writes go through service-role.
create policy "members read orders" on orders for select to authenticated
  using (exists (
    select 1 from shop_members m
    where m.shop_id = orders.shop_id and m.user_id = auth.uid()
  ));
create policy "members read order_items" on order_items for select to authenticated
  using (exists (
    select 1 from orders o
    join shop_members m on m.shop_id = o.shop_id
    where o.id = order_items.order_id and m.user_id = auth.uid()
  ));
create policy "members read order_events" on order_events for select to authenticated
  using (exists (
    select 1 from orders o
    join shop_members m on m.shop_id = o.shop_id
    where o.id = order_events.order_id and m.user_id = auth.uid()
  ));
create policy "members read own membership" on shop_members for select to authenticated
  using (user_id = auth.uid());

-- ============ atomic order creation ============
-- Called by the placeOrder server action with a fully repriced payload.
create or replace function create_order(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_shop_id uuid;
  v_customer_id uuid;
  v_order_id uuid;
  v_order jsonb := payload->'order';
  v_input jsonb := payload->'input';
  v_item jsonb;
begin
  select id into v_shop_id from shops where is_active limit 1;

  insert into customers (shop_id, phone, name, default_address)
  values (
    v_shop_id,
    v_order->>'customer_phone',
    v_order->>'customer_name',
    v_order->>'address_text'
  )
  on conflict (shop_id, phone) do update
    set name = excluded.name,
        default_address = coalesce(excluded.default_address, customers.default_address)
  returning id into v_customer_id;

  insert into orders (
    shop_id, order_number, access_token, customer_id, customer_name,
    customer_phone, locale, fulfillment_type, delivery_zone_id, address_text,
    landmark, scheduled_date, scheduled_slot, status, payment_method,
    subtotal, delivery_fee, total, customer_note
  ) values (
    v_shop_id,
    v_order->>'order_number',
    v_order->>'access_token',
    v_customer_id,
    v_order->>'customer_name',
    v_order->>'customer_phone',
    coalesce(v_input->>'locale', 'en'),
    v_order->>'fulfillment_type',
    nullif(v_input->>'delivery_zone_id','')::uuid,
    v_order->>'address_text',
    v_input->>'landmark',
    nullif(v_input->>'scheduled_date','')::date,
    v_input->>'scheduled_slot',
    v_order->>'status',
    v_order->>'payment_method',
    (v_order->>'subtotal')::int,
    (v_order->>'delivery_fee')::int,
    (v_order->>'total')::int,
    v_input->>'customer_note'
  ) returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(v_order->'items')
  loop
    insert into order_items (order_id, name_snapshot, unit_price, qty, line_total, customization)
    values (
      v_order_id,
      v_item->>'name',
      (v_item->>'unit_price')::int,
      (v_item->>'qty')::int,
      (v_item->>'line_total')::int,
      v_item->'customization'
    );
  end loop;

  insert into order_events (order_id, from_status, to_status, actor)
  values (v_order_id, null, v_order->>'status', 'system');

  return v_order_id;
end;
$$;

revoke execute on function create_order(jsonb) from anon, authenticated;
