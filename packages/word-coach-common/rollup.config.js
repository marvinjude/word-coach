import { babel } from "@rollup/plugin-babel"
import sass from "rollup-plugin-sass"

export default {
  input: "src/magic/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
    {
      file: "dist/index.es.js",
      format: "es",
      sourcemap: true,
      exports: "named",
    },
  ],

  plugins: [
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env"],
    }),
    sass({
      output: "dist/styles.css",
      include: ["src/*.scss"],
    }),
  ],
}
