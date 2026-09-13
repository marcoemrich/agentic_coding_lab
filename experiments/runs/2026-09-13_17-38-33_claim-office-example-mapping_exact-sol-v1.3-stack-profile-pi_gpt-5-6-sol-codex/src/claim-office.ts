const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const SWORD_PREMIUM = 100;
const AMULET_PREMIUM = 60;
const STAFF_PREMIUM = 80;
const POTION_PREMIUM = 40;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_REDUCTION = 15;
const COMPONENT_TYPES = ["rune", "moonstone"];
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const POLICY_CAP_MULTIPLIER = 2;
const COMPONENT_INSURANCE_VALUE = 250;
const SWORD_INSURANCE_VALUE = 1000;
const AMULET_INSURANCE_VALUE = 600;
const STAFF_INSURANCE_VALUE = 800;
const POTION_INSURANCE_VALUE = 400;
const INSURANCE_VALUES: Record<string, number> = {
  sword: SWORD_INSURANCE_VALUE,
  amulet: AMULET_INSURANCE_VALUE,
  staff: STAFF_INSURANCE_VALUE,
  potion: POTION_INSURANCE_VALUE,
  rune: COMPONENT_INSURANCE_VALUE,
  moonstone: COMPONENT_INSURANCE_VALUE,
};
const ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: SWORD_PREMIUM,
  amulet: AMULET_PREMIUM,
  staff: STAFF_PREMIUM,
  potion: POTION_PREMIUM,
  rune: COMPONENT_PREMIUM,
  moonstone: COMPONENT_PREMIUM,
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

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: Customer;
  steps: Array<QuoteStep | ClaimStep>;
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

interface Policy {
  items: Item[];
  remainingCap: number;
}

function basePremium(items: Item[]): number {
  const listedPremium = items.reduce((sum, item) => sum + (ITEM_BASE_PREMIUMS[item.type] ?? 0), 0);
  const blocks = COMPONENT_TYPES.filter(
    (type) => items.filter((item) => item.type === type).length === COMPONENT_BLOCK_SIZE,
  ).length;
  return listedPremium - blocks * COMPONENT_BLOCK_REDUCTION;
}

function itemSurcharge(items: Item[]): number {
  return items.reduce((sum, item) => {
    const premium = ITEM_BASE_PREMIUMS[item.type] ?? 0;
    const curse = item.cursed ? premium * CURSE_SURCHARGE_RATE : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
      ? premium * ENCHANTMENT_SURCHARGE_RATE
      : 0;
    return sum + curse + enchantment;
  }, 0);
}

function quote(step: QuoteStep, customer: Customer, isFollowUp: boolean): { premium: number } {
  for (const item of step.items) {
    if (ITEM_BASE_PREMIUMS[item.type] === undefined) throw new Error("Unknown item type");
  }
  const base = basePremium(step.items);
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUp ? base * FOLLOW_UP_DISCOUNT_RATE : 0;
  const premium = base + itemSurcharge(step.items) + base * INITIAL_ASSESSMENT_RATE
    - loyaltyDiscount - followUpDiscount + PROCESSING_FEE;
  return { premium: Math.ceil(premium) };
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
  return { items, remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER };
}

function reimbursableDamage(damage: Damage, availableItems: Item[]): number {
  if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
  const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
  if (itemIndex < 0) throw new Error("Damage item is not covered by the policy");
  const [item] = availableItems.splice(itemIndex, 1);
  const rate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;
  return Math.max(0, damage.amount * rate - DEDUCTIBLE);
}

function claim(step: ClaimStep, policy: Policy): { payout: number; remainingCap: number } {
  const availableItems = [...policy.items];
  const desired = step.incident.damages.reduce(
    (sum, damage) => sum + reimbursableDamage(damage, availableItems),
    0,
  );
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function executeScenario(scenario: Scenario): { results: StepResult[] } {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") return claim(step, policies.get(step.policy) as Policy);
    const result = quote(step, scenario.customer, quoteCount > 0);
    policies.set(stepIndex, createPolicy(step.items));
    quoteCount += 1;
    return result;
  });
  return { results };
}
