export type Customer = {
  yearsWithMHPCO: number;
  previousContracts: number;
};

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

const PROCESSING_FEE = 5;

// The MHPCO rounds every gold amount in its own favour. That single rule points
// in opposite arithmetic directions depending on who is paying: money coming in
// rounds up, money going out rounds down. Naming both halves keeps the shared
// policy visible instead of leaving two bare Math calls that look unrelated.
const roundPremiumInMHPCOsFavour = (amount: number): number =>
  Math.ceil(amount);

const roundPayoutInMHPCOsFavour = (amount: number): number =>
  Math.floor(amount);

// The MHPCO price list. The spec gives each item type an insurance value and
// a base premium together, so they live in one table: the set of known item
// types is a single fact, and the two columns cannot drift apart.
type PriceListEntry = {
  insuranceValue: number;
  basePremium: number;
};

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

// Enchantment drives two unrelated rules that happen to share a shape: a
// premium surcharge from 5 up, and a halved claim reimbursement from 8 up.
// They are named as a matched pair (PREMIUM / CLAIM) because an unqualified
// HIGH_ENCHANTMENT_THRESHOLD would silently mean "the premium one" and read
// as though the claim threshold were a special case of it. They are peers,
// and the spec can move either without touching the other.
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5;

const isKnownItemType = (item: Item): boolean => item.type in PRICE_LIST;

const rejectUnknownItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item));
  if (unknown) {
    throw new Error(`Unknown item type: ${unknown.type}`);
  }
};

const basePremiumOf = (item: Item): number =>
  PRICE_LIST[item.type].basePremium;

const insuranceValueOf = (item: Item): number =>
  PRICE_LIST[item.type].insuranceValue;

const surchargeRateOf = (item: Item): number =>
  (item.cursed ? CURSED_SURCHARGE_RATE : 0) +
  ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD
    ? HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0);

const surchargeOf = (item: Item): number =>
  basePremiumOf(item) * surchargeRateOf(item);

const sumBasePremiums = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumOf(item), 0);

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + surchargeOf(item), 0);

// Policy-level modifiers are whole percentages of the policy base premium.
// Applying them as `amount * percent / 100` keeps the arithmetic exact:
// `100 * 110 / 100` is 110, whereas `100 * 1.1` is 110.00000000000001.
const applyPercentage = (amount: number, percent: number): number =>
  (amount * percent) / 100;

const FIRST_INSURANCE_SURCHARGE_PERCENTAGE = 10;
const LOYALTY_DISCOUNT_PERCENTAGE = 20;
const LOYALTY_YEARS_THRESHOLD = 2;

const loyaltyDiscountPercentageOf = (customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? LOYALTY_DISCOUNT_PERCENTAGE
    : 0;

const FOLLOW_UP_DISCOUNT_PERCENTAGE = 15;
const FOLLOW_UP_CONTRACTS_THRESHOLD = 1;

const followUpDiscountPercentageOf = (customer: Customer): number =>
  customer.previousContracts >= FOLLOW_UP_CONTRACTS_THRESHOLD
    ? FOLLOW_UP_DISCOUNT_PERCENTAGE
    : 0;

const policyPercentageDeltaOf = (customer: Customer): number =>
  FIRST_INSURANCE_SURCHARGE_PERCENTAGE -
  loyaltyDiscountPercentageOf(customer) -
  followUpDiscountPercentageOf(customer);

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const isComponentBlock = (sameTypeGroup: Item[]): boolean =>
  sameTypeGroup.length === BLOCK_SIZE;

const groupByType = (items: Item[]): Item[][] => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return [...groups.values()];
};

const basePremiumOfGroup = (sameTypeGroup: Item[]): number =>
  isComponentBlock(sameTypeGroup)
    ? BLOCK_BASE_PREMIUM
    : sumBasePremiums(sameTypeGroup);

