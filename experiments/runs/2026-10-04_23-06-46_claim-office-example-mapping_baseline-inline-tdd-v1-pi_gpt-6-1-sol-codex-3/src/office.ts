import { validateScenario } from './validation';

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}
interface Quote { op: 'quote'; items: Item[] }
interface Damage { itemType: string; amount: number }
interface Claim { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } }
interface Policy { items: Item[]; remainingCap: number }
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: (Quote | Claim)[];
}
const prices: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};
const rules = {
  blockSize: 3, blockItemPremium: 20, cursePercent: 50, enchantmentPercent: 30,
  premiumEnchantment: 5, claimEnchantment: 8, loyaltyYears: 2,
  loyaltyPercent: 20, initialPercent: 10, followUpPercent: 15,
  fee: 5, deductible: 100, capMultiplier: 2, reimbursementDivisor: 2, percentScale: 100,
};

function itemBases(items: Item[]): number[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (!Object.hasOwn(prices, item.type)) throw new Error(`Unknown item type: ${item.type}`);
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return items.map(item => {
    const isBlock = ['rune', 'moonstone'].includes(item.type)
      && counts.get(item.type) === rules.blockSize;
    return isBlock ? rules.blockItemPremium : prices[item.type].premium;
  });
}

function quotePremium(items: Item[], years: number, followUp: boolean): number {
  const bases = itemBases(items);
  const base = bases.reduce((sum, amount) => sum + amount, 0);
  // Keep integer hundredths until the final rounding; all modifiers are additive.
  const riskHundredths = items.reduce((sum, item, index) => {
    const curse = item.cursed ? rules.cursePercent : 0;
    const enchantment = (item.enchantment ?? 0) >= rules.premiumEnchantment ? rules.enchantmentPercent : 0;
    return sum + bases[index] * (curse + enchantment);
  }, 0);
  const policyPercent = rules.percentScale + rules.initialPercent
    - (years >= rules.loyaltyYears ? rules.loyaltyPercent : 0)
    - (followUp ? rules.followUpPercent : 0);
  return Math.ceil((base * policyPercent + riskHundredths) / rules.percentScale + rules.fee);
}

function settleClaim(policy: Policy, damages: Damage[]) {
  // Matching entries in policy order consumes each insured item at most once per claim.
  const available = [...policy.items];
  const desired = damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error('Damage amount must be nonnegative');
    const index = available.findIndex(item => item.type === damage.itemType);
    if (index < 0) throw new Error(`Damage exceeds insured items of type: ${damage.itemType}`);
    const [item] = available.splice(index, 1);
    // High enchantment takes precedence over dragon material; otherwise reimbursement is full.
    const reimbursement = (item.enchantment ?? 0) >= rules.claimEnchantment
      ? damage.amount / rules.reimbursementDivisor : damage.amount;
    return sum + Math.max(0, reimbursement - rules.deductible);
  }, 0);
  const payout = Math.min(policy.remainingCap, Math.floor(desired));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: unknown) {
  validateScenario(scenario);
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
      return settleClaim(policy, step.incident.damages);
    }
    const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, policies.size > 0);
    policies.set(index, {
      items: step.items,
      remainingCap: rules.capMultiplier * step.items.reduce((sum, item) => sum + prices[item.type].value, 0),
    });
    return { premium };
  });
  return { results };
}
