import typescript from "@rollup/plugin-typescript";

export default {
  input: 'src/main.ts',
  output: {
    dir: 'dist/js',
    format: 'es'
  },
  plugins: [typescript()]
}