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

// Featured Project Card Component - ENHANCED
const FeaturedProjectCard = memo(({ project }) => {
  const [ref, inView] = useInView({ rootMargin: "200px" });

  return (
    <div
      ref={ref}
      className="featured-project-card card-border overflow-hidden group rounded-2xl"
      style={{ 
        opacity: inView ? 1 : 0, 
        transition: "opacity 0.5s ease",
        borderColor: `${project.color}40`
      }}
    >
      <div className="featured-project-image-wrapper">
        <img src={project.img} alt={project.title} loading="eager" />
        <div className="featured-project-overlay"></div>
        <div className="featured-project-badge">{project.badge}</div>
      </div>
      <div className="featured-project-content">
        <h3 className="featured-project-title">{project.title}</h3>
        <p className="featured-project-description">{project.description}</p>
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
      badge: "🚗 Enterprise Fleet System",
      tags: ["React", "Node.js", "PostgreSQL", "Real-time"],
      description: "Advanced fleet management with request tracking, approval workflows, and comprehensive analytics",
      color: "#0B4F9F",
    },
    {
      id: 2,
      title: "AgriConnect Marketplace",
      img: "/images/Agriconnect.png",
      badge: "🌾 Agricultural Platform",
      tags: ["Next.js", "MongoDB", "API Integration"],
      description: "Revolutionary farming platform connecting Ethiopian farmers to markets with real-time pricing",
      color: "#2E7D32",
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
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-2 border-cyan-500/40 backdrop-blur-sm">
              <span className="text-2xl">💼</span>
              <span className="text-cyan-400 font-black text-base uppercase tracking-widest">Featured Projects</span>
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                Real-World Applications
              </span>
            </h3>
            <p className="text-white-50 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Enterprise-grade systems showcasing <span className="text-cyan-400 font-bold">full-stack expertise</span>, 
              <span className="text-emerald-400 font-bold"> modern architecture</span>, and 
              <span className="text-purple-400 font-bold"> scalable solutions</span>
            </p>
          </div>
          
          {/* Project Cards */}
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
