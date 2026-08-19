import { supabase } from '@/lib/supabase';
import type { OrderWithItems } from '@/types';

export async function createOrder(input: {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  items: { productId: string; quantity: number }[];
}): Promise<{ orderId: string; amount: number }> {
  const { data, error } = await supabase.rpc('create_order', {
    p_customer_name: input.customerName,
    p_phone: input.phone,
    p_email: input.email,
    p_address: input.address,
    p_items: input.items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
  });
  if (error) throw new Error(error.message);
  return { orderId: data.order_id as string, amount: data.total_pesewas as number };
}

export async function verifyPayment(orderId: string): Promise<void> {
  const { error } = await supabase.functions.invoke('verify-payment', {
    body: { reference: orderId },
  });
  if (error) throw new Error(error.message);
}

export async function getOrder(orderId: string): Promise<OrderWithItems | null> {
  const { data, error } = await supabase.rpc('get_order', { p_order_id: orderId });
  if (error) throw error;
  return data as OrderWithItems | null;
}
