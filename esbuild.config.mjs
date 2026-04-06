import { cpSync } from "node:fs";
import { build } from "esbuild";

await build({
  bundle: true,
  minify: true,
  format: "esm",
  outdir: "dist",
  entryPoints: ["src/index.ts", "src/embed.ts"],
});

cpSync("index.html", "dist/index.html");
cpSync("embed.html", "dist/embed.html");
cpSync("src/index.css", "dist/index.css");
