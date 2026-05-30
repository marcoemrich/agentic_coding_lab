export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  items: Item[];
}

export interface QuoteResult {
  premium: number;
}

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

// Runes and moonstones are "components" — a distinct pricing tier that shares
// one base premium (and, later, block/alike rules). Naming the shared value
// makes the equality intentional rather than a coincidence two entries happen
// to share.
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
// A "building block" of exactly this many alike components is offered at a
// special block premium instead of the per-component price.
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
};
const PROCESSING_FEE = 5;

// Insurance values per item type. Unlike base premiums, these are never
// discounted (the component block discount affects the premium only, not the
// insured value), so each item contributes its full value to the policy's
// insurance sum.
const COMPONENT_INSURANCE_VALUE = 250;
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: COMPONENT_INSURANCE_VALUE,
  moonstone: COMPONENT_INSURANCE_VALUE,
};
// The total payout per policy is capped at twice the insurance sum.
const CAP_MULTIPLE = 2;

// Surcharges are expressed as integer percentages and applied as
// `amount * percent / 100`, keeping the maths in integers (avoids float errors
// such as `100 * 1.1 === 100.00000000000001`).
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_MIN_LEVEL = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_MIN_YEARS = 2;
const FOLLOWUP_CONTRACT_DISCOUNT_PERCENT = 15;
const FIRST_CONTRACT_INDEX = 0;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_MIN_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

// Sum a numeric measure over a list. Centralises the
// `reduce((total, x) => total + f(x), 0)` shape shared by every per-item /
// per-damage total in this module, so each caller states only *what* it sums.
const sumBy = <T>(items: T[], measure: (item: T) => number): number =>
  items.reduce((total, item) => total + measure(item), 0);

const PERCENT_DIVISOR = 100;

const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / PERCENT_DIVISOR;

// A surcharge that applies only when a condition holds, expressed as a
// percentage of some base amount (and 0 otherwise).
const conditionalPercent = (
  applies: boolean,
  amount: number,
  percent: number,
): number => (applies ? percentOf(amount, percent) : 0);

// The base premium for a given item type, with unknown types priced at 0.
// This is the single point that reads BASE_PREMIUMS, so both per-item and
// per-group pricing share one definition of "the base price of a type".
const basePremiumForType = (type: string): number => BASE_PREMIUMS[type] ?? 0;

// An item's effective enchantment level, with an absent enchantment treated as
// 0. Centralising the default keeps "unenchanted counts as level 0" in one
// place for every threshold check (quote surcharge at 5, claim 50% at 8).
const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

// A single item's base premium. Block pricing is a group-level concern handled
// separately in sumBasePremiums, so a plain per-type lookup suffices here.
const itemBasePremium = (item: Item): number => basePremiumForType(item.type);

const isKnownItemType = (type: string): boolean => type in BASE_PREMIUMS;

// Reject the first element that fails a validity predicate. Centralises the
// "scan a list, throw on the first invalid element" shape shared by the quote
// and claim guards, so each caller states only *what* is valid and *why* an
// invalid element is rejected.
const assertEach = <T>(
  items: T[],
  isValid: (item: T) => boolean,
  message: (item: T) => string,
): void => {
  for (const item of items) {
    if (!isValid(item)) {
      throw new Error(message(item));
    }
  }
};

// A quote can only price item types it has a base premium for, so an unknown
// type is rejected up front rather than silently priced at 0. Named so the
// quote body reads "reject unknown types, then price" instead of spelling the
// scan out inline.
const assertKnownItemTypes = (items: Item[]): void =>
  assertEach(
    items,
    (item) => isKnownItemType(item.type),
    (item) => `unknown item type: ${item.type}`,
  );

// Item-specific surcharges, each a percentage of the item's own base premium:
// a curse adds 50%, and a highly-enchanted item (level >= 5) adds 30%. They
// stack when both apply.
const itemSurcharge = (item: Item): number => {
  const base = itemBasePremium(item);
  const curse = conditionalPercent(
    item.cursed ?? false,
    base,
    CURSE_SURCHARGE_PERCENT,
  );
  const highEnchantment = conditionalPercent(
    enchantmentLevel(item) >= HIGH_ENCHANTMENT_MIN_LEVEL,
    base,
    HIGH_ENCHANTMENT_SURCHARGE_PERCENT,
  );
  return curse + highEnchantment;
};

const sumItemSurcharges = (items: Item[]): number =>
  sumBy(items, itemSurcharge);

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const componentGroupPremium = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * COMPONENT_BASE_PREMIUM;

const typeGroupPremium = (type: string, count: number): number =>
  COMPONENT_TYPES.has(type)
    ? componentGroupPremium(count)
    : count * basePremiumForType(type);

