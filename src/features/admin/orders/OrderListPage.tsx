import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllOrders } from '@/features/admin/orders/api';
import { formatPrice } from '@/lib/money';
import type { OrderStatus } from '@/types';

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  paid: 'bg-green-50 text-green-700',
  shipped: 'bg-blue-50 text-blue-700',
  delivered: 'bg-neutral-100 text-neutral-600',
};

export function OrderListPage() {
  const { data: orders, isLoading, error } = useQuery({ queryKey: ['admin', 'orders'], queryFn: getAllOrders });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-ink">Orders</h1>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Customer</th>
              <th className="px-4 py-2 font-medium">Date</th>
              <th className="px-4 py-2 font-medium">Total</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-neutral-500">
                  Loading…
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-red-600">
                  Couldn't load orders.
                </td>
              </tr>
            )}
            {orders?.map((o) => (
              <tr key={o.id} className="border-t border-neutral-100">
                <td className="px-4 py-2 text-neutral-900">{o.customer_name}</td>
                <td className="px-4 py-2 text-neutral-600">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-neutral-600">{formatPrice(o.total_pesewas)}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                </td>
                <td className="px-4 py-2 text-right">
                  <Link to={`/admin/orders/${o.id}`} className="text-brand-600 hover:text-brand-700">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {orders?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-neutral-500">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
