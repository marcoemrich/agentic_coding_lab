export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
export type Damage = { itemType: string; amount: number };
export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
export type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
type Policy = { items: Item[]; remainingCap: number };

const PRICE_LIST: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};
const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_RATE = 0.5;
const ENCHANTMENT_RATE = 0.3;
const PREMIUM_ENCHANTMENT = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT = 8;
const ENCHANTED_REIMBURSEMENT = 0.5;
const DEDUCTIBLE = 100;

function price(item: Item): { value: number; premium: number } {
  const entry = PRICE_LIST[item.type];
  if (!entry) throw new Error(`Unknown item type: ${item.type}`);
  return entry;
}

function componentBlockDiscount(items: Item[]): number {
  return ["rune", "moonstone"].reduce((sum, type) =>
    sum + (items.filter(item => item.type === type).length === BLOCK_SIZE
      ? BLOCK_SIZE * price({ type }).premium - BLOCK_PREMIUM : 0), 0);
}

function basePremium(items: Item[]): number {
  return items.reduce((sum, item) => sum + price(item).premium, 0) - componentBlockDiscount(items);
}

function itemRisk(items: Item[]): number {
  return items.reduce((sum, item) => sum + price(item).premium *
    ((item.cursed ? CURSE_RATE : 0) + ((item.enchantment ?? 0) >= PREMIUM_ENCHANTMENT ? ENCHANTMENT_RATE : 0)), 0);
}

function quotePremium(items: Item[], years: number, previousQuotes: number): number {
  const base = basePremium(items);
  const policyRate = FIRST_INSURANCE_RATE - (years >= LOYALTY_YEARS ? LOYALTY_RATE : 0)
    - (previousQuotes > 0 ? FOLLOW_UP_RATE : 0);
  return Math.ceil(base + itemRisk(items) + base * policyRate + PROCESSING_FEE);
}

function insuranceCap(items: Item[]): number {
  return CAP_MULTIPLIER * items.reduce((sum, item) => sum + price(item).value, 0);
}

function reimbursement(item: Item, amount: number): number {
  const covered = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT ? amount * ENCHANTED_REIMBURSEMENT : amount;
  return Math.max(0, covered - DEDUCTIBLE);
}

function claim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const available = [...policy.items];
  const desired = damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error(`Negative damage: ${damage.amount}`);
    const index = available.findIndex(item => item.type === damage.itemType);
    if (index < 0) throw new Error(`Uninsured damage item: ${damage.itemType}`);
    const [item] = available.splice(index, 1);
    return sum + reimbursement(item, damage.amount);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Array<{ premium: number } | { payout: number; remainingCap: number }> } {
  const policies = new Map<number, Policy>();
  let previousQuotes = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, previousQuotes);
      policies.set(index, { items: step.items, remainingCap: insuranceCap(step.items) });
      previousQuotes += 1;
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Unknown policy step: ${step.policy}`);
    return claim(policy, step.incident.damages);
  });
  return { results };
}
