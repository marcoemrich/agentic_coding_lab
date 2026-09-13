const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_RATE = 0.3;
const FOLLOW_UP_RATE = 0.15;
const HIGH_CLAIM_ENCHANTMENT = 8;
const REDUCED_REIMBURSEMENT = 0.5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const COMPONENT_VALUE = 250;
const SWORD_VALUE = 1000;
const AMULET_VALUE = 600;
const STAFF_VALUE = 800;
const POTION_VALUE = 400;
const SWORD_PREMIUM = 100;
const AMULET_PREMIUM = 60;
const STAFF_PREMIUM = 80;
const POTION_PREMIUM = 40;
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const MAIN_PREMIUMS: Record<string, number> = {
  sword: SWORD_PREMIUM, amulet: AMULET_PREMIUM, staff: STAFF_PREMIUM, potion: POTION_PREMIUM,
  rune: COMPONENT_PREMIUM, moonstone: COMPONENT_PREMIUM,
};
const INSURANCE_VALUES: Record<string, number> = {
  sword: SWORD_VALUE, amulet: AMULET_VALUE, staff: STAFF_VALUE, potion: POTION_VALUE,
  rune: COMPONENT_VALUE, moonstone: COMPONENT_VALUE,
};

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: string; [key: string]: unknown }>;
}
export interface Result { premium?: number; payout?: number; remainingCap?: number }
interface Item { type: string; cursed?: boolean; enchantment?: number; material?: string }
interface Damage { itemType: string; amount: number }
interface Policy { items: Item[]; remainingCap: number }

function componentGroupPremium(items: Item[], type: string): number {
  const count = items.filter((item) => item.type === type).length;
  return count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
}
function basePremium(items: Item[]): number {
  const mainItems = items.filter((item) => item.type !== "rune" && item.type !== "moonstone");
  const mainPremium = mainItems.reduce((sum, item) => sum + (MAIN_PREMIUMS[item.type] ?? 0), 0);
  return mainPremium + componentGroupPremium(items, "rune") + componentGroupPremium(items, "moonstone");
}
function quote(items: Item[], yearsWithMHPCO: number, followUp: boolean): number {
  const base = basePremium(items);
  const curse = items.reduce((sum, item) => sum + (item.cursed ? (MAIN_PREMIUMS[item.type] ?? 0) * CURSE_RATE : 0), 0);
  const enchantment = items.reduce((sum, item) => sum + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? (MAIN_PREMIUMS[item.type] ?? 0) * ENCHANTMENT_RATE : 0), 0);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const contractDiscount = followUp ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + curse + enchantment + base * FIRST_INSURANCE_RATE - loyalty - contractDiscount + PROCESSING_FEE);
}
function validateItems(items: Item[]): void {
  const unknown = items.find((item) => INSURANCE_VALUES[item.type] === undefined);
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
}
function policyCap(items: Item[]): number {
  return items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0) * CAP_MULTIPLIER;
}
function validateDamageQuantities(policy: Policy, damages: Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) {
    throw new Error("Damage amount must be non-negative");
  }
  const types = new Set(damages.map((damage) => damage.itemType));
  types.forEach((type) => {
    if (INSURANCE_VALUES[type] === undefined) throw new Error(`Unknown item type: ${type}`);
    const insured = policy.items.filter((item) => item.type === type).length;
    const damaged = damages.filter((damage) => damage.itemType === type).length;
    if (insured === 0) throw new Error(`Item type not insured: ${type}`);
    if (damaged > insured) throw new Error("Damage entries exceed insured quantity");
  });
}
function processClaim(policy: Policy, damages: Damage[]): Result {
  validateDamageQuantities(policy, damages);
  const matchedCounts = new Map<string, number>();
  const desired = damages.reduce((sum, damage) => {
    const occurrence = matchedCounts.get(damage.itemType) ?? 0;
    const matchingItems = policy.items.filter((item) => item.type === damage.itemType);
    const item = matchingItems[occurrence];
    matchedCounts.set(damage.itemType, occurrence + 1);
    const rate = (item.enchantment ?? 0) >= HIGH_CLAIM_ENCHANTMENT ? REDUCED_REIMBURSEMENT : 1;
    return sum + Math.max(0, damage.amount * rate - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const items = step.items as Item[];
      validateItems(items);
      results.push({ premium: quote(items, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
      policies.set(index, { items, remainingCap: policyCap(items) });
      quoteCount += 1;
    } else {
      const incident = step.incident as { damages: Damage[] };
      results.push(processClaim(policies.get(step.policy as number) as Policy, incident.damages));
    }
  });
  return { results };
}
