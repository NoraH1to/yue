import { defineConfig } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react-swc';
import ssl from '@vitejs/plugin-basic-ssl';
import { VitePWA as pwa } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    process.env.https ? ssl() : undefined,
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
  ],
  build: {
    outDir: path.resolve(
      __dirname,
      `./dist/web${process.env.pwa ? '-pwa' : ''}`,
    ),
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
  },
  base: './',
  server: {
    port: process.env.pwa ? 5112 : 5111,
    host: '0.0.0.0',
  },
});
