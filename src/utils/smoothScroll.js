// src/utils/smoothScroll.js
// Lenis smooth scroll — driven by GSAP ticker, zero competing RAF loops
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({
  duration: 1.1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false,
  wheelMultiplier: 1,
  touchMultiplier: 1.5,
  infinite: false,
  autoRaf: false, // GSAP ticker drives RAF — no double loop
})

// Single RAF loop via GSAP ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

// Disable lag smoothing — Lenis owns timing
gsap.ticker.lagSmoothing(0)

// Keep ScrollTrigger positions in sync
lenis.on('scroll', ScrollTrigger.update)

export default lenis
