const babel = require("rollup-plugin-babel")
const commonjs = require("rollup-plugin-commonjs")
const resolve = require("rollup-plugin-node-resolve")
const external = require("rollup-plugin-peer-deps-external")
const postcss = require("rollup-plugin-postcss")
const { terser } = require("rollup-plugin-terser")
// const typescript = require("@rollup/plugin-typescript")

module.exports = {
  input: "./src/index.js",
  external: ["react", "styled-components", "lodash.shuffle"],
  plugins: [
    // typescript(),
    external(),
    // eslint({
    //   throwOnError: false,
    // }),
    babel({
      exclude: "node_modules/**",
    }),
    resolve(),
    commonjs(),
    postcss({
      modules: true,
      plugins: [],
    }),
    process.env.NODE_ENV === "production" && terser(),
  ],
  output: [
    {
      file: __dirname + "/dist/index.es.js",
      format: "es",
      sourcemap: true,
      exports: "named",
    },
    {
      file: __dirname + "/dist/index.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
  ],
}
