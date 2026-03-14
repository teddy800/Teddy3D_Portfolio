import { useEffect, useRef, memo } from "react";

// Glowing custom cursor with smooth trailing dot — GPU composited, zero layout impact
const CursorTrail = memo(() => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const dot = useRef({ x: -100, y: -100 });
  const rafId = useRef(null);

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onEnterLink = () => cursorRef.current?.classList.add("cursor-hover");
    const onLeaveLink = () => cursorRef.current?.classList.remove("cursor-hover");

    window.addEventListener("mousemove", onMove, { passive: true });

    // Add hover effect to all interactive elements
    const links = document.querySelectorAll("a, button, [role='button'], .group");
    links.forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    const animate = () => {
      // Smooth lerp for trailing dot
      dot.current.x += (pos.current.x - dot.current.x) * 0.12;
      dot.current.y += (pos.current.y - dot.current.y) * 0.12;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x - 20}px, ${pos.current.y - 20}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dot.current.x - 4}px, ${dot.current.y - 4}px)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      links.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeaveLink);
      });
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      {/* Outer glow ring */}
      <div
        ref={cursorRef}
        className="cursor-ring"
        aria-hidden="true"
      />
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="cursor-dot"
        aria-hidden="true"
      />
    </>
  );
});

CursorTrail.displayName = "CursorTrail";
export default CursorTrail;
