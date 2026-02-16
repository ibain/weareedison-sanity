import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      ".sanity/",
      "SquareSpace Code/",
      "*.config.js",
      "*.config.mjs",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  }
);
