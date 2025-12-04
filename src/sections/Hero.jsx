import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import AnimatedCounter from "../components/AnimatedCounter";
import Button from "../components/Button";
import { words } from "../constants";
import HeroExperience from "../components/models/hero_models/HeroExperience";

const Hero = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".hero-text h1",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power2.inOut" }
    );
  });

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute top-0 left-0 z-10">
        <img src="/images/bg.png" alt="" />
      </div>

      <div className="hero-layout">
        {/* LEFT: Hero Content */}
        <header className="flex flex-col justify-center w-screen px-5 md:w-full md:px-20">
          <div className="flex flex-col gap-7">
            <div className="hero-text">
              <h3>
                Developing
                <span className="slide">
                  <span className="wrapper">
                    {words.map((word, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 pb-2 md:gap-3"
                      >
                        <img
                          src={word.imgPath}
                          alt="person"
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
             <p className="text-sm md:text-base uppercase tracking-widest text-gray-500 font-semibold">
  Real-World Apps • Actually Used • Production Ready
</p>
            </div>

           <p className="mt-12 text-2xl md:text-3xl lg:text-4xl font-light text-zinc-100">
  I’m{" "}
  <span className="font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
    Tewodiros Fikadu
  </span>
  {" "}— a full-stack alchemist operating from the highlands of Ethiopia,
where ancient wisdom meets tomorrow’s architecture.
</p>

            <Button
              text="See My Work"
              className="h-12 md:w-80 md:h-16 w-60"
              id="counter"
            />
          </div>
        </header>

        {/* RIGHT: 3D Model or Visual */}
        <figure>
          <div className="hero-3d-layout">
            <HeroExperience />
          </div>
        </figure>
      </div>

      <AnimatedCounter />
    </section>
  );
};

export default Hero;