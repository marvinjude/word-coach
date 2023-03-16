const vue = require("rollup-plugin-vue")
const buble = require("@rollup/plugin-buble")
const path = require("path")
const postcss = require("rollup-plugin-postcss")
const postcssPresetEnv = require("postcss-preset-env")

module.exports = {
  input: "./src/index.vue",
  plugins: [
    vue(),
    postcss({
      modules: true,
      plugins: [
        postcssPresetEnv({
          browsers: ["> 0.2% and not dead"],
        }),
      ],
    }),
    buble(),
  ],
  external: ["vue"],
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
