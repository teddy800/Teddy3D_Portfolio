import { useRef, useState, useMemo, memo, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// ─── Project data with categories ────────────────────────────────────────────
const projects = [
  {
    id: 1,
    title: "MESSOB-FMS Fleet Management System",
    desc: "Enterprise-grade fleet management solution with real-time request tracking, approval workflows, and comprehensive dashboard analytics. Built for operational excellence.",
    img: "/images/Fleet.png",
    alt: "MESSOB-FMS Fleet Management System",
    category: "Web",
    tags: ["React", "Node.js", "PostgreSQL", "Real-time"],
    featured: true,
    gradient: "linear-gradient(135deg, #0B4F9F 0%, #1E3A5F 100%)",
    priority: 1,
    github: "https://github.com/teddy800/messob-fms",
    live: "http://localhost:5200/dashboard/requests/status",
  },
  {
    id: 2,
    title: "AgriConnect - Ethiopian Agricultural Marketplace",
    desc: "Revolutionary farming platform connecting Ethiopian farmers directly to markets. Features real-time pricing, weather advisories, and trade facilitation for sustainable agriculture.",
    img: "/images/Agriconnect.png",
    alt: "AgriConnect Agricultural Platform",
    bg: "#E8F5E9",
    category: "Web",
    tags: ["Next.js", "MongoDB", "Real-time API", "Marketplace"],
    featured: true,
    gradient: "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
    priority: 2,
    github: "https://github.com/teddy800/agriconnect",
    live: "http://localhost:5173",
  },
  {
    id: 3,
    title: "Subscription Management System",
    desc: "Ready to Take Control? Join us today and simplify your subscription management.",
    img: "/images/projects/project5.png",
    alt: "Subscription Management System",
    category: "Web",
    tags: ["Next.js", "Stripe", "PostgreSQL"],
    featured: false,
  },
  {
    id: 4,
    title: "BookStore & Library Management Platform",
    img: "/images/projects/project8.png",
    alt: "Library Management Platform",
    bg: "#FFEFDB",
    category: "Web",
    tags: ["React", "Node.js", "MongoDB"],
  },
  {
    id: 5,
    title: "AI-Powered Tutoring System",
    img: "/images/projects/project4.png",
    alt: "AI Tutoring System",
    bg: "#FFE7EB",
    category: "AI",
    tags: ["Python", "OpenAI", "React"],
  },
];

const CATEGORIES = ["All", "Web", "AI", "Mobile"];

// ─── Filter pill button ───────────────────────────────────────────────────────
const FilterBtn = memo(({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`showcase-filter-btn ${active ? "showcase-filter-btn--active" : ""}`}
    aria-pressed={active}
  >
    {label}
    {active && <span className="showcase-filter-btn__dot" />}
  </button>
));
FilterBtn.displayName = "FilterBtn";

// ─── Main component ───────────────────────────────────────────────────────────
const AppShowcase = memo(() => {
  const sectionRef = useRef(null);
  const gridRef    = useRef(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = useMemo(
    () => activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter),
    [activeFilter]
  );

  const handleFilter = useCallback((cat) => {
    if (cat === activeFilter) return;
    // Fade out → swap → fade in
    if (gridRef.current) {
      gsap.to(gridRef.current, {
        opacity: 0, y: 10, duration: 0.2, ease: "power2.in",
        onComplete: () => {
          setActiveFilter(cat);
          gsap.fromTo(gridRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
          );
        },
      });
    } else {
      setActiveFilter(cat);
    }
  }, [activeFilter]);

  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, scrollTrigger: { trigger: sectionRef.current, start: "top 90%", once: true } }
    );
  }, []);

  const featured = filtered.find((p) => p.featured) ?? filtered[0];
  const rest      = filtered.filter((p) => p !== featured);

  // Get both featured projects
  const featuredProjects = filtered.filter((p) => p.featured && p.priority);
  const otherProjects = filtered.filter((p) => !p.featured || !p.priority);

  return (
    <div id="work" ref={sectionRef} className="app-showcase">
      <div className="w-full">
        {/* ── Filter bar ── */}
        <div className="showcase-filters">
          {CATEGORIES.map((cat) => (
            <FilterBtn
              key={cat}
              label={cat}
              active={activeFilter === cat}
              onClick={() => handleFilter(cat)}
            />
          ))}
        </div>

        {/* ── Grid ── */}
        <div ref={gridRef} className="showcaselayout-advanced">
          
          {/* FEATURED PROJECTS - BOTH FLEET & AGRICONNECT */}
          {featuredProjects.length > 0 && (
            <div className="featured-projects-container">
              {featuredProjects.map((project) => (
                <div key={project.id} className="featured-project-card-large showcase-card">
                  <div className="image-wrapper-large" style={project.gradient ? { background: project.gradient } : {}}>
                    <img src={project.img} alt={project.alt} loading="eager" decoding="auto" />
                    
                    {/* Project Links Overlay */}
                    <div className="project-links-overlay">
                      <div className="project-links">
                        {project.github && (
                          <a 
                            href={project.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="project-link-btn github-btn"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            <span>GitHub</span>
                          </a>
                        )}
                        {project.live && (
                          <a 
                            href={project.live} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="project-link-btn live-btn"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span>Live Demo</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="showcase-tags-large">
                      {project.tags?.map((t) => <span key={t} className="showcase-tag-large">{t}</span>)}
                    </div>
                  </div>
                  <div className="text-content-large">
                    <h2>{project.title}</h2>
                    {project.desc && <p className="text-white-50">{project.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* OTHER PROJECTS */}
          {otherProjects.length > 0 && (
            <div className="other-projects-grid">
              {otherProjects.map((p) => (
                <div key={p.id} className="project-card-small showcase-card">
                  <div className="image-wrapper-small relative" style={p.gradient ? { background: p.gradient } : (p.bg ? { background: p.bg } : {})}>
                    <img src={p.img} alt={p.alt} loading="lazy" decoding="async" />
                    <div className="showcase-tags">
                      {p.tags?.map((t) => <span key={t} className="showcase-tag">{t}</span>)}
                    </div>
                    <div className="project-overlay">
                      <span className="view-project-btn">View Details →</span>
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

AppShowcase.displayName = "AppShowcase";
export default AppShowcase;
