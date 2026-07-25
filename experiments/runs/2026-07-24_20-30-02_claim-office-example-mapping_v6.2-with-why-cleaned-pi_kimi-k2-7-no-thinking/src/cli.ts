#!/usr/bin/env node
import { processScenario } from "./claim-office.js";

const readStdin = (): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });

const main = async (): Promise<void> => {
  const inputText = await readStdin();
  let input: unknown;
  try {
    input = JSON.parse(inputText);
  } catch (error) {
    process.stderr.write(`Invalid JSON input: ${(error as Error).message}\n`);
    process.exit(1);
  }
  try {
    const result = processScenario(input as { customer: { yearsWithMHPCO: number }; steps: unknown[] });
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch (error) {
    process.stderr.write(`Error processing scenario: ${(error as Error).message}\n`);
    process.exit(1);
  }
};

void main();
