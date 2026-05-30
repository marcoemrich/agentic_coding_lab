export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteResult {
  premium: number;
}

const PROCESSING_FEE = 5;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

// Rounds up in MHPCO's favor, guarding against floating-point drift
// (e.g. 197.50000000001 should round to 198, not be inflated by noise).
const roundUpInFavor = (amount: number): number =>
  Math.ceil(Number(amount.toFixed(6)));

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

// A same-type group of exactly BLOCK_SIZE components forms one block priced at
// BLOCK_BASE_PREMIUM; any other count is priced per component. (Multi-block and
// block-plus-leftover pricing are not yet implemented.)
const componentGroupBasePremium = (count: number): number =>
  count === BLOCK_SIZE
    ? BLOCK_BASE_PREMIUM
    : count * COMPONENT_BASE_PREMIUM;

const itemBasePremium = (item: Item): number =>
  isComponent(item) ? COMPONENT_BASE_PREMIUM : BASE_PREMIUMS[item.type];

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

// A rate-based term contributes `rate * base` when its condition holds, else 0.
// Used for both surcharges (added) and discounts (subtracted).
const rateTermWhen = (applies: boolean, rate: number, base: number): number =>
  applies ? rate * base : 0;

const itemSurcharge = (item: Item): number => {
  const base = itemBasePremium(item);
  const curse = rateTermWhen(item.cursed ?? false, CURSE_SURCHARGE_RATE, base);
  const highEnchantment = rateTermWhen(
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    HIGH_ENCHANTMENT_SURCHARGE_RATE,
    base,
  );
  return curse + highEnchantment;
};

const countByType = (items: Item[]): Record<string, number> =>
  items.reduce<Record<string, number>>((counts, item) => {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
    return counts;
  }, {});

const sum = (values: number[]): number =>
  values.reduce((running, value) => running + value, 0);

const basePremiumTotal = (items: Item[]): number => {
  const mainItems = items.filter((item) => !isComponent(item));
  const components = items.filter(isComponent);

  const mainItemsTotal = sum(mainItems.map(itemBasePremium));
  const componentsTotal = sum(
    Object.values(countByType(components)).map(componentGroupBasePremium),
  );

  return mainItemsTotal + componentsTotal;
};

// Net policy-level adjustment derived from the policy base: the first-insurance
// surcharge (always) minus the loyalty discount (for established customers) and
// the follow-up discount (for contracts after the customer's first quote).
const policyBaseModifiers = (
  customer: Customer,
  policyBase: number,
  followUp: boolean,
): number => {
  const isLoyalCustomer = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
  const firstInsurance = rateTermWhen(true, FIRST_INSURANCE_RATE, policyBase);
  const loyaltyDiscount = rateTermWhen(isLoyalCustomer, LOYALTY_DISCOUNT_RATE, policyBase);
  const followUpDiscount = rateTermWhen(followUp, FOLLOWUP_DISCOUNT_RATE, policyBase);
  return firstInsurance - loyaltyDiscount - followUpDiscount;
};

export interface QuoteOptions {
  followUp?: boolean;
}

const isKnownType = (item: Item): boolean =>
  isComponent(item) || item.type in BASE_PREMIUMS;

const assertKnownItemTypes = (items: Item[]): void => {
  const unknownItem = items.find((item) => !isKnownType(item));
  if (unknownItem) {
    throw new Error(`Unknown item type: ${unknownItem.type}`);
  }
};

export const quote = (
  customer: Customer,
  items: Item[],
  options: QuoteOptions = {},
): QuoteResult => {
  assertKnownItemTypes(items);
  const policyBase = basePremiumTotal(items);
  const surcharges = sum(items.map(itemSurcharge));
  const exactPremium =
    policyBase +
    surcharges +
    policyBaseModifiers(customer, policyBase, options.followUp ?? false) +
    PROCESSING_FEE;
  return { premium: roundUpInFavor(exactPremium) };
};

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

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
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

const insuranceSum = (items: Item[]): number =>
  sum(items.map((item) => INSURANCE_VALUES[item.type]));

// The reimbursement for a single damage event: the reimbursable amount less the
// per-event deductible. Items with enchantment >= 8 are reimbursed at 50 %.
// (The dragon-material clause and cap exhaustion are not yet applied.)
const damagePayout = (damage: Damage, item: Item): number => {
  const highlyEnchanted =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;
  const reimbursable = highlyEnchanted
    ? REDUCED_REIMBURSEMENT_RATE * damage.amount
    : damage.amount;
  return reimbursable - DEDUCTIBLE;
};

// The insured policy item a damage refers to, matched by type. (Item-presence
// validation and multiple items of the same type are later tests; for now the
// first match is taken and assumed to exist.)
const itemForDamage = (items: Item[], damage: Damage): Item =>
  items.find((item) => item.type === damage.itemType)!;

export const claim = (items: Item[], incident: Incident): ClaimResult => {
  const cap = CAP_MULTIPLIER * insuranceSum(items);
  const payout = sum(
    incident.damages.map((damage) =>
      damagePayout(damage, itemForDamage(items, damage)),
    ),
  );
  return { payout, remainingCap: cap - payout };
};
