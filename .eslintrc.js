module.exports = {
  parser: "@babel/eslint-parser",
  plugins: ["react"],
  extends: [
    `eslint:recommended`,
    `plugin:react/recommended`,
    `plugin:react-hooks/recommended`,
    `prettier`,
  ],
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  rules: {
    "react/prop-types": 0,
  },
  overrides: [
    {
      files: ["src/**/*.js"],
    },
  ],
  parserOptions: {
    sourceType: "module",
    allowImportExportEverywhere: true,
    ecmaFeatures: {
      jsx: true,
    },
    babelOptions: {
      configFile: `./.babelrc.js`,
    },
  },
  settings: {
    react: {
      version: `17.0.2`,
    },
  },
}
