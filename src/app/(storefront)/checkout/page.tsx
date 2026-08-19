'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, cartTotal } from '@/lib/cart-store';
import { formatPrice } from '@/lib/money';
import { loadPaystackScript } from '@/lib/load-paystack';

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const total = cartTotal(items);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.get('customerName'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          address: formData.get('address'),
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong.');

      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!publicKey || publicKey.includes('replace_me')) {
        throw new Error('Payments are not configured yet. Add your Paystack keys to .env.');
      }

      await loadPaystackScript();
      const handler = window.PaystackPop!.setup({
        key: publicKey,
        email: data.email,
        amount: data.amount,
        ref: data.orderId,
        currency: 'GHS',
        callback: () => {
          router.push(`/api/checkout/verify?reference=${data.orderId}`);
        },
        onClose: () => setSubmitting(false),
      });
      handler.openIframe();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-neutral-500">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-neutral-900">Checkout</h1>

      <div className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col gap-1">
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm text-neutral-600">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold text-neutral-900 border-t border-neutral-200 mt-2 pt-2">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <form action={handleSubmit} className="flex flex-col gap-3">
        <input
          name="customerName"
          placeholder="Full name"
          required
          className="border border-neutral-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone number"
          required
          className="border border-neutral-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="border border-neutral-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          name="address"
          placeholder="Delivery address"
          required
          rows={3}
          className="border border-neutral-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-neutral-900 text-white rounded-md py-3 text-sm font-medium hover:bg-neutral-800 disabled:opacity-50"
        >
          {submitting ? 'Processing...' : `Pay ${formatPrice(total)}`}
        </button>
      </form>
    </div>
  );
}
