/* global process, console */
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import * as path from 'node:path';

const [target] = process.argv.slice(3);

console.log('process.argv:', process.argv);

const modDir = 'packages/hash-tool';
const appDir = 'packages/hash-tool-online';

console.log('wasm-pack start');

execFileSync('wasm-pack', ['build', '--release'], {
  cwd: modDir,
  stdio: 'inherit',
});

console.log('wasm-pack finish');

writeFileSync(
  path.join(modDir, 'pkg/package.json'),
  JSON.stringify(
    Object.assign(JSON.parse(readFileSync(path.join(modDir, 'pkg/package.json'), 'utf-8')), {
      name: '@meowtec/hash-tool',
    }),
    null,
    '  ',
  ),
);

console.log('pnpm i start');

execFileSync('pnpm', ['i'], {
  shell: true,
  stdio: 'inherit',
});

console.log('pnpm i finish');

if (target === 'app') {
  rmSync('assets', {
    force: true,
    recursive: true,
  });

  execFileSync('pnpm', ['run', 'build'], {
    cwd: appDir,
    shell: true,
    stdio: 'inherit',
  });
}
