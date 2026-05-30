interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

interface QuoteStep {
  op: string;
  items: Item[];
}

interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_DISCOUNT = 0.15;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

// Sum `valueOf` applied to each element of an iterable.
const sumOf = <T>(values: Iterable<T>, valueOf: (value: T) => number): number => {
  let sum = 0;
  for (const value of values) sum += valueOf(value);
  return sum;
};

const isComponent = (item: Item): boolean =>
  COMPONENT_TYPES.includes(item.type);

const isMainItem = (item: Item): boolean => !isComponent(item);

// A type is known if it is a priced main item or a recognised component.
const isKnownItemType = (type: string): boolean =>
  type in BASE_PREMIUM_BY_TYPE || COMPONENT_TYPES.includes(type);

const rejectUnknownItemType = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item.type));
  if (unknown) {
    throw new Error(`Unknown item type: ${unknown.type}`);
  }
};

// A group of exactly BLOCK_SIZE alike components is priced at the discounted
// BLOCK_PREMIUM; any other count is priced per component.
const componentGroupBasePremium = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;

// An item-specific surcharge adds `rate` of the item's base premium when its
// condition holds, and nothing otherwise.
const surchargeWhen = (item: Item, applies: boolean, rate: number): number =>
  applies ? rate * basePremiumForItem(item) : 0;

// Cursed items add a surcharge equal to CURSE_SURCHARGE of their base premium.
const curseSurcharge = (item: Item): number =>
  surchargeWhen(item, item.cursed ?? false, CURSE_SURCHARGE);

// Highly enchanted items (enchantment at or above the threshold) add a
// surcharge equal to HIGH_ENCHANTMENT_SURCHARGE of their base premium.
const highEnchantmentSurcharge = (item: Item): number =>
  surchargeWhen(
    item,
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    HIGH_ENCHANTMENT_SURCHARGE,
  );

// Collapse floating-point artifacts (e.g. 197.49999999) before rounding, so we
// never round a value that is only spuriously above or below a whole number.
const collapseFloatArtifacts = (amount: number): number =>
  Number(amount.toFixed(6));

// Premiums are rounded UP, in MHPCO's favor.
const roundUpInMHPCOsFavor = (amount: number): number =>
  Math.ceil(collapseFloatArtifacts(amount));

// Payouts are rounded DOWN, in MHPCO's favor.
const roundDownInMHPCOsFavor = (amount: number): number =>
  Math.floor(collapseFloatArtifacts(amount));

// Look up a per-type value, treating an unknown type as contributing nothing.
const valueByType = (table: Record<string, number>, type: string): number =>
  table[type] ?? 0;

const basePremiumForItem = (item: Item): number =>
  valueByType(BASE_PREMIUM_BY_TYPE, item.type);

// Each main item is priced on its own.
const mainItemsBasePremium = (items: Item[]): number =>
  sumOf(items, basePremiumForItem);

