import { text } from "node:stream/consumers";
import { processScenario } from "./claim-office.js";

try {
  const scenario = JSON.parse(await text(process.stdin));
  process.stdout.write(`${JSON.stringify(processScenario(scenario))}\n`);
} catch (error) {
  process.stderr.write(`${String(error)}\n`);
  process.exitCode = 1;
}
