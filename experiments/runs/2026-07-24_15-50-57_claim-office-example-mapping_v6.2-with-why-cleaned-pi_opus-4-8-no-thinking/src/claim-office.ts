const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

const isComponent = (item: { type: string }): boolean =>
  COMPONENT_TYPES.includes(item.type);

const componentGroupPremium = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * COMPONENT_BASE_PREMIUM;

const basePremiumForItem = (item: Item): number =>
  isComponent(item) ? COMPONENT_BASE_PREMIUM : (BASE_PREMIUMS[item.type] ?? 0);

const mainItemsBasePremium = (items: Item[]): number =>
  items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + basePremiumForItem(item), 0);

const countByType = (items: { type: string }[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const componentsBasePremium = (items: { type: string }[]): number => {
  const componentCounts = countByType(items.filter(isComponent));
  return [...componentCounts.values()]
    .map(componentGroupPremium)
    .reduce((sum, premium) => sum + premium, 0);
};

// Both premiums and payouts round "in MHPCO's favor", but in opposite
// directions: premiums round up (customer pays more), payouts round down
// (MHPCO pays less).
const roundPremiumInInsurerFavor = (amount: number): number =>
  Math.ceil(amount);
const roundPayoutInInsurerFavor = (amount: number): number =>
  Math.floor(amount);

const isHighEnchantment = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurcharges = (item: Item): number => {
  const base = basePremiumForItem(item);
  const curseSurcharge = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const highEnchantmentSurcharge = isHighEnchantment(item)
    ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curseSurcharge + highEnchantmentSurcharge;
};

const isKnownItemType = (item: { type: string }): boolean =>
  isComponent(item) || item.type in BASE_PREMIUMS;

const assertKnownItemTypes = (items: { type: string }[]): void => {
  const unknownItem = items.find((item) => !isKnownItemType(item));
  if (unknownItem) {
    throw new Error(`Unknown item type: ${unknownItem.type}`);
  }
};

export const quote = (
  customer: { yearsWithMHPCO: number },
  items: Item[],
  opts: { contractIndex: number },
): number => {
  assertKnownItemTypes(items);
  const basePremium =
    mainItemsBasePremium(items) + componentsBasePremium(items);
  const surcharges = items.reduce(
    (sum, item) => sum + itemSurcharges(item),
    0,
  );
  const isLoyal = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
  const isFollowupContract = opts.contractIndex >= 1;
  const policyModifiers =
    basePremium * FIRST_INSURANCE_SURCHARGE_RATE -
    (isLoyal ? basePremium * LOYALTY_DISCOUNT_RATE : 0) -
    (isFollowupContract ? basePremium * FOLLOWUP_DISCOUNT_RATE : 0);
  return roundPremiumInInsurerFavor(
    basePremium + policyModifiers + surcharges + PROCESSING_FEE,
  );
};

const insuranceValueForItem = (item: Item): number =>
  isComponent(item)
    ? COMPONENT_INSURANCE_VALUE
    : (INSURANCE_VALUES[item.type] ?? 0);

export const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueForItem(item), 0);

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimResult = { payout: number; remainingCap: number };

const capForPolicy = (policyItems: Item[]): number =>
  CAP_MULTIPLIER * insuranceSum(policyItems);

const qualifiesForHighEnchantmentClause = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const reimbursementForDamage = (damage: Damage, item: Item): number => {
  const reimbursed = qualifiesForHighEnchantmentClause(item)
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;
  return reimbursed - DEDUCTIBLE;
};

const assertDamageAmountsValid = (damages: Damage[]): void => {
  const invalidDamage = damages.find((damage) => damage.amount < 0);
  if (invalidDamage) {
    throw new Error(`Invalid damage amount: ${invalidDamage.amount}`);
  }
};

const assertDamagesWithinCoverage = (
  policyItems: Item[],
  damages: Damage[],
): void => {
  const coveredCounts = countByType(policyItems);
  const damagedCounts = countByType(
    damages.map((damage) => ({ type: damage.itemType })),
  );
  for (const [type, count] of damagedCounts) {
    if (count > (coveredCounts.get(type) ?? 0)) {
      throw new Error(`Damage for uncovered item: ${type}`);
    }
  }
};

const totalReimbursement = (
  policyItems: Item[],
  damages: Damage[],
): number =>
  damages.reduce((sum, damage) => {
    const item = policyItems.find((i) => i.type === damage.itemType)!;
    return sum + reimbursementForDamage(damage, item);
  }, 0);

export const claim = (
  policyItems: Item[],
  incident: Incident,
  remainingCap: number = capForPolicy(policyItems),
): ClaimResult => {
  assertDamageAmountsValid(incident.damages);
  assertDamagesWithinCoverage(policyItems, incident.damages);
  const rawPayout = totalReimbursement(policyItems, incident.damages);
  const payout = roundPayoutInInsurerFavor(Math.min(rawPayout, remainingCap));
  return { payout, remainingCap: remainingCap - payout };
};
