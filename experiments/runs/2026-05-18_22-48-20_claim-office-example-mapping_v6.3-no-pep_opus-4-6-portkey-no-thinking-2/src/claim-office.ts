const PROCESSING_FEE = 5;

interface Item {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD = 5;

const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_MIN_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const basePremium = (item: Item): number => BASE_PREMIUMS[item.type] ?? 0;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const itemPremium = (item: Item): number => {
  const base = basePremium(item);
  const curseSurcharge = item.cursed ? base * CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge =
    item.enchantment >= HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD
      ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return base + curseSurcharge + enchantmentSurcharge;
};

const componentBlockPremium = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * (BASE_PREMIUMS[type] ?? 0);

const countByType = (items: Item[]): Record<string, number> =>
  items.reduce<Record<string, number>>((counts, item) => {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
    return counts;
  }, {});

const componentsPremium = (components: Item[]): number =>
  Object.entries(countByType(components)).reduce(
    (sum, [type, count]) => sum + componentBlockPremium(type, count),
    0
  );

const validateItems = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const itemsPremium = (items: Item[]): number => {
  const components = items.filter(isComponent);
  const nonComponents = items.filter((item) => !isComponent(item));
  const mainPremium = nonComponents.reduce(
    (sum, item) => sum + itemPremium(item),
    0
  );
  return mainPremium + componentsPremium(components);
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

const isHighEnchantment = (item: Item): boolean =>
  item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD;

const reimbursableAmount = (policyItem: Item, damageAmount: number): number =>
  isHighEnchantment(policyItem)
    ? damageAmount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damageAmount;

const insuranceValue = (item: Item): number => INSURANCE_VALUES[item.type] ?? 0;

const totalInsuranceValue = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValue(item), 0);

const validateDamages = (
  damages: { itemType: string; amount: number }[],
  policyCounts: Record<string, number>
): void => {
  const damageCounts: Record<string, number> = {};
  for (const d of damages) {
    if (d.amount < 0) {
      throw new Error(`Negative damage amount: ${d.amount}`);
    }
    damageCounts[d.itemType] = (damageCounts[d.itemType] ?? 0) + 1;
    if (damageCounts[d.itemType] > (policyCounts[d.itemType] ?? 0)) {
      throw new Error(`More damage entries than insured items for type: ${d.itemType}`);
    }
  }
};

const findPolicyItem = (policyItems: Item[], itemType: string): Item => {
  const policyItem = policyItems.find((item) => item.type === itemType);
  if (!policyItem) {
    throw new Error(`Item type not in policy: ${itemType}`);
  }
  return policyItem;
};

const calculateUncappedPayout = (
  policyItems: Item[],
  damages: { itemType: string; amount: number }[]
): number =>
  damages.reduce((sum, damage) => {
    const policyItem = findPolicyItem(policyItems, damage.itemType);
    const reimbursement = reimbursableAmount(policyItem, damage.amount);
    return sum + Math.max(0, reimbursement - DEDUCTIBLE);
  }, 0);

export const claim = (
  policy: { items: Item[] },
  damages: { itemType: string; amount: number }[],
  remainingCap?: number
): { payout: number; remainingCap: number } => {
  validateDamages(damages, countByType(policy.items));
  const cap = remainingCap ?? totalInsuranceValue(policy.items) * CAP_MULTIPLIER;
  const uncappedPayout = calculateUncappedPayout(policy.items, damages);
  const payout = Math.floor(Math.min(uncappedPayout, cap));
  return { payout, remainingCap: cap - payout };
};

export const quote = (
  customer: { yearsWithMHPCO: number },
  items: Item[],
  isFollowUp: boolean
): number => {
  validateItems(items);
  const itemsTotalPremium = itemsPremium(items);
  const policyBasePremium = items.reduce((sum, item) => sum + basePremium(item), 0);
  const firstInsurance = policyBasePremium * FIRST_INSURANCE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS
      ? policyBasePremium * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscount = isFollowUp
    ? policyBasePremium * FOLLOW_UP_DISCOUNT_RATE
    : 0;
  return Math.ceil(itemsTotalPremium + firstInsurance - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
};
