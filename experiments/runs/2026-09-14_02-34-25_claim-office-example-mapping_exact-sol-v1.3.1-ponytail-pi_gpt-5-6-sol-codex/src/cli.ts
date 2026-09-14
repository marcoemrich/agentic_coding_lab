#!/usr/bin/env -S node --import tsx
import { processScenario, type Scenario } from "./claim-office.js";

try {
  const input = await new Promise<string>((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", chunk => { data += chunk; });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
  process.stdout.write(JSON.stringify(processScenario(JSON.parse(input) as Scenario)));
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
