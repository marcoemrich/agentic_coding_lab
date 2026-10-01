import { readFileSync } from "node:fs";
import { ClaimOffice, type Customer, type Incident, type Item, type Settlement } from "./claim-office.js";

/** A step of a scenario: one operation the office is asked to perform. */
type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: Incident };

/** A scenario as the CLI receives it: one customer and the steps to work through. */
interface Scenario {
  customer: Customer;
  steps: Step[];
}

type StepResult = { premium: number } | Settlement;

/**
 * One step translated into the office call its `op` tag names, and the office's
 * answer handed back in the shape the output schema fixes for that kind of step.
 * The whole of the adapter's reading of the schema's operation tags.
 */
function resultOf(office: ClaimOffice, step: Step): StepResult {
  if (step.op === "quote") {
    return { premium: office.quote(step.items) };
  }
  return office.claim(step.policy, step.incident);
}

/**
 * The scenario's steps handed to one office in the order the document lists them.
 * That one office is the whole of the scenario's continuity: it is what remembers
 * the policies a later claim step refers to and the contracts a later quote step is
 * a follow-up to. The order steps are worked through is the document's, and what
 * that order means for a policy is the office's -- the adapter only keeps it.
 */
function resultsOf(scenario: Scenario): StepResult[] {
  const office = new ClaimOffice(scenario.customer);
  return scenario.steps.map((step) => resultOf(office, step));
}

function main(): void {
  const scenario = JSON.parse(readFileSync(0, "utf8")) as Scenario;
  process.stdout.write(`${JSON.stringify({ results: resultsOf(scenario) })}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
