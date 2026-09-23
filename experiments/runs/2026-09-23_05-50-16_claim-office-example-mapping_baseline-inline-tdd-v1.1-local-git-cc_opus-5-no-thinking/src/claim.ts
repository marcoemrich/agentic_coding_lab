export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export class UninsuredDamageError extends Error {}
export class InvalidDamageError extends Error {}
