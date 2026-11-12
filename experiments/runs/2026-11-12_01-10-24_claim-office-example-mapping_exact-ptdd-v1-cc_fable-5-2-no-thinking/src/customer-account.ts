import type { Item } from "./item.js";
import { Policy, type ClaimSettlement, type Damage } from "./policy.js";
import { quotePremium } from "./premium.js";

export interface Quote {
  premium: number;
}

export class CustomerAccount {
  private readonly policies = new Map<number, Policy>();

  constructor(private readonly yearsWithMHPCO: number) {}

  quote(policyNumber: number, items: Item[]): Quote {
    const history = { yearsWithMHPCO: this.yearsWithMHPCO, previousContracts: this.policies.size };
    this.policies.set(policyNumber, new Policy(items));
    return { premium: quotePremium(items, history) };
  }

  claim(policyNumber: number, damages: Damage[]): ClaimSettlement {
    const policy = this.policies.get(policyNumber);
    if (policy === undefined) throw new Error(`No policy ${policyNumber} exists for this customer`);
    return policy.settleClaim(damages);
  }
}
