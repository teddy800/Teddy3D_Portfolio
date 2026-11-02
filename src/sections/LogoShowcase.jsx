import { memo } from "react";
import { logoIconsList } from "../constants";
import { useInView } from "../hooks/useInView";

const LogoIcon = memo(({ icon, index }) => (
  <div className="flex-none flex-center marquee-item">
    <img src={icon.imgPath} alt={`company logo ${index + 1}`} loading="lazy" decoding="async" />
  </div>
));

LogoIcon.displayName = "LogoIcon";

const LogoShowcase = memo(() => {
  const [ref, inView] = useInView({ rootMargin: "100px" });

  // Split logos into two rows for alternating effect
  const midPoint = Math.ceil(logoIconsList.length / 2);
  const row1Logos = logoIconsList.slice(0, midPoint);
  const row2Logos = logoIconsList.slice(midPoint);

  return (
    <div className="relative my-10 md:my-20" ref={ref}>
      {/* Row 1 - Right to Left */}
      <div className="relative mb-2">
        <div className="gradient-edge" />
        <div className="gradient-edge" />
        <div className="marquee h-28 md:h-36">
          <div
            className="gap-5 marquee-box marquee-rtl md:gap-12"
            style={{ animationPlayState: inView ? "running" : "paused" }}
          >
            {row1Logos.map((icon, index) => (
              <LogoIcon key={`row1-a-${index}`} icon={icon} index={index} />
            ))}
            {row1Logos.map((icon, index) => (
              <LogoIcon key={`row1-b-${index}`} icon={icon} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 - Left to Right (Opposite Direction) */}
      <div className="relative">
        <div className="gradient-edge" />
        <div className="gradient-edge" />
        <div className="marquee h-28 md:h-36">
          <div
            className="gap-5 marquee-box marquee-ltr md:gap-12"
            style={{ animationPlayState: inView ? "running" : "paused" }}
          >
            {row2Logos.map((icon, index) => (
              <LogoIcon key={`row2-a-${index}`} icon={icon} index={index} />
            ))}
            {row2Logos.map((icon, index) => (
              <LogoIcon key={`row2-b-${index}`} icon={icon} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

LogoShowcase.displayName = "LogoShowcase";
export default LogoShowcase;
