// Placeholder for the claim payout calculation. Replaced by real implementation in subsequent TDD cycles.
import type { Item } from "./premium.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Policy {
  insuranceSum: number;
  remainingCap: number;
  items: Item[];
}

export interface ClaimInput {
  policy: Policy;
  incident: Incident;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export const claim = (_input: ClaimInput): ClaimResult => {
  return undefined as unknown as ClaimResult;
};
