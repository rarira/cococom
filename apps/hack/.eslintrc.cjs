/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@cococom/eslint-config/node.js'],
  env: {
    browser: true, // 브라우저 환경을 명시
    es2021: true,
  },
};
