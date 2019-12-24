require("@rushstack/eslint-config/patch-eslint6");

module.exports = {
  extends: [
    "@rushstack/eslint-config",
    "plugin:prettier/recommended",
  ],
  parserOptions: { tsconfigRootDir: __dirname },
};
