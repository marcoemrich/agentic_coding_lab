export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type QuoteContext = {
  yearsWithMHPCO: number;
  isFollowUp: boolean;
};

const POLICY_FEE = 5;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;

const COMPONENT_TYPES = ["rune", "moonstone"];

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const isComponent = (item: Item): boolean =>
  COMPONENT_TYPES.includes(item.type);

const basePremiumFor = (item: Item): number => BASE_PREMIUM[item.type];

const itemSpecificSurcharges = (item: Item): number => {
  const base = basePremiumFor(item);
  const curseSurcharge = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const isHighEnchantment = item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD;
  const highEnchantmentSurcharge = isHighEnchantment ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return curseSurcharge + highEnchantmentSurcharge;
};

const componentGroupPremium = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PRICE : count * BASE_PREMIUM[type];

const loyaltyDiscountFor = (policyBasePremium: number, context: QuoteContext): number =>
  context.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? policyBasePremium * LOYALTY_DISCOUNT_RATE : 0;

const firstInsuranceSurchargeFor = (policyBasePremium: number): number =>
  policyBasePremium * FIRST_INSURANCE_SURCHARGE_RATE;

const followUpDiscountFor = (policyBasePremium: number, context: QuoteContext): number =>
  context.isFollowUp ? policyBasePremium * FOLLOW_UP_DISCOUNT_RATE : 0;

const assertKnownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

export function quote(items: Item[], context: QuoteContext): number {
  assertKnownItemTypes(items);

  const componentBasePremium = COMPONENT_TYPES.reduce((sum, type) => {
    const count = items.filter((item) => item.type === type).length;
    return sum + componentGroupPremium(type, count);
  }, 0);

  const mainItemsBasePremium = items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + basePremiumFor(item), 0);

  const unmodifiedBaseTotal = mainItemsBasePremium + componentBasePremium;

  const itemSpecificSurchargesTotal = items.reduce(
    (sum, item) => sum + itemSpecificSurcharges(item),
    0
  );

  const policyDiscounts =
    loyaltyDiscountFor(unmodifiedBaseTotal, context) +
    followUpDiscountFor(unmodifiedBaseTotal, context);
  const policySurcharges = firstInsuranceSurchargeFor(unmodifiedBaseTotal);

  const premium =
    unmodifiedBaseTotal +
    itemSpecificSurchargesTotal +
    policySurcharges -
    policyDiscounts +
    POLICY_FEE;

  return Math.ceil(premium);
}

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;

const CAP_MULTIPLIER = 2;

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const FULL_REIMBURSEMENT_RATE = 1;

const reimbursementRateFor = (item: Item): number => {
  const isHighEnchantment =
    item.enchantment !== undefined &&
    item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
  return isHighEnchantment
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;
};

const insuredItemFor = (policy: Item[], damage: Damage): Item => {
  const item = policy.find((item) => item.type === damage.itemType);
  if (item === undefined) {
    throw new Error(`Damage references item not in policy: ${damage.itemType}`);
  }
  return item;
};

const payoutForDamage = (policy: Item[], damage: Damage): number => {
  const item = insuredItemFor(policy, damage);
  return damage.amount * reimbursementRateFor(item) - DEDUCTIBLE;
};

const insuranceSumFor = (policy: Item[]): number =>
  policy.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);

const fullCapFor = (policy: Item[]): number =>
  CAP_MULTIPLIER * insuranceSumFor(policy);

const countByKey = <T>(items: T[], keyOf: (item: T) => string): Map<string, number> =>
  items.reduce(
    (counts, item) => counts.set(keyOf(item), (counts.get(keyOf(item)) ?? 0) + 1),
    new Map<string, number>()
  );

const assertDamageCountsWithinPolicy = (
  policy: Item[],
  incident: Incident
): void => {
  const insuredCounts = countByKey(policy, (item) => item.type);
  const damageCounts = countByKey(incident.damages, (damage) => damage.itemType);
  for (const [itemType, damageCount] of damageCounts) {
    const insuredCount = insuredCounts.get(itemType) ?? 0;
    if (damageCount > insuredCount) {
      throw new Error(
        `More ${itemType} damages than insured: ${damageCount} > ${insuredCount}`
      );
    }
  }
};

const assertNonNegativeDamageAmounts = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }
};

const assertDamagedItemsInPolicy = (policy: Item[], incident: Incident): void => {
  for (const damage of incident.damages) {
    insuredItemFor(policy, damage);
  }
};

export function claim(
  policy: Item[],
  incident: Incident,
  remainingCapBefore: number = fullCapFor(policy)
): ClaimResult {
  assertNonNegativeDamageAmounts(incident);
  assertDamagedItemsInPolicy(policy, incident);
  assertDamageCountsWithinPolicy(policy, incident);

  const rawPayout = incident.damages.reduce(
    (sum, damage) => sum + payoutForDamage(policy, damage),
    0
  );

  const payout = Math.floor(Math.min(rawPayout, remainingCapBefore));
  const remainingCap = remainingCapBefore - payout;

  return { payout, remainingCap };
}
