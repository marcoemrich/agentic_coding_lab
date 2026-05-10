// claim-office.ts
//
// Design choices for the input shape (documented for future tests):
// - quote(input) takes an object with `customer` and `items`.
//   - customer: { yearsWithMHPCO: number, isFollowUpContract: boolean }
//     - yearsWithMHPCO: how long the customer has been with MHPCO (drives loyalty discount).
//     - isFollowUpContract: whether this quote is the customer's second/follow-up
//       contract in the scenario (drives the 15% follow-up discount).
//   - items: an array of items to be insured. Empty array means no items.
// - quote returns the premium in G as a number.
// - claim is also exported (per the spec import) but not yet implemented.

export type Customer = {
  yearsWithMHPCO: number;
  isFollowUpContract: boolean;
};

export type Item = {
  type: "sword" | "amulet" | "staff" | "potion" | "rune" | "moonstone";
  cursed?: boolean;
  enchantment?: number;
  material?: string;
};

export type QuoteInput = {
  customer: Customer;
  items: Item[];
};

// Flat fee added to every quote at the very end (spec: "processing fee of 5 G").
// Currently observed in the empty-list test (premium = fee only).
const PROCESSING_FEE = 5;

// Block-of-3 discount: when items are exactly 3 of the same type,
// the policy base premium for that group is a flat 60 G.
const BLOCK_SIZE = 3;
const BLOCK_OF_THREE_BASE_PREMIUM = 60;

// Base premium per item type, in G (before any modifiers or fees).
// Keyed by Item["type"] so adding a new item variant is caught at compile time
// (the Record will require a corresponding entry).
const BASE_PREMIUM_BY_TYPE: Record<Item["type"], number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// Modifier rates expressed as numerator/denominator to avoid floating-point error
// for the integer-and-half cases under test (e.g. 100 * 1.1 ≠ 110 in IEEE-754).
//
// Item-level surcharges (applied to a single item's base premium):
const CURSED_SURCHARGE_NUM = 1;
const CURSED_SURCHARGE_DEN = 2; // +50%
const HIGH_ENCHANTMENT_SURCHARGE_NUM = 3;
const HIGH_ENCHANTMENT_SURCHARGE_DEN = 10; // +30%
const HIGH_ENCHANTMENT_THRESHOLD = 5;
//
// Policy-level modifiers (applied to the policy base premium):
const FIRST_INSURANCE_NUM = 1;
const FIRST_INSURANCE_DEN = 10; // +10%
const LOYALTY_DISCOUNT_NUM = 1;
const LOYALTY_DISCOUNT_DEN = 5; // -20%
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_NUM = 15;
const FOLLOW_UP_DISCOUNT_DEN = 100; // -15%

// Component types eligible for the block-of-3 discount.
const COMPONENT_TYPES: ReadonlySet<Item["type"]> = new Set(["rune", "moonstone"]);

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function itemBaseOnly(item: Item): number {
  return BASE_PREMIUM_BY_TYPE[item.type];
}

function itemSurcharges(item: Item): number {
  const base = BASE_PREMIUM_BY_TYPE[item.type];
  let surcharge = 0;
  if (item.cursed) {
    surcharge += (base * CURSED_SURCHARGE_NUM) / CURSED_SURCHARGE_DEN;
  }
  if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += (base * HIGH_ENCHANTMENT_SURCHARGE_NUM) / HIGH_ENCHANTMENT_SURCHARGE_DEN;
  }
  return surcharge;
}

function groupBaseSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemBaseOnly(item), 0);
}

function groupByType(items: Item[]): Map<Item["type"], Item[]> {
  const groups = new Map<Item["type"], Item[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return groups;
}

function groupBasePremium(group: Item[]): number {
  if (group.length === BLOCK_SIZE && isComponent(group[0])) {
    return BLOCK_OF_THREE_BASE_PREMIUM;
  }
  return groupBaseSum(group);
}

function policyBasePremium(items: Item[]): number {
  const groups = groupByType(items);
  return Array.from(groups.values()).reduce(
    (total, group) => total + groupBasePremium(group),
    0,
  );
}

function totalItemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemSurcharges(item), 0);
}

// Apply a fraction (num/den) of `amount` only when `condition` holds.
// Used for policy-level modifiers that are either active or zero,
// keeping the integer-fraction precision used throughout the module.
function fractionWhen(amount: number, num: number, den: number, condition: boolean): number {
  return condition ? (amount * num) / den : 0;
}

