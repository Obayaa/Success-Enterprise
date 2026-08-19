const ICONS: Record<string, React.ReactNode> = {
  phones: (
    <path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm2 16h4" />
  ),
  'phone-accessories': (
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" strokeLinejoin="round" />
  ),
  laptops: (
    <path d="M4 5h16v10H4V5Zm-2 14h20l-2-4H4l-2 4Z" strokeLinejoin="round" />
  ),
  'laptop-accessories': (
    <path d="M12 2a5 5 0 0 1 5 5v6a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5Zm0 0v6m-5 1h10" />
  ),
  airpods: (
    <path d="M8 4a3 3 0 0 1 3 3v9a3 3 0 1 1-3-3V7a3 3 0 0 1 3-3Zm8 0a3 3 0 0 0-3 3v9a3 3 0 1 0 3-3V7a3 3 0 0 0-3-3Z" strokeLinejoin="round" />
  ),
  'airpods-cases': (
    <path d="M6 10a6 6 0 0 1 12 0v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6Zm3 0v-1a3 3 0 0 1 6 0v1" />
  ),
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
