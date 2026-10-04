import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// react-router doesn't scroll the viewport on navigation the way a plain
// MPA does — without this, clicking a link while scrolled down (e.g. a
// footer category link) swaps the page content in place and leaves the
// scroll position untouched.
export function ScrollToTop() {
  const { pathname, search } = useLocation();
  const prevPathname = useRef(pathname);
  const prevSearch = useRef(search);

  useEffect(() => {
    const pathnameChanged = pathname !== prevPathname.current;
    const searchChanged = search !== prevSearch.current;
    prevPathname.current = pathname;
    prevSearch.current = search;

    if (!pathnameChanged && !searchChanged) {
      // Nothing actually navigated — either the very first render, or (in
      // dev) React StrictMode replaying this effect a second time on
      // mount. Either way, leave the starting scroll position alone. A
      // one-shot "first render" flag doesn't survive that replay, so this
      // compares real location values instead.
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth';

    if (pathnameChanged) {
      window.scrollTo({ top: 0, behavior });
      return;
    }

    // Same page (e.g. a "Shop" category link only changes ?category=…) —
    // jump straight to the products grid instead of all the way past the hero.
    const products = document.getElementById('products');
    if (products) {
      products.scrollIntoView({ behavior, block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
  }, [pathname, search]);

  return null;
}
