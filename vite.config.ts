import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import { PluginOption, defineConfig } from 'vite';
import { VitePWA as pwa } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    process.env.pwa
      ? pwa({
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,jpg,png,svg,woff,woff2}'],
          },
          registerType: 'autoUpdate',
          manifest: {
            name: 'yue - pure reader',
            short_name: 'yue',
            lang: 'zh-cn',
          },
        })
      : undefined,
    process.env.analyze ? (visualizer() as unknown as PluginOption) : undefined,
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
          ],
          'common-utils': ['spark-md5', 'hammerjs', 'i18next'],
          'data-source': ['dexie', 'webdav'],
          epubjs: ['epubjs'],
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
