export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteInput {
  items: Item[];
}

export interface CustomerContext {
  yearsWithMHPCO: number;
  contractIndex: number;
}

const PROCESSING_FEE = 5;

// A "building block" of exactly 3 alike components is priced at a flat
// rate instead of the sum of their individual base premiums.
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const COMPONENT_PREMIUM = 25;

const COMPONENT_TYPES = ["rune", "moonstone"];

// A cursed item costs 50% of its base premium extra to insure.
const CURSE_SURCHARGE_RATE = 0.5;

// A first-time policy carries a 10% initial-assessment surcharge on its base.
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

// Highly enchanted items (enchantment level >= 5) cost 30% of base extra.
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

// Long-standing customers (>= 2 years with MHPCO) get a 20% loyalty discount.
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

// Each contract after the customer's first carries a 15% follow-up discount.
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

interface ItemSpec {
  basePremium: number;
  insuranceValue: number;
}

// Single source of truth for per-item-type data. Both the quoted premium
// and the claim insurance value live together so the set of known item
// types is defined exactly once.
const ITEM_SPECS: Record<string, ItemSpec> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

const basePremiumFor = (item: Item): number => ITEM_SPECS[item.type].basePremium;

const isKnownItemType = (item: Item): boolean => item.type in ITEM_SPECS;

const assertKnownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const isComponent = (item: Item): boolean => COMPONENT_TYPES.includes(item.type);

const componentBlockPremium = (count: number): number => {
  if (count === BLOCK_SIZE) {
    return BLOCK_PREMIUM;
  }
  return count * COMPONENT_PREMIUM;
};

const mainItemsPremium = (items: Item[]): number =>
  items
    .filter((item) => !isComponent(item))
    .reduce((total, item) => total + basePremiumFor(item), 0);

const componentsPremium = (items: Item[]): number =>
  COMPONENT_TYPES.reduce((total, componentType) => {
    const count = items.filter((item) => item.type === componentType).length;
    return total + componentBlockPremium(count);
  }, 0);

const curseSurcharge = (item: Item, base: number): number =>
  item.cursed ? base * CURSE_SURCHARGE_RATE : 0;

const highEnchantmentSurcharge = (item: Item, base: number): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;

const itemSurcharge = (item: Item): number => {
  const base = basePremiumFor(item);
  return curseSurcharge(item, base) + highEnchantmentSurcharge(item, base);
};

const itemSurchargesPremium = (items: Item[]): number =>
  items.reduce((total, item) => total + itemSurcharge(item), 0);

// Policy-wide surcharge added to every first-time policy.
const firstInsuranceSurcharge = (policyBase: number): number =>
  policyBase * FIRST_INSURANCE_SURCHARGE_RATE;

// A conditional discount takes a fraction of the policy base when the
// customer qualifies, and nothing otherwise.
const conditionalDiscount = (
  policyBase: number,
  qualifies: boolean,
  rate: number,
): number => (qualifies ? policyBase * rate : 0);

// Policy-wide discount subtracted for long-standing customers.
const loyaltyDiscount = (policyBase: number, customer: CustomerContext): number =>
  conditionalDiscount(
    policyBase,
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS,
    LOYALTY_DISCOUNT_RATE,
  );

// Policy-wide discount subtracted for contracts after the customer's first.
const followUpDiscount = (policyBase: number, customer: CustomerContext): number =>
  conditionalDiscount(policyBase, customer.contractIndex > 0, FOLLOW_UP_DISCOUNT_RATE);

export const quote = (input: QuoteInput, customer: CustomerContext): number => {
  assertKnownItemTypes(input.items);
  const policyBase =
    mainItemsPremium(input.items) + componentsPremium(input.items);
  const policyDiscounts =
    loyaltyDiscount(policyBase, customer) +
    followUpDiscount(policyBase, customer);
  const premium =
    policyBase +
    itemSurchargesPremium(input.items) +
    firstInsuranceSurcharge(policyBase) -
    policyDiscounts +
    PROCESSING_FEE;
  return Math.ceil(premium);
};

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Policy {
  items: Item[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;

// The payout cap is twice the sum of the items' unmodified insurance values.
const CAP_MULTIPLIER = 2;

const insuranceValueFor = (item: Item): number =>
  ITEM_SPECS[item.type].insuranceValue;

// Damage to very highly enchanted items (level >= 8) is reimbursed at 50%.
const HALF_REIMBURSEMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

const isHalfReimbursed = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_THRESHOLD;

// Each damage is reimbursed for its (possibly reduced) amount minus a deductible.
const damagePayout = (damage: Damage, item: Item): number => {
  const reimbursementRate = isHalfReimbursed(item) ? HALF_REIMBURSEMENT_RATE : 1;
  return damage.amount * reimbursementRate - DEDUCTIBLE;
};

const insuredItemFor = (policy: Policy, damage: Damage): Item =>
  policy.items.find((item) => item.type === damage.itemType)!;

const policyCap = (policy: Policy): number =>
  policy.items.reduce((total, item) => total + insuranceValueFor(item), 0) *
  CAP_MULTIPLIER;

// Sum of the per-damage payouts an incident would pay out before the
// remaining cap is taken into account.
const totalDamagePayout = (policy: Policy, incident: Incident): number =>
  incident.damages.reduce(
    (total, damage) => total + damagePayout(damage, insuredItemFor(policy, damage)),
    0,
  );

// The actual payout never exceeds the remaining cap, and any fractional
// gold is rounded down in the MHPCO's favor.
const cappedPayout = (desiredPayout: number, availableCap: number): number =>
  Math.floor(Math.min(desiredPayout, availableCap));

const countByType = (types: string[], target: string): number =>
  types.filter((type) => type === target).length;

// A damage amount must be non-negative; a negative claim is nonsensical.
const assertNonNegativeDamages = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }
};

// A policy can only cover as many damages of a given item type as there
// are insured items of that type.
const assertDamagesMatchPolicy = (policy: Policy, incident: Incident): void => {
  const damagedTypes = incident.damages.map((damage) => damage.itemType);
  const insuredTypes = policy.items.map((item) => item.type);
  for (const itemType of new Set(damagedTypes)) {
    if (countByType(damagedTypes, itemType) > countByType(insuredTypes, itemType)) {
      throw new Error(`More ${itemType} damages than insured items`);
    }
  }
};

export const claim = (
  policy: Policy,
  incident: Incident,
  availableCap: number = policyCap(policy),
): ClaimResult => {
  assertNonNegativeDamages(incident);
  assertDamagesMatchPolicy(policy, incident);
  const desiredPayout = totalDamagePayout(policy, incident);
  const payout = cappedPayout(desiredPayout, availableCap);
  return { payout, remainingCap: availableCap - payout };
};
