import { memo } from "react";
import { testimonials } from "../constants";
import TitleHeader from "../components/TitleHeader";
import GlowCard from "../components/GlowCard";

const TestimonialCard = memo(({ testimonial, index }) => (
  <GlowCard card={testimonial} index={index}>
    <div className="flex items-center gap-3">
      <div>
        <img
          src={testimonial.imgPath}
          alt={testimonial.name}
          loading="lazy"
          decoding="async"
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>
      <div>
        <p className="font-bold">{testimonial.name}</p>
        <p className="text-white-50">{testimonial.mentions}</p>
      </div>
    </div>
  </GlowCard>
));

TestimonialCard.displayName = "TestimonialCard";

const Testimonials = memo(() => (
  <section id="testimonials" className="flex-center section-padding">
    <div className="w-full h-full md:px-10 px-5">
      <TitleHeader
        title="What People Say About Me?"
        sub="⭐️ Customer feedback highlights"
      />
      <div className="lg:columns-3 md:columns-2 columns-1 mt-16">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} index={index} />
        ))}
      </div>
    </div>
  </section>
));

Testimonials.displayName = "Testimonials";
export default Testimonials;
