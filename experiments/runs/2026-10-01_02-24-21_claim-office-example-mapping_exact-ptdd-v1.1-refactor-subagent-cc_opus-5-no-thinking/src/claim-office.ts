import { Policy, type Incident, type Settlement } from "./claim-settlement.js";
import { type Customer, policyPremiumOf } from "./premium-rating.js";
import type { Item } from "./office-statutes.js";

/**
 * The office's counter: what a caller needs to name a customer, the items they
 * bring, an incident they report, and to read the office's answer. The rulebook
 * modules behind it state the terms; this is where the office is spoken to.
 */
export type { Customer } from "./premium-rating.js";
export type { Item } from "./office-statutes.js";
export type { Damage, Incident, Settlement } from "./claim-settlement.js";

/**
 * The office as a going concern: it serves one customer for the length of a
 * scenario, remembers the contracts it has already written for them -- its
 * follow-up discount depends on that history -- and the policies it issued, so
 * that later claims can be settled against them.
 */
export class ClaimOffice {
  private readonly policies: Policy[] = [];

  constructor(private readonly customer: Customer) {}

  quote(items: Item[]): number {
    const premium = policyPremiumOf(items, {
      customer: this.customer,
      contractsAlreadyWritten: this.policies.length,
    });
    this.policies.push(new Policy(items));
    return premium;
  }

  /** Settling a damage report against one of the office's policies. */
  claim(policyIndex: number, incident: Incident): Settlement {
    return this.policies[policyIndex].settle(incident);
  }
}

/** A customer's first and only contract with the office. */
export function quote(customer: Customer, items: Item[]): number {
  return new ClaimOffice(customer).quote(items);
}
