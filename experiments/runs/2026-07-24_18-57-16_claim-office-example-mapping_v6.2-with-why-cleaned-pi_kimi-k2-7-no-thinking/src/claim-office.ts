export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Customer = {
  yearsWithMHPCO: number;
};

export type ScenarioStep =
  | { op: 'quote'; items: Item[] }
  | { op: 'claim'; policy: number; incident: { cause: string; damages: Array<{ itemType: string; amount: number }> } };

export type ScenarioResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export function processScenario(customer: Customer, steps: ScenarioStep[]): ScenarioResult[] {
  throw new Error('Not implemented');
}
