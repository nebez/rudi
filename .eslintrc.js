require("@rushstack/eslint-config/patch-eslint6");

module.exports = {
  ignorePatterns: ["test/spec.ts", "node_modules/"],
  extends: [
    "@rushstack/eslint-config",
    "plugin:prettier/recommended",
  ],
  parserOptions: { tsconfigRootDir: __dirname },
};
