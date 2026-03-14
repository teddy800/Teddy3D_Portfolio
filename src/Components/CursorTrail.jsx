import { useEffect, useRef, memo } from "react";

// Glowing custom cursor — GPU composited, zero layout impact, re-scans DOM on mutation
const CursorTrail = memo(() => {
  const ringRef = useRef(null);
  const dotRef  = useRef(null);
  const pos     = useRef({ x: -200, y: -200 });
  const dot     = useRef({ x: -200, y: -200 });
  const rafId   = useRef(null);
  const hovered = useRef(false);

  useEffect(() => {
    // Touch devices — bail out entirely
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const ring = ringRef.current;
    const dotEl = dotRef.current;
    if (!ring || !dotEl) return;

    // ── Mouse tracking ──────────────────────────────────────────
    const onMove = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove, { passive: true });

    // ── Hover detection via event delegation ────────────────────
    const SELECTOR = "a, button, [role='button'], input, textarea, select, label, .group, [data-cursor]";
    const onEnter = (e) => { if (e.target.closest(SELECTOR)) { hovered.current = true;  ring.classList.add("cursor-hover"); } };
    const onLeave = (e) => { if (e.target.closest(SELECTOR)) { hovered.current = false; ring.classList.remove("cursor-hover"); } };
    document.addEventListener("mouseover",  onEnter, { passive: true });
    document.addEventListener("mouseout",   onLeave, { passive: true });

    // ── Click ripple ─────────────────────────────────────────────
    const onClick = () => {
      ring.classList.add("cursor-click");
      setTimeout(() => ring.classList.remove("cursor-click"), 300);
    };
    window.addEventListener("click", onClick, { passive: true });

    // ── RAF animation loop ───────────────────────────────────────
    const lerp = (a, b, t) => a + (b - a) * t;
    const animate = () => {
      dot.current.x = lerp(dot.current.x, pos.current.x, 0.14);
      dot.current.y = lerp(dot.current.y, pos.current.y, 0.14);

      ring.style.transform  = `translate(${pos.current.x - 20}px, ${pos.current.y - 20}px)`;
      dotEl.style.transform = `translate(${dot.current.x - 4}px, ${dot.current.y - 4}px)`;

      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout",  onLeave);
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
    </>
  );
});

CursorTrail.displayName = "CursorTrail";
export default CursorTrail;
