import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { memo } from "react";

import AnimatedCounter from "../Components/AnimatedCounter";
import Button from "../Components/Button";
import { words } from "../constants";
import HeroExperience from "../Components/models/hero_models/HeroExperience";

const Hero = memo(() => {
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".hero-badge",   { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo(".hero-text h1, .hero-text h3, .hero-text h4",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.8 }, "-=0.3")
      .fromTo(".hero-desc",    { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.4")
      .fromTo(".hero-cta",     { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3")
      .fromTo(".hero-stats",   { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.2");
  });

  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 z-10 pointer-events-none">
        <img src="/images/bg.png" alt="" aria-hidden="true" />
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
