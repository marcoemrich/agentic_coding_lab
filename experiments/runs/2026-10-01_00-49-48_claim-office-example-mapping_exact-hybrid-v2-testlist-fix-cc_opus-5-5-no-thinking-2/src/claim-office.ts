export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
export type QuoteStep = { op: "quote"; items: Item[] };
export type Damage = { itemType: string; amount: number };
export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
export type Step = QuoteStep | ClaimStep;
export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};
export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type ScenarioResult = { results: (QuoteResult | ClaimResult)[] };

// ---------------------------------------------------------------------------
// Item catalogue
// ---------------------------------------------------------------------------

type CatalogueEntry = { basePremium: number; insuranceValue: number };
const ITEM_CATALOGUE: Record<string, CatalogueEntry> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};
const catalogueEntryOf = (type: string): CatalogueEntry => {
  const entry = ITEM_CATALOGUE[type];
  if (!entry) throw new Error(`Unknown item type: ${type}`);
  return entry;
};
const basePremiumOf = (type: string): number => catalogueEntryOf(type).basePremium;
const insuranceValueOf = (type: string): number => catalogueEntryOf(type).insuranceValue;

const enchantmentOf = (item: Item): number => item.enchantment ?? 0;

const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / 100;

// ---------------------------------------------------------------------------
// Quotes
// ---------------------------------------------------------------------------

const PROCESSING_FEE = 5;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;

const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

const countItemsByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
};

const isComponentBlock = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === BLOCK_SIZE;

const premiumForType = (type: string, count: number): number =>
  isComponentBlock(type, count) ? BLOCK_PREMIUM : count * basePremiumOf(type);

const sumBasePremiums = (items: Item[]): number =>
  [...countItemsByType(items)].reduce(
    (sum, [type, count]) => sum + premiumForType(type, count),
    0,
  );

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentOf(item) >= HIGH_ENCHANTMENT_LEVEL;

const itemSurcharge = (
  items: Item[],
  applies: (item: Item) => boolean,
  percent: number,
): number =>
  items
    .filter(applies)
    .reduce((sum, item) => sum + percentOf(basePremiumOf(item.type), percent), 0);

const itemSpecificSurcharges = (items: Item[]): number =>
  itemSurcharge(items, isCursed, CURSE_SURCHARGE_PERCENT) +
  itemSurcharge(items, isHighlyEnchanted, HIGH_ENCHANTMENT_SURCHARGE_PERCENT);

const policyWideAdjustmentPercent = (yearsWithMHPCO: number, isFollowUp: boolean): number =>
  FIRST_INSURANCE_SURCHARGE_PERCENT -
  (yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_DISCOUNT_PERCENT : 0) -
  (isFollowUp ? FOLLOW_UP_DISCOUNT_PERCENT : 0);

const quotePremium = (items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number => {
  const basePremium = sumBasePremiums(items);
  const policyWideAdjustment = percentOf(
    basePremium,
    policyWideAdjustmentPercent(yearsWithMHPCO, isFollowUp),
  );
  return Math.ceil(
    basePremium + itemSpecificSurcharges(items) + policyWideAdjustment + PROCESSING_FEE,
  );
};

// ---------------------------------------------------------------------------
// Claims
// ---------------------------------------------------------------------------

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const REDUCED_REIMBURSEMENT_ENCHANTMENT = 8;
const REDUCED_REIMBURSEMENT_PERCENT = 50;

const reimbursableAmount = (damage: Damage, item: Item): number =>
  enchantmentOf(item) >= REDUCED_REIMBURSEMENT_ENCHANTMENT
    ? percentOf(damage.amount, REDUCED_REIMBURSEMENT_PERCENT)
    : damage.amount;

const takeInsuredItemFor = (damage: Damage, unclaimedItems: Item[]): Item => {
  const index = unclaimedItems.findIndex((candidate) => candidate.type === damage.itemType);
  if (index === -1) throw new Error(`Item not insured by this policy: ${damage.itemType}`);
  return unclaimedItems.splice(index, 1)[0];
};

const damagePayout = (damage: Damage, unclaimedItems: Item[]): number => {
  if (damage.amount < 0) throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  const insuredItem = takeInsuredItemFor(damage, unclaimedItems);
  return Math.max(0, reimbursableAmount(damage, insuredItem) - DEDUCTIBLE);
};

const coverageCap = (policyItems: Item[]): number =>
  CAP_MULTIPLIER * policyItems.reduce((sum, item) => sum + insuranceValueOf(item.type), 0);

const processClaim = (
  step: ClaimStep,
  policyItems: Item[],
  remainingCaps: Map<number, number>,
): ClaimResult => {
  const capBefore = remainingCaps.get(step.policy) ?? coverageCap(policyItems);
  const unclaimedItems = [...policyItems];
  const requested = Math.floor(
    step.incident.damages.reduce((sum, damage) => sum + damagePayout(damage, unclaimedItems), 0),
  );
  const payout = Math.min(requested, capBefore);
  const remainingCap = capBefore - payout;
  remainingCaps.set(step.policy, remainingCap);
  return { payout, remainingCap };
};

// ---------------------------------------------------------------------------
// Scenario
// ---------------------------------------------------------------------------

const policyItemsOf = (scenario: Scenario, claim: ClaimStep): Item[] =>
  (scenario.steps[claim.policy] as QuoteStep).items;

const hasEarlierQuote = (steps: Step[], index: number): boolean =>
  steps.slice(0, index).some((step) => step.op === "quote");

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const remainingCaps = new Map<number, number>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === "claim") {
        return processClaim(step, policyItemsOf(scenario, step), remainingCaps);
      }
      const isFollowUp = hasEarlierQuote(scenario.steps, index);
      return { premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, isFollowUp) };
    }),
  };
};
