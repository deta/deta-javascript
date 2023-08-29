import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import pkg from './package.json';

export default [
  {
    input: './src/index.node.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs', // commonJS
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
      }),
      nodeResolve({
        browser: false,
      }),
      commonjs({ extensions: ['.ts'] }),
      cleanup({
        comments: 'none',
      }),
    ],
  },
  {
    input: './src/index.browser.ts',
    output: [
      {
        name: 'deta',
        file: pkg.browser,
        format: 'es', // browser
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
      }),
      nodeResolve({
        browser: true,
      }),
      commonjs({ extensions: ['.ts'] }),
      replace({
        'process.env.DETA_PROJECT_KEY': JSON.stringify(''),
        'process.env.DETA_BASE_HOST': JSON.stringify(''),
        'process.env.DETA_DRIVE_HOST': JSON.stringify(''),
        preventAssignment: true,
      }),
      terser(),
      cleanup({
        comments: 'none',
      }),
    ],
  },
];
