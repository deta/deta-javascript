import commonjs from '@rollup/plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: {
    file: './build/index.js',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    commonjs({ extensions: ['.js', '.ts'] }),
    nodeResolve(),
    sourceMaps(),
  ],
};
