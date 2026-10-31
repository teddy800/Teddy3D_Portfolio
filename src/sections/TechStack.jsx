import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { memo, Suspense, useMemo, useEffect } from "react";

import TitleHeader from "../Components/TitleHeader";
import TechIconCardExperience, { preloadTechModels } from "../Components/models/tech_logos/TechIconCardExperience";
import { techStackIcons } from "../constants";
import { useInView } from "../hooks/useInView";

gsap.registerPlugin(ScrollTrigger);

// Ultra-fast placeholder with gradient animation
const CardPlaceholder = () => (
  <div className="w-52 h-60 flex items-center justify-center bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-lg backdrop-blur-sm">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 animate-pulse" />
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-400/20 animate-ping" style={{ animationDuration: '2s' }} />
    </div>
  </div>
);

const TechCard = memo(({ techStackIcon, index }) => {
  const [ref, inView] = useInView({ rootMargin: "400px" }); // Increased margin for earlier loading

  return (
    <div
      ref={ref}
      data-tech={techStackIcon.name}
      className="card-border tech-card overflow-hidden group xl:rounded-full rounded-lg transform transition-all duration-300 hover:scale-105"
      style={{
        animation: inView ? `fadeInUp 0.4s ease-out ${index * 0.05}s both` : "none", // Faster animation
      }}
    >
      <div className="tech-card-animated-bg" />
      <div className="tech-card-content">
        <div className="tech-icon-wrapper">
          {inView ? (
            <Suspense fallback={<CardPlaceholder />}>
              <TechIconCardExperience model={techStackIcon} />
            </Suspense>
          ) : (
            <CardPlaceholder />
          )}
        </div>
        <div className="padding-x w-full">
          <p className="transition-colors duration-300">{techStackIcon.name}</p>
        </div>
      </div>
    </div>
  );
});

TechCard.displayName = "TechCard";

const TechStack = memo(() => {
  // Memoize cards to prevent unnecessary re-renders
  const memoizedCards = useMemo(
    () => techStackIcons.map((icon, idx) => ({ ...icon, id: `${icon.name}-${idx}` })),
    []
  );

  // Preload all 3D models immediately for instant rendering
  useEffect(() => {
    preloadTechModels(memoizedCards);
  }, [memoizedCards]);

  useGSAP(() => {
    gsap.fromTo(
      ".tech-card",
      { y: 30, opacity: 0 }, // Reduced distance for faster animation
      {
        y: 0,
        opacity: 1,
        duration: 0.5, // Faster duration
        ease: "power2.out", // Snappier easing
        stagger: 0.04, // Reduced stagger for quicker appearance
        scrollTrigger: {
          trigger: "#skills",
          start: "top 80%", // Start earlier
          once: true,
          fastScrollEnd: true,
        },
      }
    );
  });

  return (
    <div id="skills" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="How I Can Contribute & My Key Skills"
          sub="🤝 What I Bring to the Table"
        />
        <div className="tech-grid">
          {memoizedCards.map((techStackIcon, idx) => (
            <TechCard key={techStackIcon.id} techStackIcon={techStackIcon} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
});

TechStack.displayName = "TechStack";
export default TechStack;
