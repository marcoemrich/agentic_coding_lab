const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const MINIMUM_ENCHANTMENT_FOR_SURCHARGE = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const MINIMUM_YEARS_FOR_LOYALTY_DISCOUNT = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const PER_DAMAGE_DEDUCTIBLE = 100;
const CLAIM_CAP_MULTIPLIER = 2;
const MINIMUM_ENCHANTMENT_FOR_REDUCED_REIMBURSEMENT = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const EXACT_COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_ITEM_TYPES = new Set(["rune", "moonstone"]);
const ITEM_COVERAGE_BY_TYPE: Record<string, { basePremium: number; insuredValue: number }> = {
  sword: { basePremium: 100, insuredValue: 1000 },
  amulet: { basePremium: 60, insuredValue: 600 },
  staff: { basePremium: 80, insuredValue: 800 },
  potion: { basePremium: 40, insuredValue: 400 },
  rune: { basePremium: COMPONENT_BASE_PREMIUM, insuredValue: 250 },
  moonstone: { basePremium: COMPONENT_BASE_PREMIUM, insuredValue: 250 },
};

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

function coverageForItemType(itemType: string): { basePremium: number; insuredValue: number } {
  const coverage = ITEM_COVERAGE_BY_TYPE[itemType];
  if (coverage === undefined) throw new Error(`Unknown item type: ${itemType}`);
  return coverage;
}

function basePremiumForItemType(itemType: string): number {
  return coverageForItemType(itemType).basePremium;
}

function basePremiumForItems(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return [...counts].reduce((total, [type, count]) => {
    const isComponentBlock = COMPONENT_ITEM_TYPES.has(type) && count === EXACT_COMPONENT_BLOCK_SIZE;
    return total + (isComponentBlock ? COMPONENT_BLOCK_BASE_PREMIUM : basePremiumForItemType(type) * count);
  }, 0);
}

function premiumFor(items: Item[], customer: Customer, previousQuoteCount: number): number {
  const basePremium = basePremiumForItems(items);
  const curseSurcharge = items.reduce(
    (total, item) => total + (item.cursed === true ? basePremiumForItemType(item.type) * CURSE_SURCHARGE_RATE : 0), 0,
  );
  const enchantmentSurcharge = items.reduce(
    (total, item) => total + ((item.enchantment ?? 0) >= MINIMUM_ENCHANTMENT_FOR_SURCHARGE
      ? basePremiumForItemType(item.type) * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0), 0,
  );
  const loyaltyDiscount = customer.yearsWithMHPCO >= MINIMUM_YEARS_FOR_LOYALTY_DISCOUNT
    ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = previousQuoteCount > 0 ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(basePremium + curseSurcharge + enchantmentSurcharge + basePremium * INITIAL_ASSESSMENT_RATE
    - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

interface PolicyState {
  items: Item[];
  remainingCap: number;
}

function totalInsuredValue(items: Item[]): number {
  return items.reduce((total, item) => total + coverageForItemType(item.type).insuredValue, 0);
}

function removeMatchingInsuredItem(remainingItems: Item[], itemType: string): Item {
  const itemIndex = remainingItems.findIndex((item) => item.type === itemType);
  if (itemIndex < 0) throw new Error("Damaged item is not insured");
  const [item] = remainingItems.splice(itemIndex, 1);
  return item;
}

function processClaim(policy: PolicyState, damages: Damage[]): { payout: number; remainingCap: number } {
  const remainingItems = [...policy.items];
  const desiredPayout = damages.reduce((total, damage) => {
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
    const item = removeMatchingInsuredItem(remainingItems, damage.itemType);
    const reimbursementRate = (item.enchantment ?? 0) >= MINIMUM_ENCHANTMENT_FOR_REDUCED_REIMBURSEMENT
      ? REDUCED_REIMBURSEMENT_RATE : 1;
    return total + Math.max(0, damage.amount * reimbursementRate - PER_DAMAGE_DEDUCTIBLE);
  }, 0);
  const payout = Math.min(Math.floor(desiredPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: unknown[] } {
  let quoteCount = 0;
  const policies = new Map<number, PolicyState>();
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (policy === undefined) throw new Error("Claim requires a policy");
      return processClaim(policy, step.incident.damages);
    }
    const premium = premiumFor(step.items, scenario.customer, quoteCount);
    policies.set(stepIndex, { items: step.items, remainingCap: totalInsuredValue(step.items) * CLAIM_CAP_MULTIPLIER });
    quoteCount += 1;
    return { premium };
  });
  return { results };
}
