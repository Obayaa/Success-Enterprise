import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/money';
import { updateOrderStatus } from '../../actions';

const STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED'];

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <Link href="/admin/orders" className="text-sm text-neutral-500 hover:text-neutral-900 w-fit">
        ← All orders
      </Link>

      <h1 className="text-2xl font-semibold text-neutral-900">Order #{order.id.slice(-8)}</h1>

      <div className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col gap-1 text-sm text-neutral-600">
        <p>
          <span className="text-neutral-400">Customer:</span> {order.customerName}
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
          <span className="text-neutral-400">Placed:</span> {order.createdAt.toLocaleString()}
        </p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col gap-1">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-neutral-600">
            <span>
              {item.product.name} × {item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold text-neutral-900 border-t border-neutral-200 mt-2 pt-2">
          <span>Total</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      <form
        action={async (formData: FormData) => {
          'use server';
          await updateOrderStatus(order.id, String(formData.get('status')));
        }}
        className="flex items-center gap-2"
      >
        <label className="text-sm text-neutral-600">Status</label>
        <select
          name="status"
          defaultValue={order.status}
          className="border border-neutral-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-neutral-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-neutral-800"
        >
          Update
        </button>
      </form>
    </div>
  );
}
