import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import ts from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import rimraf from 'rimraf';

rimraf.sync('public');

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
    }),
    copy({
      targets: [
        { src: 'src/static/*', dest: 'public/' }
      ]
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