import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getOrder, verifyPayment } from '@/features/checkout/api';
import { formatPrice } from '@/lib/money';
import { useCartStore } from '@/lib/cart-store';

const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 3000;

export function OrderConfirmationPage() {
  const { ref = '' } = useParams();
  const clearCart = useCartStore((s) => s.clear);
  const [confirming, setConfirming] = useState(true);
  const attemptsRef = useRef(0);

  const { data: order, isLoading, isError, refetch } = useQuery({
    queryKey: ['order', ref],
    queryFn: () => getOrder(ref),
  });

  const isPaid = order && order.status !== 'pending';

  useEffect(() => {
    if (isPaid) {
      clearCart();
      setConfirming(false);
    }
  }, [isPaid, clearCart]);

  // While the order is still "pending," keep retrying verification for a
  // short window — the Paystack popup closing doesn't guarantee our verify
  // call has landed yet, so the customer shouldn't be left staring at
  // "pending" with no idea whether anything is actually happening.
  useEffect(() => {
    if (!order || isPaid) return;
    if (attemptsRef.current >= MAX_ATTEMPTS) {
      setConfirming(false);
      return;
    }
    const timer = setTimeout(async () => {
      attemptsRef.current += 1;
      await verifyPayment(order.id).catch(() => {});
      await refetch();
    }, RETRY_DELAY_MS);
    return () => clearTimeout(timer);
  }, [order, isPaid, refetch]);

  function handleCheckAgain() {
    attemptsRef.current = 0;
    setConfirming(true);
    verifyPayment(ref)
      .catch(() => {})
      .finally(() => refetch());
  }

  if (isLoading) {
    return <p className="text-neutral-500 text-sm py-16 text-center">Loading…</p>;
  }
  if (isError) {
    return <p className="text-red-600 text-sm py-16 text-center">Couldn't load this order.</p>;
  }
  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 flex flex-col gap-6">
      <div className="text-center flex flex-col gap-2 items-center">
        {!isPaid && confirming && (
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-brand-600 animate-spin mb-1">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
        <h1 className="font-display text-xl font-bold text-ink">
          {isPaid ? 'Order confirmed' : confirming ? 'Confirming your payment…' : 'Payment pending'}
        </h1>
        <p className="text-neutral-500 text-sm">
          {isPaid
            ? "Thanks for your order! We'll be in touch to arrange delivery."
            : confirming
              ? 'This usually takes a few seconds. Hang tight.'
              : "We haven't received confirmation of this payment yet. If you completed payment, this can occasionally take a minute — try checking again, or contact us with your order reference below."}
        </p>
        {!isPaid && !confirming && (
          <button
            onClick={handleCheckAgain}
            className="mt-1 text-sm font-medium text-brand-600 hover:text-brand-700 border border-brand-100 rounded-md px-4 py-2"
          >
            Check again
          </button>
        )}
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

      <p className="text-xs text-neutral-400 text-center">Order reference: {order.id}</p>

      <Link to="/" className="text-center text-brand-600 font-medium hover:text-brand-700">
        Continue shopping
      </Link>
    </div>
  );
}
