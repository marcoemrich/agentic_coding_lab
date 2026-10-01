import { Customer, Item, quotePremium } from './premium.js';
import { ClaimError, ClaimResult, Incident } from './claim.js';
import { Policy } from './policy.js';
import { UnknownItemTypeError } from './catalog.js';

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export type StepResult = QuoteResult | ClaimResult;

/** A scenario the MHPCO refuses to process. */
export class ScenarioError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScenarioError';
  }
}

/** State carried from step to step while a scenario is processed. */
interface ScenarioState {
  customer: Customer;
  policies: Map<number, Policy>;
  contractCount: number;
}

function validateScenario(scenario: Scenario): void {
  if (!scenario || !Array.isArray(scenario.steps)) {
    throw new ScenarioError('Scenario must have a steps array');
  }
  if (!scenario.customer || typeof scenario.customer.yearsWithMHPCO !== 'number') {
    throw new ScenarioError('Scenario must have a customer with yearsWithMHPCO');
  }
}

function runQuote(step: QuoteStep, index: number, state: ScenarioState): QuoteResult {
  if (!Array.isArray(step.items)) {
    throw new ScenarioError(`Step ${index}: quote must have an items array`);
  }
  state.contractCount += 1;
  try {
    const premium = quotePremium(step.items, state.customer, state.contractCount);
    state.policies.set(index, new Policy(step.items));
    return { premium };
  } catch (error) {
    if (error instanceof UnknownItemTypeError) throw new ScenarioError(`Step ${index}: ${error.message}`);
    throw error;
  }
}

function runClaim(step: ClaimStep, index: number, state: ScenarioState): ClaimResult {
  const policy = state.policies.get(step.policy);
  if (!policy) {
    throw new ScenarioError(`Step ${index}: no policy created by step ${step.policy}`);
  }
  if (!step.incident || !Array.isArray(step.incident.damages)) {
    throw new ScenarioError(`Step ${index}: claim must have an incident with damages`);
  }
  try {
    return policy.claim(step.incident);
  } catch (error) {
    if (error instanceof ClaimError) throw new ScenarioError(`Step ${index}: ${error.message}`);
    throw error;
  }
}

/**
 * Processes the steps in order. Policies created by quote steps are addressed
 * by their step index; each keeps its own cap across later claims.
 */
export function runScenario(scenario: Scenario): StepResult[] {
  validateScenario(scenario);
  const state: ScenarioState = {
    customer: scenario.customer,
    policies: new Map(),
    contractCount: 0,
  };

  return scenario.steps.map((step, index) => {
    switch (step?.op) {
      case 'quote':
        return runQuote(step, index, state);
      case 'claim':
        return runClaim(step, index, state);
      default:
        throw new ScenarioError(`Step ${index}: unknown operation ${JSON.stringify((step as { op?: unknown })?.op)}`);
    }
  });
}
