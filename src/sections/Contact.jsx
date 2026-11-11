import { useRef, useState, Suspense, memo, useEffect } from "react";
import emailjs from "@emailjs/browser";

import TitleHeader from "../Components/TitleHeader";
import { useInView } from "../hooks/useInView";
import { useToast } from "../Components/ToastNotification";
import ContactExperience from "../Components/models/contact/ContactExperience";
import { 
  contactFormLimiter, 
  isHoneypotFilled, 
  validateSubmissionTiming, 
  detectSpam,
  isValidEmail 
} from "../utils/rateLimiter";

const Contact = memo(() => {
  const formRef = useRef(null);
  const [canvasRef, canvasInView] = useInView({ rootMargin: "400px" });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "", honeypot: "" });
  const [formMountTime] = useState(Date.now());
  const addToast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Security: Check honeypot (bot prevention)
    if (isHoneypotFilled(form.honeypot)) {
      console.warn("Honeypot filled - likely bot");
      addToast("Form submission failed. Please try again.", "error");
      return;
    }
    
    // Security: Check submission timing (too fast = bot)
    if (!validateSubmissionTiming(formMountTime)) {
      addToast("Please take your time filling the form.", "error");
      return;
    }
    
    // Security: Rate limiting check
    const rateLimitResult = contactFormLimiter.check(form.email);
    if (!rateLimitResult.allowed) {
      addToast(rateLimitResult.message, "error");
      return;
    }
    
    // Validate form fields
    if (!form.name.trim()) {
      addToast("Please enter your name", "error");
      return;
    }
    if (!form.email.trim()) {
      addToast("Please enter your email", "error");
      return;
    }
    if (!form.message.trim()) {
      addToast("Please enter a message", "error");
      return;
    }
    
    // Validate email format
    if (!isValidEmail(form.email)) {
      addToast("Please enter a valid email address", "error");
      return;
    }
    
    // Security: Spam detection
    if (detectSpam(form.message) || detectSpam(form.name)) {
      addToast("Your message contains suspicious content. Please rephrase.", "error");
      return;
    }
    
    // Validate message length
    if (form.message.length < 10) {
      addToast("Please enter a longer message (at least 10 characters)", "error");
      return;
    }
    if (form.message.length > 1000) {
      addToast("Message is too long (maximum 1000 characters)", "error");
      return;
    }
    
    // Validate environment variables
    if (!import.meta.env.VITE_APP_EMAILJS_SERVICE_ID || 
        !import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID || 
        !import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY) {
      addToast("Email service not configured. Please try again later.", "error");
      return;
    }

    setLoading(true);
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      );
      setForm({ name: "", email: "", message: "", honeypot: "" });
      addToast(`Message sent! I'll get back to you soon 🚀 (${rateLimitResult.remainingAttempts} submissions remaining)`, "success");
    } catch (error) {
      console.error("EmailJS Error:", error);
      const errorMsg = error.text || "Something went wrong. Please try again.";
      addToast(errorMsg, "error");
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
                {/* Honeypot field - hidden from users, only bots will fill it */}
                <input
                  type="text"
                  name="honeypot"
                  value={form.honeypot}
                  onChange={handleChange}
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                  tabIndex="-1"
                  autoComplete="off"
                  aria-hidden="true"
                />
                
                <div>
                  <label htmlFor="name">Your name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="What's your good name?"
                    maxLength="100"
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
                    maxLength="100"
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
                    minLength="10"
                    maxLength="1000"
                    required
                  />
                  <p className="text-xs text-white-50 mt-2">
                    {form.message.length}/1000 characters
                  </p>
                </div>
                <button type="submit" disabled={loading}>
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
