type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type Customer = {
  yearsWithMHPCO: number;
};

const CENTS_PER_GOLD = 100;

const BASE_FEE = 5;
const SWORD_PREMIUM = 100;
const AMULET_PREMIUM = 60;
const STAFF_PREMIUM = 80;
const POTION_PREMIUM = 40;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENTS_PER_BLOCK = 3;

const LOYALTY_DISCOUNT_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const INSURANCE_CONTRACT_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

const HIGH_ENCHANTMENT_THRESHOLD = 5;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const EQUIPMENT_BASE_PREMIUMS: Record<string, number> = {
  sword: SWORD_PREMIUM,
  amulet: AMULET_PREMIUM,
  staff: STAFF_PREMIUM,
  potion: POTION_PREMIUM,
};

const COMPONENT_TYPES = ["rune", "moonstone"];

const countWhere = <T>(items: T[], predicate: (item: T) => boolean): number =>
  items.filter(predicate).length;

const premiumForComponentCount = (count: number): number => {
  if (count === COMPONENTS_PER_BLOCK) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return count * COMPONENT_PREMIUM;
};

const premiumForComponentsOfType = (items: Item[], type: string): number =>
  premiumForComponentCount(
    countWhere(items, (item) => item.type === type),
  );

const basePremiumForItem = (item: Item): number =>
  EQUIPMENT_BASE_PREMIUMS[item.type] ?? 0;

const isKnownItemType = (type: string): boolean =>
  type in EQUIPMENT_BASE_PREMIUMS || COMPONENT_TYPES.includes(type);

const validateKnownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const componentPremiumTotal = (items: Item[]): number =>
  sumBy(COMPONENT_TYPES, (type) => premiumForComponentsOfType(items, type));

const basePremiumForAllItems = (items: Item[]): number =>
  sumBy(items, basePremiumForItem) + componentPremiumTotal(items);

const sumBy = <T>(items: T[], valueFor: (item: T) => number): number =>
  items.reduce((sum, item) => sum + valueFor(item), 0);

const hasEnchantmentAtLeast = (
  item: Item | undefined,
  threshold: number,
): boolean =>
  item !== undefined &&
  item.enchantment !== undefined &&
  item.enchantment >= threshold;

const surchargeRateFor = (item: Item): number =>
  (item.cursed ? CURSED_SURCHARGE_RATE : 0) +
  (hasEnchantmentAtLeast(item, HIGH_ENCHANTMENT_THRESHOLD)
    ? HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0);

const toCents = (gold: number): number => gold * CENTS_PER_GOLD;

const surchargeCentsFor = (item: Item): number =>
  toCents(basePremiumForItem(item) * surchargeRateFor(item));

const roundUpCentsToGold = (cents: number): number =>
  Math.ceil(cents / CENTS_PER_GOLD);

const policyAdjustmentRate = (
  customer: Customer,
  contractIndex: number | null,
): number => {
  const qualifiesForLoyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_DISCOUNT_YEARS;
  const hasInsuranceContract = contractIndex !== null;
  const isFollowUpContract = hasInsuranceContract && contractIndex > 0;

  return (
    (qualifiesForLoyaltyDiscount ? -LOYALTY_DISCOUNT_RATE : 0) +
    (hasInsuranceContract ? INSURANCE_CONTRACT_SURCHARGE_RATE : 0) +
    (isFollowUpContract ? -FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0)
  );
};

export const quote = (
  customer: Customer,
  insuredItems: Item[],
  contractIndex: number | null = null,
): number => {
  validateKnownItemTypes(insuredItems);
  const baseCents = toCents(basePremiumForAllItems(insuredItems));
  const itemSurchargeTotal = sumBy(insuredItems, surchargeCentsFor);
  const policyRate = policyAdjustmentRate(customer, contractIndex);
  const policyAdjustmentCents = baseCents * policyRate;
  const baseFeeCents = toCents(BASE_FEE);
  const totalCents =
    baseCents + itemSurchargeTotal + policyAdjustmentCents + baseFeeCents;
  return roundUpCentsToGold(totalCents);
};

type Policy = {
  items: Item[];
  remainingCap: number;
};

type Damage = {
  itemType: string;
  amount: number;
};

type Incident = {
  cause: string;
  damages: Damage[];
};

type ClaimResult = {
  payout: number;
  remainingCap: number;
};

const DEDUCTIBLE_GOLD = 100;
const HIGH_ENCHANTMENT_DAMAGE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_DAMAGE_MULTIPLIER = 0.5;

const findItemByType = (items: Item[], type: string): Item | undefined =>
  items.find((item) => item.type === type);

const payoutMultiplierFor = (item: Item | undefined): number =>
  hasEnchantmentAtLeast(item, HIGH_ENCHANTMENT_DAMAGE_THRESHOLD)
    ? HIGH_ENCHANTMENT_DAMAGE_MULTIPLIER
    : 1;

const damagePayout = (item: Item | undefined, amount: number): number =>
  amount * payoutMultiplierFor(item) - DEDUCTIBLE_GOLD;

const payoutForDamage = (items: Item[], damage: Damage): number =>
  damagePayout(findItemByType(items, damage.itemType), damage.amount);

const validateClaim = (policy: Policy, incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error("Damage amount cannot be negative");
    }
  }
  const damageTypes = new Set(incident.damages.map((damage) => damage.itemType));
  for (const type of damageTypes) {
    const insuredCount = countWhere(
      policy.items,
      (item) => item.type === type,
    );
    const damageCount = countWhere(
      incident.damages,
      (damage) => damage.itemType === type,
    );
    if (damageCount > insuredCount) {
      throw new Error(`Damage count exceeds insured count for ${type}`);
    }
  }
};

export const claim = (policy: Policy, incident: Incident): ClaimResult => {
  validateClaim(policy, incident);
  const totalPayout = sumBy(incident.damages, (damage) =>
    payoutForDamage(policy.items, damage),
  );
  const cappedPayout = Math.min(totalPayout, policy.remainingCap);
  const roundedPayout = Math.floor(cappedPayout);
  return { payout: roundedPayout, remainingCap: policy.remainingCap - roundedPayout };
};
