import { processScenario, Scenario } from "./claim-office.js";

const chunks: Buffer[] = [];
process.stdin.on("data", (chunk) => chunks.push(chunk));
process.stdin.on("end", () => {
  const scenario = JSON.parse(Buffer.concat(chunks).toString()) as Scenario;
  process.stdout.write(JSON.stringify(processScenario(scenario)) + "\n");
});
