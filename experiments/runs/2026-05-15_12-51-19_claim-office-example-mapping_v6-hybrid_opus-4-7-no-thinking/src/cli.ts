#!/usr/bin/env node
import { runScenario } from "./claim-office.js";

const readStdin = (): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });

const main = async (): Promise<void> => {
  const raw = await readStdin();
  try {
    const input = JSON.parse(raw);
    const result = runScenario(input);
    process.stdout.write(JSON.stringify(result));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`claim-office error: ${message}\n`);
    process.exit(1);
  }
};

main();
