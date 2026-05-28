#! /usr/bin/env node

import { processScenario } from "./process-scenario.js";

async function main() {
  let inputData = "";
  process.stdin.setEncoding("utf-8");

  for await (const chunk of process.stdin) {
    inputData += chunk;
  }

  try {
    const input = JSON.parse(inputData);
    const result = processScenario(input);
    process.stdout.write(JSON.stringify(result) + "\n");
  } catch (err: any) {
    process.stderr.write(err.message + "\n");
    process.exit(1);
  }
}

main();