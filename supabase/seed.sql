-- Seed data for Sethi Bakery. Mirrors lib/demo-data.ts — keep them in sync.
-- Run after migrations: supabase db reset applies both.

insert into shops (slug, name, address, whatsapp_phone, settings) values (
  'sethi-bakery',
  '{"en":"Sethi Bakery","pa":"ਸੇਠੀ ਬੇਕਰੀ","hi":"सेठी बेकरी"}',
  'Near Bus Adda, Patti, Tarn Taran, Punjab 143416',
  null,
  '{"accepting_orders": true, "min_order_paise": 0}'
);

with s as (select id from shops where slug = 'sethi-bakery')
insert into categories (shop_id, slug, name, sort_order)
select s.id, v.slug, v.name::jsonb, v.sort_order from s, (values
  ('cakes', '{"en":"Cakes","pa":"ਕੇਕ","hi":"केक"}', 0),
  ('pastries', '{"en":"Pastries","pa":"ਪੇਸਟਰੀ","hi":"पेस्ट्री"}', 1),
  ('patties-snacks', '{"en":"Patties & Snacks","pa":"ਪੈਟੀਜ਼ ਅਤੇ ਸਨੈਕਸ","hi":"पैटीज़ और स्नैक्स"}', 2),
  ('breads', '{"en":"Breads & Rusk","pa":"ਬ੍ਰੈੱਡ ਅਤੇ ਰਸ","hi":"ब्रेड और रस्क"}', 3),
  ('grocery', '{"en":"Grocery","pa":"ਕਰਿਆਨਾ","hi":"किराना"}', 4)
) as v(slug, name, sort_order);

-- Custom cakes (base_price = paise per kg)
with s as (select id from shops where slug = 'sethi-bakery'),
     c as (select id from categories where slug = 'cakes')
insert into products (shop_id, category_id, slug, name, description, product_type, base_price, is_featured, tags, sort_order)
select s.id, c.id, v.slug, v.name::jsonb, v.description::jsonb, 'custom_cake', v.base_price, v.is_featured, v.tags, v.sort_order
from s, c, (values
  ('black-forest-cake', '{"en":"Black Forest Cake","pa":"ਬਲੈਕ ਫੋਰੈਸਟ ਕੇਕ","hi":"ब्लैक फॉरेस्ट केक"}',
   '{"en":"Classic layers of chocolate sponge, fresh cream and cherries — our bestseller for birthdays."}',
   45000, true, array['bestseller'], 0),
  ('chocolate-truffle-cake', '{"en":"Chocolate Truffle Cake","pa":"ਚਾਕਲੇਟ ਟਰਫਲ ਕੇਕ","hi":"चॉकलेट ट्रफल केक"}',
   '{"en":"Rich dark chocolate ganache over soft chocolate sponge. For serious chocolate lovers."}',
   55000, true, array[]::text[], 1),
  ('pineapple-cake', '{"en":"Pineapple Cake","pa":"ਪਾਈਨੈਪਲ ਕੇਕ","hi":"पाइनएप्पल केक"}',
   '{"en":"Light vanilla sponge with fresh cream and juicy pineapple — the classic Punjabi celebration cake."}',
   40000, false, array[]::text[], 2),
  ('red-velvet-cake', '{"en":"Red Velvet Cake","pa":"ਰੈੱਡ ਵੈਲਵੇਟ ਕੇਕ","hi":"रेड वेलवेट केक"}',
   '{"en":"Velvety red sponge with cream-cheese frosting. Premium choice for anniversaries."}',
   60000, true, array['premium'], 3)
) as v(slug, name, description, base_price, is_featured, tags, sort_order);

-- Pastries & rolls
with s as (select id from shops where slug = 'sethi-bakery'),
     c as (select id from categories where slug = 'pastries')
