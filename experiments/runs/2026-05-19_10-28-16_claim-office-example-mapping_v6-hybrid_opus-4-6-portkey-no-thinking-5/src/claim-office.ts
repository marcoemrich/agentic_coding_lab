const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_MIN_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const DEDUCTIBLE = 100;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Step {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: {
    cause: string;
    damages: Damage[];
  };
}

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

function computeComponentPremium(items: Array<{ type: string }>): number {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
  }
  let premium = 0;
  for (const [type, count] of counts) {
    if (count === BLOCK_SIZE) {
      premium += BLOCK_PREMIUM;
    } else {
      premium += count * (BASE_PREMIUMS[type] ?? 0);
    }
  }
  return premium;
}

function computeItemSurcharge(item: Item): number {
  const basePremium = BASE_PREMIUMS[item.type] ?? 0;
  const curseSurcharge = item.cursed ? basePremium * CURSE_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return curseSurcharge + enchantmentSurcharge;
}

function computeQuotePremium(items: Item[], customer: { yearsWithMHPCO: number }, isFollowUp: boolean): number {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  const standardItems = items.filter((item) => !COMPONENT_TYPES.has(item.type));
  const standardBasePremium = standardItems.reduce((sum, item) => sum + (BASE_PREMIUMS[item.type] ?? 0), 0);
  const itemSurcharges = standardItems.reduce((sum, item) => sum + computeItemSurcharge(item), 0);
  const componentPremium = computeComponentPremium(items);
  const policyBase = standardBasePremium + componentPremium;
  const firstInsurance = policyBase * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(policyBase + itemSurcharges + firstInsurance - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

function computeDamageReimbursement(damage: Damage, items: Item[]): number {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
  const item = items.find((i) => i.type === damage.itemType);
  if (!item) {
    throw new Error(`Claim references item not in policy: ${damage.itemType}`);
  }
  const isHighEnchantment = (item.enchantment ?? 0) >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD;
  const adjustedAmount = isHighEnchantment ? damage.amount * CLAIM_HIGH_ENCHANTMENT_REIMBURSEMENT_RATE : damage.amount;
  return Math.max(0, adjustedAmount - DEDUCTIBLE);
}

function computeClaimResult(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const damageCounts = new Map<string, number>();
  for (const damage of damages) {
    damageCounts.set(damage.itemType, (damageCounts.get(damage.itemType) ?? 0) + 1);
  }
  for (const [type, count] of damageCounts) {
    const insuredCount = policy.items.filter((i) => i.type === type).length;
    if (count > insuredCount) {
      throw new Error(`More damages than insured items for type: ${type}`);
    }
  }
  const totalBeforeCap = damages.reduce((sum, damage) => sum + computeDamageReimbursement(damage, policy.items), 0);
  const totalPayout = Math.floor(Math.min(totalBeforeCap, policy.remainingCap));
  policy.remainingCap -= totalPayout;
  return { payout: totalPayout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: unknown[] } {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const items = step.items ?? [];
      const isFollowUp = quoteCount > 0;
      quoteCount++;
      const insuranceSum = items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
      policies.set(index, { items, insuranceSum, remainingCap: insuranceSum * 2 });
      return { premium: computeQuotePremium(items, scenario.customer, isFollowUp) };
    }
    if (step.op === "claim") {
      return computeClaimResult(policies.get(step.policy!)!, step.incident!.damages);
    }
    return {};
  });
  return { results };
}
