-- The RC aircraft box spotted in the shop photos didn't fit any existing
-- category, so it gets its own. Same as 0004: inserted unpublished with a
-- generic name/price/stock guess — confirm against the actual box before
-- publishing.

insert into categories (name, slug) values
  ('Gadgets & Toys', 'gadgets-toys')
on conflict (slug) do nothing;

insert into products (name, slug, description, price_pesewas, stock, published, category_id)
select 'RC Aircraft', 'rc-aircraft', 'Remote-controlled toy aircraft.', 25000, 4, false, c.id
from categories c where c.slug = 'gadgets-toys'
on conflict (slug) do nothing;
