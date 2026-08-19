import { Link } from 'react-router-dom';

const CATEGORY_LINKS = [
  { label: 'AirPods', slug: 'airpods' },
  { label: 'Ring Lights', slug: 'ring-lights' },
  { label: 'Keyboards', slug: 'keyboards' },
  { label: 'Tripods', slug: 'tripods' },
];

export function Footer() {
  return (
    <footer className="bg-ink text-neutral-300 mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-3">
          <span className="font-display font-extrabold text-white text-lg">Success Enterprise</span>
          <p className="text-sm text-neutral-400 sm:max-w-[24ch]">
            IT and content-creation accessories for students, creators, and professionals across Ghana.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Shop</span>
          <nav className="flex flex-col gap-2 text-sm">
            {CATEGORY_LINKS.map((c) => (
              <Link key={c.slug} to={`/?category=${c.slug}`} className="hover:text-white transition-colors">
                {c.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Support</span>
          <div className="flex flex-col gap-2 text-sm">
            <span>Questions? Reach us on WhatsApp or by phone.</span>
            <Link to="/cart" className="hover:text-white transition-colors">
              Your cart
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Payment</span>
          <p className="text-sm text-neutral-400">Secure checkout via Paystack — Mobile Money &amp; card.</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-xs text-neutral-500">
          © {new Date().getFullYear()} Success Enterprise. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
