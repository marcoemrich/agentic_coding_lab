#!/usr/bin/env node
import { processScenario, type Scenario } from "./claim-office.js";

try {
  const input = await new Promise<string>((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk: string) => { data += chunk; });
    process.stdin.on("end", () => { resolve(data); });
    process.stdin.on("error", reject);
  });
  const scenario = JSON.parse(input) as Scenario;
  process.stdout.write(JSON.stringify(processScenario(scenario)));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
