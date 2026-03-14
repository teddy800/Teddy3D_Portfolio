import { useRef, memo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { counterItems } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const AnimatedCounter = memo(() => {
  const counterRef = useRef(null);
  const countersRef = useRef([]);

  useGSAP(() => {
    countersRef.current.forEach((counter, index) => {
      if (!counter) return;
      const numberElement = counter.querySelector(".counter-number");
      const item = counterItems[index];

      gsap.set(numberElement, { innerText: "0" });

      gsap.to(numberElement, {
        innerText: item.value,
        duration: 2.5,
        ease: "power2.out",
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: "#counter",
          start: "top center",
          // once — don't re-trigger on scroll back
          once: true,
        },
        onComplete: () => {
          numberElement.textContent = `${item.value}${item.suffix}`;
        },
      });
    });
  }, { scope: counterRef, dependencies: [] });

  return (
    <div id="counter" ref={counterRef} className="mt-32 padding-x-lg xl:mt-0">
      <div className="mx-auto grid-4-cols">
        {counterItems.map((item, index) => (
          <div
            key={index}
            ref={(el) => el && (countersRef.current[index] = el)}
            className="flex flex-col justify-center p-10 rounded-lg bg-zinc-900"
          >
            <div className="mb-2 text-5xl font-bold counter-number text-white-50">
              0{item.suffix}
            </div>
            <div className="text-lg text-white-50">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

AnimatedCounter.displayName = "AnimatedCounter";
export default AnimatedCounter;
