#!/usr/bin/env node
import { stdin } from "node:process";
import { processScenario, type Scenario } from "./claim-office.js";

const main = async (): Promise<void> => {
  try {
    stdin.setEncoding("utf8");
    let input = "";
    for await (const chunk of stdin) input += chunk;
    const scenario = JSON.parse(input) as Scenario;
    process.stdout.write(`${JSON.stringify(processScenario(scenario))}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
};

await main();
