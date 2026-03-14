import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — loads first, cached aggressively
          'vendor-react': ['react', 'react-dom'],
          // Animation — separate from 3D
          'vendor-anim': ['gsap', '@gsap/react', 'framer-motion', 'lenis'],
          // Three.js ecosystem — largest chunk, loads lazily
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing', 'postprocessing'],
        },
      },
    },
  },

  // Optimize dev server
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'gsap',
      'lenis',
      'framer-motion',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
    ],
  },
})
