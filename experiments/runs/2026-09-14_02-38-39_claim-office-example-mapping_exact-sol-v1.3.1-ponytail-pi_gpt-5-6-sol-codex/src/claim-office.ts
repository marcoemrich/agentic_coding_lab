export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
export type Damage = { itemType: string; amount: number };
export type Step = {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: { cause: string; damages: Damage[] };
};
export type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

type Policy = { items: Item[]; remainingCap: number };

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT = 0.1;
const CURSE_SURCHARGE = 0.5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_SURCHARGE = 0.3;
const FOLLOW_UP_DISCOUNT = 0.15;
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT = 8;
const ENCHANTED_REIMBURSEMENT = 0.5;
const CAP_MULTIPLIER = 2;
const BASE_PREMIUM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40 };
const INSURANCE_VALUE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };

function itemBase(item: Item, items: Item[]): number {
  if (item.type in BASE_PREMIUM) return BASE_PREMIUM[item.type];
  const count = items.filter(({ type }) => type === item.type).length;
  return count === BLOCK_SIZE ? BLOCK_PREMIUM / BLOCK_SIZE : COMPONENT_PREMIUM;
}

function premium(items: Item[], years: number, followUp: boolean): number {
  const base = items.reduce((sum, item) => sum + itemBase(item, items), 0);
  const curse = items.reduce((sum, item) => sum + (item.cursed ? itemBase(item, items) * CURSE_SURCHARGE : 0), 0);
  const enchanted = items.reduce((sum, item) =>
    sum + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? itemBase(item, items) * ENCHANTMENT_SURCHARGE : 0), 0);
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_DISCOUNT : 0;
  const contract = followUp ? base * FOLLOW_UP_DISCOUNT : 0;
  return Math.ceil(base + curse + enchanted + base * INITIAL_ASSESSMENT - loyalty - contract + PROCESSING_FEE);
}

function createPolicy(items: Item[]): Policy {
  const sum = items.reduce((total, item) => total + INSURANCE_VALUE[item.type], 0);
  return { items, remainingCap: sum * CAP_MULTIPLIER };
}

function settle(policy: Policy, damages: Damage[]): Record<string, number> {
  if (damages.some(({ amount }) => amount < 0)) throw new Error("Damage amount cannot be negative");
  const types = new Set(damages.map(({ itemType }) => itemType));
  for (const type of types) {
    const insured = policy.items.filter((item) => item.type === type).length;
    if (damages.filter(({ itemType }) => itemType === type).length > insured) throw new Error("Damage is not insured");
  }
  const desired = damages.reduce((sum, damage) => {
    const item = policy.items.find(({ type }) => type === damage.itemType);
    const rate = (item?.enchantment ?? 0) >= CLAIM_ENCHANTMENT ? ENCHANTED_REIMBURSEMENT : 1;
    return sum + Math.max(0, damage.amount * rate - DEDUCTIBLE);
  }, 0);
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Array<Record<string, number>> } {
  const results: Array<Record<string, number>> = [];
  const policies: Array<Policy | undefined> = [];
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const items = step.items ?? [];
      if (items.some((item) => !(item.type in INSURANCE_VALUE))) throw new Error("Unknown item type");
      results.push({ premium: premium(items, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
      policies[index] = createPolicy(items);
      quoteCount += 1;
    } else {
      const policy = policies[step.policy ?? -1];
      if (!policy) throw new Error("Policy does not exist");
      results.push(settle(policy, step.incident?.damages ?? []));
    }
  });
  return { results };
}
