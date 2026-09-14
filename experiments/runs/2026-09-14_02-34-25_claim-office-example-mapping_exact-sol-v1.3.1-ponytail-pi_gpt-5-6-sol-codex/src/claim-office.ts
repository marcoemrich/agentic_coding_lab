export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
interface Damage { itemType: string; amount: number }
interface Incident { cause: string; damages: Damage[] }
interface Step { op: string; items?: Item[]; policy?: number; incident?: Incident }
interface Policy { items: Item[]; remainingCap: number }
interface Result { premium?: number; payout?: number; remainingCap?: number }

const INITIAL_ASSESSMENT = 0.1;
const CURSE_SURCHARGE = 0.5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_SURCHARGE = 0.3;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_REDUCTION = 15;
const COMPONENT_BLOCK_SIZE = 3;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT = 8;
const ENCHANTED_REIMBURSEMENT = 0.5;
const CAP_MULTIPLIER = 2;

const PRICES: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 }, amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 }, potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 }, moonstone: { value: 250, premium: 25 },
};

function basePremium(items: Item[]): number {
  const standard = items.reduce((sum, item) => sum + PRICES[item.type].premium, 0);
  const blocks = ["rune", "moonstone"].filter(type =>
    items.filter(item => item.type === type).length === COMPONENT_BLOCK_SIZE
  ).length;
  return standard - blocks * COMPONENT_BLOCK_REDUCTION;
}

function quote(items: Item[], years: number, followUp: boolean): number {
  const base = basePremium(items);
  const itemModifier = items.reduce((sum, item) => sum + PRICES[item.type].premium *
    ((item.cursed ? CURSE_SURCHARGE : 0) + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? ENCHANTMENT_SURCHARGE : 0)), 0);
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_DISCOUNT : 0;
  const contractDiscount = followUp ? base * FOLLOW_UP_DISCOUNT : 0;
  return Math.ceil(base + itemModifier + base * INITIAL_ASSESSMENT - loyalty - contractDiscount + PROCESSING_FEE);
}

function desiredPayout(policy: Policy, damages: Damage[]): number {
  const available = [...policy.items];
  return damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error(`Invalid damage amount: ${damage.amount}`);
    const itemIndex = available.findIndex(item => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Damage item not insured: ${damage.itemType}`);
    const [item] = available.splice(itemIndex, 1);
    const rate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT ? ENCHANTED_REIMBURSEMENT : 1;
    return sum + Math.max(0, damage.amount * rate - DEDUCTIBLE);
  }, 0);
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const items = step.items ?? [];
      const unknown = items.find(item => !PRICES[item.type]);
      if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
      policies.set(index, { items, remainingCap: items.reduce((sum, item) => sum + PRICES[item.type].value, 0) * CAP_MULTIPLIER });
      return { premium: quote(items, scenario.customer.yearsWithMHPCO, quoteCount++ > 0) };
    }
    const policy = policies.get(step.policy ?? -1)!;
    const desired = Math.floor(desiredPayout(policy, step.incident?.damages ?? []));
    const payout = Math.min(desired, policy.remainingCap);
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
}
