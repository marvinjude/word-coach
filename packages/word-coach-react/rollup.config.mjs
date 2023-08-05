import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import peerDepsExternal from "rollup-plugin-peer-deps-external"
import postcss from "rollup-plugin-postcss"
import typescript from "@rollup/plugin-typescript"
import svgr from "@svgr/rollup"
import eslint from "@rollup/plugin-eslint"

export default {
  input: "./src/index.tsx",
  external: ["react", "lodash.shuffle", "framer-motion"],
  plugins: [
    /**
     * We wouldn't really wan't styles in our common package to conflict with styles in the application
     * where the WordCoach component will be used that's why we are using css modules here
     */
    postcss({
      modules: true,
    }),
    eslint({
      include: ["./src/**/*.{ts,tsx}"],
    }),
    svgr(),
    peerDepsExternal(),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
    resolve({ preferBuiltins: false, browser: true }),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "bundled",
    }),
    process.env.NODE_ENV === "production" && terser(),
    commonjs(),
  ],
  output: [
    {
      file: "./dist/index.es.js",
      format: "es",
      sourcemap: true,
      exports: "named",
      name: "WordCoach",
    },
    {
      file: "./dist/index.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
      name: "WordCoach",
    },
    {
      file: "./dist/index.umd.js",
      format: "umd",
      sourcemap: true,
      name: "WordCoach",
      exports: "named",
    },
  ],
}
