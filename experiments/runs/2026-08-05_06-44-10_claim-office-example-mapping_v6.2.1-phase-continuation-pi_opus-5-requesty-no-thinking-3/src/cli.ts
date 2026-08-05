#!/usr/bin/env node
import { runScenario, type Scenario } from "./claim-office.js";

// stdin arrives in chunks, so the scenario is only complete once the stream ends.
const readStdinText = async (): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
};

const scenario = JSON.parse(await readStdinText()) as Scenario;
process.stdout.write(JSON.stringify(runScenario(scenario)));
