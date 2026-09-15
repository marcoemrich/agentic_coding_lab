export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

interface QuoteStep { op: "quote"; items: Item[] }
interface Damage { itemType: string; amount: number }
interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

type Result = { premium: number } | { payout: number; remainingCap: number };

const SWORD_BASE_PREMIUM = 100;
const AMULET_BASE_PREMIUM = 60;
const STAFF_BASE_PREMIUM = 80;
const POTION_BASE_PREMIUM = 40;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const INITIAL_ASSESSMENT_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const PERCENT = 100;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CLAIM_HIGH_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_FACTOR = 0.5;
const CAP_MULTIPLIER = 2;
const SWORD_INSURANCE_VALUE = 1000;
const AMULET_INSURANCE_VALUE = 600;
const STAFF_INSURANCE_VALUE = 800;
const POTION_INSURANCE_VALUE = 400;
const COMPONENT_INSURANCE_VALUE = 250;

const INSURANCE_VALUE: Record<string, number> = {
  sword: SWORD_INSURANCE_VALUE,
  amulet: AMULET_INSURANCE_VALUE,
  staff: STAFF_INSURANCE_VALUE,
  potion: POTION_INSURANCE_VALUE,
  rune: COMPONENT_INSURANCE_VALUE,
  moonstone: COMPONENT_INSURANCE_VALUE,
};

const BASE_PREMIUM: Record<string, number> = {
  sword: SWORD_BASE_PREMIUM,
  amulet: AMULET_BASE_PREMIUM,
  staff: STAFF_BASE_PREMIUM,
  potion: POTION_BASE_PREMIUM,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
};

function basePremium(items: Item[]): number {
  items.forEach((item) => {
    if (BASE_PREMIUM[item.type] === undefined) throw new Error(`Unknown item type: ${item.type}`);
  });
  const counts = new Map<string, number>();
  items.forEach((item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1));
  return [...counts].reduce((sum, [type, count]) => {
    const isComponentBlock = (type === "rune" || type === "moonstone") && count === COMPONENT_BLOCK_SIZE;
    return sum + (isComponentBlock ? COMPONENT_BLOCK_PREMIUM : BASE_PREMIUM[type] * count);
  }, 0);
}

function itemRiskSurcharge(items: Item[]): number {
  return items.reduce((sum, item) => {
    const cursePercent = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
    const enchantmentPercent = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
      ? ENCHANTMENT_SURCHARGE_PERCENT : 0;
    return sum + BASE_PREMIUM[item.type] * (cursePercent + enchantmentPercent) / PERCENT;
  }, 0);
}

function quote(items: Item[], yearsWithMHPCO: number, contractIndex: number): number {
  const base = basePremium(items);
  const assessment = base * INITIAL_ASSESSMENT_PERCENT / PERCENT;
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_DISCOUNT_PERCENT / PERCENT : 0;
  const followUp = contractIndex > 0 ? base * FOLLOW_UP_DISCOUNT_PERCENT / PERCENT : 0;
  return Math.ceil(base + assessment + itemRiskSurcharge(items) - loyalty - followUp + PROCESSING_FEE);
}

function reimbursableDamage(item: Item | undefined, amount: number): number {
  const factor = (item?.enchantment ?? 0) >= CLAIM_HIGH_ENCHANTMENT_LEVEL ? HALF_REIMBURSEMENT_FACTOR : 1;
  return Math.max(0, amount * factor - DEDUCTIBLE);
}

function desiredPayout(policy: QuoteStep, damages: Damage[]): number {
  const unmatchedItems = [...policy.items];
  return damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
    const itemIndex = unmatchedItems.findIndex((insured) => insured.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Damage is not covered: ${damage.itemType}`);
    const [item] = unmatchedItems.splice(itemIndex, 1);
    return sum + reimbursableDamage(item, damage.amount);
  }, 0);
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const remainingCaps = new Map<number, number>();
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push({ premium: quote(step.items, scenario.customer.yearsWithMHPCO, index) });
      const insuranceSum = step.items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
      remainingCaps.set(index, insuranceSum * CAP_MULTIPLIER);
      return;
    }
    const policy = scenario.steps[step.policy] as QuoteStep;
    const desired = desiredPayout(policy, step.incident.damages);
    const remaining = remainingCaps.get(step.policy) ?? 0;
    const payout = Math.floor(Math.min(desired, remaining));
    remainingCaps.set(step.policy, remaining - payout);
    results.push({ payout, remainingCap: remaining - payout });
  });
  return { results };
}
