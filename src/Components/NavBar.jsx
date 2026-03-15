import { useState, useEffect, useCallback, memo } from "react";
import { navLinks } from "../constants";

const NavBar = memo(() => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { 
          setScrolled(window.scrollY > 10);
          ticking = false; 
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change / outside click
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (!e.target.closest(".mobile-menu") && !e.target.closest(".hamburger")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
        <div className="inner">
          <a href="#hero" className="logo" onClick={closeMenu}>
            Tewodiros Fikadu
          </a>

          {/* Desktop nav */}
          <nav className="desktop">
            <ul>
              {navLinks.map(({ link, name }) => (
                <li key={name} className="group">
                  <a href={link}>
                    <span>{name}</span>
                    <span className="underline" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <a href="#contact" className="contact-btn group hidden lg:flex">
              <div className="inner">
                <span>Contact me</span>
              </div>
            </a>

            {/* Hamburger — mobile only */}
            <button
              className="hamburger lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span className={`hamburger__line ${menuOpen ? "hamburger__line--open-1" : ""}`} />
              <span className={`hamburger__line ${menuOpen ? "hamburger__line--open-2" : ""}`} />
              <span className={`hamburger__line ${menuOpen ? "hamburger__line--open-3" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      <div
        className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop */}
        <div
          className={`mobile-menu__backdrop ${menuOpen ? "mobile-menu__backdrop--visible" : ""}`}
          onClick={closeMenu}
        />

        {/* Drawer */}
        <nav className="mobile-menu__drawer">
          <div className="mobile-menu__header">
            <span className="text-white font-semibold text-lg">Menu</span>
            <button onClick={closeMenu} aria-label="Close menu" className="mobile-menu__close">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <ul className="mobile-menu__links">
            {navLinks.map(({ link, name }, i) => (
              <li
                key={name}
                style={{ transitionDelay: menuOpen ? `${i * 60}ms` : "0ms" }}
                className={`mobile-menu__item ${menuOpen ? "mobile-menu__item--visible" : ""}`}
              >
                <a href={link} onClick={closeMenu} className="mobile-menu__link">
                  {name}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            onClick={closeMenu}
            className="mobile-menu__cta"
          >
            Contact me
          </a>
        </nav>
      </div>
    </>
  );
});

NavBar.displayName = "NavBar";
export default NavBar;
