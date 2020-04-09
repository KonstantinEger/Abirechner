import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import ts from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

export default [{
  input: 'src/main.ts',
  output: {
    dir: 'public/build',
    format: 'es',
    chunkFileNames: '[name]-chunk.js'
  },
  plugins: [
    resolve(),
    ts(),
    terser({
      output: {
        comments: false
      }
    })
  ]
},{
  input: 'src/sw.js',
  output: {
    file: 'public/sw.js',
    format: 'iife'
  },
  plugins: [json()]
}];