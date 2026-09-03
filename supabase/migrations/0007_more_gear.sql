-- Assorted phone cases, a second AirPods-category item (distinct in-ear
-- style TWS earbuds, not stem-style, to avoid duplicating the look of the
-- existing Oraimo Airpods), and a new Chargers & Cables category for the
-- wall charger and power bank. All photos individually checked for visible
-- branding before use.

insert into categories (name, slug) values
  ('Chargers & Cables', 'chargers-cables')
on conflict (slug) do nothing;

insert into products (name, slug, description, price_pesewas, stock, published, category_id)
select v.name, v.slug, v.description, v.price_pesewas, v.stock, true, c.id
from (values
  ('Assorted Phone Case', 'assorted-phone-case', 'Protective silicone/TPU phone case. Pattern varies by stock on hand.', 3500, 20, 'phone-covers'),
  ('TWS Wireless Earbuds', 'tws-wireless-earbuds', 'True wireless in-ear earbuds with a compact charging case.', 12000, 8, 'airpods'),
  ('USB Wall Charger', 'usb-wall-charger', 'Compact USB power adapter with a charging cable.', 5000, 15, 'chargers-cables'),
  ('Solar Power Bank', 'solar-power-bank', 'Rugged portable battery pack with a solar panel for backup charging.', 18000, 6, 'chargers-cables')
) as v(name, slug, description, price_pesewas, stock, category_slug)
join categories c on c.slug = v.category_slug
on conflict (slug) do nothing;
