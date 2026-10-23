import { ClaimOfficeError } from "./claim-office-error.js";
import { Policy } from "./policy.js";
import type { Item } from "./premium.js";

export class PolicyRegister {
  readonly #policies = new Map<number, Policy>();

  get hasPriorContract(): boolean {
    return this.#policies.size > 0;
  }

  open(stepIndex: number, items: Item[]): void {
    this.#policies.set(stepIndex, new Policy(items));
  }

  find(stepIndex: number): Policy {
    const policy = this.#policies.get(stepIndex);
    if (policy === undefined) {
      throw new ClaimOfficeError(`No policy was created by step ${stepIndex}`);
    }
    return policy;
  }
}
