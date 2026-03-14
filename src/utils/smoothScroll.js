// src/utils/smoothScroll.js
// Advanced Lenis smooth scroll — integrated with GSAP ticker for zero conflict
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false,
  normalizeWheel: true,
  wheelMultiplier: 0.85,
  touchMultiplier: 1.5,
  infinite: false,
})

// Sync Lenis with GSAP ticker — eliminates the competing RAF loop
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

// Disable GSAP's own lag smoothing so Lenis drives timing
gsap.ticker.lagSmoothing(0)

// Keep ScrollTrigger in sync with Lenis scroll position
lenis.on('scroll', ScrollTrigger.update)

export default lenis
