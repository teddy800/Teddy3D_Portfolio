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
    target: 'es2020',
    minify: 'terser',
    modulePreload: { polyfill: true },
    cssTarget: 'chrome90',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,
        pure_funcs: ['console.log', 'console.info', 'console.warn', 'console.debug'],
        pure_getters: true,
        unsafe: true,
        unsafe_methods: true,
        unsafe_arrows: true,
        ecma: 2020,
        module: true,
        toplevel: true,
        keep_fargs: false,
        keep_infinity: true,
      },
      mangle: {
        properties: {
          regex: /^_/,
        },
        toplevel: true,
        safari10: true,
      },
      format: {
        comments: false,
        ecma: 2020,
      },
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    cssMinify: 'lightningcss',
    sourcemap: false,
    reportCompressedSize: false,
    rollupOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
      output: {
        experimentalMinChunkSize: 20000,
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return

          // GSAP — fully independent
          if (id.includes('/gsap/')) return 'vendor-gsap'

          // Framer Motion — independent
          if (id.includes('/framer-motion/')) return 'vendor-framer'

          // Lenis — independent
          if (id.includes('/lenis/')) return 'vendor-lenis'

          // Split Three.js core from R3F for better caching
          if (id.includes('/three/')) return 'vendor-three-core'

          // React Three Fiber ecosystem
          if (
            id.includes('/@react-three/') ||
            id.includes('/postprocessing/') ||
            id.includes('/three-stdlib/')
          ) return 'vendor-r3f'

          // React core
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/scheduler/')
          ) return 'vendor-react'

          // Other vendor deps
          return 'vendor-common'
        },
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|gif|svg|webp|avif|ico/.test(ext)) {
            return `images/[name]-[hash][extname]`
          } else if (/woff|woff2|eot|ttf|otf/.test(ext)) {
            return `fonts/[name][extname]` // No hash for fonts to enable proper caching
          } else if (ext === 'css') {
            return `css/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        compact: true,
        generatedCode: {
          arrowFunctions: true,
          constBindings: true,
          objectShorthand: true,
        },
      },
    },
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
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
      target: 'es2020',
      minify: true,
      treeShaking: true,
      legalComments: 'none',
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
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
})
