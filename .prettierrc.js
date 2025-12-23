// @ts-check

/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
module.exports = {
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: [
    "^react(-native)?$",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^(@)(/.*)$",
    "",
    "^[.]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",
};
