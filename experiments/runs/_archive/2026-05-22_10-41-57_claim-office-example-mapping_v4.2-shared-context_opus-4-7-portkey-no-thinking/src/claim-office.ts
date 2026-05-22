type Item = { type: string; enchantment?: number; cursed?: boolean };
type Damage = { itemType: string; amount: number };
type Step = {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: { cause?: string; damages: Damage[] };
};
type Scenario = {
  customer?: { yearsWithMHPCO?: number };
  steps: Step[];
};

const PROCESSING_FEE = 5;
const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const BLOCK_OF_3_PRICE = 60;
const BLOCK_ELIGIBLE_TYPES = new Set(["rune", "moonstone"]);
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const CURSE_SURCHARGE_RATE = 0.5;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function quotePremium(
  items: Item[],
  yearsWithMHPCO: number,
  quoteIndex: number,
): number {
  const countsByType: Record<string, number> = {};
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM_BY_ITEM_TYPE)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    countsByType[item.type] = (countsByType[item.type] ?? 0) + 1;
  }
  let policyBase = 0;
  for (const [type, count] of Object.entries(countsByType)) {
    if (BLOCK_ELIGIBLE_TYPES.has(type) && count === 3) {
      policyBase += BLOCK_OF_3_PRICE;
    } else {
      policyBase += count * BASE_PREMIUM_BY_ITEM_TYPE[type];
    }
  }
  let itemSurcharges = 0;
  for (const item of items) {
    let surchargeRate = 0;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      surchargeRate += HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
    if (item.cursed) {
      surchargeRate += CURSE_SURCHARGE_RATE;
    }
    itemSurcharges += surchargeRate * BASE_PREMIUM_BY_ITEM_TYPE[item.type];
  }
  const firstInsuranceCharge = policyBase * FIRST_INSURANCE_RATE;
  const loyaltyDiscount =
    yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = quoteIndex >= 1 ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  return (
    Math.ceil(
      policyBase + itemSurcharges + firstInsuranceCharge - loyaltyDiscount - followUpDiscount,
    ) + PROCESSING_FEE
  );
}

function adjustForEnchantment(amount: number, insuredItem: Item | undefined): number {
  if ((insuredItem?.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD) {
    return amount * HIGH_ENCHANTMENT_PAYOUT_RATE;
  }
  return amount;
}

function initialCapFor(policyItems: Item[]): number {
  const insuranceSum = policyItems.reduce(
    (sum, item) => sum + INSURANCE_VALUE_BY_ITEM_TYPE[item.type],
    0,
  );
  return CAP_MULTIPLIER * insuranceSum;
}

function reimbursementFor(damage: Damage, policyItems: Item[]): number {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
  const insuredItem = policyItems.find((item) => item.type === damage.itemType);
  if (insuredItem === undefined) {
    throw new Error(`Claim references item type not in policy: ${damage.itemType}`);
  }
  const adjustedAmount = adjustForEnchantment(damage.amount, insuredItem);
  return Math.max(0, adjustedAmount - DEDUCTIBLE_PER_DAMAGE);
}

function countByKey<T>(values: T[], keyOf: (value: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const value of values) {
    const key = keyOf(value);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

function assertDamagesMatchInsured(damages: Damage[], policyItems: Item[]): void {
  const insuredCountsByType = countByKey(policyItems, (item) => item.type);
  const damageCountsByType = countByKey(damages, (damage) => damage.itemType);
  for (const [type, count] of Object.entries(damageCountsByType)) {
    if (count > (insuredCountsByType[type] ?? 0)) {
      throw new Error(`Claim contains more damages of type ${type} than insured`);
    }
  }
}

function processClaim(
  claimStep: Step,
  steps: Step[],
  remainingCapByPolicy: Record<number, number>,
): { payout: number; remainingCap: number } {
  const policyIndex = claimStep.policy!;
  const policyItems = steps[policyIndex].items ?? [];
  if (!(policyIndex in remainingCapByPolicy)) {
    remainingCapByPolicy[policyIndex] = initialCapFor(policyItems);
  }
  const damages = claimStep.incident?.damages ?? [];
  assertDamagesMatchInsured(damages, policyItems);
  const grossPayout = damages.reduce(
    (sum, damage) => sum + reimbursementFor(damage, policyItems),
    0,
  );
  const payout = Math.min(
    Math.floor(grossPayout),
    remainingCapByPolicy[policyIndex],
  );
  remainingCapByPolicy[policyIndex] -= payout;
  return { payout, remainingCap: remainingCapByPolicy[policyIndex] };
}

export function processScenario(scenario: unknown): unknown {
  const { customer, steps } = scenario as Scenario;
  const yearsWithMHPCO = customer?.yearsWithMHPCO ?? 0;
  const remainingCapByPolicy: Record<number, number> = {};
  let quoteIndex = 0;
  const results = steps.map((step) => {
    if (step.op === "claim") {
      return processClaim(step, steps, remainingCapByPolicy);
    }
    const premium = quotePremium(step.items ?? [], yearsWithMHPCO, quoteIndex);
    quoteIndex += 1;
    return { premium };
  });
  return { results };
}
