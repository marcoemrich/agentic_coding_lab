export type Customer = { yearsWithMHPCO: number };
export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
export type Damage = { itemType: string; amount: number };
export type Incident = { cause?: string; damages: Damage[] };

const PROCESSING_FEE = 5;

const BASE_PRICES: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;

const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOWUP_DISCOUNT = 0.15;

const isKnownItemType = (type: string): boolean => type in BASE_PRICES;

const basePriceFor = (type: string): number => BASE_PRICES[type] ?? 0;

const isComponentType = (type: string): boolean =>
  COMPONENT_TYPES.includes(type);

const assertKnownItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item.type));
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
};

const itemSurchargeRate = (item: Item): number => {
  let rate = 0;
  if (item.cursed) rate += CURSED_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD)
    rate += HIGH_ENCHANTMENT_SURCHARGE;
  return rate;
};

const groupByType = (items: Item[]): Map<string, Item[]> =>
  items.reduce((groups, item) => {
    const group = groups.get(item.type) ?? [];
    return groups.set(item.type, [...group, item]);
  }, new Map<string, Item[]>());

const groupBasePremium = (type: string, group: Item[]): number => {
  if (isComponentType(type) && group.length === BLOCK_SIZE) return BLOCK_PRICE;
  return group.length * basePriceFor(type);
};

const groupItemSurcharges = (type: string, group: Item[]): number => {
  // Components have no item-specific modifiers.
  if (isComponentType(type)) return 0;
  const unitBase = basePriceFor(type);
  return group.reduce((sum, item) => sum + unitBase * itemSurchargeRate(item), 0);
};

const policyBasePremium = (items: Item[]): number =>
  Array.from(groupByType(items)).reduce(
    (sum, [type, group]) => sum + groupBasePremium(type, group),
    0,
  );

const policyItemSurcharges = (items: Item[]): number =>
  Array.from(groupByType(items)).reduce(
    (sum, [type, group]) => sum + groupItemSurcharges(type, group),
    0,
  );

const policyModifierRate = (
  customer: Customer,
  previousQuoteCount: number,
): number => {
  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? -LOYALTY_DISCOUNT : 0;
  const followUp = previousQuoteCount >= 1 ? -FOLLOWUP_DISCOUNT : 0;
  return FIRST_INSURANCE_SURCHARGE + loyalty + followUp;
};

export const quote = (
  customer: Customer,
  items: Item[],
  previousQuoteCount: number,
): number => {
  assertKnownItemTypes(items);
  const basePremium = policyBasePremium(items);
  const total =
    basePremium +
    policyItemSurcharges(items) +
    basePremium * policyModifierRate(customer, previousQuoteCount) +
    PROCESSING_FEE;
  return Math.ceil(total);
};

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, i) => sum + (INSURANCE_VALUES[i.type] ?? 0), 0);

const policyCap = (items: Item[]): number =>
  insuranceSum(items) * CAP_MULTIPLIER;

const isHighlyEnchanted = (item: Item | undefined): boolean =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const reimbursableAmount = (item: Item | undefined, damageAmount: number): number =>
  isHighlyEnchanted(item)
    ? damageAmount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damageAmount;

const damagePayout = (items: Item[], damage: Damage): number => {
  const item = items.find((i) => i.type === damage.itemType);
  return reimbursableAmount(item, damage.amount) - DEDUCTIBLE;
};

const desiredPayout = (items: Item[], incident: Incident): number =>
  incident.damages.reduce((sum, d) => sum + damagePayout(items, d), 0);

const countByType = <T>(elements: T[], typeOf: (e: T) => string): Map<string, number> =>
  elements.reduce(
    (counts, e) => counts.set(typeOf(e), (counts.get(typeOf(e)) ?? 0) + 1),
    new Map<string, number>(),
  );

const assertDamageAmountNonNegative = (damage: Damage): void => {
  if (damage.amount < 0)
    throw new Error(`Damage amount must be non-negative: ${damage.amount}`);
};

const assertDamagesMatchPolicy = (items: Item[], incident: Incident): void => {
  incident.damages.forEach(assertDamageAmountNonNegative);
  const insuredCounts = countByType(items, (i) => i.type);
  const damageCounts = countByType(incident.damages, (d) => d.itemType);
  for (const [type, count] of damageCounts) {
    const insuredCount = insuredCounts.get(type) ?? 0;
    if (insuredCount === 0)
      throw new Error(`Damage references item not in policy: ${type}`);
    if (count > insuredCount)
      throw new Error(
        `More damages of ${type} (${count}) than insured (${insuredCount})`,
      );
  }
};

export const claim = (
  _customer: Customer,
  items: Item[],
  incident: Incident,
  capUsed: number,
): { payout: number; remainingCap: number } => {
  assertDamagesMatchPolicy(items, incident);
  const remainingBeforeClaim = policyCap(items) - capUsed;
  const payout = Math.floor(
    Math.min(desiredPayout(items, incident), remainingBeforeClaim),
  );
  return { payout, remainingCap: remainingBeforeClaim - payout };
};
