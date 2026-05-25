#!/usr/bin/env node
import { runScenario } from "./claim-office.js";

const readStdin = async (): Promise<string> => {
  let data = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) {
    data += chunk;
  }
  return data;
};

const main = async (): Promise<void> => {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input);
    const output = runScenario(scenario);
    process.stdout.write(JSON.stringify(output));
  } catch (err) {
    process.stderr.write(`${(err as Error).message}\n`);
    process.exit(1);
  }
};

void main();
