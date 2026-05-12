import { processScenario } from "./claim-office.js";

const chunks: Buffer[] = [];
process.stdin.on("data", (chunk) => chunks.push(chunk));
process.stdin.on("end", () => {
  const scenario = JSON.parse(Buffer.concat(chunks).toString());
  const result = processScenario(scenario);
  process.stdout.write(JSON.stringify(result) + "\n");
});
