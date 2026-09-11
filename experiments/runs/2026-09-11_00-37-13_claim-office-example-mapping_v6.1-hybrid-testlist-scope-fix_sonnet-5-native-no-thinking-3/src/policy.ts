export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

// ---------------------------------------------------------------------------
// Premium calculation
//
// Constants, helpers, and calculatePremium itself. Claim/payout calculation
// (deductible, cap, dragon-material and high-enchantment reimbursement
// clauses) is a separate concern and lives in its own section below.
// ---------------------------------------------------------------------------

const PROCESSING_FEE = 5;

// Main items and components share one lookup: every type has a single base
// per-unit premium here. Where pricing behavior actually diverges (e.g. the
// component block discount below), that's layered on top in premiumForType
// rather than by splitting this table.
const BASE_PREMIUMS: Record<string, number> = {
  // main items
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  // components
  rune: 25,
  moonstone: 25,
};

// Insurance value per item type — the amount an item is insured for, used to
// compute a policy's coverage cap. This is a policy-level concept (like
// BASE_PREMIUMS), independent of any specific claim, so it lives here rather
// than in the claim-calculation section even though its first consumer
// (insuranceSum) currently only appears in claim/cap tests.
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

export const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

export const KNOWN_ITEM_TYPES: ReadonlySet<string> = new Set(Object.keys(BASE_PREMIUMS));

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;

const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_DISCOUNT = 0.15;

// Guards against float drift (e.g. 100 * 1.1 === 110.00000000000001) before
// rounding up to the nearest whole gold piece, as the spec requires exact-G amounts.
// (roundDownToGold below applies the identical guard in the claim section, just
// flooring instead of ceiling — kept as two small named functions rather than one
// parameterized helper, since a shared `roundToGold(amount, Math.ceil)` would trade
// a self-explanatory call site for one that hides the rounding direction behind an
// injected function reference.)
const FLOAT_DRIFT_GUARD_PRECISION = 100;
const roundUpToGold = (amount: number): number =>
  Math.ceil(Math.round(amount * FLOAT_DRIFT_GUARD_PRECISION) / FLOAT_DRIFT_GUARD_PRECISION);

// A block discount replaces the per-unit price with one flat premium, but only
// when a type's count exactly matches the block size (e.g. 3 runes → 60G flat;
// 2 or 4 runes still price per-unit).
const premiumForType = (type: string, count: number): number =>
  count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * BASE_PREMIUMS[type];

// A cursed item's surcharge is 50% of its own base premium (not the policy
// total), so it's calculated per item rather than per type group.
const curseSurchargeForItem = (item: Item): number =>
  item.cursed ? BASE_PREMIUMS[item.type] * CURSE_SURCHARGE : 0;

const enchantmentSurchargeForItem = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? BASE_PREMIUMS[item.type] * HIGH_ENCHANTMENT_SURCHARGE : 0;

// Curse and high-enchantment surcharges stack additively per item (an item
// can be both cursed and highly enchanted), so they're summed together in a
// single per-item total rather than accumulated via separate traversals.
const itemSurcharge = (item: Item): number => curseSurchargeForItem(item) + enchantmentSurchargeForItem(item);

