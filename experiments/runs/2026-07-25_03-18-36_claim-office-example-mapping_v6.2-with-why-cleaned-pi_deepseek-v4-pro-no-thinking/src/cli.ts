#!/usr/bin/env node
import { processScenario } from "./claim-office.js";
import { readFileSync } from "fs";

let input: string;
try {
  input = readFileSync(0, "utf-8"); // Read from stdin (fd 0)
} catch {
  // If stdin is empty or unavailable
  process.exit(1);
}

try {
  const scenario = JSON.parse(input);
  const result = processScenario(scenario);
  process.stdout.write(JSON.stringify(result) + "\n");
} catch (e) {
  process.stderr.write((e instanceof Error ? e.message : String(e)) + "\n");
  process.exit(1);
}