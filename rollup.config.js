import replace from '@rollup/plugin-replace';
// import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import pkg from './package.json';

export default {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs', // commonJS
    },
    {
      file: pkg.module,
      format: 'es', // ES Modules
    },
    {
      name: 'Deta',
      file: pkg.browser,
      format: 'iife', // browser,
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
    nodeResolve(),
    commonjs({ extensions: ['.ts'] }),
    // terser(),
    replace({
      'process.env.DETA_PROJECT_KEY': JSON.stringify(''),
      'process.env.DETA_BASE_HOST': JSON.stringify(''),
      'process.env.DETA_DRIVE_HOST': JSON.stringify(''),
      preventAssignment: true,
    }),
  ],
};
