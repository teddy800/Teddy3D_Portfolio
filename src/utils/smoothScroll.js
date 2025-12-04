// src/utils/smoothScroll.js
import Lenis from 'lenis'

const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false,
  normalizeWheel: true,
  wheelMultiplier: 0.9,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// No need to export anything! Just side-effect is enough