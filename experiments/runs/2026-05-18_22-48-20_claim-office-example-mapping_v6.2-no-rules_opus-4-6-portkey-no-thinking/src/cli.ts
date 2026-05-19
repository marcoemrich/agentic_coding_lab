import { processScenario } from "./claim-office.js";

const chunks: Buffer[] = [];

process.stdin.on("data", (chunk) => chunks.push(chunk));
process.stdin.on("end", () => {
  const input = JSON.parse(Buffer.concat(chunks).toString("utf-8"));
  const output = processScenario(input);
  process.stdout.write(JSON.stringify(output) + "\n");
});
