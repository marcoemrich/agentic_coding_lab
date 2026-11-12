import { type Damage, type Settlement, settleClaim } from "./claim.js";
import { issuePolicy, type Policy } from "./policy.js";
import type { Item } from "./price-list.js";
import { quotePremium } from "./quote.js";

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Quote {
  premium: number;
}

export class CustomerContracts {
  private readonly policies = new Map<number, Policy>();

  constructor(private readonly customer: Customer) {}

  quote(policyReference: number, items: Item[]): Quote {
    const premium = quotePremium(items, { ...this.customer, previousContracts: this.policies.size });
    this.policies.set(policyReference, issuePolicy(items));
    return { premium };
  }

  claim(policyReference: number, damages: Damage[]): Settlement {
    const policy = this.policyFor(policyReference);
    const settlement = settleClaim(policy, damages);
    this.policies.set(policyReference, { ...policy, remainingCap: settlement.remainingCap });
    return settlement;
  }

  private policyFor(policyReference: number): Policy {
    const policy = this.policies.get(policyReference);
    if (policy === undefined) {
      throw new Error(`Claim refers to policy ${policyReference}, which no earlier quote step created`);
    }
    return policy;
  }
}
