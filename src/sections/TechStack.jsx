import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { memo, Suspense, useMemo } from "react";

import TitleHeader from "../Components/TitleHeader";
import TechIconCardExperience from "../Components/models/tech_logos/TechIconCardExperience";
import { techStackIcons } from "../constants";
import { useInView } from "../hooks/useInView";

gsap.registerPlugin(ScrollTrigger);

const CardPlaceholder = () => (
  <div className="w-52 h-60 flex items-center justify-center">
    <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
  </div>
);

const TechCard = memo(({ techStackIcon, index }) => {
  const [ref, inView] = useInView({ rootMargin: "300px" });

  return (
    <div
      ref={ref}
      className="card-border tech-card overflow-hidden group xl:rounded-full rounded-lg"
      style={{
        animation: inView ? `fadeInUp 0.6s ease-out ${index * 0.1}s both` : "none",
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
          <p>{techStackIcon.name}</p>
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

  useGSAP(() => {
    gsap.fromTo(
      ".tech-card",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.inOut",
        stagger: 0.08,
        scrollTrigger: {
          trigger: "#skills",
          start: "top center",
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
