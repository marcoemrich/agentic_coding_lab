#!/usr/bin/env node
import { runScenario } from "./claim-office.js";

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
});
process.stdin.on("end", () => {
  try {
    const scenario = JSON.parse(input);
    const result = runScenario(scenario);
    process.stdout.write(JSON.stringify(result));
  } catch (err) {
    process.stderr.write(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
});
