interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

interface Customer {
  yearsWithMHPCO: number;
  contractCount: number;
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
};

const BLOCK_PRICE_FOR_3_ALIKE = 60;
const CURSED_SURCHARGE_MULTIPLIER = 1.5;
const ENCHANTMENT_SURCHARGE_MULTIPLIER = 0.3;
const FIRST_INSURANCE_SURCHARGE_MULTIPLIER = 1.1;
const FOLLOW_UP_CONTRACT_DISCOUNT_MULTIPLIER = 0.85;
const LOYALTY_DISCOUNT_MULTIPLIER = 0.8;
const LOYALTY_DISCOUNT_MIN_YEARS = 2;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FOLLOW_UP_CONTRACT_MIN_COUNT = 1;

interface Policy {
  basePremium: number;
  premium: number;
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

const roundToCents = (amount: number): number => Math.round(amount * 100) / 100;

const multiplierIfEligible = (value: number, threshold: number, multiplier: number): number =>
  value >= threshold ? multiplier : 1;

const PROCESSING_FEE = 5;

const calculateItemCosts = (items: Item[]): number => {
  const nonCursedCountsByType: Record<string, number> = {};
  let cursedCost = 0;
  let enchantmentSurcharge = 0;

  for (const item of items) {
    const itemBasePremium = BASE_PREMIUMS[item.type];
    if (item.cursed) {
      cursedCost += itemBasePremium * CURSED_SURCHARGE_MULTIPLIER;
    } else {
      nonCursedCountsByType[item.type] = (nonCursedCountsByType[item.type] ?? 0) + 1;
      if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
        enchantmentSurcharge += itemBasePremium * ENCHANTMENT_SURCHARGE_MULTIPLIER;
      }
    }
  }

  let nonCursedCost = 0;
  for (const [type, count] of Object.entries(nonCursedCountsByType)) {
    if (count === 3) {
      nonCursedCost += BLOCK_PRICE_FOR_3_ALIKE;
    } else {
      nonCursedCost += count * BASE_PREMIUMS[type];
    }
  }

  return cursedCost + nonCursedCost + enchantmentSurcharge;
};

export function generateQuote(items: Item[], customer: Customer): Policy {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  const followUpMultiplier = multiplierIfEligible(customer.contractCount, FOLLOW_UP_CONTRACT_MIN_COUNT, FOLLOW_UP_CONTRACT_DISCOUNT_MULTIPLIER);
  const loyaltyMultiplier = multiplierIfEligible(customer.yearsWithMHPCO, LOYALTY_DISCOUNT_MIN_YEARS, LOYALTY_DISCOUNT_MULTIPLIER);
  const basePremium = roundToCents(calculateItemCosts(items) * FIRST_INSURANCE_SURCHARGE_MULTIPLIER * followUpMultiplier * loyaltyMultiplier);
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  const remainingCap = 2 * insuranceSum;
  return { basePremium, premium: Math.ceil(basePremium + PROCESSING_FEE), items, insuranceSum, remainingCap };
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_MULTIPLIER = 0.5;

interface Damage {
  itemType: string;
  amount: number;
}

interface Incident {
  cause: string;
  damages: Damage[];
}

const applyEnchantmentReduction = (amount: number, enchantment: number): number =>
  enchantment >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
    ? amount * HIGH_ENCHANTMENT_PAYOUT_MULTIPLIER
    : amount;

const countByType = (keys: string[]): Record<string, number> =>
  keys.reduce<Record<string, number>>((counts, key) => {
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});

export function processClaim(policy: Policy, incident: Incident): { payout: number; remainingCap: number } {
  const damageCountsByType = countByType(incident.damages.map((d) => d.itemType));
  const policyCountsByType = countByType(policy.items.map((i) => i.type));
  for (const [type, count] of Object.entries(damageCountsByType)) {
    if (count > (policyCountsByType[type] ?? 0)) {
      throw new Error(`Damage entries for type ${type} exceed insured count`);
    }
  }
  const damage = incident.damages[0];
  if (damage.amount < 0) {
    throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
  }
  const item = policy.items.find((i) => i.type === damage.itemType);
  if (!item) {
    throw new Error(`Item type not in policy: ${damage.itemType}`);
  }
  const effectiveDamage = applyEnchantmentReduction(damage.amount, item.enchantment ?? 0);
  const payoutBeforeCap = Math.max(0, effectiveDamage - DEDUCTIBLE);
  const payout = Math.floor(Math.min(payoutBeforeCap, policy.remainingCap));
  return { payout, remainingCap: policy.remainingCap - payout };
}
