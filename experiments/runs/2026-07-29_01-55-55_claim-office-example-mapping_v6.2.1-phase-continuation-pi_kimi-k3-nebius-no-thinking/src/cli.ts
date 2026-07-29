import { processScenario } from "./claim-office.js";

const chunks: Buffer[] = [];
process.stdin.on("data", (chunk) => chunks.push(chunk));
process.stdin.on("end", () => {
  try {
    const scenario = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    const output = processScenario(scenario);
    process.stdout.write(JSON.stringify(output));
  } catch (error) {
    process.stderr.write(`${(error as Error).message}\n`);
    process.exit(1);
  }
});
