import { useState, useEffect, memo } from "react";

const PageLoader = memo(({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Simulate asset loading progress
    const steps = [20, 45, 70, 88, 100];
    let i = 0;
    const tick = () => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
        setTimeout(tick, 300 + Math.random() * 200);
      } else {
        setTimeout(() => {
          setLeaving(true);
          setTimeout(onComplete, 700);
        }, 300);
      }
    };
    setTimeout(tick, 100);
  }, [onComplete]);

  return (
    <div className={`page-loader ${leaving ? "page-loader--leaving" : ""}`} aria-label="Loading">
      <div className="page-loader__content">
        {/* Animated logo / name */}
        <div className="page-loader__name">
          <span className="page-loader__letter" style={{ animationDelay: "0ms" }}>T</span>
          <span className="page-loader__letter" style={{ animationDelay: "60ms" }}>e</span>
          <span className="page-loader__letter" style={{ animationDelay: "120ms" }}>w</span>
          <span className="page-loader__letter" style={{ animationDelay: "180ms" }}>o</span>
          <span className="page-loader__letter" style={{ animationDelay: "240ms" }}>d</span>
          <span className="page-loader__letter" style={{ animationDelay: "300ms" }}>i</span>
          <span className="page-loader__letter" style={{ animationDelay: "360ms" }}>r</span>
          <span className="page-loader__letter" style={{ animationDelay: "420ms" }}>o</span>
          <span className="page-loader__letter" style={{ animationDelay: "480ms" }}>s</span>
        </div>

        <p className="page-loader__subtitle">Full-Stack Developer</p>

        {/* Progress bar */}
        <div className="page-loader__bar-track">
          <div
            className="page-loader__bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="page-loader__percent">{progress}%</p>
      </div>
    </div>
  );
});

PageLoader.displayName = "PageLoader";
export default PageLoader;