const sumBasePremiums = (items: Item[]): number =>
  sumBy([...countByType(items)], ([type, count]) =>
    typeGroupPremium(type, count),
  );

// Policy-wide modifiers scale with the whole policy's base premium.
// First-insurance is a surcharge every new policy pays; the loyalty discount
// rewards customers at or past the loyalty threshold.
const firstInsuranceSurcharge = (policyBase: number): number =>
  percentOf(policyBase, FIRST_INSURANCE_SURCHARGE_PERCENT);

const loyaltyDiscount = (customer: Customer, policyBase: number): number =>
  customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS
    ? percentOf(policyBase, LOYALTY_DISCOUNT_PERCENT)
    : 0;

// Every contract after the customer's first quote in the scenario is a
// follow-up contract and earns a discount.
const followUpDiscount = (quoteIndex: number, policyBase: number): number =>
  quoteIndex > FIRST_CONTRACT_INDEX
    ? percentOf(policyBase, FOLLOWUP_CONTRACT_DISCOUNT_PERCENT)
    : 0;

// Net signed adjustment that policy-wide modifiers make to the policy base:
// the first-insurance surcharge adds, the loyalty and follow-up discounts
// subtract. Grouping them keeps the quote formula at "base + item surcharges
// + policy-wide adjustments + fee".
const policyAdjustments = (
  customer: Customer,
  quoteIndex: number,
  policyBase: number,
): number =>
  firstInsuranceSurcharge(policyBase) -
  loyaltyDiscount(customer, policyBase) -
  followUpDiscount(quoteIndex, policyBase);

export const quote = (
  customer: Customer,
  step: QuoteStep,
  quoteIndex: number,
): QuoteResult => {
  assertKnownItemTypes(step.items);
  const policyBase = sumBasePremiums(step.items);
  const premium = Math.ceil(
    policyBase +
      sumItemSurcharges(step.items) +
      policyAdjustments(customer, quoteIndex, policyBase) +
      PROCESSING_FEE,
  );
  return { premium };
};

// The payout cap for a policy: twice the sum of its items' insurance values.
// Unknown types are rejected, mirroring quote, so a policy's cap is only
// computed from recognised items.
export const policyCap = (items: Item[]): number => {
  assertKnownItemTypes(items);
  const insuranceSum = sumBy(items, (item) => INSURANCE_VALUES[item.type] ?? 0);
  return CAP_MULTIPLE * insuranceSum;
};

// Reimbursement for one damage before the deductible. A highly-enchanted item
// (level >= 8) is reimbursed at 50% of the damage; otherwise in full.
const reimbursement = (item: Item, damage: Damage): number =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_CLAIM_MIN_LEVEL
    ? percentOf(damage.amount, HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT)
    : damage.amount;

// Payout for one damage: the reimbursement minus the deductible, never below 0.
const damagePayout = (item: Item, damage: Damage): number =>
  Math.max(0, reimbursement(item, damage) - DEDUCTIBLE);

// Removes and returns the first policy item insuring this damage's type. Each
// damage consumes a distinct insured item, so a claim with more damages of a
// type than the policy covers leaves a damage unmatched — which is rejected.
const takeInsuredItem = (available: Item[], damage: Damage): Item => {
  const index = available.findIndex((item) => item.type === damage.itemType);
  if (index < 0) {
    throw new Error(
      `damage references item not covered by policy: ${damage.itemType}`,
    );
  }
  return available.splice(index, 1)[0];
};

const assertNonNegativeDamages = (damages: Damage[]): void =>
  assertEach(
    damages,
    (damage) => damage.amount >= 0,
    (damage) => `damage amount must not be negative: ${damage.amount}`,
  );

// Total payout requested across all damages, before the cap. Each damage
// consumes a distinct insured item from a private copy of the policy, so the
// loop is explicit: takeInsuredItem mutates `available` as it goes, and a plain
// accumulator keeps that consume-as-you-go ordering visible (rather than hiding
// the side effect inside a pure-looking sumBy).
const requestedPayout = (policyItems: Item[], damages: Damage[]): number => {
  const available = [...policyItems];
  let requested = 0;
  for (const damage of damages) {
    requested += damagePayout(takeInsuredItem(available, damage), damage);
  }
  return requested;
};

export const claim = (
  policyItems: Item[],
  incident: Incident,
  remainingCap: number,
): ClaimResult => {
  assertNonNegativeDamages(incident.damages);
  const requested = requestedPayout(policyItems, incident.damages);
  const payout = Math.floor(Math.min(requested, remainingCap));
  return { payout, remainingCap: remainingCap - payout };
};
