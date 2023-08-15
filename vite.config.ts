import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import { PluginOption, defineConfig } from 'vite';
import { VitePWA as pwa } from 'vite-plugin-pwa';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    pwa({
      devOptions: {
        enabled: process.env.NODE_ENV === 'development' && !!process.env.pwa,
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,jpg,png,svg,woff,woff2,wasm}'],
      },
      registerType: 'prompt',
      manifest: {
        name: 'yuè - pure reader',
        short_name: 'yuè',
        description:
          'Lightweight web reader, easy to use, clean interface, focused on reading',
        theme_color: '#000000',
        lang: 'zh-cn',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    process.env.analyze ? (visualizer() as unknown as PluginOption) : undefined,
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/libarchive.js/src/webworker/wasm-gen/*.wasm',
          dest: 'assets/wasm-gen',
        },
      ],
    }),
  ],
  build: {
    outDir: path.resolve(
      __dirname,
      `./dist/web${process.env.pwa ? '-pwa' : ''}`,
    ),
    rollupOptions: {
      output: {
        manualChunks: {
          'mui-icons': ['@mui/icons-material'],
          'mui-material': ['@mui/material'],
          react: ['react', 'react-dom', 'react-router-dom'],
          'react-utils': [
            'react-beautiful-dnd',
            'react-i18next',
            'formik',
            'notistack',
            'ahooks',
          ],
          'common-utils': [
            'spark-md5',
            'hammerjs',
            'i18next',
            'arraybuffer-to-string',
            'url-join',
            'swiper',
            'swiper/modules',
            'nanoid',
            'browser-fs-access',
            'anysort-typed',
            'body-scroll-lock',
            'mime',
            'yup',
          ],
          'data-source': ['dexie', '@norah1to/webdav'],
          epubjs: ['epubjs'],
          pdf: ['react-pdf'],
          archive: ['libarchive.js'],
          txt: ['to-array-buffer', 'detect-file-encoding-and-language']
        },
      },
    },
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
  },
  base: '/',
  server: {
    port: process.env.pwa ? 5112 : 5111,
    host: '0.0.0.0',
  },
});
