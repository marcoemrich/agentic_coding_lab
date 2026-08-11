import { createPolicy, settleClaim, type Policy } from './claim.js';
import { quotePremium } from './premium.js';
import { ClaimOfficeError, type Scenario, type StepResult } from './types.js';

/**
 * Processes the steps of a scenario in order. Quote steps create a policy that
 * later claim steps address by step index; each quote after the first counts as
 * a follow-up contract for the customer.
 */
function validateStep(step: Scenario['steps'][number]): void {
  if (step.op === 'quote') {
    if (!Array.isArray(step.items)) {
      throw new ClaimOfficeError('a quote step requires an items array');
    }
    return;
  }
  if (step.op === 'claim') {
    if (!Array.isArray(step.incident?.damages)) {
      throw new ClaimOfficeError('a claim step requires incident.damages');
    }
    return;
  }
  throw new ClaimOfficeError(`unknown step op: ${JSON.stringify((step as { op: unknown }).op)}`);
}

function validate(scenario: Scenario): void {
  if (typeof scenario !== 'object' || scenario === null) {
    throw new ClaimOfficeError('scenario must be a JSON object');
  }
  if (typeof scenario.customer?.yearsWithMHPCO !== 'number') {
    throw new ClaimOfficeError('scenario requires customer.yearsWithMHPCO');
  }
  if (!Array.isArray(scenario.steps)) {
    throw new ClaimOfficeError('scenario requires a steps array');
  }
  scenario.steps.forEach(validateStep);
}

export function runScenario(scenario: Scenario): StepResult[] {
  validate(scenario);

  const policies = new Map<number, Policy>();
  const results: StepResult[] = [];
  let contracts = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, scenario.customer, contracts);
      contracts += 1;
      policies.set(index, createPolicy(step.items));
      results.push({ premium });
      return;
    }

    const policy = policies.get(step.policy);
    if (!policy) {
      throw new ClaimOfficeError(`step ${step.policy} did not create a policy`);
    }
    results.push(settleClaim(policy, step.incident));
  });

  return results;
}
