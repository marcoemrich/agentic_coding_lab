import { runScenario } from "./claim-office.js";

async function main(): Promise<void> {
  // Read all of stdin
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf-8").trim();

  if (!raw) {
    process.stderr.write("Error: empty input\n");
    process.exit(1);
  }

  let input: unknown;
  try {
    input = JSON.parse(raw) as unknown;
  } catch {
    process.stderr.write("Error: invalid JSON input\n");
    process.exit(1);
  }

  try {
    const result = runScenario(input);
    process.stdout.write(JSON.stringify(result) + "\n");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`Error: ${message}\n`);
    process.exit(1);
  }
}

main();