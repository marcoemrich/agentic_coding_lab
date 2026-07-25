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
  const input = await readStdin();
  let scenario: unknown;
  try {
    scenario = JSON.parse(input);
  } catch (error) {
    console.error("Invalid JSON input");
    process.exit(1);
  }
  try {
    const result = processScenario(scenario as Parameters<typeof processScenario>[0]);
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  }
};

main();
