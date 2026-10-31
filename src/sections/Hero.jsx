import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { memo, useEffect, useRef } from "react";

import AnimatedCounter from "../Components/AnimatedCounter";
import Button from "../Components/Button";
import { words } from "../constants";
import HeroExperience from "../Components/models/hero_models/HeroExperience";
import { rafScheduler } from "../utils/advancedPerformance";

const Hero = memo(() => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // Ultra-fast timeline with optimized easing
    const tl = gsap.timeline({ 
      defaults: { 
        ease: "power2.out", // Snappier easing
        duration: 0.4, // Faster default duration
      } 
    });
    
    tl.fromTo(".hero-badge",   { y: 15, opacity: 0 }, { y: 0, opacity: 1 })
      .fromTo(".hero-text h1, .hero-text h3, .hero-text h4",
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 }, "-=0.2")
      .fromTo(".hero-desc",    { y: 15, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.3")
      .fromTo(".hero-cta",     { y: 15, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.2")
      .fromTo(".hero-stats",   { y: 15, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.15");
  });

  // Preload hero images with RAF scheduler
  useEffect(() => {
    rafScheduler.schedule('hero-preload', () => {
      const bgImg = new Image();
      bgImg.src = '/images/bg.png';
      bgImg.decoding = 'async';
      bgImg.fetchPriority = 'high';
    }, 'high');
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="relative overflow-x-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 z-10 pointer-events-none w-full h-full">
        <img 
          src="/images/bg.png" 
          alt="" 
          aria-hidden="true"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div className="hero-layout">
        {/* LEFT: Hero Content */}
        <header className="flex flex-col justify-center w-screen px-5 md:w-full md:px-20">
          <div className="flex flex-col gap-7">
            {/* Status badge */}
            <div className="hero-badge flex items-center gap-2 w-fit">
              <span className="hero-badge__dot" aria-hidden="true" />
              <span className="text-xs md:text-sm text-white/60 tracking-widest uppercase">
                Available for work
              </span>
            </div>

            <div className="hero-text">
              <h3>
                Developing
                <span className="slide">
                  <span className="wrapper">
                    {words.map((word, index) => (
                      <span key={index} className="flex items-center gap-1 pb-2 md:gap-3">
                        <img
                          src={word.imgPath}
                          alt={word.text}
                          loading="eager"
                          decoding="async"
                          className="p-1 rounded-full xl:size-12 md:size-10 size-7 md:p-2 bg-white-50"
                        />
                        <span>{word.text}</span>
                      </span>
                    ))}
                  </span>
                </span>
              </h3>
              <h4>Building Real-World Apps</h4>
              <h4>That Actually Get Used</h4>
            </div>

            <p className="hero-desc mt-4 text-xl md:text-2xl lg:text-3xl font-light text-zinc-100 max-w-xl leading-relaxed">
              I&apos;m{" "}
              <span className="font-black gradient-text">Tewodiros Fikadu</span>
              {" "}— a full-stack alchemist from Ethiopia, turning ideas into
              production-grade digital experiences.
            </p>

            <div className="hero-cta flex flex-wrap gap-4 items-center">
              <Button text="See My Work" className="h-12 md:w-60 md:h-14 w-52" id="counter" />
              <a
                href="#contact"
                className="hero-ghost-btn"
              >
                Let&apos;s Talk
              </a>
            </div>
          </div>
        </header>

        {/* RIGHT: 3D Model */}
        <figure>
          <div className="hero-3d-layout">
            <HeroExperience />
          </div>
        </figure>
      </div>

      <div className="hero-stats">
        <AnimatedCounter />
      </div>
    </section>
  );
});

Hero.displayName = "Hero";
export default Hero;
