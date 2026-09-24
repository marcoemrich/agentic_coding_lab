import { quotePremium } from './quote-premium.js';
import { processClaim } from './claim.js';
import { policyPayoutCap } from './claim-cap.js';

export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
export type Step = { op: 'quote'; items: Item[] } | { op: 'claim'; policy: number; incident: { cause: string; damages: { itemType: string; amount: number }[] } };

export function scenarioResults(steps: Step[], yearsWithMHPCO: number) {
  const results: ({ premium: number } | { payout: number; remainingCap: number })[] = [];
  let contracts = 0;
  const remainingCaps = new Map<number, number>();
  for (const [index, step] of steps.entries()) {
    if (step.op === 'quote') {
      results.push({ premium: quotePremium(step.items, yearsWithMHPCO, contracts) });
      remainingCaps.set(index, policyPayoutCap(step.items));
      contracts++;
    } else {
      const policy = steps[step.policy] as Extract<Step, { op: 'quote' }>;
      const result = processClaim(policy.items, step.incident.damages, remainingCaps.get(step.policy));
      remainingCaps.set(step.policy, result.remainingCap);
      results.push(result);
    }
  }
  return results;
}
