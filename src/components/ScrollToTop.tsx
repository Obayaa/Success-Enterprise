import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// react-router doesn't scroll the viewport on navigation the way a plain
// MPA does — without this, clicking a link while scrolled down (e.g. a
// footer category link) swaps the page content in place and leaves the
// scroll position untouched.
export function ScrollToTop() {
  const { pathname, search } = useLocation();
  const prevPathname = useRef(pathname);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // Leave the initial scroll position alone — this effect is for
      // in-app navigation, not the very first page load.
      isFirstRender.current = false;
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth';
    const navigatedToNewPage = pathname !== prevPathname.current;
    prevPathname.current = pathname;

    if (navigatedToNewPage) {
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
