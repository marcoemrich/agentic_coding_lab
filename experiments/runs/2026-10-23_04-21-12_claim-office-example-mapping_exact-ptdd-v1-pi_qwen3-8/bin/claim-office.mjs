#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "..", "src", "cli.ts");
const result = spawnSync(process.execPath, ["--import", "tsx", cli], {
  stdio: ["inherit", "inherit", "inherit"],
});
process.exit(result.status ?? 1);
