import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import ts from '@rollup/plugin-typescript';

export default {
  input: 'src/main.ts',
  output: {
    dir: 'public/build',
    format: 'es',
    chunkFileNames: '[name]-chunk.js'
  },
  plugins: [resolve(), ts(), terser()]
}