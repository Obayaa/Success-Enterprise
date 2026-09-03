-- New categories + starter products spotted in shop-floor photos (speakers,
-- smartwatches, security cameras, a router, gaming/wired headsets, a decor
-- lamp, and an LED video light under the existing Ring Lights category).
--
-- These are inserted UNPUBLISHED: names/prices/stock are best-guess
-- placeholders from a photo, not confirmed against the actual boxes. Review
-- each one in /admin/products, correct the details, attach a real photo,
-- then publish.

insert into categories (name, slug) values
  ('Speakers', 'speakers'),
  ('Smartwatches', 'smartwatches'),
  ('Security Cameras', 'security-cameras'),
  ('Routers & Networking', 'routers'),
  ('Headphones', 'headphones'),
  ('Lamps & Decor Lighting', 'lamps')
on conflict (slug) do nothing;

insert into products (name, slug, description, price_pesewas, stock, published, category_id)
select v.name, v.slug, v.description, v.price_pesewas, v.stock, false, c.id
from (values
  ('Portable Bluetooth Speaker', 'portable-bluetooth-speaker', 'Compact wireless speaker with rich bass, USB-C charging, and a built-in mic for calls.', 15000, 8, 'speakers'),
  ('Smartwatch (V18 Pro Max)', 'smartwatch-v18-pro-max', 'Touchscreen smartwatch with call function, heart-rate and step tracking, and long battery life.', 18000, 6, 'smartwatches'),
  ('Sport Smartwatch', 'sport-smartwatch', 'Everyday fitness smartwatch with notifications, heart-rate monitor, and multiple sport modes.', 15000, 5, 'smartwatches'),
  ('360-Degree WiFi Security Camera', '360-wifi-security-camera', 'Indoor pan-and-tilt WiFi camera with night vision, motion alerts, and phone app viewing.', 28000, 4, 'security-cameras'),
  ('Mini WiFi Security Camera', 'mini-wifi-security-camera', 'Compact plug-in WiFi camera for home or shop monitoring, with night vision and app alerts.', 22000, 4, 'security-cameras'),
  ('4G/5G Wireless Router', '4g-5g-wireless-router', 'SIM-card WiFi router for home or office internet, no fixed broadband line needed.', 35000, 5, 'routers'),
  ('HP Gaming Headset H120', 'hp-gaming-headset-h120', 'Over-ear gaming headset with noise-isolating mic and cushioned ear cups.', 20000, 6, 'headphones'),
  ('Wired Stereo Headset', 'wired-stereo-headset', 'Everyday wired headset with in-line mic, compatible with phones and laptops.', 6000, 10, 'headphones'),
  ('Sunset Projection Lamp', 'sunset-projection-lamp', 'LED lamp that projects a warm sunset glow, popular for photo and video backdrops.', 9000, 10, 'lamps'),
  ('Adjustable LED Video Light Panel', 'adjustable-led-video-light-panel', 'Continuous LED light panel with adjustable brightness and color temperature for photo/video.', 22000, 5, 'ring-lights')
) as v(name, slug, description, price_pesewas, stock, category_slug)
join categories c on c.slug = v.category_slug
on conflict (slug) do nothing;
