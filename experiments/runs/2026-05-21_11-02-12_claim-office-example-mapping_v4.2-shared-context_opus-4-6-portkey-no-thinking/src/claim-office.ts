const BASE_PREMIUM = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
} as const;

export type ItemType = keyof typeof BASE_PREMIUM;

export type Item = { type: ItemType; cursed?: boolean; enchantment?: number };
export type Customer = { yearsWithMHPCO: number };
export type QuoteOptions = { isFollowUp?: boolean };

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const COMPONENT_TYPES: ReadonlySet<ItemType> = new Set<ItemType>(["rune", "moonstone"]);
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const DEDUCTIBLE = 100;

function itemSurcharge(item: Item): number {
  const base = BASE_PREMIUM[item.type];
  const cursed = item.cursed ? base * CURSED_SURCHARGE_RATE : 0;
  const enchantment =
    item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD
      ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return cursed + enchantment;
}

export function calculatePayout(policy: { items: Item[] }, damages: { itemType: ItemType; amount: number }[]): number {
  const totalPayout = damages.reduce(
    (sum, damage) => {
      const policyItem = policy.items.find((item) => item.type === damage.itemType);
      const reimbursementRate = policyItem && policyItem.enchantment !== undefined && policyItem.enchantment >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD
        ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
        : 1;
      return sum + damage.amount * reimbursementRate - DEDUCTIBLE;
    },
    0,
  );
  return Math.floor(totalPayout);
}

export function calculatePremium(items: Item[], customer?: Customer, options?: QuoteOptions): number {
  const groups = new Map<ItemType, number>();
  let totalSurcharge = 0;
  for (const item of items) {
    groups.set(item.type, (groups.get(item.type) ?? 0) + 1);
    totalSurcharge += itemSurcharge(item);
  }

  let basePremiumTotal = 0;
  for (const [type, count] of groups) {
    if (COMPONENT_TYPES.has(type) && count === BLOCK_SIZE) {
      basePremiumTotal += BLOCK_PREMIUM;
    } else {
      basePremiumTotal += count * BASE_PREMIUM[type];
    }
  }
  let policyPremium = basePremiumTotal;
  if (customer && customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    policyPremium *= 1 - LOYALTY_DISCOUNT_RATE;
  }
  policyPremium += policyPremium * FIRST_INSURANCE_SURCHARGE_RATE;
  if (options?.isFollowUp) {
    policyPremium *= 1 - FOLLOW_UP_DISCOUNT_RATE;
  }
  return Math.ceil(policyPremium + totalSurcharge + PROCESSING_FEE);
}
