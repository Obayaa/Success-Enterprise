-- Lets an admin manually finalize a stuck order (e.g. payment confirmed
-- out-of-band) the same way verify-payment does, so stock still decrements
-- correctly instead of being silently skipped by a plain status update.
grant execute on function mark_order_paid(uuid) to authenticated;
