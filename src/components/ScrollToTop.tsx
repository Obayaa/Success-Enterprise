import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// react-router doesn't scroll the viewport on navigation the way a plain
// MPA does — without this, clicking a link while scrolled down (e.g. a
// footer category link) swaps the page content in place and leaves the
// scroll position untouched.
export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}
