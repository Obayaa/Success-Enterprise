import { Link, Navigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrderById, updateOrderStatus } from '@/features/admin/orders/api';
import { formatPrice } from '@/lib/money';
import { ORDER_STATUSES, type OrderStatus } from '@/types';

export function OrderDetailPage() {
  const { id = '' } = useParams();
  const queryClient = useQueryClient();
  const { data: order, isLoading } = useQuery({
    queryKey: ['admin', 'order', id],
    queryFn: () => getOrderById(id),
  });

  const statusMutation = useMutation({
    mutationFn: (status: OrderStatus) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });

  if (isLoading) {
    return <p className="text-neutral-500 text-sm py-16 text-center">Loading…</p>;
  }
  if (!order) {
    return <Navigate to="/admin/orders" replace />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <Link to="/admin/orders" className="text-sm text-neutral-500 hover:text-neutral-900 w-fit">
        ← All orders
      </Link>

      <h1 className="font-display text-2xl font-bold text-ink">Order #{order.id.slice(-8)}</h1>

      <div className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col gap-1 text-sm text-neutral-600">
        <p>
          <span className="text-neutral-400">Customer:</span> {order.customer_name}
        </p>
        <p>
          <span className="text-neutral-400">Phone:</span> {order.phone}
        </p>
        <p>
          <span className="text-neutral-400">Email:</span> {order.email}
        </p>
        <p>
          <span className="text-neutral-400">Address:</span> {order.address}
        </p>
        <p>
          <span className="text-neutral-400">Placed:</span> {new Date(order.created_at).toLocaleString()}
        </p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col gap-1">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-neutral-600">
            <span>
              {item.product.name} × {item.quantity}
            </span>
            <span>{formatPrice(item.price_pesewas * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold text-neutral-900 border-t border-neutral-200 mt-2 pt-2">
          <span>Total</span>
          <span>{formatPrice(order.total_pesewas)}</span>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          statusMutation.mutate(String(formData.get('status')) as OrderStatus);
        }}
        className="flex items-center gap-2"
      >
        <label className="text-sm text-neutral-600">Status</label>
        <select
          name="status"
          defaultValue={order.status}
          className="border border-neutral-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={statusMutation.isPending}
          className="bg-neutral-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-neutral-800 disabled:opacity-50"
        >
          Update
        </button>
      </form>
    </div>
  );
}
