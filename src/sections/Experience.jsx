import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { memo } from "react";

import { expCards } from "../constants";
import TitleHeader from "../Components/TitleHeader";
import GlowCard from "../Components/GlowCard";

gsap.registerPlugin(ScrollTrigger);

const Experience = memo(() => {
  useGSAP(() => {
    gsap.utils.toArray(".timeline-card").forEach((card) => {
      gsap.from(card, {
        xPercent: -100,
        opacity: 0,
        transformOrigin: "left left",
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          once: true,
          fastScrollEnd: true,
        },
      });
    });

    gsap.to(".timeline", {
      transformOrigin: "bottom bottom",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".timeline",
        start: "top center",
        end: "70% center",
        fastScrollEnd: true,
        onUpdate: (self) => {
          gsap.set(".timeline", { scaleY: 1 - self.progress });
        },
      },
    });

    gsap.utils.toArray(".expText").forEach((text) => {
      gsap.from(text, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: text,
          start: "top 60%",
          once: true,
          fastScrollEnd: true,
        },
      });
    }, "<");
  }, []);

  return (
    <section
      id="experience"
      className="mt-20 flex-center md:mt-40 section-padding xl:px-0"
    >
      <div className="w-full h-full px-5 md:px-20">
        <TitleHeader
          title="Professional Work Experience"
          sub="💼 My Career Overview"
        />
        <div className="relative mt-32">
          <div className="relative z-50 space-y-10 xl:space-y-32">
            {expCards.map((card) => (
              <div key={card.title} className="exp-card-wrapper">
                <div className="xl:w-2/6">
                  <GlowCard card={card}>
                    <div>
                      <img src={card.imgPath} alt="exp-img" />
                    </div>
                  </GlowCard>
                </div>
                <div className="xl:w-4/6">
                  <div className="flex items-start">
                    <div className="timeline-wrapper">
                      <div className="timeline" />
                      <div className="w-1 h-full gradient-line" />
                    </div>
                    <div className="relative z-20 flex gap-5 expText xl:gap-20 md:gap-10">
                      <div className="timeline-logo">
                        <img src={card.logoPath} alt="logo" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-semibold">{card.title}</h1>
                        <p className="my-5 text-white-50">
                          🗓️&nbsp;{card.date}
                        </p>
                        <p className="text-[#839CB5] italic">
                          Responsibilities
                        </p>
                        <ul className="flex flex-col gap-5 mt-5 list-disc ms-5 text-white-50">
                          {card.responsibilities.map(
                            (responsibility, index) => (
                              <li key={index} className="text-lg">
                                {responsibility}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

Experience.displayName = "Experience";
export default Experience;