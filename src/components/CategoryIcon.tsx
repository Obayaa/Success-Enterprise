const ICONS: Record<string, React.ReactNode> = {
  airpods: <path d="M8 4a3 3 0 0 1 3 3v9a3 3 0 1 1-3-3V7a3 3 0 0 1 3-3Zm8 0a3 3 0 0 0-3 3v9a3 3 0 1 0 3-3V7a3 3 0 0 0-3-3Z" strokeLinejoin="round" />,
  microphones: <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 1 1-6 0V5a3 3 0 0 1 3-3Zm-6 9a6 6 0 0 0 12 0M12 17v4m-3 0h6" strokeLinecap="round" />,
  'ring-lights': <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />,
  'phone-covers': <path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm2 16h4" />,
  'phone-holders': <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" strokeLinejoin="round" />,
  'laptop-accessories': <path d="M4 5h16v10H4V5Zm-2 14h20l-2-4H4l-2 4Z" strokeLinejoin="round" />,
  keyboards: <path d="M3 6h18v12H3V6Zm3 3h.01M9 9h.01M12 9h.01M15 9h.01M18 9h.01M6 12h.01M9 12h.01M12 12h.01M15 12h.01M18 12h.01M8 15h8" />,
  mice: <path d="M12 3a6 6 0 0 1 6 6v6a6 6 0 1 1-12 0V9a6 6 0 0 1 6-6Zm0 0v6" strokeLinejoin="round" />,
  tripods: <path d="M12 3v10m0 0-6 8m6-8 6 8M6 21h12" strokeLinecap="round" />,
  speakers: <path d="M11 5 6 9H2v6h4l5 4V5Z M15.5 8.5a5 5 0 0 1 0 7 M18.5 5.5a9 9 0 0 1 0 13" strokeLinejoin="round" />,
  smartwatches: <path d="M8 6h8v3a4 4 0 0 1 0 6v3H8v-3a4 4 0 0 1 0-6V6Z M12 10v2l1.5 1" strokeLinejoin="round" />,
  'security-cameras': <path d="M3 7h11v10H3V7Z M14 10l7-4v12l-7-4Z" strokeLinejoin="round" />,
  routers: <path d="M5 13a10 10 0 0 1 14 0 M8.5 16.5a5 5 0 0 1 7 0 M12 20h.01" />,
  headphones: <path d="M3 14v-3a9 9 0 1 1 18 0v3 M21 14v4a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z M3 14v4a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3Z" strokeLinejoin="round" />,
  lamps: <path d="M7 3h10l-3 6h-4L7 3Z M12 9v9 M8 21h8" strokeLinejoin="round" />,
  'gadgets-toys': <path d="M12 2 2 7l10 5 10-5-10-5Z M2 17l10 5 10-5 M2 12l10 5 10-5" strokeLinejoin="round" />,
};

const DEFAULT = <path d="M4 7h16v13H4V7Zm0 0 3-4h10l3 4" strokeLinejoin="round" />;

export function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      className={className}
    >
      {ICONS[slug] ?? DEFAULT}
    </svg>
  );
}
