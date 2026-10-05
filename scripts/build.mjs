import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { join } from "node:path";

const output = "public";
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of [
  "index.html",
  "styles.css",
  "lower-page.css",
  "entrance.css",
  "surfaces.css",
  "rooms.css",
  "amenity-chapters.css",
  "gallery-sequence.css",
  "fonts.css",
  "app.js",
  "amenity-chapters.js",
  "gallery-sequence.js",
  "site.js",
  "robots.txt",
  "sitemap.xml",
]) {
  await cp(file, join(output, file));
}
for (const folder of ["icons", "fonts", "photos", "textures"]) {
  const source = join("assets", folder);
  const target = join(output, source);
  await mkdir(target, { recursive: true });
  for (const file of await readdir(source)) {
    if (/\.(svg|woff2|webp|txt)$/i.test(file) || file === "LICENSE") {
      await cp(join(source, file), join(target, file));
    }
  }
}
console.log("Website built in public/.");
