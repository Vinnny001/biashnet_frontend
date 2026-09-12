/*
 * Minimal on purpose.
 *
 * ESLint and a "lint" script were already in package.json, but there was
 * no config, so `npm run lint` only ever errored out and nothing was
 * checked. That let a plain ReferenceError ship to production: a service
 * file imported `paymentApi` but still called `api.post(...)`, which
 * builds cleanly because Vite does not resolve identifiers.
 *
 * So the rules that earn their place here are the ones that catch
 * mistakes a build cannot. Style is left alone — turning on a full preset
 * against this codebase would bury real findings under thousands of
 * formatting complaints, which is how lint configs end up ignored.
 */

module.exports = {
  root: true,

  env: {
    browser: true,
    es2022: true,
    node: true,
  },

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },

  settings: {
    react: { version: "detect" },
  },

  plugins: ["react", "react-hooks"],

  rules: {
    /* The one that would have caught `api is not defined`. */
    "no-undef": "error",

    /* Typo'd or dead imports — same family of mistake. */
    "no-unused-vars": [
      "warn",
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],

    /* Genuine bugs, not style. */
    "no-const-assign": "error",
    "no-dupe-keys": "error",
    "no-dupe-args": "error",
    "no-unreachable": "error",
    "no-cond-assign": "error",
    "no-self-compare": "error",
    "use-isnan": "error",
    "valid-typeof": "error",

    /* JSX has to mark identifiers as used or no-unused-vars misfires. */
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",

    /* Stale-closure bugs in effects are invisible until runtime. */
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },

  globals: {
    /* Vite */
    __APP_ENV__: "readonly",
  },

  ignorePatterns: ["dist", "build", "node_modules", "android", "ios"],
};
