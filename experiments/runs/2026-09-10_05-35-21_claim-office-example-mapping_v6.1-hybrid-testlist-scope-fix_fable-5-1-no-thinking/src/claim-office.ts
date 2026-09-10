// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Damage = { itemType: string; amount: number };

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type Result = QuoteResult | ClaimResult;

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const countWhere = <T>(elements: T[], matches: (element: T) => boolean): number =>
  elements.filter(matches).length;

const countOfType = (items: Item[], type: string): number =>
  countWhere(items, (item) => item.type === type);

// An item without an enchantment counts as enchantment level 0.
const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

// ---------------------------------------------------------------------------
// Quote: premium terms
// ---------------------------------------------------------------------------

const PROCESSING_FEE = 5;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
// A building block of alike components is priced as a unit, not per piece.
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

// ---------------------------------------------------------------------------
// Quote
// ---------------------------------------------------------------------------

// The MHPCO only insures item types it has a base premium for.
const isKnownItemType = (type: string): boolean => type in BASE_PREMIUMS;

const assertKnownItemType = (type: string): void => {
  if (!isKnownItemType(type)) throw new Error(`Unknown item type: ${type}`);
};

const assertKnownItemTypes = (items: Item[]): void =>
  items.forEach((item) => assertKnownItemType(item.type));

const isComponent = (type: string): boolean => COMPONENT_TYPES.has(type);

const formsBlock = (type: string, count: number): boolean =>
  isComponent(type) && count === COMPONENT_BLOCK_SIZE;

const premiumForTypeGroup = (type: string, count: number): number =>
  formsBlock(type, count) ? COMPONENT_BLOCK_PREMIUM : count * BASE_PREMIUMS[type];

const calculateBasePremium = (items: Item[]): number => {
  const types = [...new Set(items.map((item) => item.type))];
  return types.reduce(
    (total, type) => total + premiumForTypeGroup(type, countOfType(items, type)),
    0,
  );
};

// Item-specific modifiers: each applies a rate to the base premium of every affected item.
const itemSurcharge = (items: Item[], applies: (item: Item) => boolean, rate: number): number =>
  items
    .filter(applies)
    .reduce((sum, item) => sum + BASE_PREMIUMS[item.type] * rate, 0);

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD;

const curseSurcharge = (items: Item[]): number =>
  itemSurcharge(items, isCursed, CURSE_SURCHARGE_RATE);

const enchantmentSurcharge = (items: Item[]): number =>
  itemSurcharge(items, isHighlyEnchanted, ENCHANTMENT_SURCHARGE_RATE);

// Policy-wide modifiers: each applies to the policy base premium (sum of item base premiums).
const firstInsuranceSurcharge = (basePremium: number): number =>
  basePremium * FIRST_INSURANCE_SURCHARGE_RATE;

const isLoyalCustomer = (yearsWithMHPCO: number): boolean =>
  yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const loyaltyDiscount = (basePremium: number, yearsWithMHPCO: number): number =>
  isLoyalCustomer(yearsWithMHPCO) ? basePremium * LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscount = (basePremium: number, isFollowUpContract: boolean): number =>
  isFollowUpContract ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;

// Premiums are rounded up to whole G, in the MHPCO's favour.
const roundUpToWholeGold = (amount: number): number => Math.ceil(amount);

// What the MHPCO knows about the customer at the moment a quote is issued.
type CustomerContext = { yearsWithMHPCO: number; isFollowUpContract: boolean };

const quotePremium = (items: Item[], customer: CustomerContext): number => {
  assertKnownItemTypes(items);
  const basePremium = calculateBasePremium(items);
  const premiumBeforeFee =
    basePremium +
    curseSurcharge(items) +
    enchantmentSurcharge(items) +
    firstInsuranceSurcharge(basePremium) -
    loyaltyDiscount(basePremium, customer.yearsWithMHPCO) -
    followUpDiscount(basePremium, customer.isFollowUpContract);
  return roundUpToWholeGold(premiumBeforeFee + PROCESSING_FEE);
};

// ---------------------------------------------------------------------------
// Claim: reimbursement terms
// ---------------------------------------------------------------------------

