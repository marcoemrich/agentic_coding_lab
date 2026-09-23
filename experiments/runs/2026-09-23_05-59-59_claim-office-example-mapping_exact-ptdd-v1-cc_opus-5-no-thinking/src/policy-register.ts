import type { Item } from "./item.js";
import { payoutCap } from "./policy.js";

interface RegisteredPolicy {
  items: Item[];
  remainingCap: number;
}

export class PolicyRegister {
  private readonly policies = new Map<number, RegisteredPolicy>();

  get contractCount(): number {
    return this.policies.size;
  }

  register(stepIndex: number, items: Item[]): void {
    this.policies.set(stepIndex, { items, remainingCap: payoutCap(items) });
  }

  policyCreatedBy(stepIndex: number): RegisteredPolicy {
    const policy = this.policies.get(stepIndex);
    if (policy === undefined) {
      throw new Error(`Claim refers to step ${stepIndex}, which created no policy`);
    }
    return policy;
  }
}
