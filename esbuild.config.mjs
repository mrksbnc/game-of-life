import { cpSync } from "node:fs";
import { build } from "esbuild";

await build({
  bundle: true,
  minify: true,
  format: "esm",
  outdir: "dist",
  entryPoints: ["src/index.ts"],
});

cpSync("index.html", "dist/index.html");
cpSync("src/index.css", "dist/index.css");
