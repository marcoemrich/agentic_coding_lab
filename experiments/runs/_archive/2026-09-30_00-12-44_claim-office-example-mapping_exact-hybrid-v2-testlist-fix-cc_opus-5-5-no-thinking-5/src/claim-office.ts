export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: Incident };

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Incident {
  cause: string;
  damages: { itemType: string; amount: number }[];
}

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type Result = QuoteResult | ClaimResult;

export interface ScenarioOutcome {
  results: any[]; // loosely typed so callers can read premium/payout without narrowing
}

const PROCESSING_FEE = 5;
// MHPCO price list per item type (gold).
const PRICE_LIST: Record<string, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENTS_PER_BLOCK = 3;
const COMPONENT_BLOCK_PREMIUM = 60; // building block of 3 alike components

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;

// Fractional gold is always rounded in MHPCO's favor: premiums up, payouts down.
const roundPremiumInMHPCOsFavor = (gold: number): number => Math.ceil(gold);
const roundPayoutInMHPCOsFavor = (gold: number): number => Math.floor(gold);

const sumOf = <T>(values: T[], amountOf: (value: T) => number): number =>
  values.reduce((sum, value) => sum + amountOf(value), 0);

const sumOfItemPremiums = (items: Item[]): number => sumOf(items, (item) => PRICE_LIST[item.type].basePremium);

const premiumOfAlikeComponents = (components: Item[]): number =>
  components.length === COMPONENTS_PER_BLOCK ? COMPONENT_BLOCK_PREMIUM : sumOfItemPremiums(components);

const basePremiumOf = (items: Item[]): number => {
  const mainItems = items.filter((item) => !COMPONENT_TYPES.includes(item.type));
  const componentPremium = sumOf(COMPONENT_TYPES, (type) =>
    premiumOfAlikeComponents(items.filter((item) => item.type === type)),
  );
  return sumOfItemPremiums(mainItems) + componentPremium;
};

// Multiply before dividing so integer gold amounts stay float-safe.
const PERCENT_BASE = 100;
const percentOf = (gold: number, percent: number): number => (gold * percent) / PERCENT_BASE;

const isCursed = (item: Item): boolean => item.cursed === true;
const isHighlyEnchanted = (item: Item): boolean => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
const isLoyalCustomer = (yearsWithMHPCO: number): boolean => yearsWithMHPCO >= LOYALTY_YEARS;

// Item-specific surcharge: a percentage of the affected items' own base premiums.
const itemSurchargeOf = (items: Item[], applies: (item: Item) => boolean, percent: number): number =>
  percentOf(sumOfItemPremiums(items.filter(applies)), percent);

const isKnownItemType = (type: string): boolean => type in PRICE_LIST;

const assertAllItemTypesKnown = (items: Item[]): void => {
  const unknownItem = items.find((item) => !isKnownItemType(item.type));
  if (unknownItem) throw new Error(`Unknown item type: ${unknownItem.type}`);
};

const quotePremium = (items: Item[], yearsWithMHPCO: number, isFollowUpContract: boolean): number => {
  assertAllItemTypesKnown(items);
  const basePremium = basePremiumOf(items);
  const surcharges =
    itemSurchargeOf(items, isCursed, CURSE_SURCHARGE_PERCENT) +
    itemSurchargeOf(items, isHighlyEnchanted, HIGH_ENCHANTMENT_SURCHARGE_PERCENT) +
    percentOf(basePremium, FIRST_INSURANCE_SURCHARGE_PERCENT);
  const discounts =
    (isLoyalCustomer(yearsWithMHPCO) ? percentOf(basePremium, LOYALTY_DISCOUNT_PERCENT) : 0) +
    (isFollowUpContract ? percentOf(basePremium, FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT) : 0);
  return roundPremiumInMHPCOsFavor(basePremium + surcharges - discounts + PROCESSING_FEE);
};

const DEDUCTIBLE_PER_DAMAGED_ITEM = 100;
const CLAIM_CAP_MULTIPLIER = 2; // a policy pays out at most twice its insurance sum
const STRONGLY_ENCHANTED_LEVEL = 8;
const STRONGLY_ENCHANTED_REIMBURSEMENT_PERCENT = 50;

const isStronglyEnchanted = (item: Item): boolean => (item.enchantment ?? 0) >= STRONGLY_ENCHANTED_LEVEL;

const reimbursableAmountOf = (damagedItem: Item, damageAmount: number): number =>
  isStronglyEnchanted(damagedItem)
    ? percentOf(damageAmount, STRONGLY_ENCHANTED_REIMBURSEMENT_PERCENT)
    : damageAmount;

const insuranceSumOf = (items: Item[]): number => sumOf(items, (item) => PRICE_LIST[item.type].insuranceValue);

const initialClaimCapOf = (insuredItems: Item[]): number => CLAIM_CAP_MULTIPLIER * insuranceSumOf(insuredItems);

type Damage = Incident["damages"][number];

const countOfType = <T>(entries: T[], typeOf: (entry: T) => string, type: string): number =>
  entries.filter((entry) => typeOf(entry) === type).length;

const assertDamageAmountsValid = (damages: Damage[]): void => {
  const invalidDamage = damages.find((damage) => damage.amount < 0);
  if (invalidDamage) throw new Error(`Invalid damage amount for ${invalidDamage.itemType}: ${invalidDamage.amount}`);
};

// Every damage entry must be matched by its own insured item of that type
// (this also rejects damages to item types the policy does not cover at all).
const assertDamagesCoveredByPolicy = (insuredItems: Item[], damages: Damage[]): void => {
  for (const { itemType } of damages) {
    const damagedCount = countOfType(damages, (damage) => damage.itemType, itemType);
    const insuredCount = countOfType(insuredItems, (item) => item.type, itemType);
    if (damagedCount > insuredCount) throw new Error(`More ${itemType} damages than insured ${itemType} items`);
  }
};

// Assumes coverage was already asserted. The deductible can swallow a small damage
// entirely, but never makes the payout negative.
const payoutForDamage = (insuredItems: Item[], damage: Damage): number => {
  const damagedItem = insuredItems.find((item) => item.type === damage.itemType)!;
  return Math.max(0, reimbursableAmountOf(damagedItem, damage.amount) - DEDUCTIBLE_PER_DAMAGED_ITEM);
};

const settleClaim = (
  insuredItems: Item[],
  incident: Incident,
  capBefore: number,
): ClaimResult => {
  assertDamageAmountsValid(incident.damages);
  assertDamagesCoveredByPolicy(insuredItems, incident.damages);
  const requestedPayout = roundPayoutInMHPCOsFavor(
    sumOf(incident.damages, (damage) => payoutForDamage(insuredItems, damage)),
  );
  const payout = Math.min(requestedPayout, capBefore);
  return { payout, remainingCap: capBefore - payout };
};

type QuoteStep = Extract<Step, { op: "quote" }>;

export const processScenario = (scenario: Scenario): ScenarioOutcome => {
  const remainingCaps = new Map<number, number>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      const policy = scenario.steps[step.policy] as QuoteStep;
      const capBefore = remainingCaps.get(step.policy) ?? initialClaimCapOf(policy.items);
      const result = settleClaim(policy.items, step.incident, capBefore);
      remainingCaps.set(step.policy, result.remainingCap);
      return result;
    }
    return { premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, index > 0) };
  });
  return { results };
};
