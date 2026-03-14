import { useRef, useState, Suspense, memo } from "react";
import emailjs from "@emailjs/browser";

import TitleHeader from "../components/TitleHeader";
import { useInView } from "../hooks/useInView";

// Lazy-load the heavy 3D canvas — only mounts when contact section scrolls into view
import ContactExperience from "../components/models/contact/ContactExperience";

const Contact = memo(() => {
  const formRef = useRef(null);
  const [canvasRef, canvasInView] = useInView({ rootMargin: "400px" });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      );
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="flex-center section-padding">
      <div className="w-full h-full px-5 md:px-10">
        <TitleHeader
          title="Get in Touch – Let's Connect"
          sub="💬 Have questions or ideas? Let's talk! 🚀"
        />
        <div className="mt-16 grid-12-cols">
          <div className="xl:col-span-5">
            <div className="p-10 flex-center card-border rounded-xl">
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="flex flex-col w-full gap-7"
              >
                <div>
                  <label htmlFor="name">Your name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="What's your good name?"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="What's your email address?"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can I help you?"
                    rows="5"
                    required
                  />
                </div>
                <button type="submit">
                  <div className="cta-button group">
                    <div className="bg-circle" />
                    <p className="text">{loading ? "Sending..." : "Send Message"}</p>
                    <div className="arrow-wrapper">
                      <img src="/images/arrow-down.svg" alt="arrow" />
                    </div>
                  </div>
                </button>
              </form>
            </div>
          </div>

          {/* 3D canvas only mounts when scrolled near */}
          <div className="xl:col-span-7 min-h-96" ref={canvasRef}>
            <div className="bg-[#cd7c2e] w-full h-full hover:cursor-grab rounded-3xl overflow-hidden">
              {canvasInView ? (
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center min-h-96">
                    <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
                  </div>
                }>
                  <ContactExperience />
                </Suspense>
              ) : (
                <div className="w-full h-full min-h-96 bg-[#cd7c2e] rounded-3xl" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Contact.displayName = "Contact";
export default Contact;
