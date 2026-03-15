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

  return (
    <div className="relative my-10 md:my-20" ref={ref}>
      <div className="gradient-edge" />
      <div className="gradient-edge" />
      <div className="marquee h-52">
        {/* Pause CSS animation when not in viewport — zero GPU cost off-screen */}
        <div
          className="gap-5 marquee-box md:gap-12"
          style={{ animationPlayState: inView ? "running" : "paused" }}
        >
          {logoIconsList.map((icon, index) => (
            <LogoIcon key={`a-${index}`} icon={icon} index={index} />
          ))}
          {logoIconsList.map((icon, index) => (
            <LogoIcon key={`b-${index}`} icon={icon} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
});

LogoShowcase.displayName = "LogoShowcase";
export default LogoShowcase;
