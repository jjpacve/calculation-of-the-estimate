import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const projectRoot = process.cwd();
const outputDir = join(projectRoot, "dist");
mkdirSync(outputDir, { recursive: true });

for (const file of ["index.html", "Расчет.js"]) {
  copyFileSync(join(projectRoot, file), join(outputDir, file));
}
console.log("Desktop frontend prepared in dist/");
