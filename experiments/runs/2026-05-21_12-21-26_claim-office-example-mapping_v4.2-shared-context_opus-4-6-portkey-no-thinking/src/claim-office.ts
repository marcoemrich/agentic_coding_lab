export interface QuoteItem {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

export interface QuoteInput {
  items: QuoteItem[];
  customer: { yearsWithMHPCO: number };
  isFollowUp: boolean;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const BLOCK_OF_3_PREMIUM = 60;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

export function quote(input: QuoteInput): number {
  let policyBase = 0;

  const itemTypeCounts: Record<string, number> = {};
  for (const item of input.items) {
    itemTypeCounts[item.type] = (itemTypeCounts[item.type] || 0) + 1;
  }

  for (const [type, count] of Object.entries(itemTypeCounts)) {
    if (count === 3) {
      policyBase += BLOCK_OF_3_PREMIUM;
    } else {
      policyBase += count * BASE_PREMIUM[type];
    }
  }

  let itemSurcharges = 0;
  for (const item of input.items) {
    const itemBase = BASE_PREMIUM[item.type];
    if (item.cursed) {
      itemSurcharges += itemBase * CURSED_SURCHARGE_RATE;
    }
    if (item.enchantment !== undefined && item.enchantment >= 5) {
      itemSurcharges += itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
  }

  const loyaltyDiscount = input.customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_RATE;
  const followUpDiscount = input.isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  const totalDiscounts = loyaltyDiscount + followUpDiscount;
  const policyPremium = policyBase + itemSurcharges + firstInsuranceSurcharge - totalDiscounts;
  return Math.ceil(policyPremium + PROCESSING_FEE);
}

export interface ClaimItem {
  type: string;
  enchantment?: number;
  material?: string;
}

export interface DamageEntry {
  type: string;
  amount: number;
}

export interface ClaimInput {
  policyItems: ClaimItem[];
  damages: DamageEntry[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

export function claim(input: ClaimInput): ClaimResult {
  const damageCounts: Record<string, number> = {};
  for (const damage of input.damages) {
    damageCounts[damage.type] = (damageCounts[damage.type] || 0) + 1;
  }
  const policyCounts: Record<string, number> = {};
  for (const item of input.policyItems) {
    policyCounts[item.type] = (policyCounts[item.type] || 0) + 1;
  }
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] || 0)) {
      throw new Error(`More damage entries for ${type} than policy covers`);
    }
  }

  const payout = input.damages.reduce(
    (sum, damage) => {
      const policyItem = input.policyItems.find((item) => item.type === damage.type);
      const enchantmentLevel = policyItem?.enchantment ?? 0;
      const isHighEnchantment = enchantmentLevel >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
      const reimbursement = isHighEnchantment ? damage.amount * HIGH_ENCHANTMENT_CLAIM_RATE : damage.amount;
      return sum + reimbursement - DEDUCTIBLE;
    },
    0,
  );
  const insuranceSum = input.policyItems.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
  const insuranceCap = 2 * insuranceSum;
  const flooredPayout = Math.floor(payout);
  return { payout: flooredPayout, remainingCap: insuranceCap - flooredPayout };
}
