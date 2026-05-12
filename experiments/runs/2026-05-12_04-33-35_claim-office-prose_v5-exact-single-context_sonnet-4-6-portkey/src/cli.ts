#!/usr/bin/env tsx
import { processScenario } from "./claim-office.js";

const chunks: Buffer[] = [];
process.stdin.on("data", (chunk: Buffer) => chunks.push(chunk));
process.stdin.on("end", () => {
  const scenario = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  const output = processScenario(scenario);
  process.stdout.write(JSON.stringify(output) + "\n");
});