// Tally how many values fall under each key, where the key is read off each
// value by `keyOf`.
const countBy = <T>(values: Iterable<T>, keyOf: (value: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = keyOf(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

// Components are grouped by type, and each group is block-priced.
const componentsBasePremium = (components: Item[]): number =>
  sumOf(countByType(components).values(), componentGroupBasePremium);

const policyBasePremium = (items: Item[]): number =>
  mainItemsBasePremium(items.filter(isMainItem)) +
  componentsBasePremium(items.filter(isComponent));

// Tier 1 — item-specific surcharges: computed off each affected item's base
// premium and summed across the policy. (curse and high-enchantment.)
const itemSurcharges = (items: Item[]): number =>
  sumOf(items, (item) => curseSurcharge(item) + highEnchantmentSurcharge(item));

// A policy-wide modifier adds `rate` of the policy base premium when its
// condition holds, and nothing otherwise.
const fractionOfPolicyBaseWhen = (
  policyBase: number,
  applies: boolean,
  rate: number,
): number => (applies ? rate * policyBase : 0);

// Every new policy carries a surcharge equal to FIRST_INSURANCE_SURCHARGE of
// the policy base premium. It always applies, so it is computed directly
// rather than going through the conditional fractionOfPolicyBaseWhen helper.
const firstInsuranceSurcharge = (policyBase: number): number =>
  FIRST_INSURANCE_SURCHARGE * policyBase;

// Long-standing customers (at or above the loyalty threshold) receive a
// discount equal to LOYALTY_DISCOUNT of the policy base premium.
const loyaltyDiscount = (policyBase: number, customer: Customer): number =>
  fractionOfPolicyBaseWhen(
    policyBase,
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS,
    LOYALTY_DISCOUNT,
  );

// Every contract after the customer's first (a non-zero quote index) receives a
// discount equal to FOLLOWUP_DISCOUNT of the policy base premium.
const followUpDiscount = (policyBase: number, quoteIndex: number): number =>
  fractionOfPolicyBaseWhen(policyBase, quoteIndex >= 1, FOLLOWUP_DISCOUNT);

// Tier 2 — policy-wide modifiers: each computed as a fraction of the policy
// base premium. Surcharges add; discounts subtract. (first-insurance surcharge,
// loyalty discount, follow-up discount.)
const policyWideModifiers = (
  policyBase: number,
  customer: Customer,
  quoteIndex: number,
): number =>
  firstInsuranceSurcharge(policyBase) -
  loyaltyDiscount(policyBase, customer) -
  followUpDiscount(policyBase, quoteIndex);

export const quote = (
  customer: Customer,
  step: QuoteStep,
  quoteIndex: number,
): number => {
  rejectUnknownItemType(step.items);

  const policyBase = policyBasePremium(step.items);

  const total =
    policyBase +
    itemSurcharges(step.items) +
    policyWideModifiers(policyBase, customer, quoteIndex) +
    PROCESSING_FEE;
  return roundUpInMHPCOsFavor(total);
};

interface Damage {
  itemType: string;
  amount: number;
}

interface Incident {
  cause: string;
  damages: Damage[];
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const ENCHANTMENT_HALF_THRESHOLD = 8;
const HALF_REIMBURSEMENT = 0.5;
const CAP_MULTIPLIER = 2;
const COMPONENT_INSURANCE_VALUE = 250;

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

// Each item is insured for a fixed value; components share a flat value.
const insuranceValueForItem = (item: Item): number =>
  isComponent(item)
    ? COMPONENT_INSURANCE_VALUE
    : valueByType(INSURANCE_VALUE_BY_TYPE, item.type);

const insuranceSum = (items: Item[]): number =>
  sumOf(items, insuranceValueForItem);

// A policy's total payout cap is a fixed multiple of the insured value of its
// items. Premium-side modifiers (block discounts, surcharges) do not affect it.
const payoutCap = (policyItems: Item[]): number =>
  CAP_MULTIPLIER * insuranceSum(policyItems);

// Items at or above the half-reimbursement enchantment threshold are reimbursed
// at only half the damage amount.
const isHalfReimbursed = (item: Item | undefined): boolean =>
  (item?.enchantment ?? 0) >= ENCHANTMENT_HALF_THRESHOLD;

// What MHPCO reimburses for a single damage, before the deductible.
// Reimbursement turns solely on enchantment: high-enchantment items
// (at or above the threshold) get half the damage amount; everything else
// gets the full amount. Material is not inspected — dragon material is
// fully reimbursed simply because it falls in the full-amount branch, and
// half-reimbursement still wins for a high-enchantment dragon item.
const reimbursedAmount = (item: Item | undefined, amount: number): number =>
  isHalfReimbursed(item) ? HALF_REIMBURSEMENT * amount : amount;

// A damage is reimbursed against the first policy item of its type.
const itemForDamage = (policyItems: Item[], damage: Damage): Item | undefined =>
  policyItems.find((item) => item.type === damage.itemType);

// The net payout for a single damage: what MHPCO reimburses for the damaged
// item, less the per-damage deductible.
const netPayoutForDamage = (policyItems: Item[], damage: Damage): number =>
  reimbursedAmount(itemForDamage(policyItems, damage), damage.amount) -
  DEDUCTIBLE;

// A claim is rejected if it reports more damages of a given type than the
// policy actually covers. This also rejects damage to an item type absent
// from the policy: its insured count is 0, so any such damage over-claims.
const rejectIfOverClaimed = (policyItems: Item[], incident: Incident): void => {
  const insuredCounts = countByType(policyItems);
  const damageCounts = countBy(incident.damages, (damage) => damage.itemType);
  for (const [type, count] of damageCounts) {
    if (count > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`Claim rejected: more ${type} damages than insured`);
    }
  }
};

// A claim is rejected if any damage reports a negative amount.
const rejectIfNegativeDamage = (incident: Incident): void => {
  if (incident.damages.some((damage) => damage.amount < 0)) {
    throw new Error("Claim rejected: negative damage amount");
  }
};

export const claim = (
  policyItems: Item[],
  incident: Incident,
  startingRemainingCap: number = payoutCap(policyItems),
): ClaimResult => {
  rejectIfOverClaimed(policyItems, incident);
  rejectIfNegativeDamage(incident);

  const rawPayout = sumOf(incident.damages, (damage) =>
    netPayoutForDamage(policyItems, damage),
  );
  // The payout is capped at whatever remains of the policy's payout cap.
  const payout = roundDownInMHPCOsFavor(
    Math.min(rawPayout, startingRemainingCap),
  );
  return { payout, remainingCap: startingRemainingCap - payout };
};
