import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import { fixupPluginRules } from '@eslint/compat';
import eslintPrettier from 'eslint-plugin-prettier/recommended';

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    plugins: {
      react: eslintPluginReact,
      'react-hooks': fixupPluginRules(eslintPluginReactHooks),
    },
    rules: eslintPluginReactHooks.configs.recommended.rules,
  },
  eslintPrettier,
  {
    ignores: [
      'crates/minifier-js/lib/**',
      'crates/minifier-js/wasm/**',
      'app/src/components/ui/**',
    ],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
);
