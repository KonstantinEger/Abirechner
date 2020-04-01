import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/main.js',
  output: {
    dir: 'dist',
    format: 'es',
    chunkFileNames: '[name]-chunk.js'
  },
  plugins: [resolve(), terser()]
}