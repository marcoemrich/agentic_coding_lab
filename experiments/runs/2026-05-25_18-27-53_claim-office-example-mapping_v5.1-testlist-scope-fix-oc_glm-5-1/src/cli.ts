import { processScenario } from "./claim-office.js";
import { readFileSync } from "fs";

function main(): void {
  try {
    const input = JSON.parse(readFileSync(0, "utf-8"));
    const result = processScenario(input);
    process.stdout.write(JSON.stringify(result) + "\n");
  } catch (err) {
    if (err instanceof Error) {
      process.stderr.write(err.message + "\n");
    } else {
      process.stderr.write("Unknown error\n");
    }
    process.exit(1);
  }
}

main();
