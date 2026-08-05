#!/usr/bin/env node
import { text } from "node:stream/consumers";
import { runScenario, type Scenario } from "./claim-office.js";

const main = async (): Promise<void> => {
  const scenario = JSON.parse(await text(process.stdin)) as Scenario;
  process.stdout.write(JSON.stringify(runScenario(scenario)));
};

main();
