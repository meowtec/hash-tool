// @ts-check

import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import eslintReactHooks from 'eslint-plugin-react-hooks';
import eslintPrettier from 'eslint-plugin-prettier/recommended';

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    plugins: {
      'react-hooks': eslintReactHooks,
    },
    // @ts-ignore
    rules: eslintReactHooks.configs.recommended.rules,
  },
  eslintPrettier,
);
