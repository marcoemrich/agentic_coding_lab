export interface QuoteInput {
  customer?: { yearsWithMHPCO: number; previousContracts?: number };
  items: {
    type: string;
    material?: string;
    cursed?: boolean;
    enchantment?: number;
  }[];
}

const PROCESSING_FEE = 5;

const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;

const CURSE_SURCHARGE_RATE = 0.5;

const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const LOYALTY_MINIMUM_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

// Premiums are rounded up to whole G, in MHPCO's favour.
const roundUpToWholeG = (amount: number): number => Math.ceil(amount);

// Payouts are rounded down to whole G, in MHPCO's favour.
const roundDownToWholeG = (amount: number): number => Math.floor(amount);

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

export function quote(input: QuoteInput): number {
  const countsByType: Record<string, number> = {};
  for (const item of input.items) {
    countsByType[item.type] = (countsByType[item.type] ?? 0) + 1;
  }

  let basePremiumTotal = 0;
  for (const type of Object.keys(countsByType)) {
    const count = countsByType[type];
    if (count === BLOCK_SIZE) {
      basePremiumTotal += BLOCK_PRICE;
    } else {
      basePremiumTotal += count * BASE_PREMIUMS[type];
    }
  }

  const isFirstInsurance = input.customer?.previousContracts !== undefined;

  let surchargeTotal = 0;
  for (const item of input.items) {
    const itemBasePremium = BASE_PREMIUMS[item.type];
    if (item.cursed) {
      surchargeTotal += itemBasePremium * CURSE_SURCHARGE_RATE;
    }
    if (
      item.enchantment !== undefined &&
      item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD
    ) {
      surchargeTotal += itemBasePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
    if (isFirstInsurance) {
      surchargeTotal += itemBasePremium * FIRST_INSURANCE_SURCHARGE_RATE;
    }
  }

  const isLoyal =
    (input.customer?.yearsWithMHPCO ?? 0) >= LOYALTY_MINIMUM_YEARS;
  const isFollowUp = (input.customer?.previousContracts ?? 0) >= 1;

  const loyaltyDiscount = isLoyal ? basePremiumTotal * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUp
    ? basePremiumTotal * FOLLOW_UP_DISCOUNT_RATE
    : 0;

  const rawPremium =
    basePremiumTotal -
    loyaltyDiscount -
    followUpDiscount +
    surchargeTotal +
    PROCESSING_FEE;

  return roundUpToWholeG(rawPremium);
}

export interface ClaimInput {
  items: { type: string; material?: string; enchantment?: number }[];
  remainingCap?: number;
  incident: { cause: string; damages: { itemType: string; amount: number }[] };
}

export interface ClaimResult {
  payout: number;
  // The cap left over after this claim, so successive claims can be chained by
  // passing it back in as ClaimInput.remainingCap. Optional because callers who
  // only need the payout can ignore it.
  remainingCap?: number;
}

const DEDUCTIBLE = 100;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const hasHighEnchantment = (
  item: ClaimInput["items"][number] | undefined,
): boolean =>
  item?.enchantment !== undefined &&
  item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

// Reimbursement for a single damage, before the deductible is applied.
const reimbursementBeforeDeductible = (
  item: ClaimInput["items"][number] | undefined,
  damageAmount: number,
): number =>
  hasHighEnchantment(item)
    ? damageAmount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damageAmount;

// The total payout is capped at a multiple of the unmodified insurance sum.
const payoutCap = (items: ClaimInput["items"]): number => {
  const insuranceSum = items.reduce(
    (total, item) => total + INSURANCE_VALUES[item.type],
    0,
  );
  return CAP_MULTIPLIER * insuranceSum;
};

export function claim(input: ClaimInput): ClaimResult {
  const rawPayout = input.incident.damages.reduce((total, damage) => {
    const item = input.items.find((i) => i.type === damage.itemType);
    const reimbursed = reimbursementBeforeDeductible(item, damage.amount);
    return total + (reimbursed - DEDUCTIBLE);
  }, 0);

  const availableRemainingCap = input.remainingCap ?? payoutCap(input.items);
  const payout = roundDownToWholeG(Math.min(rawPayout, availableRemainingCap));
  return { payout, remainingCap: availableRemainingCap - payout };
}
