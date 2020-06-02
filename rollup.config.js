import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from "@rollup/plugin-typescript";
import rimraf from 'rimraf';

const production = (process.env.BUILD && process.env.BUILD === 'production') ? true : false;

console.clear();
console.log('BUILD TARGET: ' + (production ? 'production' : 'develop'));
console.log('MINIFIED: ' + production);

if (production) rimraf.sync('./dist/js');

export default {
  input: 'src/main.ts',
  output: {
    dir: 'dist/js',
    chunkFileNames: `[name]-chunk${production ? '-[hash]' : ''}.js`,
    format: 'es'
  },
  plugins: [
    resolve(),
    typescript(),
    production ? terser({ output: { comments: false } }) : undefined
  ]
}