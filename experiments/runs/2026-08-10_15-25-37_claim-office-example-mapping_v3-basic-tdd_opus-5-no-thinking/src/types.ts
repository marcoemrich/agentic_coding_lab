export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export type Step =
  | { op: 'quote'; items: Item[] }
  | { op: 'claim'; policy: number; incident: Incident };

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

/** Rejection of a scenario for a reason the MHPCO considers the customer's fault. */
export class ClaimOfficeError extends Error {}
