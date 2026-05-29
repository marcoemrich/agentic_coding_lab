import { readFileSync } from "node:fs";
import { runScenario } from "./claim-office.js";

const toScenarioStep = (step: any, scenario: any) => {
  if (step.op === "quote") {
    return {
      type: "quote",
      customer: { years: scenario.customer.yearsWithMHPCO },
      items: step.items,
    };
  }
  return {
    type: "claim",
    policy: step.policy,
    incident: step.incident,
  };
};

const main = () => {
  const input = readFileSync(0, "utf8");
  const scenario = JSON.parse(input);
  const steps = scenario.steps.map((step: any) =>
    toScenarioStep(step, scenario),
  );
  const results = runScenario(steps);

  // Build the full output before writing so an error never leaves
  // partial results on stdout.
  const output = JSON.stringify({ results });
  process.stdout.write(output);
};

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
