import resolve from '@rollup/plugin-node-resolve';
import typescript from "@rollup/plugin-typescript";

export default {
  input: 'src/main.ts',
  output: {
    dir: 'dist/js',
    format: 'es'
  },
  plugins: [
    resolve(),
    typescript()
  ]
}