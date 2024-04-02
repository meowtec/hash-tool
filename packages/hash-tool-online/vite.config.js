// @ts-check
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig(({ command }) => ({
  root: 'src',
  build: {
    outDir: '../../..',
  },
  base: 'https://meowtec.github.io/hash-tool/',
  plugins: [preact(), wasm(), topLevelAwait()],
  resolve: {
    alias: {},
  },
  worker: {
    plugins: () => [wasm(), topLevelAwait()],
  },
}));
