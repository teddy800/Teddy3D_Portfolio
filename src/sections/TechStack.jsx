import { memo, Suspense, useMemo, useEffect } from "react";

import TitleHeader from "../Components/TitleHeader";
import TechIconCardExperience, { preloadTechModels } from "../Components/models/tech_logos/TechIconCardExperience";
import { techStackIcons } from "../constants";
import { useInView } from "../hooks/useInView";

// Simple placeholder
const CardPlaceholder = () => (
  <div className="w-full h-full flex items-center justify-center bg-slate-800/20 rounded-lg">
    <div className="w-12 h-12 rounded-full bg-slate-700/40 animate-pulse" />
  </div>
);

const TechCard = memo(({ techStackIcon }) => {
  const [ref, inView] = useInView({ rootMargin: "200px" });

  return (
    <div
      ref={ref}
      data-tech={techStackIcon.name}
      className="card-border tech-card overflow-hidden group xl:rounded-full rounded-lg"
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

// Featured Project Card Component
const FeaturedProjectCard = memo(({ project }) => {
  const [ref, inView] = useInView({ rootMargin: "200px" });

  return (
    <div
      ref={ref}
      className="featured-project-card card-border overflow-hidden group rounded-xl"
      style={{ opacity: inView ? 1 : 0, transition: "opacity 0.5s ease" }}
    >
      <div className="featured-project-image-wrapper">
        <img src={project.img} alt={project.title} loading="lazy" />
        <div className="featured-project-overlay">
          <div className="featured-project-badge">{project.badge}</div>
        </div>
      </div>
      <div className="featured-project-content">
        <h3 className="featured-project-title">{project.title}</h3>
        <div className="featured-project-tags">
          {project.tags.map((tag, idx) => (
            <span key={idx} className="featured-project-tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
});

FeaturedProjectCard.displayName = "FeaturedProjectCard";

const TechStack = memo(() => {
  const memoizedCards = useMemo(
    () => techStackIcons.map((icon, idx) => ({ ...icon, id: `${icon.name}-${idx}` })),
    []
  );

  const featuredProjects = useMemo(() => [
    {
      id: 1,
      title: "MESSOB-FMS Fleet Management",
      img: "/images/Fleet.png",
      badge: "🚗 Enterprise System",
      tags: ["React", "Node.js", "PostgreSQL", "Real-time"],
    },
    {
      id: 2,
      title: "AgriConnect Marketplace",
      img: "/images/Agriconnect.png",
      badge: "🌾 Agricultural Platform",
      tags: ["Next.js", "MongoDB", "API Integration"],
    },
  ], []);

  useEffect(() => {
    preloadTechModels(memoizedCards);
  }, [memoizedCards]);

  return (
    <div id="skills" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="How I Can Contribute & My Key Skills"
          sub="🤝 What I Bring to the Table"
        />
        
        {/* Tech Stack Grid */}
        <div className="tech-grid">
          {memoizedCards.map((techStackIcon) => (
            <TechCard key={techStackIcon.id} techStackIcon={techStackIcon} />
          ))}
        </div>

        {/* Featured Projects Section - OUTSTANDING DISPLAY */}
        <div className="mt-24 md:mt-32">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
              <span className="text-cyan-400 font-bold text-sm uppercase tracking-wider">✨ Featured Projects</span>
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
              Built With These Technologies 🚀
            </h3>
            <p className="text-white-50 text-base md:text-lg max-w-2xl mx-auto">
              Real-world enterprise applications showcasing my full-stack expertise
            </p>
          </div>
          <div className="featured-projects-grid">
            {featuredProjects.map((project) => (
              <FeaturedProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

TechStack.displayName = "TechStack";
export default TechStack;
