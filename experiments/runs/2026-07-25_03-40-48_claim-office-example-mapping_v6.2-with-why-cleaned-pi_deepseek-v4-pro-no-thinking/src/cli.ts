import { processScenario } from "./claim-office.js";

async function main(): Promise<void> {
  // Read all data from stdin
  const chunks: Array<Uint8Array | string> = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const textDecoder = new TextDecoder("utf-8");
  const input = chunks
    .map((c) => (typeof c === "string" ? c : textDecoder.decode(c)))
    .join("");

  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    process.stderr.write("Error: Invalid JSON input\n");
    process.exit(1);
  }

  let result: ReturnType<typeof processScenario>;
  try {
    result = processScenario(parsed);
  } catch (err) {
    process.stderr.write(`Error: ${err instanceof Error ? err.message : "Unknown error"}\n`);
    process.exit(1);
  }

  process.stdout.write(JSON.stringify(result) + "\n");
}

main();