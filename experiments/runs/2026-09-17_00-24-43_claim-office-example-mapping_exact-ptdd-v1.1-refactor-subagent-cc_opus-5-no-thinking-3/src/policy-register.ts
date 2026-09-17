// The register of policies a scenario has opened. It knows two things the
// office would otherwise have to remember by hand: how a later claim addresses
// an earlier policy -- by the zero-based index of the quote step that opened
// it -- and how much of each policy's cap is left once claims have been settled
// against it, since the cap is a per-policy total carried across claims.

import { type Damage, type Settlement, policyCap, settleClaim } from "./claim-settlement.js";
import { type Item } from "./item-catalogue.js";

// A policy, once quoted, carries its items and whatever cap it has left.
interface Policy {
  items: Item[];
  remainingCap: number;
}

export class PolicyRegister {
  private readonly policies = new Map<number, Policy>();

  // A quote opens a policy over its items, with the full cap still available.
  open(reference: number, items: Item[]): void {
    this.policies.set(reference, { items, remainingCap: policyCap(items) });
  }

  // Settling against a registered policy draws on the cap it has left, so what
  // this claim does not exhaust remains available to the next one.
  settleAgainst(reference: number, damages: Damage[]): Settlement {
    const policy = this.policies.get(reference) as Policy;
    const settlement = settleClaim(policy.items, damages, policy.remainingCap);
    policy.remainingCap = settlement.remainingCap;
    return settlement;
  }
}