// Reject items whose `type` isn't in the known premium table.
// Throws before any pricing work so callers see a clear domain error
// rather than a downstream NaN from a missing base premium.
function validateItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM_BY_TYPE)) {
      throw new Error(`Unknown item type: '${item.type}'`);
    }
  }
}

export function quote(input: QuoteInput): number {
  const { customer, items } = input;
  validateItemTypes(items);
  const policyBase = policyBasePremium(items);
  const surcharges = totalItemSurcharges(items);
  const firstInsurance = fractionWhen(policyBase, FIRST_INSURANCE_NUM, FIRST_INSURANCE_DEN, true);
  const loyalty = fractionWhen(
    policyBase,
    LOYALTY_DISCOUNT_NUM,
    LOYALTY_DISCOUNT_DEN,
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS,
  );
  const followUp = fractionWhen(
    policyBase,
    FOLLOW_UP_DISCOUNT_NUM,
    FOLLOW_UP_DISCOUNT_DEN,
    customer.isFollowUpContract,
  );
  return Math.ceil(policyBase + surcharges + firstInsurance - loyalty - followUp + PROCESSING_FEE);
}

// Insurance sum per item type, in G. Independent of BASE_PREMIUM_BY_TYPE
// even though current values happen to be 10× the base premium — these are
// distinct domain concepts (pricing vs coverage), and the block-of-3 spec
// test confirms premium discounts must not affect insurance sum.
const INSURANCE_SUM_BY_TYPE: Record<Item["type"], number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

// Per-damage deductible: customer covers the first 100 G of each damage entry.
const DEDUCTIBLE_PER_DAMAGE = 100;
// Policy cap is 2× the total insurance sum.
const CAP_MULTIPLIER = 2;

export type ClaimItem = {
  type: Item["type"];
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Damage = {
  itemType: Item["type"];
  amount: number;
};

export type ClaimInput = {
  policy: { items: ClaimItem[]; remainingCap?: number };
  incident: { damages: Damage[] };
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

function policyInsuranceSum(items: ClaimItem[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_SUM_BY_TYPE[item.type], 0);
}

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;

function isHighEnchantmentClaim(item: ClaimItem | undefined): boolean {
  return item?.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

function damagePayout(damage: Damage, items: ClaimItem[]): number {
  const item = items.find((i) => i.type === damage.itemType);
  const reimbursable = isHighEnchantmentClaim(item) ? damage.amount / 2 : damage.amount;
  return Math.max(0, reimbursable - DEDUCTIBLE_PER_DAMAGE);
}

function totalPayout(damages: Damage[], items: ClaimItem[]): number {
  return damages.reduce((total, damage) => total + damagePayout(damage, items), 0);
}

function countOccurrences(types: Item["type"][]): Map<Item["type"], number> {
  const counts = new Map<Item["type"], number>();
  for (const type of types) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
}

// A claim's damage entries must each be non-negative. Negative amounts make
// no domain sense (you can't be damaged a negative amount), and silently
// passing them through would let a forged claim reduce other damages' payout.
function validateNonNegativeDamages(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }
}

// Every damaged item type must be covered by the policy at least as many
// times as it appears in the damages array. (E.g. a single-sword policy
// can't have two sword damage entries — the second one isn't insured.)
function validateDamagesCovered(items: ClaimItem[], damages: Damage[]): void {
  const policyCounts = countOccurrences(items.map((i) => i.type));
  const damageCounts = countOccurrences(damages.map((d) => d.itemType));
  for (const [type, count] of damageCounts) {
    const covered = policyCounts.get(type) ?? 0;
    if (count > covered) {
      throw new Error(
        `Claim has ${count} damage entries of type '${type}' but policy covers only ${covered}`,
      );
    }
  }
}

export function claim(input: ClaimInput): ClaimResult {
  const { items, remainingCap } = input.policy;
  const { damages } = input.incident;
  validateNonNegativeDamages(damages);
  validateDamagesCovered(items, damages);
  const cap = remainingCap ?? CAP_MULTIPLIER * policyInsuranceSum(items);
  const payout = Math.floor(Math.min(totalPayout(damages, items), cap));
  return { payout, remainingCap: cap - payout };
}
