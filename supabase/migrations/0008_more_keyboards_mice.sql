-- More keyboards and a mouse, all with clean unbranded photos verified
-- individually (several earlier mouse candidates were rejected for visible
-- manufacturer logos).

insert into products (name, slug, description, price_pesewas, stock, published, category_id)
select v.name, v.slug, v.description, v.price_pesewas, v.stock, true, c.id
from (values
  ('Wireless Mouse', 'wireless-mouse', 'Ergonomic wireless mouse with a smooth scroll wheel and side buttons.', 6500, 12, 'mouses'),
  ('Pink Mechanical Keyboard', 'pink-mechanical-keyboard', 'Compact mechanical keyboard with pink keycaps.', 28000, 5, 'keyboards'),
  ('Backlit Mechanical Keyboard', 'backlit-mechanical-keyboard', 'Compact mechanical keyboard with red backlighting.', 32000, 5, 'keyboards')
) as v(name, slug, description, price_pesewas, stock, category_slug)
join categories c on c.slug = v.category_slug
on conflict (slug) do nothing;
