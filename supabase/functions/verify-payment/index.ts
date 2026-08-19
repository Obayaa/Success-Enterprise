// Deno Edge Function. Deploy with: supabase functions deploy verify-payment
// Set secrets with: supabase secrets set PAYSTACK_SECRET_KEY=sk_...
//
// This is the one place a secret key is involved, so it's the one place
// payment gets confirmed — never trust the client-side Paystack "success"
// callback alone.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Required for browser calls via supabase.functions.invoke() — without this,
// the browser's CORS preflight (OPTIONS) gets no response and the actual
// POST never reaches this function at all. It just fails silently.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405);
  }

  const { reference } = await req.json();
  if (!reference) {
    return json({ error: 'Missing reference.' }, 400);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, status, total_pesewas')
    .eq('id', reference)
    .maybeSingle();

  if (orderError || !order) {
    return json({ error: 'Order not found.' }, 404);
  }

  if (order.status !== 'pending') {
    return json({ status: order.status });
  }

  const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
  });
  const verifyData = await verifyRes.json();

  const paid =
    verifyRes.ok &&
    verifyData?.data?.status === 'success' &&
    verifyData?.data?.amount === order.total_pesewas;

  if (!paid) {
    return json({ error: 'Payment not confirmed.' }, 400);
  }

  const { error: markError } = await supabase.rpc('mark_order_paid', { p_order_id: order.id });
  if (markError) {
    return json({ error: markError.message }, 500);
  }

  return json({ status: 'paid' });
});