insert into products (shop_id, category_id, slug, name, description, base_price, unit, is_eggless, is_featured, tags, sort_order)
select s.id, c.id, v.slug, v.name::jsonb, v.description::jsonb, v.base_price, v.unit::jsonb, v.is_eggless, v.is_featured, v.tags, v.sort_order
from s, c, (values
  ('chocolate-pastry', '{"en":"Chocolate Pastry","pa":"ਚਾਕਲੇਟ ਪੇਸਟਰੀ","hi":"चॉकलेट पेस्ट्री"}', null, 3500, '{"en":"per piece"}', false, true, array[]::text[], 0),
  ('pineapple-pastry', '{"en":"Pineapple Pastry","pa":"ਪਾਈਨੈਪਲ ਪੇਸਟਰੀ","hi":"पाइनएप्पल पेस्ट्री"}', null, 3000, '{"en":"per piece"}', true, false, array[]::text[], 1),
  ('jam-roll', '{"en":"Jam Roll","pa":"ਜੈਮ ਰੋਲ","hi":"जैम रोल"}',
   '{"en":"Soft sponge rolled with sweet mixed-fruit jam — a Sethi Bakery signature."}',
   1500, '{"en":"per piece"}', true, true, array['bestseller'], 2),
  ('cream-roll', '{"en":"Cream Roll","pa":"ਕਰੀਮ ਰੋਲ","hi":"क्रीम रोल"}',
   '{"en":"Crispy flaky roll filled with fresh sweet cream. Best with evening chai."}',
   1200, '{"en":"per piece"}', true, true, array['bestseller'], 3)
) as v(slug, name, description, base_price, unit, is_eggless, is_featured, tags, sort_order);

-- Patties & snacks
with s as (select id from shops where slug = 'sethi-bakery'),
     c as (select id from categories where slug = 'patties-snacks')
insert into products (shop_id, category_id, slug, name, description, base_price, unit, is_eggless, is_featured, sort_order)
select s.id, c.id, v.slug, v.name::jsonb, v.description::jsonb, v.base_price, v.unit::jsonb, true, v.is_featured, v.sort_order
from s, c, (values
  ('veg-patty', '{"en":"Veg Patty","pa":"ਵੈਜ ਪੈਟੀ","hi":"वेज पैटी"}',
   '{"en":"Golden flaky pastry stuffed with spiced potato-pea filling. Fresh batches all day."}',
   2000, '{"en":"per piece"}', true, 0),
  ('paneer-patty', '{"en":"Paneer Patty","pa":"ਪਨੀਰ ਪੈਟੀ","hi":"पनीर पैटी"}', null, 2500, '{"en":"per piece"}', false, 1)
) as v(slug, name, description, base_price, unit, is_featured, sort_order);

-- Breads
with s as (select id from shops where slug = 'sethi-bakery'),
     c as (select id from categories where slug = 'breads')
insert into products (shop_id, category_id, slug, name, product_type, base_price, unit, is_eggless, sort_order)
select s.id, c.id, v.slug, v.name::jsonb, v.product_type, v.base_price, v.unit::jsonb, true, v.sort_order
from s, c, (values
  ('fresh-white-bread', '{"en":"Fresh White Bread","pa":"ਤਾਜ਼ੀ ਵ੍ਹਾਈਟ ਬ੍ਰੈੱਡ","hi":"ताज़ी व्हाइट ब्रेड"}', 'variant', null, null, 0),
  ('atta-rusk', '{"en":"Atta Rusk","pa":"ਆਟਾ ਰਸ","hi":"आटा रस्क"}', 'simple', 6000, '{"en":"500 g pack"}', 1)
) as v(slug, name, product_type, base_price, unit, sort_order);

insert into product_variants (product_id, name, price, is_default, sort_order)
select p.id, v.name::jsonb, v.price, v.is_default, v.sort_order
from products p, (values
  ('{"en":"400 g"}', 4000, true, 0),
  ('{"en":"800 g"}', 7500, false, 1)
) as v(name, price, is_default, sort_order)
where p.slug = 'fresh-white-bread';

-- Grocery
with s as (select id from shops where slug = 'sethi-bakery'),
     c as (select id from categories where slug = 'grocery')
insert into products (shop_id, category_id, slug, name, base_price, compare_at_price, unit, sort_order)
select s.id, c.id, v.slug, v.name::jsonb, v.base_price, v.compare_at_price, v.unit::jsonb, v.sort_order
from s, c, (values
  ('amul-butter-100g', '{"en":"Amul Butter 100 g","hi":"अमूल बटर 100 ग्राम"}', 6000, 6200, '{"en":"100 g"}', 0),
  ('parle-g-family-pack', '{"en":"Parle-G Family Pack","hi":"पारले-जी फैमिली पैक"}', 3000, null, '{"en":"800 g"}', 1),
  ('punjabi-namkeen-mix', '{"en":"Punjabi Namkeen Mix","pa":"ਪੰਜਾਬੀ ਨਮਕੀਨ ਮਿਕਸ","hi":"पंजाबी नमकीन मिक्स"}', 5000, null, '{"en":"400 g pack"}', 2)
) as v(slug, name, base_price, compare_at_price, unit, sort_order);

