import { babel } from "@rollup/plugin-babel"
import sass from "rollup-plugin-sass"
import typescript from "@rollup/plugin-typescript"
import copy from "rollup-plugin-copy"

export default {
  input: "./src/index.ts",
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
    copy({
      targets: [{ src: "src/icons", dest: "dist/" }],
    }),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
    sass({
      output: "dist/styles.css",
      include: ["src/*/*.scss"],
    }),
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env"],
    }),
  ],
}
