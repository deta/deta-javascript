import { terser } from 'rollup-plugin-terser';
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
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
    nodeResolve(),
    commonjs({ extensions: ['.ts'] }),
    terser(),
  ],
};
