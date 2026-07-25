// MHPCO Claim Office - business logic
// Implementation built incrementally via TDD.

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause?: string;
  damages: Damage[];
};

export type Policy = {
  items: Item[];
  remainingCap: number;
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

// Flat fee charged on every quote (covers claim-file processing).
const PROCESSING_FEE = 5;

// Base premium (in G) for each known item type.
const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// Insurance value (in G) for each known item type — independent of any modifiers or blocks.
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

// Insurance value for a single item of the given type; throws on unknown type.
const insuranceValueFor = (type: string): number => {
  const value = INSURANCE_VALUE[type];
  if (value === undefined) {
    throw new UnknownItemTypeError(type);
  }
  return value;
};

// Sum of insurance values across all items (blocks do NOT affect insurance sum).
export const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueFor(item.type), 0);

// Maximum payout cap for a fresh policy: twice the insurance sum.
export const capForPolicy = (items: Item[]): number => 2 * insuranceSum(items);

// Thrown when an item has a type that isn't known to MHPCO.
export class UnknownItemTypeError extends Error {
  constructor(type: string) {
    super(`unknown item type: ${type}`);
  }
}

// Rate (10%) of the first-insurance surcharge on the policy base.
const FIRST_INSURANCE_RATE = 0.1;

// Returns the 10% first-insurance surcharge for the given policy base.
const firstInsuranceSurcharge = (policyBase: number): number =>
  policyBase * FIRST_INSURANCE_RATE;

// Loyalty discount rate applied to long-standing customers (≥ 2 years).
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;

// Discount for a long-standing customer (0 if years < threshold).
const loyaltyDiscount = (customerYears: number, policyBase: number): number => {
  if (customerYears >= LOYALTY_THRESHOLD_YEARS) {
    return policyBase * LOYALTY_RATE;
  }
  return 0;
};

// Follow-up contract discount rate applied from the second quote onward.
const FOLLOW_UP_RATE = 0.15;

// Discount for a follow-up contract (0 if first quote).
const followUpDiscount = (isFollowUp: boolean, policyBase: number): number => {
  if (isFollowUp) {
    return policyBase * FOLLOW_UP_RATE;
  }
  return 0;
};

// High-enchantment surcharge rate applied per item when its enchantment ≥ 5.
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

// Surcharge for an item's high-enchantment status (0 if none applies).
const highEnchantmentSurcharge = (item: Item): number => {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    return premiumFor(item.type) * HIGH_ENCHANTMENT_RATE;
  }
  return 0;
};

// Curse surcharge rate applied per cursed item (50% of item's base premium).
const CURSE_RATE = 0.5;

// Surcharge for an item being cursed (0 if not cursed).
const curseSurcharge = (item: Item): number => {
  if (item.cursed === true) {
    return premiumFor(item.type) * CURSE_RATE;
  }
  return 0;
};

// Special bundle premium for a "block" of exactly 3 alike components.
const BLOCK_PREMIUM = 60;

// Item types that count as components for the block-of-3 rule.
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

// Counts how many items in the list share a given component type.
const countByComponent = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
  }
  return counts;
};

// Premium for a single item of the given type; throws on unknown type.
const premiumFor = (type: string): number => {
  const base = BASE_PREMIUM[type];
  if (base === undefined) {
    throw new UnknownItemTypeError(type);
  }
  return base;
};

// Sum of item bases, with exactly-3-of-a-kind component blocks replacing 3×base with BLOCK_PREMIUM.
// Main items (sword/amulet/staff/potion) are never affected by the block rule.
const policyBaseWithBlocks = (items: Item[]): number => {
  const counts = countByComponent(items);
  let base = 0;
  // Component types: count === 3 forms a block (BLOCK_PREMIUM), otherwise sum per item.
  for (const [type, count] of counts) {
    if (count === 3) {
      base += BLOCK_PREMIUM;
    } else {
      base += count * premiumFor(type);
    }
  }
  // Main items (non-components) are summed per item.
  for (const item of items) {
    if (!COMPONENT_TYPES.has(item.type)) {
      base += premiumFor(item.type);
    }
  }
  return base;
};

// Quote for a policy: per-item base (with block-of-3 component rule), per-item high-enchantment
// surcharge (≥5), per-item curse surcharge (cursed items), 10% first-insurance surcharge on the
// policy base, loyalty discount (≥ 2 years), follow-up discount (subsequent quote), and the flat
// processing fee; rounded UP to whole G in MHPCO's favor.
export const quote = (items: Item[], customerYears: number, isFollowUp: boolean): number => {
  const policyBase = policyBaseWithBlocks(items);
  // Sum all per-item surcharges (high-enchantment + curse) in a single pass.
  const itemSurcharges = items.reduce(
    (sum, item) => sum + highEnchantmentSurcharge(item) + curseSurcharge(item),
    0
  );
  const raw = policyBase + itemSurcharges
    + firstInsuranceSurcharge(policyBase)
    - loyaltyDiscount(customerYears, policyBase)
    - followUpDiscount(isFollowUp, policyBase)
    + PROCESSING_FEE;
  return Math.ceil(raw);
};

// Deductible applied per damage event.
const DAMAGE_DEDUCTIBLE = 100;

// Reimbursement rate when an item's enchantment is ≥ 8 (50%).
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;

// Reimbursement factor for a single damage against an item.
// - enchantment ≥ 8 → 0.5 (high-enchantment clause applies)
// - otherwise → 1 (full reimbursement)
const reimbursementFactor = (item: Item): number => {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return HIGH_ENCHANTMENT_CLAIM_RATE;
  }
  return 1;
};

// Computes payout for a single damage entry against a given item.
const damagePayout = (item: Item, amount: number): number => {
  const preDeductible = amount * reimbursementFactor(item);
  return Math.max(0, preDeductible - DAMAGE_DEDUCTIBLE);
};

// Finds the first item in the policy whose type matches `itemType` AND that has not yet been
// "used" by an earlier damage in this incident. Throws if no such item exists.
const consumeMatchingItem = (items: Item[], used: boolean[], itemType: string): Item => {
  for (let i = 0; i < items.length; i++) {
    if (!used[i] && items[i].type === itemType) {
      used[i] = true;
      return items[i];
    }
  }
  throw new Error(`no undamaged item of type "${itemType}" in policy`);
};

export const claim = (policy: Policy, incident: Incident): ClaimResult => {
  const used = new Array<boolean>(policy.items.length).fill(false);
  let uncappedPayout = 0;
  for (const damage of incident.damages) {
    const item = consumeMatchingItem(policy.items, used, damage.itemType);
    uncappedPayout += damagePayout(item, damage.amount);
  }
  const payout = Math.min(uncappedPayout, policy.remainingCap);
  return { payout: Math.floor(payout), remainingCap: policy.remainingCap - payout };
};
