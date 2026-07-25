// Placeholder for the scenario runner. Replaced by real implementation in subsequent TDD cycles.
import type { Customer } from "./premium.js";

export interface ScenarioInput {
  customer: Customer;
  steps: unknown[];
}

export interface ScenarioOutput {
  results: unknown[];
}

export const runScenario = (_input: ScenarioInput): ScenarioOutput => {
  return undefined as unknown as ScenarioOutput;
};
