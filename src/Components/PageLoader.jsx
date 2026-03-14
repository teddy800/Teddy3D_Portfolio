import { useState, useEffect, useRef, memo } from "react";

const NAME = "Tewodiros";
const SUBTITLE = "Full-Stack Developer";

// Tiny floating particle
const Particle = memo(({ style }) => (
  <span className="loader-particle" style={style} aria-hidden="true" />
));
Particle.displayName = "Particle";

const PageLoader = memo(({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving]   = useState(false);
  const particles = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      left:  `${Math.random() * 100}%`,
      top:   `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2.5 + Math.random() * 3}s`,
      width:  `${2 + Math.random() * 3}px`,
      height: `${2 + Math.random() * 3}px`,
      opacity: 0.15 + Math.random() * 0.35,
    }))
  );

  useEffect(() => {
    const steps = [15, 35, 58, 78, 92, 100];
    let i = 0;
    const tick = () => {
      if (i < steps.length) {
        setProgress(steps[i++]);
        setTimeout(tick, 280 + Math.random() * 180);
      } else {
        setTimeout(() => {
          setLeaving(true);
          setTimeout(onComplete, 650);
        }, 250);
      }
    };
    setTimeout(tick, 80);
  }, [onComplete]);

  return (
    <div
      className={`page-loader ${leaving ? "page-loader--leaving" : ""}`}
      aria-label="Loading portfolio"
      role="status"
    >
      {/* Ambient particles */}
      {particles.current.map((p, i) => (
        <Particle key={i} style={p} />
      ))}

      {/* Radial glow */}
      <div className="loader-glow" aria-hidden="true" />

      <div className="page-loader__content">
        {/* Animated name */}
        <div className="page-loader__name" aria-label={NAME}>
          {NAME.split("").map((ch, i) => (
            <span
              key={i}
              className="page-loader__letter"
              style={{ animationDelay: `${i * 55}ms` }}
            >
              {ch}
            </span>
          ))}
        </div>

        <p className="page-loader__subtitle">{SUBTITLE}</p>

        {/* Progress bar */}
        <div className="page-loader__bar-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="page-loader__bar-fill" style={{ width: `${progress}%` }} />
        </div>

        <p className="page-loader__percent">{progress}%</p>
      </div>
    </div>
  );
});

PageLoader.displayName = "PageLoader";
export default PageLoader;
