#!/usr/bin/env node
import { processScenario } from "./claim-office.js";

async function main() {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const input = JSON.parse(Buffer.concat(chunks).toString("utf-8"));
  const result = processScenario(input);
  console.log(JSON.stringify(result));
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
