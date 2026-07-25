// MHPCO Claim Office - Core Logic
// This module processes scenarios and returns results.
// CLI entry point is in cli.ts.

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface ClaimDamage {
  itemType: string;
  amount: number;
}

export interface ClaimIncident {
  cause: string;
  damages: ClaimDamage[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: ClaimIncident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

export function processScenario(scenario: Scenario): ScenarioResult {
  // Stub - will be implemented via TDD
  return { results: [] };
}