// Scenario adapter: driving the MHPCO rulebook through a run of steps.
//
// Everything here changes when the CLI's JSON schema changes, and never when
// MHPCO revises a pricing or claim rule. The rulebook itself knows nothing
// about steps, step indices, or the order a scenario runs them in.
import {
  openPolicy,
  quote,
  settleClaim,
  type Customer,
  type Incident,
  type Item,
  type Policy,
  type Settlement,
} from "./claim-office.js";

// The shapes the CLI exchanges, named by the specification's JSON schema.
export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
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

// The claim result the schema requires is exactly the rulebook's settlement.
export type ClaimResult = Settlement;

export type StepResult = QuoteResult | ClaimResult;

// Scenario bookkeeping, not a claim-office rule: a claim step names its policy
// by the zero-based index of the quote step that opened it, and the customer's
// contract history grows as the scenario concludes contracts.
class PolicyRegister {
  private readonly byOpeningStep = new Map<number, Policy>();
  private concluded = 0;

  get contractsConcluded(): number {
    return this.concluded;
  }

  record(openingStep: number, policy: Policy): void {
    this.byOpeningStep.set(openingStep, policy);
    this.concluded += 1;
  }

  // Owns the policy's running cap: settling a claim against a registered policy
  // is the only way its remaining cap changes.
  settleAgainst(openingStep: number, incident: Incident): ClaimResult {
    const policy = this.policyOpenedBy(openingStep);
    const settlement = settleClaim(policy, incident);
    policy.remainingCap = settlement.remainingCap;
    return settlement;
  }

  private policyOpenedBy(openingStep: number): Policy {
    const policy = this.byOpeningStep.get(openingStep);
    if (policy === undefined) {
      throw new Error(`claim refers to step ${String(openingStep)}, which created no policy`);
    }
    return policy;
  }
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const register = new PolicyRegister();
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "quote") {
      const premium = quote(scenario.customer, step.items, register.contractsConcluded);
      register.record(index, openPolicy(step.items));
      return { premium };
    }
    return register.settleAgainst(step.policy, step.incident);
  });
  return { results };
}
