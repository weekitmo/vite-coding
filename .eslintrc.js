module.exports = {
  // Fix typescript error by install @typescript-eslint/parser & @typescript-eslint/eslint-plugin and set extends plugin
  extends: [
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    "no-console": "off",
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/semi": 0,
    "prefer-const": "off",
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/ban-ts-comment": 0
  },
  env: {
    es6: true
  }
}
