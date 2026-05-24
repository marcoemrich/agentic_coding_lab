#!/usr/bin/env node
import { run } from "./claim-office.js";

const readStdin = (): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => { data += chunk; });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });

const main = async (): Promise<void> => {
  try {
    const input = JSON.parse(await readStdin());
    const output = run(input);
    process.stdout.write(JSON.stringify(output) + "\n");
  } catch (err) {
    process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  }
};

main();
