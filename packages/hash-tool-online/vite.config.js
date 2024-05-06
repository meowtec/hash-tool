// @ts-check
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  return {
    build: {
      outDir: isBuild ? '../../..' : undefined,
    },
    base: isBuild ? 'https://meowtec.github.io/hash-tool/' : undefined,
    plugins: [isBuild ? preact() : react(), wasm(), topLevelAwait()],
    resolve: {
      alias: {},
    },
    worker: {
      plugins: () => [wasm(), topLevelAwait()],
    },
    server: {
      port: 11211,
    },
  };
});
