import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import peerDepsExternal from "rollup-plugin-peer-deps-external"
import postcss from "rollup-plugin-postcss"
import typescript from "@rollup/plugin-typescript"
import svgr from "@svgr/rollup"

export default {
  input: "./src/index.ts",
  external: ["react", "lodash.shuffle", "framer-motion"],
  plugins: [
    /**Okay! We wouldn't really wan't styles in our common package to conflict with styles in the application where the WordCoach component will be used that's why we are using css modules here */
    postcss({
      modules: true,
    }),
    svgr(),
    peerDepsExternal(),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
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
