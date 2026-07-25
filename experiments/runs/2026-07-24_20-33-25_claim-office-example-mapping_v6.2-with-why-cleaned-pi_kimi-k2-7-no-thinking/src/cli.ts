#!/usr/bin/env node
import { processScenario, type Scenario } from "./claim-office.js";

async function main(): Promise<void> {
  const inputChunks: string[] = [];
  process.stdin.setEncoding("utf8");

  for await (const chunk of process.stdin) {
    inputChunks.push(chunk as string);
  }

  const inputText = inputChunks.join("");
  let scenario: Scenario | undefined;
  try {
    scenario = JSON.parse(inputText) as Scenario;
  } catch (error) {
    process.stderr.write(`Invalid JSON input: ${error}\n`);
    process.exit(1);
  }

  try {
    const result = processScenario(scenario);
    process.stdout.write(JSON.stringify(result) + "\n");
  } catch (error) {
    process.stderr.write(`Error processing scenario: ${error}\n`);
    process.exit(1);
  }
}

void main();
