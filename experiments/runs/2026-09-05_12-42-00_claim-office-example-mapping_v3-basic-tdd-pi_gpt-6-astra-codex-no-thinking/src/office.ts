interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}
interface Quote { op: 'quote'; items: Item[] }
interface Claim { op: 'claim'; policy: number; incident: { cause: string; damages: { itemType: string; amount: number }[] } }
interface Scenario { customer: { yearsWithMHPCO: number }; steps: (Quote | Claim)[] }
const prices: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const insuranceValues: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;

export function runScenario(input: unknown) {
  const scenario = input as Scenario;
  let contracts = 0;
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Invalid policy reference: ${step.policy}`);
      const available = [...policy.items];
      const desired = step.incident.damages.reduce((sum, damage) => {
        if (!Number.isInteger(damage.amount) || damage.amount < 0) throw new Error('Damage amount must be a non-negative integer');
        // Repeated types consume insured occurrences in their input order.
        const index = available.findIndex(item => item.type === damage.itemType);
        if (index < 0) throw new Error(`Item not insured or too many damages: ${damage.itemType}`);
        const [item] = available.splice(index, 1);
        // High enchantment wins even for dragon material; otherwise reimbursement is full.
        return sum + Math.max(0, damage.amount / ((item.enchantment ?? 0) >= 8 ? 2 : 1) - DEDUCTIBLE);
      }, 0);
      const payout = Math.min(policy.remainingCap, Math.floor(desired));
      policy.remainingCap -= payout;
      return { payout, remainingCap: policy.remainingCap };
    }
    if (step.op !== 'quote') throw new Error('Unsupported operation');
    for (const item of step.items) {
      if (!Object.hasOwn(prices, item.type)) throw new Error(`Unknown item type: ${item.type}`);
    }
    policies.set(index, { items: step.items, remainingCap: step.items.reduce((sum, item) => sum + insuranceValues[item.type] * 2, 0) });
    const bases = step.items.map(item => {
      const isBlock = ['rune', 'moonstone'].includes(item.type)
        && step.items.filter(other => other.type === item.type).length === 3;
      return isBlock ? 20 : prices[item.type];
    });
    const base = bases.reduce((sum, value) => sum + value, 0);
    // Keep percentage numerators integral until the single final rounding step.
    const risk = step.items.reduce((sum, item, index) => sum + bases[index]
      * ((item.cursed ? 50 : 0) + ((item.enchantment ?? 0) >= 5 ? 30 : 0)), 0);
    const rate = 110 - (scenario.customer.yearsWithMHPCO >= 2 ? 20 : 0) - (contracts > 0 ? 15 : 0);
    contracts++;
    return { premium: Math.ceil((base * rate + risk) / 100) + PROCESSING_FEE };
  });
  return { results };
}
