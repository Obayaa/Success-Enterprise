import { supabase } from '@/lib/supabase';
import type { Order, OrderStatus, OrderWithItems } from '@/types';

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getOrderById(id: string): Promise<OrderWithItems | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*, product:products(name, slug))')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as OrderWithItems | null;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  if (status === 'paid') {
    // Same path verify-payment uses — decrements stock, and is a no-op if
    // the order isn't currently pending (so it's safe to call more than once).
    const { error } = await supabase.rpc('mark_order_paid', { p_order_id: id });
    if (error) throw new Error(error.message);
    return;
  }
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}
