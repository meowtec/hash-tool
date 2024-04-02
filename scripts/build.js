#!/usr/bin/env zx
import { readFileSync, rmSync, writeFileSync } from 'node:fs';

const [target] = process.argv.slice(3);

console.log(process.argv);

cd('packages/hash-tool');

await $`wasm-pack build --release`;

writeFileSync(
  'pkg/package.json',
  JSON.stringify(
    Object.assign(JSON.parse(readFileSync('pkg/package.json', 'utf-8')), {
      name: '@meowtec/hash-tool',
    }),
    null,
    '  ',
  ),
);

await $`pnpm i`;

if (target === 'app') {
  cd('..');

  rmSync('assets', {
    force: true,
    recursive: true,
  });

  cd('hash-tool-online');

  await $`npm run build`;
}
