export type Customer = { yearsWithMHPCO: number };
export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
export type Quote = { premium: number; insuranceSum: number };
export type Policy = { items: Item[]; insuranceSum: number; paidOut?: number };
export type Damage = { itemType: string; amount: number };
export type Incident = { cause: string; damages: Damage[] };
export type ClaimResult = { payout: number; remainingCap: number; policy: Policy };

// Components (runes, moonstones, …) share one price and can form "building blocks".
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_PRICE = 25;
const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  ...Object.fromEntries(COMPONENT_TYPES.map((type) => [type, COMPONENT_PRICE])),
};
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;
const PROCESSING_FEE = 5;
// Every claim pays out damage minus a fixed deductible.
const DEDUCTIBLE = 100;
// Claims on very highly enchanted items (a stricter threshold than the premium surcharge) are only partly reimbursed.
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;
// Price list: every item's insurance value is ten times its base premium (sword 1000/100, amulet 600/60, …).
const INSURANCE_VALUE_PER_PREMIUM = 10;
// Total payout per policy is capped at twice the insurance sum.
const PAYOUT_CAP_MULTIPLIER = 2;

// A building block of exactly BLOCK_SIZE alike components is priced at BLOCK_PRICE instead of BLOCK_SIZE × COMPONENT_PRICE.
const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;
const COMPONENT_BLOCK_DISCOUNT = BLOCK_SIZE * COMPONENT_PRICE - BLOCK_PRICE;

// Fractional amounts always round in MHPCO's favour: premiums up, payouts down.
const roundPremium = Math.ceil;
const roundPayout = Math.floor;

// Integer-safe percent math: (base * percent) / 100 avoids float noise such as 115.00000000000001.
const percentOf = (amount: number, percent: number): number => (amount * percent) / 100;

const sum = (amounts: number[]): number => amounts.reduce((total, amount) => total + amount, 0);

const basePremiumOf = (item: Item): number => {
  const premium = BASE_PREMIUM_BY_TYPE[item.type];
  if (premium === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return premium;
};

const insuranceValueOf = (item: Item): number => basePremiumOf(item) * INSURANCE_VALUE_PER_PREMIUM;

const isHighlyEnchanted = (item: Item): boolean => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

// Item-specific modifiers apply to the item's own base premium.
const itemSurcharge = (item: Item): number => {
  const base = basePremiumOf(item);
  return (
    (item.cursed ? percentOf(base, CURSE_SURCHARGE_PERCENT) : 0) +
    (isHighlyEnchanted(item) ? percentOf(base, HIGH_ENCHANTMENT_SURCHARGE_PERCENT) : 0)
  );
};

const countOfType = (items: Item[], type: string): number => items.filter((item) => item.type === type).length;

const isBlock = (items: Item[], type: string): boolean => countOfType(items, type) === BLOCK_SIZE;

const isLoyal = (customer: Customer): boolean => customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

// contractIndex is 0 for the customer's first contract; every later one is a follow-up.
const isFollowUpContract = (contractIndex: number): boolean => contractIndex > 0;

// Policy-wide modifiers apply to the whole base premium; surcharges are positive, discounts negative.
const policyModifierPercents = (customer: Customer, contractIndex: number): number[] => [
  FIRST_INSURANCE_SURCHARGE_PERCENT,
  isLoyal(customer) ? -LOYALTY_DISCOUNT_PERCENT : 0,
  isFollowUpContract(contractIndex) ? -FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT : 0,
];

export const quote = (customer: Customer, items: Item[], contractIndex: number): Quote => {
  const blockCount = COMPONENT_TYPES.filter((type) => isBlock(items, type)).length;
  const listPrice = sum(items.map(basePremiumOf));
  const itemSurcharges = sum(items.map(itemSurcharge));
  const basePremium = listPrice - blockCount * COMPONENT_BLOCK_DISCOUNT;
  const policyModifiers = percentOf(basePremium, sum(policyModifierPercents(customer, contractIndex)));
  return {
    premium: roundPremium(basePremium + itemSurcharges + policyModifiers + PROCESSING_FEE),
    insuranceSum: sum(items.map(insuranceValueOf)),
  };
};

const hasReducedReimbursement = (item: Item | undefined): boolean =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const reimbursementFor = (policy: Policy, damage: Damage): number => {
  const item = policy.items.find((candidate) => candidate.type === damage.itemType);
  return hasReducedReimbursement(item) ? percentOf(damage.amount, HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT) : damage.amount;
};

// The deductible is charged once per damaged item, not once per claim.
const payoutFor = (policy: Policy, damage: Damage): number => reimbursementFor(policy, damage) - DEDUCTIBLE;

const payoutCapOf = (policy: Policy): number => policy.insuranceSum * PAYOUT_CAP_MULTIPLIER;

// A fresh policy has no paidOut yet.
const paidOutOf = (policy: Policy): number => policy.paidOut ?? 0;

const remainingCapOf = (policy: Policy): number => payoutCapOf(policy) - paidOutOf(policy);

const countDamagesOfType = (damages: Damage[], type: string): number =>
  damages.filter((damage) => damage.itemType === type).length;

const assertNoNegativeDamages = (damages: Damage[]): void => {
  for (const { amount } of damages) {
    if (amount < 0) throw new Error(`Negative damage amount: ${amount}`);
  }
};

// A claim may not report more damaged items of a type than the policy insures.
// This also rejects damages to item types the policy does not cover at all (insured count 0).
const assertDamagesCovered = (policy: Policy, damages: Damage[]): void => {
  for (const { itemType } of damages) {
    if (countDamagesOfType(damages, itemType) > countOfType(policy.items, itemType)) {
      throw new Error(`More ${itemType} damages than insured ${itemType} items`);
    }
  }
};

export const claim = (policy: Policy, incident: Incident): ClaimResult => {
  assertNoNegativeDamages(incident.damages);
  assertDamagesCovered(policy, incident.damages);
  const remainingBefore = remainingCapOf(policy);
  const desired = roundPayout(sum(incident.damages.map((damage) => payoutFor(policy, damage))));
  const payout = Math.min(desired, remainingBefore);
  return {
    payout,
    remainingCap: remainingBefore - payout,
    policy: { ...policy, paidOut: paidOutOf(policy) + payout },
  };
};
