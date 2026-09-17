import { readFileSync } from "node:fs";
import {
  transactScenario,
  type Customer,
  type Incident,
  type Item,
} from "./claim-office.js";

/**
 * The wire shapes of the scenario document, as the published CLI schema names
 * them. They describe what arrives on stdin, not what MHPCO knows: the office's
 * own reading of a visit lives in claim-office.
 */
interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

interface ScenarioDocument {
  customer: Customer;
  steps: (QuoteStep | ClaimStep)[];
}

const STDIN_FD = 0;

function readStdin(): string {
  return readFileSync(STDIN_FD, "utf8");
}

function main(): void {
  const scenario = JSON.parse(readStdin()) as ScenarioDocument;
  process.stdout.write(
    JSON.stringify({ results: transactScenario(scenario) }),
  );
}

try {
  main();
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exit(1);
}
