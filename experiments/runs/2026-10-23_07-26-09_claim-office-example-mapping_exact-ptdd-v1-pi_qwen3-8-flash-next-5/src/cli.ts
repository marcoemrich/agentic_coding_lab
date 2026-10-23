import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { execute } from "./scenario.js";

export { execute };

function main(): void {
  const raw = readFileSync(0, "utf8");
  const outcome = execute(JSON.parse(raw));
  if (outcome.exitCode !== 0) {
    process.stderr.write(outcome.stderr);
    process.exit(outcome.exitCode);
  }
  process.stdout.write(outcome.stdout + "\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