// Every damage event carries a deductible, borne by the customer.
const DEDUCTIBLE_PER_DAMAGE_EVENT = 100;
// Damage to strongly enchanted items is only partially reimbursed (a stricter bar than the premium surcharge).
const PARTIAL_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const PARTIAL_REIMBURSEMENT_RATE = 0.5;
// Unmodified insurance value per item; the sum over a policy bounds what can be paid out.
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};
// A policy pays out at most twice its insurance sum.
const PAYOUT_CAP_MULTIPLIER = 2;

// ---------------------------------------------------------------------------
// Claim
// ---------------------------------------------------------------------------

// A policy: the items it covers and how much it may still pay out.
type Policy = { items: Item[]; remainingCap: number };

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

const payoutCap = (items: Item[]): number => insuranceSum(items) * PAYOUT_CAP_MULTIPLIER;

const openPolicy = (items: Item[]): Policy => ({ items, remainingCap: payoutCap(items) });

const countDamagesOfType = (damages: Damage[], type: string): number =>
  countWhere(damages, (damage) => damage.itemType === type);

const assertNonNegativeAmount = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount for ${damage.itemType}: ${damage.amount}`);
  }
};

// Each damaged item must be covered by a distinct insured item of the same type.
const assertDamageCovered = (insuredItems: Item[], damages: Damage[], damage: Damage): void => {
  const { itemType } = damage;
  if (countDamagesOfType(damages, itemType) > countOfType(insuredItems, itemType)) {
    throw new Error(`More damages than insured items of type: ${itemType}`);
  }
};

const assertDamagesValid = (insuredItems: Item[], damages: Damage[]): void =>
  damages.forEach((damage) => {
    assertNonNegativeAmount(damage);
    assertDamageCovered(insuredItems, damages, damage);
  });

const isPartiallyReimbursed = (item: Item): boolean =>
  enchantmentLevel(item) >= PARTIAL_REIMBURSEMENT_ENCHANTMENT_THRESHOLD;

const reimbursedAmount = (item: Item, damage: Damage): number =>
  isPartiallyReimbursed(item) ? damage.amount * PARTIAL_REIMBURSEMENT_RATE : damage.amount;

const findDamagedItem = (insuredItems: Item[], damage: Damage): Item | undefined =>
  insuredItems.find((candidate) => candidate.type === damage.itemType);

const payoutForDamage = (insuredItems: Item[], damage: Damage): number => {
  const item = findDamagedItem(insuredItems, damage);
  if (item === undefined) throw new Error(`Damaged item not covered by policy: ${damage.itemType}`);
  return reimbursedAmount(item, damage) - DEDUCTIBLE_PER_DAMAGE_EVENT;
};

const claimPayout = (insuredItems: Item[], damages: Damage[]): number =>
  damages.reduce((total, damage) => total + payoutForDamage(insuredItems, damage), 0);

// Payouts are rounded down to whole G, in the MHPCO's favour.
const roundDownToWholeGold = (amount: number): number => Math.floor(amount);

const settleClaim = (policy: Policy, damages: Damage[]): ClaimResult => {
  assertDamagesValid(policy.items, damages);
  const payout = roundDownToWholeGold(
    Math.min(claimPayout(policy.items, damages), policy.remainingCap),
  );
  return { payout, remainingCap: policy.remainingCap - payout };
};

// ---------------------------------------------------------------------------
// Scenario
// ---------------------------------------------------------------------------

// Every contract after the customer's first in a scenario is a follow-up contract.
const isFollowUpContract = (stepIndex: number): boolean => stepIndex > 0;

const customerContextAt = (scenario: Scenario, stepIndex: number): CustomerContext => ({
  yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
  isFollowUpContract: isFollowUpContract(stepIndex),
});

export const runScenario = (scenario: Scenario): { results: Result[] } => {
  // Policies are referenced by the index of the quote step that created them.
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy) ?? openPolicy([]);
      const result = settleClaim(policy, step.incident.damages);
      policies.set(step.policy, { ...policy, remainingCap: result.remainingCap });
      return result;
    }
    policies.set(index, openPolicy(step.items));
    return { premium: quotePremium(step.items, customerContextAt(scenario, index)) };
  });
  return { results };
};
