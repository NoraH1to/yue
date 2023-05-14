import path from 'path';
import url from 'url';
import pluginTerser from '@rollup/plugin-terser';
import pluginTypescript from '@rollup/plugin-typescript';
import pluginEslint from '@rollup/plugin-eslint';
import pluginDelete from 'rollup-plugin-delete';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginResolve from '@rollup/plugin-node-resolve';

const isDev = process.env.NODE_ENV === 'development';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * @type {import("rollup").RollupOptions}
 */
const config = {
  input: ['electron/index.ts', 'electron/preload.ts'],
  output: {
    dir: 'dist/electron/',
    format: 'cjs',
    sourcemap: isDev,
  },
  external: ['electron'],
  plugins: [
    pluginDelete({
      targets: ['dist/electron/*'],
    }),
    pluginEslint(),
    pluginResolve(),
    pluginCommonjs(),
    pluginTypescript({
      tsconfig: path.resolve(__dirname, './electron/tsconfig.json'),
      sourceMap: isDev,
    }),
    isDev ? undefined : pluginTerser(),
  ],
};

export default config;
