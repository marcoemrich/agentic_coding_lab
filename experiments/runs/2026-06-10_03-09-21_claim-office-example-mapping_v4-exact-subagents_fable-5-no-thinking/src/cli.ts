// cli.ts
import { processScenario } from "./claim-office.js";

const chunks: Buffer[] = [];
process.stdin.on("data", (chunk: Buffer) => {
  chunks.push(chunk);
});
process.stdin.on("end", () => {
  try {
    const scenario = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    process.stdout.write(JSON.stringify(processScenario(scenario)));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  }
});
