#!/usr/bin/env -S node --import tsx

import { processScenario, type Scenario } from "./claim-office.js";

const input = await new Promise<string>((resolve) => {
  let contents = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk: string) => {
    contents += chunk;
  });
  process.stdin.on("end", () => resolve(contents));
});

const scenario = JSON.parse(input) as Scenario;
process.stdout.write(JSON.stringify(processScenario(scenario)));
