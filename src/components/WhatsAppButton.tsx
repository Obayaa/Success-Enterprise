const WHATSAPP_URL =
  'https://wa.me/233532862478?text=' +
  encodeURIComponent("Hi! I have a question about a product on your website.");

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12.04 2c-5.5 0-10 4.5-10 10 0 1.76.46 3.48 1.34 5L2 22l5.14-1.35A9.96 9.96 0 0 0 12.04 22c5.5 0 10-4.5 10-10s-4.5-10-10-10Zm0 18.2a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-3.05.8.82-2.97-.2-.3a8.2 8.2 0 1 1 6.9 3.79Zm4.5-6.14c-.25-.12-1.45-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.15.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.24-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.85.83-.85 2.02s.87 2.35.99 2.51c.12.16 1.71 2.6 4.14 3.65.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.45-.59 1.65-1.17.2-.57.2-1.06.14-1.17-.06-.11-.22-.17-.47-.29Z" />
      </svg>
    </a>
  );
}
