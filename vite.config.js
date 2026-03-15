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
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    cssMinify: 'lightningcss',
    sourcemap: false,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') && !id.includes('three')) return 'vendor-react'
            if (id.includes('three') || id.includes('@react-three')) return 'vendor-three'
            if (id.includes('gsap')) return 'vendor-gsap'
            if (id.includes('framer-motion')) return 'vendor-framer'
            if (id.includes('lenis')) return 'vendor-lenis'
            if (id.includes('emailjs')) return 'vendor-email'
            return 'vendor-common'
          }
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
