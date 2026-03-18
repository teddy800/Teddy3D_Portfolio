import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [],
      },
      jsxImportSource: 'react',
      fastRefresh: true,
    }),
  ],

  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,
        pure_funcs: ['console.log', 'console.info', 'console.warn'],
        pure_getters: true,
        unsafe: true,
        unsafe_methods: true,
      },
      mangle: {
        properties: {
          regex: /^_/,
        },
      },
      format: {
        comments: false,
      },
    },
    chunkSizeWarningLimit: 1500,
    cssCodeSplit: true,
    cssMinify: 'lightningcss',
    sourcemap: false,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return

          // GSAP — fully independent, no react/three deps
          if (id.includes('/gsap/')) return 'vendor-gsap'

          // Framer Motion — independent
          if (id.includes('/framer-motion/')) return 'vendor-framer'

          // Lenis — independent
          if (id.includes('/lenis/')) return 'vendor-lenis'

          // Three.js + entire R3F ecosystem in ONE chunk to avoid cross-refs
          if (
            id.includes('/three/') ||
            id.includes('/@react-three/') ||
            id.includes('/postprocessing/') ||
            id.includes('/react-responsive/')
          ) return 'vendor-three'

          // React core
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/scheduler/')
          ) return 'vendor-react'
        },
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|gif|svg|webp|ico/.test(ext)) {
            return `images/[name]-[hash][extname]`
          } else if (/woff|woff2|eot|ttf|otf/.test(ext)) {
            return `fonts/[name]-[hash][extname]`
          } else if (ext === 'css') {
            return `css/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
      },
    },
  },

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
      'react-responsive',
      '@emailjs/browser',
    ],
    exclude: ['@react-three/postprocessing'],
    esbuildOptions: {
      target: 'esnext',
      minify: true,
    },
  },

  server: {
    middlewareMode: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
    preTransformRequests: true,
    fs: {
      strict: false,
    },
  },

  preview: {
    port: 4173,
  },
})
