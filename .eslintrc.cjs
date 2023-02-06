/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    "prettier",
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript/recommended",
    "@vue/eslint-config-prettier",
    "plugin:prettier/recommended",
  ],
  plugins: ["prettier"],
  rules: {
    "@typescript-eslint/no-explicit-any": ["warn"],
    "@typescript-eslint/ban-types": ["warn"],
    "@typescript-eslint/explicit-function-return-type": ["warn"],
    "vue/multi-word-component-names": "off",
    "vue/padding-line-between-blocks": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "prettier/prettier": [
      "error",
      {
        trailingComma: "all",
        endOfLine: "auto",
        bracketSameLine: true,
      },
    ],
  },
};
