const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 1 / 10;
const LOYALTY_DISCOUNT_RATE = 2 / 10;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 15 / 100;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

export const KNOWN_ITEM_TYPES = new Set(Object.keys(BASE_PREMIUMS));

const CURSED_SURCHARGE_RATE = 1 / 2;

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const HIGHLY_ENCHANTED_THRESHOLD = 5;
const ENCHANTMENT_SURCHARGE_RATE = 3 / 10;

export type Item = { type: string; enchantment?: number; cursed?: boolean };
type Customer = { yearsAsCustomer: number };

const isComponent = (item: Item): boolean =>
  COMPONENT_TYPES.includes(item.type);

const hasEnchantmentAtLeast = (item: Item, threshold: number): boolean =>
  (item.enchantment ?? 0) >= threshold;

const isHighlyEnchanted = (item: Item): boolean =>
  hasEnchantmentAtLeast(item, HIGHLY_ENCHANTED_THRESHOLD);

const calculateItemBasePremium = (item: Item): number =>
  BASE_PREMIUMS[item.type] ?? 0;

const calculateItemSurcharges = (item: Item, basePremium: number): number => {
  const cursedSurcharge = item.cursed ? basePremium * CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = isHighlyEnchanted(item)
    ? basePremium * ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return cursedSurcharge + enchantmentSurcharge;
};

const countComponentsByType = (items: Item[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (isComponent(item)) {
      counts[item.type] = (counts[item.type] ?? 0) + 1;
    }
  }
  return counts;
};

const hasBlockDiscount = (componentCounts: Record<string, number>, type: string): boolean =>
  componentCounts[type] === BLOCK_SIZE;

export const quote = (items: Item[], customer: Customer, contractNumber: number): number => {
  const componentCounts = countComponentsByType(items);

  let policyBasePremium = 0;
  let itemSurcharges = 0;

  for (const item of items) {
    if (isComponent(item) && hasBlockDiscount(componentCounts, item.type)) {
      continue;
    }
    const basePremium = calculateItemBasePremium(item);
    policyBasePremium += basePremium;
    itemSurcharges += calculateItemSurcharges(item, basePremium);
  }

  for (const type of COMPONENT_TYPES) {
    if (hasBlockDiscount(componentCounts, type)) {
      policyBasePremium += BLOCK_PREMIUM;
    }
  }

  const firstInsuranceSurcharge = policyBasePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount =
    customer.yearsAsCustomer >= LOYALTY_YEARS_THRESHOLD
      ? policyBasePremium * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscount =
    contractNumber > 1 ? policyBasePremium * FOLLOW_UP_DISCOUNT_RATE : 0;

  const totalPremium =
    policyBasePremium + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount + itemSurcharges;

  return Math.ceil(totalPremium) + PROCESSING_FEE;
};

type Damage = { itemType: string; amount: number };
type ClaimResult = { payout: number; remainingCap: number };

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_RATE = 1 / 2;

const isHighlyEnchantedForClaim = (item: Item): boolean =>
  hasEnchantmentAtLeast(item, CLAIM_HIGH_ENCHANTMENT_THRESHOLD);

const findPolicyItem = (policyItems: Item[], itemType: string): Item | undefined =>
  policyItems.find((item) => item.type === itemType);

const calculateEffectiveDamage = (damage: Damage, policyItems: Item[]): number => {
  const matchedItem = findPolicyItem(policyItems, damage.itemType);
  if (matchedItem && isHighlyEnchantedForClaim(matchedItem)) {
    return damage.amount * CLAIM_HIGH_ENCHANTMENT_RATE;
  }
  return damage.amount;
};

export const claim = (
  policyItems: Item[],
  damages: Damage[],
  previousPayouts: number,
): ClaimResult => {
  const insuranceSum = policyItems.reduce(
    (sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0),
    0,
  );
  const cap = CAP_MULTIPLIER * insuranceSum;
  const availableCap = cap - previousPayouts;

  const rawPayout = damages.reduce((sum, damage) => {
    const effectiveAmount = calculateEffectiveDamage(damage, policyItems);
    return sum + Math.max(0, effectiveAmount - DEDUCTIBLE);
  }, 0);

  const cappedPayout = Math.min(rawPayout, availableCap);
  const roundedPayout = Math.floor(cappedPayout);
  return { payout: roundedPayout, remainingCap: availableCap - roundedPayout };
};
