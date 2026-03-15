import { memo } from "react";
import { socialImgs } from "../constants";

const Footer = memo(() => {
  const handleSocial = (name) => {
    const map = {
      github:   "https://github.com/teddy800",
      gmail:    "mailto:tewodrosfikadu499@gmail.com",
      insta:    "https://instagram.com",
      whatsapp: "https://wa.me/251911406293",
      linkedin: "https://linkedin.com",
    };
    const url = map[name];
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left — branding */}
        <div className="flex flex-col justify-center">
          <p className="font-semibold text-white">Tewodiros Fikadu</p>
          <p className="text-sm mt-1">Full-Stack Developer · Ethiopia</p>
        </div>

        {/* Center — contact info */}
        <div className="flex flex-col items-center justify-center gap-1 text-sm">
          <a href="tel:+251911406293" className="hover:text-white transition-colors">
            📞 +251 911 406 293
          </a>
          <a href="mailto:tewodrosfikadu499@gmail.com" className="hover:text-white transition-colors">
            ✉️ tewodrosfikadu499@gmail.com
          </a>
          <a
            href="https://wa.me/251911406293"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            💬 WhatsApp Chat
          </a>
        </div>

        {/* Right — social icons */}
        <div className="socials">
          {socialImgs.map((socialImg) => (
            <button
              key={socialImg.name}
              onClick={() => handleSocial(socialImg.name)}
              aria-label={socialImg.name}
              className="icon"
            >
              <img
                src={socialImg.imgPath}
                alt={socialImg.name}
                loading="lazy"
                decoding="async"
                className="size-5 object-contain"
              />
            </button>
          ))}
        </div>

        {/* Copyright */}
        <div className="flex flex-col justify-center md:col-span-3">
          <p className="text-center text-xs mt-4 md:mt-0">
            © {new Date().getFullYear()} Tewodiros Fikadu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;
