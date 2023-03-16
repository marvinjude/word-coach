const babel = require("@rollup/plugin-babel")
const commonjs = require("@rollup/plugin-commonjs")
const resolve = require("@rollup/plugin-node-resolve")
const { terser } = require("@rollup/plugin-terser")
const peerDepsExternal = require("rollup-plugin-peer-deps-external")
const postcss = require("rollup-plugin-postcss")
const postcssPresetEnv = require("postcss-preset-env")

module.exports = {
  input: "./src/index.js",
  external: ["react", "styled-components", "lodash.shuffle", "framer-motion"],
  plugins: [
    postcss({
      modules: true,
      plugins: [
        postcssPresetEnv({
          browsers: ["> 0.2% and not dead"],
        }),
      ],
    }),
    peerDepsExternal(),
    commonjs({
      include: "node_modules/**",
    }),
    resolve(),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "bundled",
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
