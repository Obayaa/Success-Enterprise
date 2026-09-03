-- Optional "was" price so a product can show a slashed-price discount.
-- Null means no discount is running; when set it must be higher than the
-- current selling price (price_pesewas) or the discount makes no sense.

alter table products
  add column compare_at_price_pesewas integer null;

alter table products
  add constraint compare_at_price_above_price
  check (compare_at_price_pesewas is null or compare_at_price_pesewas > price_pesewas);
