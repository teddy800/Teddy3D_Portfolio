// Advanced IntersectionObserver hook — mounts heavy components only when visible
import { useState, useEffect, useRef } from "react";

export function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  // Stringify options so the effect only re-runs when values actually change
  const optionsKey = JSON.stringify(options);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          // Once visible, stop observing — no need to watch anymore
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "200px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey]);

  return [ref, inView];
}
