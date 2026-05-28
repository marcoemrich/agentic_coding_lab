import { processScenario } from "./claim-office.js";

const chunks: Buffer[] = [];
process.stdin.on("data", (chunk) => chunks.push(chunk));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(Buffer.concat(chunks).toString());
    const result = processScenario(input);
    process.stdout.write(JSON.stringify(result));
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    process.stderr.write(message + "\n");
    process.exit(1);
  }
});