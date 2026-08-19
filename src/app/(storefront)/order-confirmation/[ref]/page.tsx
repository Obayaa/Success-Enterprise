import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/money';
import { ClearCartOnMount } from '@/components/ClearCartOnMount';

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const order = await prisma.order.findUnique({
    where: { id: ref },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  const isPaid = order.status !== 'PENDING';

  return (
    <div className="max-w-md mx-auto px-4 py-12 flex flex-col gap-6">
      {isPaid && <ClearCartOnMount />}

      <div className="text-center flex flex-col gap-2">
        <h1 className="text-xl font-semibold text-neutral-900">
          {isPaid ? 'Order confirmed' : 'Payment pending'}
        </h1>
        <p className="text-neutral-500 text-sm">
          {isPaid
            ? "Thanks for your order! We'll be in touch to arrange delivery."
            : "We haven't received confirmation of this payment yet."}
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

      <p className="text-xs text-neutral-400 text-center">Order reference: {order.id}</p>

      <Link href="/" className="text-center text-indigo-600 font-medium hover:text-indigo-700">
        Continue shopping
      </Link>
    </div>
  );
}
