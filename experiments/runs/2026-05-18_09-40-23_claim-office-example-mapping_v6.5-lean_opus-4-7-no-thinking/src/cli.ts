import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

const main = (): void => {
  const input = readFileSync(0, "utf8");
  const result = runScenario(JSON.parse(input));
  process.stdout.write(JSON.stringify(result));
};

try {
  main();
} catch (err) {
  process.stderr.write((err as Error).message + "\n");
  process.exit(1);
}
