import { insuranceValueOf } from "./catalog.js";
import { matchDamagesToItems, type Damage } from "./damaged-items.js";
import type { Item } from "./premium.js";
import { reimbursementFor } from "./reimbursement.js";

const CAP_FACTOR = 2;

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export class Policy {
  readonly insuranceSum: number;
  readonly #items: Item[];
  #remainingCap: number;

  constructor(items: Item[]) {
    this.#items = items;
    this.insuranceSum = items.reduce((sum, item) => sum + insuranceValueOf(item.type), 0);
    this.#remainingCap = this.insuranceSum * CAP_FACTOR;
  }

  get remainingCap(): number {
    return this.#remainingCap;
  }

  claim(damages: Damage[]): ClaimResult {
    const reimbursement = reimbursementFor(matchDamagesToItems(damages, this.#items));
    const payout = Math.min(reimbursement, this.#remainingCap);
    this.#remainingCap -= payout;
    return { payout, remainingCap: this.#remainingCap };
  }
}
