import vue from "rollup-plugin-vue"
import babel from "@rollup/plugin-babel"
import postcss from "rollup-plugin-postcss"
import postcssPresetEnv from "postcss-preset-env"

export default {
  input: "./src/index.jsx",
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
    babel({
      plugins: ["@vue/babel-plugin-jsx"],
      babelHelpers: "bundled",
    }),
  ],
  external: ["vue"],
  output: [
    {
      file: "./dist/index.es.js",
      format: "es",
      sourcemap: true,
      exports: "named",
    },
    {
      file: "./dist/index.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
  ],
}
