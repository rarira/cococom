/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "./react.js",
    require.resolve("@vercel/style-guide/eslint/next"),
    "turbo",
  ],
  env: {
    browser: true,
    node: true,
  },
};
