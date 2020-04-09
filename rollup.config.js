import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import ts from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import rimraf from 'rimraf';
import { processString as minifyCSS } from 'uglifycss';
import { minify as minifyHTML } from 'html-minifier';

const minifyHTMLOptions = {
  collapseWhitespace: true,
  removeTagWhitespace: true,
  minifyCSS: true,
  minifyJS: true
}

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
        {
          src: 'src/static/index.html',
          dest: 'public/',
          transform: buf => minifyHTML(buf.toString('utf8'), minifyHTMLOptions)
        },
        {
          src: 'src/static/styles/main.css',
          dest: 'public/styles/',
          transform: buf => minifyCSS(buf.toString('utf8'))
        },
        {
          src: 'src/static/manifest.json',
          dest: 'public/'
        }
      ]
    })
  ]
},{
  input: 'src/sw.js',
  output: {
    file: 'public/sw.js',
    format: 'iife'
  },
  plugins: [json(), terser()]
}];