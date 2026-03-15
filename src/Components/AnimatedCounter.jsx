import { useRef, memo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { counterItems } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const AnimatedCounter = memo(() => {
  const counterRef  = useRef(null);
  const numbersRef  = useRef([]);

  useGSAP(() => {
    numbersRef.current.forEach((el, index) => {
      if (!el) return;
      const item = counterItems[index];

      // Start from 0
      gsap.set(el, { textContent: "0" + item.suffix });

      gsap.to({ val: 0 }, {
        val: item.value,
        duration: 2.5,
        ease: "power2.out",
        snap: { val: 1 },
        scrollTrigger: {
          trigger: "#counter",
          start: "top 80%",
          once: true,
        },
        onUpdate() {
          if (el) el.textContent = Math.round(this.targets()[0].val) + item.suffix;
        },
        onComplete() {
          if (el) el.textContent = item.value + item.suffix;
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
            className="flex flex-col justify-center p-10 rounded-lg bg-zinc-900"
          >
            <div
              ref={(el) => { if (el) numbersRef.current[index] = el; }}
              className="mb-2 text-5xl font-bold text-white-50"
            >
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
