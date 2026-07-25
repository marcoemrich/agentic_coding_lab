const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type Customer = {
  yearsWithMHPCO: number;
};

const countByType = <T>(elements: T[], typeOf: (element: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const element of elements) {
    const type = typeOf(element);
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

const componentBase = (count: number): number => {
  if (count === BLOCK_SIZE) {
    return BLOCK_PREMIUM;
  }
  return count * COMPONENT_PREMIUM;
};

const isComponent = (item: { type: string }): boolean => COMPONENT_TYPES.has(item.type);

const componentsBase = (components: { type: string }[]): number => {
  const countsByType = countByType(components, (item) => item.type);
  let total = 0;
  for (const count of countsByType.values()) {
    total += componentBase(count);
  }
  return total;
};

const itemBase = (item: Item): number => {
  if (isComponent(item)) {
    return COMPONENT_PREMIUM;
  }
  const base = BASE_PREMIUMS[item.type];
  if (base === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return base;
};

const isHighEnchantment = (item: Item): boolean =>
  item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurcharges = (item: Item): number => {
  const base = itemBase(item);
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * CURSE_SURCHARGE_RATE;
  }
  if (isHighEnchantment(item)) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
};

const policyBase = (items: Item[]): number => {
  const components = items.filter(isComponent);
  const mainItemsBase = items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + itemBase(item), 0);
  return mainItemsBase + componentsBase(components);
};

const conditionalDiscount = (base: number, rate: number, applies: boolean): number =>
  applies ? base * rate : 0;

// Rounding always favours MHPCO. Premiums (customer pays) round UP;
// payouts (money flows away from MHPCO) round DOWN.
const roundPremiumInMHPCOFavor = (amount: number): number => Math.ceil(amount);
const roundPayoutInMHPCOFavor = (amount: number): number => Math.floor(amount);

const premiumBeforeFee = (customer: Customer, items: Item[], quoteIndex: number): number => {
  const base = policyBase(items);
  const surcharges = items.reduce((sum, item) => sum + itemSurcharges(item), 0);
  const firstInsuranceSurcharge = base * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = conditionalDiscount(
    base,
    LOYALTY_DISCOUNT_RATE,
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
  );
  const followupDiscount = conditionalDiscount(base, FOLLOWUP_DISCOUNT_RATE, quoteIndex > 0);
  return base + surcharges + firstInsuranceSurcharge - loyaltyDiscount - followupDiscount;
};

export const quote = (
  customer: Customer,
  items: Item[],
  quoteIndex: number,
): number => {
  return roundPremiumInMHPCOFavor(premiumBeforeFee(customer, items, quoteIndex) + PROCESSING_FEE);
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const COMPONENT_INSURANCE_VALUE = 250;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const itemInsuranceValue = (item: Item): number =>
  isComponent(item) ? COMPONENT_INSURANCE_VALUE : INSURANCE_VALUES[item.type];

export const insuranceCap = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0) * CAP_MULTIPLIER;

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

// Claim-side high-enchantment clause. NOTE: this threshold (8) is deliberately
// distinct from the quote-side isHighEnchantment threshold (5) — different rules.
const isHighEnchantmentForClaim = (item: Item): boolean =>
  item.enchantment !== undefined && item.enchantment >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD;

const damagePayout = (damage: Damage, item: Item): number => {
  const reimbursed = isHighEnchantmentForClaim(item)
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;
  return reimbursed - DEDUCTIBLE;
};

const insuredItemFor = (items: Item[], damage: Damage): Item =>
  items.find((item) => item.type === damage.itemType)!;

const validateDamages = (items: Item[], damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }
  const insuredCounts = countByType(items, (item) => item.type);
  const damageCounts = countByType(damages, (damage) => damage.itemType);
  for (const [type, count] of damageCounts) {
    if (count > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`More damages of type ${type} than insured`);
    }
  }
};

export const claim = (
  items: Item[],
  incident: Incident,
  remainingCap: number,
): ClaimResult => {
  validateDamages(items, incident.damages);
  const desiredPayout = incident.damages.reduce(
    (sum, damage) => sum + damagePayout(damage, insuredItemFor(items, damage)),
    0,
  );
  const payout = Math.min(roundPayoutInMHPCOFavor(desiredPayout), remainingCap);
  return { payout, remainingCap: remainingCap - payout };
};
