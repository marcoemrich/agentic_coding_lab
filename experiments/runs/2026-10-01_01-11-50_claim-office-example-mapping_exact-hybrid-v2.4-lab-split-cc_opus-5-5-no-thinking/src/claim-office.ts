export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
export type Damage = { itemType: string; amount: number };
export type QuoteStep = { op: "quote"; items: Item[] };
export type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: (QuoteStep | ClaimStep)[];
};
export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type ScenarioResult = { results: (QuoteResult | ClaimResult)[] };

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const PROCESSING_FEE = 5;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};
const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const POWERFUL_ENCHANTMENT_LEVEL = 8;
const POWERFUL_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

const countOccurrences = (types: string[]): Map<string, number> =>
  types.reduce((counts, type) => counts.set(type, (counts.get(type) ?? 0) + 1), new Map<string, number>());

const typesOf = (items: Item[]): string[] => items.map((item) => item.type);

const isBuildingBlock = (type: string, count: number): boolean =>
  COMPONENT_TYPES.includes(type) && count === BUILDING_BLOCK_SIZE;

const basePremiumOfAlike = (type: string, count: number): number =>
  isBuildingBlock(type, count) ? BUILDING_BLOCK_PREMIUM : count * BASE_PREMIUMS[type];

const basePremiumOf = (items: Item[]): number =>
  [...countOccurrences(typesOf(items))].reduce((sum, [type, count]) => sum + basePremiumOfAlike(type, count), 0);

const roundPremiumInFavourOfMHPCO = (amount: number): number => Math.ceil(amount);

const roundPayoutInFavourOfMHPCO = (amount: number): number => Math.floor(amount);

const percentOf = (amount: number, percent: number): number => (amount * percent) / 100;

const itemSurchargeOf = (items: Item[], appliesTo: (item: Item) => boolean, percent: number): number =>
  items.filter(appliesTo).reduce((sum, item) => sum + percentOf(BASE_PREMIUMS[item.type], percent), 0);

const isCursed = (item: Item): boolean => item.cursed === true;

const enchantmentLevelOf = (item: Item | undefined): number => item?.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean => enchantmentLevelOf(item) >= HIGH_ENCHANTMENT_LEVEL;

const curseSurchargeOf = (items: Item[]): number => itemSurchargeOf(items, isCursed, CURSE_SURCHARGE_PERCENT);

const highEnchantmentSurchargeOf = (items: Item[]): number =>
  itemSurchargeOf(items, isHighlyEnchanted, HIGH_ENCHANTMENT_SURCHARGE_PERCENT);

const isLoyalCustomer = (yearsWithMHPCO: number): boolean => yearsWithMHPCO >= LOYALTY_YEARS;

const loyaltyDiscountOf = (basePremium: number, yearsWithMHPCO: number): number =>
  isLoyalCustomer(yearsWithMHPCO) ? percentOf(basePremium, LOYALTY_DISCOUNT_PERCENT) : 0;

const followUpDiscountOf = (basePremium: number, isFollowUpContract: boolean): number =>
  isFollowUpContract ? percentOf(basePremium, FOLLOW_UP_DISCOUNT_PERCENT) : 0;

const assertKnownTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !(item.type in BASE_PREMIUMS));
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
};

const quotePremium = (items: Item[], yearsWithMHPCO: number, isFollowUpContract: boolean): number => {
  assertKnownTypes(items);
  const basePremium = basePremiumOf(items);
  const surcharges =
    curseSurchargeOf(items) +
    highEnchantmentSurchargeOf(items) +
    percentOf(basePremium, FIRST_INSURANCE_SURCHARGE_PERCENT);
  const discounts =
    loyaltyDiscountOf(basePremium, yearsWithMHPCO) + followUpDiscountOf(basePremium, isFollowUpContract);
  return roundPremiumInFavourOfMHPCO(basePremium + surcharges - discounts + PROCESSING_FEE);
};

const isFollowUpStep = (stepIndex: number): boolean => stepIndex > 0;

const insuranceSumOf = (items: Item[]): number => items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

const isPowerfullyEnchanted = (item: Item | undefined): boolean =>
  enchantmentLevelOf(item) >= POWERFUL_ENCHANTMENT_LEVEL;

const reimbursableAmountOf = (damage: Damage, insuredItems: Item[]): number => {
  const damagedItem = insuredItems.find((insured) => insured.type === damage.itemType);
  return isPowerfullyEnchanted(damagedItem)
    ? percentOf(damage.amount, POWERFUL_ENCHANTMENT_REIMBURSEMENT_PERCENT)
    : damage.amount;
};

const payoutOf = (damages: Damage[], insuredItems: Item[]): number =>
  damages.reduce((sum, damage) => sum + reimbursableAmountOf(damage, insuredItems) - DEDUCTIBLE, 0);

const coverageCapOf = (items: Item[]): number => CAP_FACTOR * insuranceSumOf(items);

const insuredItemsOf = (scenario: Scenario, claim: ClaimStep): Item[] => (scenario.steps[claim.policy] as QuoteStep).items;

const assertNonNegativeAmounts = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) throw new Error(`Negative damage amount: ${negative.amount}`);
};

const assertDamagesCovered = (damages: Damage[], insuredItems: Item[]): void => {
  const insuredCounts = countOccurrences(typesOf(insuredItems));
  const damagedCounts = countOccurrences(damages.map((damage) => damage.itemType));
  for (const [type, count] of damagedCounts) {
    if (count > (insuredCounts.get(type) ?? 0)) throw new Error(`Damage to ${type} exceeds insured items`);
  }
};

const settleClaim = (claim: ClaimStep, insuredItems: Item[], availableCap: number): ClaimResult => {
  assertNonNegativeAmounts(claim.incident.damages);
  assertDamagesCovered(claim.incident.damages, insuredItems);
  const payout = Math.min(roundPayoutInFavourOfMHPCO(payoutOf(claim.incident.damages, insuredItems)), availableCap);
  return { payout, remainingCap: availableCap - payout };
};

const settleClaimAgainstPolicy = (scenario: Scenario, claim: ClaimStep, remainingCaps: Map<number, number>): ClaimResult => {
  const insuredItems = insuredItemsOf(scenario, claim);
  const availableCap = remainingCaps.get(claim.policy) ?? coverageCapOf(insuredItems);
  const result = settleClaim(claim, insuredItems, availableCap);
  remainingCaps.set(claim.policy, result.remainingCap);
  return result;
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const remainingCapsByPolicy = new Map<number, number>();
  return {
    results: scenario.steps.map((step, index) =>
      step.op === "quote"
        ? { premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, isFollowUpStep(index)) }
        : settleClaimAgainstPolicy(scenario, step, remainingCapsByPolicy),
    ),
  };
};
