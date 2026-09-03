-- Starter categories matching the product line. Run automatically by
-- `supabase db reset`, or paste into the SQL editor for a hosted project.

insert into categories (name, slug) values
  ('AirPods', 'airpods'),
  ('Microphones', 'microphones'),
  ('Ring Lights', 'ring-lights'),
  ('Phone Covers', 'phone-covers'),
  ('Phone Holders', 'phone-holders'),
  ('Laptop Accessories', 'laptop-accessories'),
  ('Keyboards', 'keyboards'),
  ('Mice', 'mice'),
  ('Tripods', 'tripods'),
  ('Speakers', 'speakers'),
  ('Smartwatches', 'smartwatches'),
  ('Security Cameras', 'security-cameras'),
  ('Routers & Networking', 'routers'),
  ('Headphones', 'headphones'),
  ('Lamps & Decor Lighting', 'lamps'),
  ('Gadgets & Toys', 'gadgets-toys')
on conflict (slug) do nothing;
