const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_ENCHANTMENT_RATE = 0.5;

const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const isStandardItem = (item: any): boolean => item.type in BASE_PREMIUMS;

const isComponent = (item: any): boolean => COMPONENT_TYPES.has(item.type);

const itemBasePremium = (item: any): number => BASE_PREMIUMS[item.type] ?? 0;

function countBy(items: any[], key: (item: any) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const k = key(item);
    counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts;
}

function componentGroupPremium(count: number): number {
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
}

function componentPremium(items: any[]): number {
  const components = items.filter(isComponent);
  const typeCounts = countBy(components, (c) => c.type);
  return Object.values(typeCounts).reduce(
    (sum, count) => sum + componentGroupPremium(count),
    0,
  );
}

function itemSurcharge(item: any): number {
  const base = itemBasePremium(item);
  const cursedSurcharge = item.cursed ? base * CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return cursedSurcharge + enchantmentSurcharge;
}

function validateItems(items: any[]): void {
  for (const item of items) {
    if (!isStandardItem(item) && !isComponent(item)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function calculateQuotePremium(items: any[], customer: any, quoteIndex: number): number {
  validateItems(items);
  const standardItems = items.filter(isStandardItem);
  const standardBase = standardItems.reduce(
    (sum: number, item: any) => sum + itemBasePremium(item),
    0,
  );
  const standardSurcharges = standardItems.reduce(
    (sum: number, item: any) => sum + itemSurcharge(item),
    0,
  );
  const policyBase = standardBase + componentPremium(items);
  const firstInsurance = policyBase * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = quoteIndex > 0 ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(policyBase + standardSurcharges + firstInsurance - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

function itemInsuranceValue(item: any): number {
  if (isComponent(item)) return COMPONENT_INSURANCE_VALUE;
  return INSURANCE_VALUES[item.type] ?? 0;
}

function insuranceSum(items: any[]): number {
  return items.reduce((sum: number, item: any) => sum + itemInsuranceValue(item), 0);
}

function reimbursementRate(policyItem: any): number {
  return policyItem?.enchantment >= CLAIM_ENCHANTMENT_THRESHOLD ? CLAIM_ENCHANTMENT_RATE : 1;
}

function calculateDamagePayout(damage: any, policyItems: any[]): number {
  const policyItem = policyItems.find((i: any) => i.type === damage.itemType);
  if (!policyItem) {
    throw new Error(`Damage references item type not in policy: ${damage.itemType}`);
  }
  return Math.max(0, damage.amount * reimbursementRate(policyItem) - DEDUCTIBLE);
}

function validateDamages(damages: any[], policyItems: any[]): void {
  for (const d of damages) {
    if (d.amount < 0) {
      throw new Error(`Negative damage amount: ${d.amount}`);
    }
  }
  const damageCounts = countBy(damages, (d) => d.itemType);
  const itemCounts = countBy(policyItems, (item) => item.type);
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (itemCounts[type] ?? 0)) {
      throw new Error(`More damages of type ${type} than insured items`);
    }
  }
}

function processClaim(step: any, policies: Map<number, any>): { payout: number; remainingCap: number } {
  const policy = policies.get(step.policy)!;
  validateDamages(step.incident.damages, policy.items);
  const rawPayout = step.incident.damages.reduce(
    (sum: number, damage: any) => sum + calculateDamagePayout(damage, policy.items),
    0,
  );
  const payout = Math.floor(Math.min(rawPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: any): { results: any[] } {
  let quoteCount = 0;
  const policies = new Map<number, any>();
  const results = scenario.steps.map((step: any, index: number) => {
    if (step.op === "claim") {
      return processClaim(step, policies);
    }
    const premium = calculateQuotePremium(step.items, scenario.customer, quoteCount);
    policies.set(index, { items: step.items, remainingCap: insuranceSum(step.items) * 2 });
    quoteCount++;
    return { premium };
  });
  return { results };
}
