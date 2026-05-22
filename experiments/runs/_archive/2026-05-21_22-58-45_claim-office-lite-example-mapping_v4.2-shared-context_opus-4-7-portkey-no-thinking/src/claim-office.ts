const BASE_PRICE_BY_TYPE: Record<string, number> = {
  potion: 40,
  amulet: 60,
  staff: 80,
  sword: 100,
  rune: 25,
  moonstone: 25,
};
const RUNE_COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const RUNE_COMPONENT_BLOCK_SIZE = 3;
const RUNE_COMPONENT_BLOCK_PRICE = 60;

const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const CURSE_SURCHARGE_RATE = 0.5;

const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOWUP_THRESHOLD_PREVIOUS_QUOTES = 1;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const PROCESSING_FEE = 5;

const DEDUCTIBLE_PER_ITEM = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

export function claim(input: { policy: { items: { type: string; material?: string; enchantment?: number }[] }; incident: { cause?: string; damages: { itemType: string; amount: number }[] } }): number {
  const damages = input.incident.damages;
  const policyItems = input.policy.items;
  const insuredCountByType: Record<string, number> = {};
  for (const item of policyItems) {
    insuredCountByType[item.type] = (insuredCountByType[item.type] ?? 0) + 1;
  }
  const claimedCountByType: Record<string, number> = {};
  for (const damage of damages) {
    claimedCountByType[damage.itemType] = (claimedCountByType[damage.itemType] ?? 0) + 1;
  }
  for (const type of Object.keys(claimedCountByType)) {
    const claimedCount = claimedCountByType[type];
    const insuredCount = insuredCountByType[type] ?? 0;
    if (claimedCount > insuredCount) {
      throw new Error(`Claim has more ${type} damages (${claimedCount}) than insured (${insuredCount})`);
    }
  }
  const totalPayout = damages.reduce((payoutSoFar, damage) => {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative: ${damage.amount}`);
    }
    const policyItem = policyItems.find((item) => item.type === damage.itemType);
    if (policyItem === undefined) {
      throw new Error(`Claim references item type not in policy: ${damage.itemType}`);
    }
    const hasHighEnchantment = (policyItem.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
    const reimbursable = hasHighEnchantment ? damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATE : damage.amount;
    return payoutSoFar + (reimbursable - DEDUCTIBLE_PER_ITEM);
  }, 0);
  return Math.floor(totalPayout);
}

export function quote(input: { customer: { yearsWithMHPCO: number }; items: { type: string; enchantment?: number; cursed?: boolean }[]; previousQuoteCount?: number }): number {
  const items = input.items;
  for (const item of items) {
    if (!(item.type in BASE_PRICE_BY_TYPE)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  const countByType: Record<string, number> = {};
  for (const item of items) {
    countByType[item.type] = (countByType[item.type] ?? 0) + 1;
  }
  let basePrice = 0;
  for (const type of Object.keys(countByType)) {
    const count = countByType[type];
    const formsRuneBlock = RUNE_COMPONENT_TYPES.has(type) && count === RUNE_COMPONENT_BLOCK_SIZE;
    if (formsRuneBlock) {
      basePrice += RUNE_COMPONENT_BLOCK_PRICE;
    } else {
      basePrice += count * BASE_PRICE_BY_TYPE[type];
    }
  }
  let highEnchantmentSurcharges = 0;
  let cursedSurcharges = 0;
  for (const item of items) {
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      highEnchantmentSurcharges += BASE_PRICE_BY_TYPE[item.type] * HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
    if (item.cursed === true) {
      cursedSurcharges += BASE_PRICE_BY_TYPE[item.type] * CURSE_SURCHARGE_RATE;
    }
  }
  const firstInsuranceSurcharge = basePrice * FIRST_INSURANCE_SURCHARGE_RATE;
  const qualifiesForLoyaltyDiscount = input.customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;
  const loyaltyDiscount = qualifiesForLoyaltyDiscount ? basePrice * LOYALTY_DISCOUNT_RATE : 0;
  const qualifiesForFollowUpDiscount = (input.previousQuoteCount ?? 0) >= FOLLOWUP_THRESHOLD_PREVIOUS_QUOTES;
  const followUpDiscount = qualifiesForFollowUpDiscount ? basePrice * FOLLOWUP_DISCOUNT_RATE : 0;
  const premium = basePrice + cursedSurcharges + highEnchantmentSurcharges + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount + PROCESSING_FEE;
  return Math.ceil(premium);
}
