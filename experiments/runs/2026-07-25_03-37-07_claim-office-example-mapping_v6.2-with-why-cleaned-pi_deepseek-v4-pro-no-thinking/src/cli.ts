import { processScenario, type Scenario } from "./claim-office.js";

async function main(): Promise<void> {
  // Read all input from stdin
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const input = Buffer.concat(chunks).toString("utf-8");

  if (input.trim().length === 0) {
    process.stderr.write("Error: Empty input\n");
    process.exit(1);
  }

  let scenario: Scenario;
  try {
    scenario = JSON.parse(input) as Scenario;
  } catch {
    process.stderr.write("Error: Invalid JSON input\n");
    process.exit(1);
  }

  const result = processScenario(scenario);

  // Output result as JSON to stdout
  process.stdout.write(JSON.stringify(result));
}

void main();