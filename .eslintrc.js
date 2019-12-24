require("@rushstack/eslint-config/patch-eslint6");

module.exports = {
  extends: ["@rushstack/eslint-config"],
  parserOptions: { tsconfigRootDir: __dirname },
};
