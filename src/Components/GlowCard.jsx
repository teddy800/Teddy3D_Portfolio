import { useRef, useCallback, memo } from "react";

const GlowCard = memo(({ card, index, children }) => {
  const cardRef = useRef(null);

  // Throttled to ~60fps — no angle calc on every pixel
  const handleMouseMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    let angle = (Math.atan2(mouseY, mouseX) * (180 / Math.PI) + 360) % 360;
    el.style.setProperty("--start", angle + 60);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="p-10 mb-5 card card-border timeline-card rounded-xl break-inside-avoid-column"
    >
      <div className="glow" />
      {children}
      <p className="mt-5 text-white-50 text-lg font-light">{card.review}</p>
    </div>
  );
});

GlowCard.displayName = "GlowCard";
export default GlowCard;
