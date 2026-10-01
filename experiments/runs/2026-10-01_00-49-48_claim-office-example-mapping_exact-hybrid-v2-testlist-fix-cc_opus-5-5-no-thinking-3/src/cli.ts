#!/usr/bin/env -S npx tsx
import { runScenario } from "./claim-office.js";

const readAllStdin = (onInput: (input: string) => void): void => {
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk: string) => {
    input += chunk;
  });
  process.stdin.on("end", () => onInput(input));
};

const runScenarioJson = (scenarioJson: string): string =>
  `${JSON.stringify(runScenario(JSON.parse(scenarioJson)))}\n`;

readAllStdin((scenarioJson) => {
  try {
    process.stdout.write(runScenarioJson(scenarioJson));
  } catch (error) {
    process.stderr.write(`${String(error)}\n`);
    process.exitCode = 1;
  }
});
