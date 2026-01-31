import js from '@eslint/js';
import react from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    ignores: ['dist/**'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react,
      '@typescript-eslint': tseslint,
    },
    settings: {
      react: {
        version: 'detect', // Fix React version warning
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      // Add any custom rules here
    },
  },
];
