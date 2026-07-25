import { processScenario } from "./claim-office.js";

async function main(): Promise<void> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf-8").trim();
  if (!raw) {
    process.stderr.write("Error: no input provided\n");
    process.exit(1);
  }

  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch {
    process.stderr.write("Error: invalid JSON input\n");
    process.exit(1);
  }

  try {
    const output = processScenario(input);
    process.stdout.write(JSON.stringify(output) + "\n");
  } catch (err) {
    process.stderr.write("Error: " + (err instanceof Error ? err.message : String(err)) + "\n");
    process.exit(1);
  }
}

main();