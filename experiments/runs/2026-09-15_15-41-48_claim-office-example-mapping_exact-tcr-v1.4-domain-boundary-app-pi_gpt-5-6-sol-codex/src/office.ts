export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: string; items?: Item[]; policy?: number; incident?: Incident }>;
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

export interface Incident {
  cause: string;
  damages: Damage[];
}

const PROCESSING_FEE = 5;
const DAMAGE_DEDUCTIBLE = 100;
const POLICY_CAP_MULTIPLIER = 2;
const FIRST_INSURANCE_DIVISOR = 10;
const CURSE_SURCHARGE_DIVISOR = 2;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_DIVISOR = 5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HALF_REIMBURSEMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_DIVISOR = 2;
const HIGH_ENCHANTMENT_NUMERATOR = 3;
const HIGH_ENCHANTMENT_DIVISOR = 10;
const FOLLOW_UP_NUMERATOR = 3;
const FOLLOW_UP_DIVISOR = 20;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

function isComponentBlock(items: Item[], componentType: string): boolean {
  return items.filter((item) => item.type === componentType).length === COMPONENT_BLOCK_SIZE;
}

function calculateComponentBlockDiscount(items: Item[]): number {
  const ordinaryBlockPremium = COMPONENT_BLOCK_SIZE * MAIN_ITEM_PREMIUMS.rune;
  const blockSaving = ordinaryBlockPremium - COMPONENT_BLOCK_PREMIUM;
  return COMPONENT_TYPES.filter((type) => isComponentBlock(items, type)).length * blockSaving;
}

function calculateBasePremium(items: Item[]): number {
  const ordinaryTotal = items.reduce((total, item) => total + MAIN_ITEM_PREMIUMS[item.type], 0);
  return ordinaryTotal - calculateComponentBlockDiscount(items);
}

function calculateCurseSurcharge(items: Item[]): number {
  return items
    .filter((item) => item.cursed)
    .reduce((total, item) => total + MAIN_ITEM_PREMIUMS[item.type] / CURSE_SURCHARGE_DIVISOR, 0);
}

function calculateEnchantmentSurcharge(items: Item[]): number {
  return items
    .filter((item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL)
    .reduce((total, item) => total
      + MAIN_ITEM_PREMIUMS[item.type] * HIGH_ENCHANTMENT_NUMERATOR / HIGH_ENCHANTMENT_DIVISOR, 0);
}

function calculateLoyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? basePremium / LOYALTY_DISCOUNT_DIVISOR : 0;
}

function calculateFollowUpDiscount(basePremium: number, isFollowUp: boolean): number {
  return isFollowUp ? basePremium * FOLLOW_UP_NUMERATOR / FOLLOW_UP_DIVISOR : 0;
}

function calculateQuote(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const basePremium = calculateBasePremium(items);
  const firstInsurance = basePremium / FIRST_INSURANCE_DIVISOR;
  const loyaltyDiscount = calculateLoyaltyDiscount(basePremium, yearsWithMHPCO);
  const followUpDiscount = calculateFollowUpDiscount(basePremium, isFollowUp);
  const premium = basePremium + firstInsurance + calculateCurseSurcharge(items)
    + calculateEnchantmentSurcharge(items) - loyaltyDiscount - followUpDiscount + PROCESSING_FEE;
  return Math.ceil(premium);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function validateKnownItems(items: Item[]): void {
  const unknownItem = items.find((item) => !Object.hasOwn(INSURANCE_VALUES, item.type));
  if (unknownItem) throw new Error(`Unknown item type: ${unknownItem.type}`);
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0);
  return { items, remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER };
}

function isHalfReimbursed(item: Item): boolean {
  return (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_LEVEL;
}

function calculateDamagePayout(damage: Damage, item: Item): number {
  const reimbursableDamage = isHalfReimbursed(item)
    ? damage.amount / HALF_REIMBURSEMENT_DIVISOR
    : damage.amount;
  return Math.max(reimbursableDamage - DAMAGE_DEDUCTIBLE, 0);
}

function calculateIncidentPayout(policy: Policy, incident: Incident): number {
  return incident.damages.reduce((total, damage) => {
    const item = policy.items.find((insuredItem) => insuredItem.type === damage.itemType)!;
    return total + calculateDamagePayout(damage, item);
  }, 0);
}

function validateDamageMultiplicity(policy: Policy, incident: Incident): void {
  const exceedsCoverage = incident.damages.some((damage) =>
    incident.damages.filter((candidate) => candidate.itemType === damage.itemType).length
      > policy.items.filter((item) => item.type === damage.itemType).length);
  if (exceedsCoverage) throw new Error("Damage entries exceed insured items");
}

function validateDamageAmounts(incident: Incident): void {
  if (incident.damages.some((damage) => damage.amount < 0)) throw new Error("Negative damage amount");
}

function processClaim(policy: Policy, incident: Incident): Record<string, number> {
  validateDamageMultiplicity(policy, incident);
  validateDamageAmounts(incident);
  const payout = Math.floor(Math.min(calculateIncidentPayout(policy, incident), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function executeScenario(scenario: Scenario): { results: Array<Record<string, number>> } {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") return processClaim(policies.get(step.policy ?? -1)!, step.incident!);
    const items = step.items ?? [];
    validateKnownItems(items);
    policies.set(index, createPolicy(items));
    const premium = calculateQuote(items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
    quoteCount += 1;
    return { premium };
  });
  return { results };
}
