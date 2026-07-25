#!/usr/bin/env node

import { processScenario } from "./claim-office.js";
import { readFileSync } from "fs";

async function main() {
  // Read JSON from stdin
  const stdin = readFileSync(0, "utf-8");
  try {
    const input = JSON.parse(stdin);
    const output = processScenario(input);
    console.log(JSON.stringify(output));
  } catch (e: any) {
    console.error(e.message);
    process.exit(1);
  }
}

main();