import {
  type Scenario,
  type ScenarioOutput,
  type StepResult,
  type PolicyState,
  MAIN_ITEM_TYPES,
} from './types.js';
import { computeQuotePremium, validateQuoteItems } from './quote.js';
import { processClaim, computeInsuranceSum } from './claim.js';

const KNOWN_COMPONENT_TYPES = new Set(['rune', 'moonstone']);

function isKnownItemType(type: string): boolean {
  return MAIN_ITEM_TYPES.has(type) || KNOWN_COMPONENT_TYPES.has(type);
}

/**
 * Processes a complete scenario and returns results for each step.
 * Throws on validation errors (unknown item types, bad claim references, etc.)
 */
export function processScenario(scenario: Scenario): ScenarioOutput {
  const { customer, steps } = scenario;
  const results: StepResult[] = [];
  const policies: PolicyState[] = []; // indexed by step index
  let quoteCount = 0;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    if (step.op === 'quote') {
      // Validate item types
      for (const item of step.items) {
        if (!isKnownItemType(item.type)) {
          throw new Error(`Unknown item type: "${item.type}"`);
        }
      }

      const premium = computeQuotePremium(step.items, customer, quoteCount);
      quoteCount++;

      const insuranceSum = computeInsuranceSum(step.items);
      const cap = insuranceSum * 2;

      // Store policy state for potential claim steps
      policies[i] = {
        items: step.items,
        insuranceSum,
        cap,
        remainingCap: cap,
      };

      results.push({ premium });
    } else if (step.op === 'claim') {
      const policyIndex = step.policy;
      const policy = policies[policyIndex];

      if (!policy) {
        throw new Error(`No policy found at step index ${policyIndex}`);
      }

      // Validate damage amounts
      for (const damage of step.incident.damages) {
        if (damage.amount < 0) {
          throw new Error(`Negative damage amount: ${damage.amount}`);
        }
      }

      // Validate damage item types
      for (const damage of step.incident.damages) {
        if (!isKnownItemType(damage.itemType)) {
          throw new Error(`Unknown item type in damage: "${damage.itemType}"`);
        }
      }

      const claimResult = processClaim(policy, step.incident);

      // Update the policy's remaining cap for future claims
      policy.remainingCap = claimResult.remainingCap;

      results.push(claimResult);
    }
  }

  return { results };
}
