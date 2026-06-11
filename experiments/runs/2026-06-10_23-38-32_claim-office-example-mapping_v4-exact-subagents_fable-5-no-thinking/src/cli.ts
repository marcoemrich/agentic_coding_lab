// cli.ts — claim-office CLI entry point
import { processScenario } from "./claim-office.js";

const chunks: Buffer[] = [];
process.stdin.on("data", (chunk) => chunks.push(chunk));
process.stdin.on("end", () => {
  const input = Buffer.concat(chunks).toString("utf8");
  const scenario = JSON.parse(input);
  try {
    const output = JSON.stringify(processScenario(scenario));
    process.stdout.write(output);
  } catch (error) {
    process.stderr.write(`${error}\n`);
    process.exit(1);
  }
});
