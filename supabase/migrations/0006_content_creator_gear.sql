-- Content-creation accessories: a tripod, a microphone, and a phone stand
-- using stock photos that were already downloaded and quality-checked in
-- an earlier batch (see 1bb21e0) but never attached to a product. Verified
-- individually again here for an accurate match to the product name.
-- Published directly since the photos are confirmed real matches.

insert into products (name, slug, description, price_pesewas, stock, published, category_id)
select v.name, v.slug, v.description, v.price_pesewas, v.stock, true, c.id
from (values
  ('Extendable Tripod Stand', 'extendable-tripod-stand', 'Adjustable-height aluminum tripod with a tilt head, for phones and cameras.', 12000, 10, 'tripods'),
  ('Recording Microphone', 'recording-microphone', 'Stage-style dynamic microphone for podcasts, voiceovers, and live recording.', 25000, 6, 'microphones'),
  ('Desktop Phone Stand', 'desktop-phone-stand', 'Compact foldable stand that props up a phone at a comfortable viewing angle.', 4000, 15, 'phone-holders')
) as v(name, slug, description, price_pesewas, stock, category_slug)
join categories c on c.slug = v.category_slug
on conflict (slug) do nothing;
