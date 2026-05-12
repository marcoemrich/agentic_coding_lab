import { processScenario } from "./claim-office.js";

const chunks: Buffer[] = [];
process.stdin.on("data", (chunk) => chunks.push(chunk));
process.stdin.on("end", () => {
  const input = Buffer.concat(chunks).toString("utf8");
  let scenario: unknown;
  try {
    scenario = JSON.parse(input);
  } catch {
    process.stderr.write("Error: invalid JSON input\n");
    process.exit(1);
  }
  const output = processScenario(scenario as any);
  process.stdout.write(JSON.stringify(output) + "\n");
});
