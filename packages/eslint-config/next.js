/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "./react.js",
    require.resolve("@vercel/style-guide/eslint/next"),
    "turbo",
  ],
};
