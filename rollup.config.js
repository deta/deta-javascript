import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import pkg from './package.json';

export default {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs', // commonJS
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'esm', // ES Modules
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
    commonjs({ extensions: ['.ts'] }),
    nodeResolve(),
    sourceMaps(),
    terser(),
  ],
};
