#!/usr/bin/env -S node --import tsx
import { readFileSync } from "node:fs";
import { processScenario } from "./claim-office.js";

const input = readFileSync(0, "utf-8");
const scenario = JSON.parse(input);
try {
  const results = processScenario(scenario);
  process.stdout.write(JSON.stringify({ results }) + "\n");
} catch (error) {
  process.stderr.write(String(error) + "\n");
  process.exit(1);
}
