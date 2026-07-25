export const roundUpToWholeG = (value: number): number => Math.ceil(value);

export const roundDownToWholeG = (value: number): number => Math.floor(value);

type ItemValueTable = Record<string, number>;

const ITEM_BASE_PREMIUMS: ItemValueTable = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

export const KNOWN_ITEM_TYPES: ReadonlySet<string> = new Set(
  Object.keys(ITEM_BASE_PREMIUMS)
);

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };

type Customer = { yearsWithMHPCO: number };

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const BLOCK_ELIGIBLE_TYPES = new Set(["rune", "moonstone"]);

const countBy = <T>(items: T[], getKey: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = getKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const computePremiumForType = (type: string, count: number): number =>
  BLOCK_ELIGIBLE_TYPES.has(type) && count === BLOCK_SIZE
    ? BLOCK_PREMIUM
    : count * ITEM_BASE_PREMIUMS[type];

export const computeBasePremium = (items: Item[]): number => {
  let total = 0;
  for (const [type, count] of countByType(items)) {
    total += computePremiumForType(type, count);
  }
  return total;
};

const ITEM_INSURANCE_VALUES: ItemValueTable = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};

export const computeInsuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + ITEM_INSURANCE_VALUES[item.type], 0);

const CAP_MULTIPLIER = 2;

export const computeCap = (items: Item[]): number =>
  computeInsuranceSum(items) * CAP_MULTIPLIER;

const PROCESSING_FEE = 5;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;

const computeCurseSurcharge = (item: Item): number => {
  const base = ITEM_BASE_PREMIUMS[item.type];
  return item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
};

const meetsEnchantmentThreshold = (item: Item, threshold: number): boolean =>
  (item.enchantment ?? 0) >= threshold;

const computeHighEnchantmentSurcharge = (item: Item): number => {
  const base = ITEM_BASE_PREMIUMS[item.type];
  return meetsEnchantmentThreshold(item, HIGH_ENCHANTMENT_THRESHOLD)
    ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
};

const computeItemSurcharge = (item: Item): number =>
  computeCurseSurcharge(item) + computeHighEnchantmentSurcharge(item);

const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

export const computeQuotePremium = (
  items: Item[],
  customer: Customer,
  options: { isFollowUpContract?: boolean } = {}
): number => {
  const policyBase = computeBasePremium(items);
  const itemSurcharges = items.reduce(
    (sum, item) => sum + computeItemSurcharge(item),
    0
  );
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = options.isFollowUpContract
    ? policyBase * FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    : 0;
  const discounts = loyaltyDiscount + followUpDiscount;
  const total =
    policyBase + itemSurcharges + firstInsuranceSurcharge - discounts + PROCESSING_FEE;
  return roundUpToWholeG(total);
};

const DEDUCTIBLE = 100;
const DAMAGE_HIGH_ENCHANTMENT_THRESHOLD = 8;
const DAMAGE_HIGH_ENCHANTMENT_RATE = 0.5;

type Damage = { itemType: string; amount: number };

type Incident = { cause: string; damages: Damage[] };

type PolicyState = { remainingCap?: number };

type ClaimResult = { payout: number; remainingCap: number };

const findInsuredItem = (policyItems: Item[], itemType: string): Item | undefined =>
  policyItems.find((item) => item.type === itemType);

const validateNoNegativeDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative, got ${damage.amount}.`);
    }
  }
};

const validateDamageCountsWithinPolicy = (damages: Damage[], policyItems: Item[]): void => {
  const policyCounts = countByType(policyItems);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [type, count] of damageCounts) {
    if (count > (policyCounts.get(type) ?? 0)) {
      throw new Error(
        `Claim references ${count} damaged item(s) of type "${type}", but the policy only insures ${policyCounts.get(type) ?? 0}.`
      );
    }
  }
};

const validateDamagesAgainstPolicy = (damages: Damage[], policyItems: Item[]): void => {
  validateNoNegativeDamageAmounts(damages);
  validateDamageCountsWithinPolicy(damages, policyItems);
};

const computeDamagePayout = (damage: Damage, policyItems: Item[]): number => {
  const item = findInsuredItem(policyItems, damage.itemType);
  const reimbursable =
    item && meetsEnchantmentThreshold(item, DAMAGE_HIGH_ENCHANTMENT_THRESHOLD)
      ? damage.amount * DAMAGE_HIGH_ENCHANTMENT_RATE
      : damage.amount;
  return Math.max(0, reimbursable - DEDUCTIBLE);
};

const sumDamagePayouts = (damages: Damage[], policyItems: Item[]): number =>
  damages.reduce((sum, damage) => sum + computeDamagePayout(damage, policyItems), 0);

export const processClaim = (
  policyItems: Item[],
  incident: Incident,
  policyState: PolicyState = {}
): ClaimResult => {
  validateDamagesAgainstPolicy(incident.damages, policyItems);
  const availableCap = policyState.remainingCap ?? computeCap(policyItems);
  const desiredPayout = roundDownToWholeG(sumDamagePayouts(incident.damages, policyItems));
  const payout = Math.min(desiredPayout, availableCap);
  const remainingCap = availableCap - payout;
  return { payout, remainingCap };
};
