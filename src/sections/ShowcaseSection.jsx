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
