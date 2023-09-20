import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import postcss1 from 'rollup-plugin-postcss'
import typescript from '@rollup/plugin-typescript'

export default {
  input: './src/index.tsx',
  external: ['react', 'lodash.shuffle', 'framer-motion'],
  plugins: [
    // postcss2({
    // //   extract: true,
    //   writeDefinitions: true,
    // }),
    postcss1({
      modules: true,
      extentions: ['.scss'],
    }),
    peerDepsExternal(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    resolve({ preferBuiltins: false, browser: true }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    process.env.NODE_ENV === 'production' && terser(),
    commonjs(),
  ],
  output: [
    {
      file: './dist/index.es.js',
      format: 'es',
      sourcemap: true,
      exports: 'named',
      name: 'WordCoach',
    },
    {
      file: './dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      name: 'WordCoach',
    },
    {
      file: './dist/index.umd.js',
      format: 'umd',
      sourcemap: true,
      name: 'WordCoach',
      exports: 'named',
    },
  ],
}
