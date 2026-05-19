import { processScenario } from "./claim-office.js";

const chunks: Buffer[] = [];

process.stdin.on("data", (chunk) => chunks.push(chunk));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(Buffer.concat(chunks).toString("utf-8"));
    const output = processScenario(input);
    process.stdout.write(JSON.stringify(output) + "\n");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(message + "\n");
    process.exitCode = 1;
  }
});
