export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
export type Step = { op: 'quote'; items: Item[] } | { op: 'claim'; policy: number; incident: { cause: string; damages: { itemType: string; amount: number }[] } };
export type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

const prices: Record<string, [number, number]> = {
  sword: [1000, 100], amulet: [600, 60], staff: [800, 80], potion: [400, 40],
  rune: [250, 25], moonstone: [250, 25],
};

export function runScenario(scenario: Scenario): { results: Array<{ premium: number } | { payout: number; remainingCap: number }> } {
  const results: Array<{ premium: number } | { payout: number; remainingCap: number }> = [];
  let quoteCount = 0;
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  for (const [index, step] of scenario.steps.entries()) {
    if (step.op === 'quote') {
      let base = 0;
      let riskHundredths = 0;
      const counts: Record<string, number> = {};
      for (const item of step.items) {
        if (!prices[item.type]) throw new Error(`Unknown item type: ${item.type}`);
        const itemBase = prices[item.type][1];
        base += itemBase;
        counts[item.type] = (counts[item.type] ?? 0) + 1;
        if (item.cursed) riskHundredths += 50 * itemBase;
        if ((item.enchantment ?? 0) >= 5) riskHundredths += 30 * itemBase;
      }
      for (const type of ['rune', 'moonstone']) {
        if (counts[type] === 3) base -= 15;
      }
      const policyRate = 100 + 10 - (scenario.customer.yearsWithMHPCO >= 2 ? 20 : 0) - (quoteCount > 0 ? 15 : 0);
      results.push({ premium: Math.ceil((base * policyRate + riskHundredths + 500) / 100) });
      quoteCount++;
      policies.set(index, {
        items: step.items,
        remainingCap: 2 * step.items.reduce((sum, item) => sum + prices[item.type][0], 0),
      });
    } else {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
      const available = [...policy.items];
      let payoutTwice = 0;
      for (const damage of step.incident.damages) {
        if (!Number.isInteger(damage.amount) || damage.amount < 0) throw new Error('Invalid damage amount');
        const match = available.findIndex(item => item.type === damage.itemType);
        if (match < 0) throw new Error(`Uninsured or excess damage: ${damage.itemType}`);
        const [insured] = available.splice(match, 1);
        payoutTwice += Math.max(0, damage.amount * ((insured.enchantment ?? 0) >= 8 ? 1 : 2) - 200);
      }
      const payout = Math.min(Math.floor(payoutTwice / 2), policy.remainingCap);
      policy.remainingCap -= payout;
      results.push({ payout, remainingCap: policy.remainingCap });
    }
  }
  return { results };
}