-- Cake option groups (shop-wide: product_id null)
with s as (select id from shops where slug = 'sethi-bakery')
insert into option_groups (shop_id, code, name, input_type, required, sort_order)
select s.id, v.code, v.name::jsonb, v.input_type, v.required, v.sort_order from s, (values
  ('size', '{"en":"Size","pa":"ਸਾਈਜ਼","hi":"साइज़"}', 'single_select', true, 0),
  ('shape', '{"en":"Shape","pa":"ਸ਼ਕਲ","hi":"आकार"}', 'single_select', true, 1),
  ('egg', '{"en":"Egg preference","pa":"ਅੰਡੇ ਦੀ ਪਸੰਦ","hi":"अंडा विकल्प"}', 'single_select', true, 2),
  ('photo_print', '{"en":"Photo print on cake","pa":"ਕੇਕ ਉੱਤੇ ਫੋਟੋ ਪ੍ਰਿੰਟ","hi":"केक पर फोटो प्रिंट"}', 'single_select', false, 3),
  ('message', '{"en":"Message on cake","pa":"ਕੇਕ ਉੱਤੇ ਸੁਨੇਹਾ","hi":"केक पर संदेश"}', 'text', false, 4),
  ('delivery_datetime', '{"en":"Needed by (date & time)","pa":"ਕਦੋਂ ਚਾਹੀਦਾ ਹੈ","hi":"कब चाहिए"}', 'datetime', true, 5)
) as v(code, name, input_type, required, sort_order);

insert into options (group_id, code, name, weight_kg, price_effect, amount, is_default, sort_order)
select g.id, v.code, v.name::jsonb, v.weight_kg, v.price_effect, v.amount, v.is_default, v.sort_order
from option_groups g
join (values
  ('size', '0_5kg', '{"en":"0.5 kg"}', 0.5, 'none', 0, false, 0),
  ('size', '1kg', '{"en":"1 kg"}', 1.0, 'none', 0, true, 1),
  ('size', '2kg', '{"en":"2 kg"}', 2.0, 'none', 0, false, 2),
  ('size', '3kg', '{"en":"3 kg"}', 3.0, 'none', 0, false, 3),
  ('shape', 'round', '{"en":"Round","pa":"ਗੋਲ","hi":"गोल"}', null, 'none', 0, true, 0),
  ('shape', 'square', '{"en":"Square","pa":"ਚੌਰਸ","hi":"चौकोर"}', null, 'none', 0, false, 1),
  ('shape', 'heart', '{"en":"Heart","pa":"ਦਿਲ","hi":"दिल"}', null, 'multiplier', 1.1, false, 2),
  ('egg', 'with_egg', '{"en":"With egg","pa":"ਅੰਡੇ ਨਾਲ","hi":"अंडे के साथ"}', null, 'none', 0, true, 0),
  ('egg', 'eggless', '{"en":"Eggless","pa":"ਬਿਨਾਂ ਅੰਡੇ","hi":"एगलेस"}', null, 'per_kg', 5000, false, 1),
  ('photo_print', 'no', '{"en":"No photo","pa":"ਬਿਨਾਂ ਫੋਟੋ","hi":"बिना फोटो"}', null, 'none', 0, true, 0),
  ('photo_print', 'yes', '{"en":"Add photo print","pa":"ਫੋਟੋ ਪ੍ਰਿੰਟ ਪਾਓ","hi":"फोटो प्रिंट जोड़ें"}', null, 'flat', 15000, false, 1)
) as v(group_code, code, name, weight_kg, price_effect, amount, is_default, sort_order)
  on v.group_code = g.code;

-- Delivery zones
with s as (select id from shops where slug = 'sethi-bakery')
insert into delivery_zones (shop_id, name, villages, fee, free_above, sort_order)
select s.id, v.name::jsonb, v.villages, v.fee, v.free_above, v.sort_order from s, (values
  ('{"en":"Patti Town","pa":"ਪੱਟੀ ਸ਼ਹਿਰ","hi":"पट्टी शहर"}',
   array['Patti','Bus Adda','Railway Road','Sabzi Mandi'], 2000, 50000, 0),
  ('{"en":"Nearby villages (within 5 km)","pa":"ਨੇੜਲੇ ਪਿੰਡ (5 ਕਿ.ਮੀ. ਤੱਕ)","hi":"नज़दीकी गाँव (5 कि.मी. तक)"}',
   array['Dubli','Kot Dharm Chand','Sur Singh','Manochahal'], 4000, 100000, 1)
) as v(name, villages, fee, free_above, sort_order);
