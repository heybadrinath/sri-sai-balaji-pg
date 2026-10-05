import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const html = await readFile("index.html", "utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, "Duplicate HTML ids");
for (const match of html.matchAll(/href="#([^"]+)"/g))
  assert.ok(ids.includes(match[1]), `Missing anchor: ${match[1]}`);
const refs = new Set(
  [...html.matchAll(/(?:href|src|data-full)="([^"#]+)"/g)].map(
    (match) => match[1],
  ),
);
for (const file of [
  "styles.css",
  "lower-page.css",
  "entrance.css",
  "surfaces.css",
  "rooms.css",
  "amenity-chapters.css",
  "gallery-sequence.css",
  "fonts.css",
]) {
  const css = await readFile(file, "utf8");
  for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g))
    refs.add(match[1]);
}
for (const ref of refs)
  if (!/^(https?:|tel:|data:)/.test(ref)) await access(ref);
for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
  for (const source of match[1].split(","))
    await access(source.trim().split(/\s/)[0]);
}
for (const match of html.matchAll(
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
))
  JSON.parse(match[1]);
assert.equal(
  (html.match(/class="gallery-item(?:[ "])/g) || []).length,
  6,
  "Expected six curated gallery photographs",
);
assert.equal(
  (html.match(/destination_place_id=/g) || []).length,
  8,
  "Expected eight specific landmark routes",
);
for (const id of [
  "rooms",
  "amenities",
  "gallery",
  "location",
  "faqs",
  "visit",
  "photo-dialog",
  "room-dialog",
])
  assert.ok(ids.includes(id), `Missing section/control: ${id}`);
assert.ok(html.includes("tel:+918883399299"), "Missing supplied telephone");
assert.ok(
  html.includes("maps.app.goo.gl/7i6eU5S9nwtS1Z8v5"),
  "Missing supplied Maps link",
);
for (const file of [
  "app.js",
  "site.js",
  "amenity-chapters.js",
  "gallery-sequence.js",
])
  execFileSync(process.execPath, ["--check", file]);
console.log(
  "Static checks passed: assets, section links, gallery, landmark routes, structured data and JavaScript syntax.",
);
