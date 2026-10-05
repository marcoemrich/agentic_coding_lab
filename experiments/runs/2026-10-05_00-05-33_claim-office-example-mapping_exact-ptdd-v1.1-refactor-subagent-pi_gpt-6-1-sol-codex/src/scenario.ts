import { premiumForQuote } from './premium.js';
import { payoutForIncident, type Damage } from './claim-reimbursement.js';
import { initialCapForItems, settlePayoutAgainstCap } from './policy-cap.js';
import type { Item } from './item.js';

export type { Item } from './item.js';
export type { Damage } from './claim-reimbursement.js';
interface Quote { op: 'quote'; items: Item[] }
interface Claim { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } }
interface Policy { items: Item[]; remainingCap: number }
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: (Quote | Claim)[] }

export function processScenario(scenario: Scenario) {
  const policies = new Map<number, Policy>();
  let contracts = 0;
  return scenario.steps.map((step, index) => {
    if (step.op === 'quote') {
      const premium = premiumForQuote(step.items, scenario.customer.yearsWithMHPCO, contracts);
      policies.set(index, { items: step.items, remainingCap: initialCapForItems(step.items) });
      contracts += 1;
      return { premium };
    }
    const policy = policies.get(step.policy)!;
    const settlement = settlePayoutAgainstCap(payoutForIncident(policy.items, step.incident.damages), policy.remainingCap);
    policy.remainingCap = settlement.remainingCap;
    return settlement;
  });
}