const policyBasePremiumOf = (items: Item[]): number =>
  groupByType(items).reduce((sum, group) => sum + basePremiumOfGroup(group), 0);

export const quote = (customer: Customer, items: Item[]): number => {
  rejectUnknownItemTypes(items);

  const policyBasePremium = policyBasePremiumOf(items);
  const policyPercentageAdjustment = applyPercentage(
    policyBasePremium,
    policyPercentageDeltaOf(customer),
  );

  return roundPremiumInMHPCOsFavour(
    policyBasePremium +
      sumItemSurcharges(items) +
      policyPercentageAdjustment +
      PROCESSING_FEE,
  );
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

export const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueOf(item), 0);

const DEDUCTIBLE = 100;

// A policy will pay out at most twice what it insures, across all claims made
// against it. That ceiling is a property of the policy, so deriving it lives
// here beside the other claim rules rather than in whatever code happens to be
// opening a claim.
const PAYOUT_CAP_MULTIPLE = 2;

export const payoutCapOf = (items: Item[]): number =>
  PAYOUT_CAP_MULTIPLE * insuranceSum(items);

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

// Note the deliberate absence of a dragon-material clause: dragon items are
// reimbursed in full, which is already what the default rate of 1 does. The
// spec calls it out as a rule, but expressing it as `material === "dragon" ? 1
// : 1` would add a conditional that cannot change an outcome.
const reimbursementRateOf = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;

// Each damage entry carries its own deductible, so reimbursement is decided
// per entry and only then summed into the policy-level total.
const reimbursementFor = (damage: Damage, item: Item): number =>
  damage.amount * reimbursementRateOf(item) - DEDUCTIBLE;

// A damage entry names its item by type, so the insured item it refers to has
// to be looked up in the policy. Matching is where "is this damage covered?"
// gets decided: either it yields the item, or the claim is rejected. Doing it
// once, up front, is what lets everything downstream take a CoveredDamage and
// never ask again whether the item exists.
type CoveredDamage = {
  damage: Damage;
  item: Item;
};

// An insured item backs at most one damage entry, so matching *consumes* it:
// each match is taken out of the unclaimed pool and cannot back a second entry.
// That is what makes two sword damages on a one-sword policy a rejection rather
// than a double payout, so the taking is named rather than left as a bare splice.
const takeInsuredItemFor = (damage: Damage, unclaimed: Item[]): Item => {
  const index = unclaimed.findIndex((item) => item.type === damage.itemType);
  if (index === -1) {
    throw new Error(`Item type not covered by the policy: ${damage.itemType}`);
  }
  const [item] = unclaimed.splice(index, 1);
  return item;
};

const matchDamagesToInsuredItems = (
  damages: Damage[],
  items: Item[],
): CoveredDamage[] => {
  const unclaimed = [...items];
  return damages.map((damage) => ({
    damage,
    item: takeInsuredItemFor(damage, unclaimed),
  }));
};

const sumReimbursements = (covered: CoveredDamage[]): number =>
  covered.reduce((sum, { damage, item }) => sum + reimbursementFor(damage, item), 0);

const rejectNegativeDamageAmounts = (damages: Damage[]): void => {
  if (damages.some((damage) => damage.amount < 0)) {
    throw new Error("Damage amount must not be negative");
  }
};

// The cap is consumed across successive claims, so a claim reads the cap left
// before it and reports the cap left after it. Those are two different numbers
// and each gets its own name: `remainingCap` alone would mean both at once.
export const claim = (
  items: Item[],
  incident: Incident,
  capBeforeClaim: number,
): ClaimResult => {
  rejectNegativeDamageAmounts(incident.damages);

  const reimbursementBeforeCap = sumReimbursements(
    matchDamagesToInsuredItems(incident.damages, items),
  );
  const payout = roundPayoutInMHPCOsFavour(
    Math.min(reimbursementBeforeCap, capBeforeClaim),
  );
  return { payout, remainingCap: capBeforeClaim - payout };
};
