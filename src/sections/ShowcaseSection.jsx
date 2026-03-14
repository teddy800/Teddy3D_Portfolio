import { useRef, useState, useMemo, memo, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// ─── Project data with categories ────────────────────────────────────────────
const projects = [
  {
    id: 1,
    title: "Subscription Management System",
    desc: "Ready to Take Control? Join us today and simplify your subscription management.",
    img: "/images/projects/project5.png",
    alt: "Subscription Management System",
    category: "Web",
    tags: ["Next.js", "Stripe", "PostgreSQL"],
    featured: true,
  },
  {
    id: 2,
    title: "BookStore & Library Management Platform",
    img: "/images/projects/project8.png",
    alt: "Library Management Platform",
    bg: "#FFEFDB",
    category: "Web",
    tags: ["React", "Node.js", "MongoDB"],
  },
  {
    id: 3,
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
        <div ref={gridRef} className="showcaselayout">
          {/* Featured / first project */}
          {featured ? (
            <div className="first-project-wrapper showcase-card">
              <div className="image-wrapper">
                <img src={featured.img} alt={featured.alt} loading="lazy" decoding="async" />
                {/* Tags overlay */}
                <div className="showcase-tags">
                  {featured.tags?.map((t) => <span key={t} className="showcase-tag">{t}</span>)}
                </div>
              </div>
              <div className="text-content">
                <h2>{featured.title}</h2>
                {featured.desc && <p className="text-white-50 md:text-xl">{featured.desc}</p>}
              </div>
            </div>
          ) : (
            <div className="first-project-wrapper flex items-center justify-center text-white-50 text-lg">
              No projects in this category yet.
            </div>
          )}

          {/* Side list */}
          <div className="overflow-hidden project-list-wrapper">
            {rest.length > 0 ? rest.map((p) => (
              <div key={p.id} className="project showcase-card">
                <div className="image-wrapper relative" style={p.bg ? { background: p.bg } : {}}>
                  <img src={p.img} alt={p.alt} loading="lazy" decoding="async" />
                  <div className="showcase-tags">
                    {p.tags?.map((t) => <span key={t} className="showcase-tag">{t}</span>)}
                  </div>
                </div>
                <h2>{p.title}</h2>
              </div>
            )) : (
              <div className="flex items-center justify-center h-full text-white-50 text-sm py-10">
                No other projects in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

AppShowcase.displayName = "AppShowcase";
export default AppShowcase;
