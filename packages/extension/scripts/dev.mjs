import { spawnSync } from "node:child_process";
import { watch } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = resolve(root, "src");
const publicDir = resolve(root, "public");

function build() {
  console.log(`[extension] building…`);
  const result = spawnSync("node", ["scripts/build.mjs"], {
    cwd: root,
    stdio: "inherit",
    shell: false,
    env: process.env,
  });
  if (result.status !== 0) {
    console.error(`[extension] build failed (${result.status ?? "unknown"})`);
    return false;
  }
  console.log(`[extension] dist ready — load/reload packages/extension/dist in chrome://extensions`);
  return true;
}

build();

let timer = null;
const kick = (event, filename) => {
  if (!filename) return;
  clearTimeout(timer);
  timer = setTimeout(() => build(), 200);
};

watch(srcDir, { recursive: true }, kick);
watch(publicDir, { recursive: true }, kick);
console.log(`[extension] watching ${srcDir}`);
