export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<Record<string, unknown>>;
}

export interface ScenarioResult {
  results: Array<Record<string, number>>;
}

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const COMPONENT_INSURANCE_VALUE = 250;
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const SWORD_BASE_PREMIUM = 100;
const AMULET_BASE_PREMIUM = 60;
const STAFF_BASE_PREMIUM = 80;
const POTION_BASE_PREMIUM = 40;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const KNOWN_ITEM_TYPES = new Set(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

const isComponent = (item: Item): boolean =>
  item.type === "rune" || item.type === "moonstone";

const basePremiumFor = (item: Item): number => {
  if (item.type === "sword") return SWORD_BASE_PREMIUM;
  if (item.type === "amulet") return AMULET_BASE_PREMIUM;
  if (item.type === "staff") return STAFF_BASE_PREMIUM;
  if (item.type === "potion") return POTION_BASE_PREMIUM;
  if (isComponent(item)) return COMPONENT_BASE_PREMIUM;
  return 0;
};

const componentPremium = (items: Item[]): number => {
  const counts = new Map<string, number>();
  items.filter(isComponent).forEach((item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1));
  return [...counts.values()].reduce(
    (total, count) => total + (count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_BASE_PREMIUM),
    0,
  );
};

const curseSurcharge = (item: Item): number =>
  item.cursed ? basePremiumFor(item) * CURSE_SURCHARGE_RATE : 0;

const enchantmentSurcharge = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
    ? basePremiumFor(item) * ENCHANTMENT_SURCHARGE_RATE
    : 0;

const itemRiskSurcharge = (item: Item): number =>
  curseSurcharge(item) + enchantmentSurcharge(item);

const loyaltyDiscount = (basePremium: number, yearsWithMHPCO: number): number =>
  yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_DISCOUNT_RATE : 0;

const validateItems = (items: Item[]): void => {
  items.forEach((item) => {
    if (!KNOWN_ITEM_TYPES.has(item.type)) throw new Error(`Unknown item type: ${item.type}`);
  });
};

const followUpDiscount = (basePremium: number, isFollowUp: boolean): number =>
  isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;

const quotePremium = (
  items: Item[],
  yearsWithMHPCO: number,
  isFollowUp: boolean,
): number => {
  validateItems(items);
  const mainItemPremium = items.filter((item) => !isComponent(item)).reduce(
    (total, item) => total + basePremiumFor(item),
    0,
  );
  const basePremium = mainItemPremium + componentPremium(items);
  const riskSurcharge = items.reduce((total, item) => total + itemRiskSurcharge(item), 0);
  const discount = loyaltyDiscount(basePremium, yearsWithMHPCO);
  const contractDiscount = followUpDiscount(basePremium, isFollowUp);
  return Math.ceil(basePremium + riskSurcharge + basePremium * INITIAL_ASSESSMENT_RATE - discount - contractDiscount + PROCESSING_FEE);
};

const insuranceValueFor = (item: Item): number =>
  isComponent(item) ? COMPONENT_INSURANCE_VALUE : INSURANCE_VALUES[item.type] ?? 0;

const createPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: items.reduce((sum, item) => sum + insuranceValueFor(item), 0) * CAP_MULTIPLIER,
});

const reimbursementFor = (item: Item, damage: Damage): number => {
  const reimbursable = (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_LEVEL
    ? damage.amount * HALF_REIMBURSEMENT_RATE
    : damage.amount;
  return Math.max(0, reimbursable - DEDUCTIBLE);
};

const consumeCoveredItem = (availableItems: Item[], itemType: string): Item => {
  const itemIndex = availableItems.findIndex((item) => item.type === itemType);
  if (itemIndex < 0) throw new Error(`Damage item is not covered: ${itemType}`);
  return availableItems.splice(itemIndex, 1)[0];
};

const validateDamage = (damage: Damage): void => {
  if (!KNOWN_ITEM_TYPES.has(damage.itemType)) {
    throw new Error(`Unknown damage item type: ${damage.itemType}`);
  }
  if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
};

const desiredClaimPayout = (policy: Policy, damages: Damage[]): number => {
  const availableItems = [...policy.items];
  return damages.reduce((sum, damage) => {
    validateDamage(damage);
    return sum + reimbursementFor(consumeCoveredItem(availableItems, damage.itemType), damage);
  }, 0);
};

const processClaim = (policy: Policy, damages: Damage[]): Record<string, number> => {
  const desiredPayout = desiredClaimPayout(policy, damages);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const processScenario = (scenario: Scenario): ScenarioResult => {
  const results: Array<Record<string, number>> = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const items = step.items as Item[];
      results.push({ premium: quotePremium(items, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
      policies.set(index, createPolicy(items));
      quoteCount += 1;
      return;
    }
    const policy = policies.get(step.policy as number);
    if (!policy) throw new Error("Claim policy does not reference an earlier quote");
    const incident = step.incident as { damages: Damage[] };
    results.push(processClaim(policy, incident.damages));
  });
  return { results };
};
