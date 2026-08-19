export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white mt-12">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-neutral-500">
        <p>© {new Date().getFullYear()} Success Enterprise. All rights reserved.</p>
        <p>Questions? Reach us on WhatsApp or by phone.</p>
      </div>
    </footer>
  );
}