const loyaltyDiscountRateFor = (customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? LOYALTY_DISCOUNT : 0;

// A customer has a "follow-up contract" once they've received at least one
// prior quote, regardless of whether it converted to a policy.
const followUpDiscountRateFor = (previousQuoteCount: number): number =>
  previousQuoteCount > 0 ? FOLLOW_UP_DISCOUNT : 0;

export const calculatePremium = (customer: Customer, items: Item[], previousQuoteCount = 0): number => {
  if (items.length === 0) return PROCESSING_FEE;

  const countsByType: Record<string, number> = {};
  for (const item of items) {
    countsByType[item.type] = (countsByType[item.type] ?? 0) + 1;
  }

  // "Policy base premium" per the spec: the sum of all item base premiums
  // (after block discounts), before any item-specific or policy-wide modifiers.
  const policyBasePremium = Object.entries(countsByType).reduce(
    (sum, [type, count]) => sum + premiumForType(type, count),
    0,
  );

  // Item-specific modifiers (cursed, high enchantment) apply to each item's own
  // base premium and are summed in here, ahead of any policy-wide modifiers.
  const itemModifierTotal = items.reduce((sum, item) => sum + itemSurcharge(item), 0);

  const premiumBeforePolicyModifiers = policyBasePremium + itemModifierTotal;

  // Policy-wide modifiers (loyalty, first insurance, follow-up contract) are each
  // a percentage of the policy base premium, summed together rather than
  // compounded sequentially — per the spec's integration example, which adds
  // "+ 10 first insurance − 20 loyalty ... − 15 follow-up" as flat amounts.
  const policyWideModifierRate =
    FIRST_INSURANCE_SURCHARGE - loyaltyDiscountRateFor(customer) - followUpDiscountRateFor(previousQuoteCount);

  // NOTE: policyWideModifierRate is applied against policyBasePremium (the raw
  // item base total), NOT against premiumBeforePolicyModifiers (which already
  // includes curse/enchantment surcharges). This is load-bearing: the spec's
  // integration example only balances when first-insurance/loyalty/follow-up
  // percentages are computed off the 100G item base, not the running total.
  const finalPremium = premiumBeforePolicyModifiers + policyBasePremium * policyWideModifierRate;
  return roundUpToGold(finalPremium) + PROCESSING_FEE;
};

// ---------------------------------------------------------------------------
// Claim calculation
// ---------------------------------------------------------------------------

const DEDUCTIBLE = 100;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

// Rounds down, in the MHPCO's favor, guarding against the same float drift
// roundUpToGold guards against for premiums (see that function's comment for
// why this isn't merged into a single parameterized helper).
const roundDownToGold = (amount: number): number =>
  Math.floor(Math.round(amount * FLOAT_DRIFT_GUARD_PRECISION) / FLOAT_DRIFT_GUARD_PRECISION);

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export const calculateClaim = (item: Item, damageAmount: number): number => {
  // `item.material` is intentionally not inspected here. The spec's
  // dragon-material clause ("dragon material → full reimbursement") never
  // changes this calculation: full reimbursement is already the default for
  // any item below the high-enchantment threshold, and per the spec's own
  // precedence rule the 50% high-enchantment clause wins outright whenever
  // both clauses would apply (including dragon items with enchantment >= 8).
  // So dragon-material is a no-op against this ternary given every example
  // in the spec. If a future example distinguishes dragon-material from the
  // plain default (e.g. a non-dragon, low-enchantment item contrasted with a
  // dragon one), revisit this — but don't branch on `material` speculatively
  // before a test demands it.
  const reimbursed =
    (item.enchantment ?? 0) >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD
      ? damageAmount * CLAIM_HIGH_ENCHANTMENT_REIMBURSEMENT
      : damageAmount;
  return roundDownToGold(reimbursed - DEDUCTIBLE);
};

const CAP_MULTIPLIER = 2;

// Looks up the policy item a damage entry refers to. Throws a descriptive
// error (rather than letting a missing item surface as an unrelated
// "Cannot read properties of undefined" downstream) so the CLI's top-level
// catch reports something a user can actually act on.
const findInsuredItem = (items: Item[], itemType: string): Item => {
  const item = items.find((candidate) => candidate.type === itemType);
  if (!item) {
    throw new Error(`Damaged item not found in policy: ${itemType}`);
  }
  return item;
};

export const processClaim = (items: Item[], damages: Damage[], previousPayoutTotal = 0): ClaimResult => {
  const uncappedPayout = damages.reduce((sum, damage) => {
    const item = findInsuredItem(items, damage.itemType);
    return sum + calculateClaim(item, damage.amount);
  }, 0);

  const availableCap = insuranceSum(items) * CAP_MULTIPLIER - previousPayoutTotal;
  const payout = Math.min(uncappedPayout, availableCap);
  return { payout, remainingCap: availableCap - payout };
};
