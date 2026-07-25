const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

const COMPONENT_BASE = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE = 60;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const MAIN_ITEM_BASE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const CURSE_RATE = 0.5;
const HIGH_ENCHANT_RATE = 0.3;
const HIGH_ENCHANT_MIN = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_MIN_YEARS = 2;
const FOLLOWUP_RATE = 0.15;

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANT_PAYOUT_MIN = 8;
const HIGH_ENCHANT_PAYOUT_RATE = 0.5;

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Incident {
  cause: string;
  damages: Damage[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

type Step = QuoteStep | ClaimStep;

interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const blockBasePremium = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE : count * COMPONENT_BASE;

const componentsBasePremium = (items: Item[]): number => {
  let total = 0;
  for (const count of countByType(items).values()) {
    total += blockBasePremium(count);
  }
  return total;
};

const mainItemsBasePremium = (items: Item[]): number =>
  items.reduce((sum, i) => sum + MAIN_ITEM_BASE[i.type], 0);

// Surcharges that add `rate` of an item's base premium for each item matching `applies`.
const modifierSurcharge = (
  items: Item[],
  applies: (item: Item) => boolean,
  rate: number,
): number =>
  items.reduce((sum, i) => sum + (applies(i) ? MAIN_ITEM_BASE[i.type] * rate : 0), 0);

const curseSurcharge = (items: Item[]): number =>
  modifierSurcharge(items, (i) => i.cursed === true, CURSE_RATE);

const highEnchantSurcharge = (items: Item[]): number =>
  modifierSurcharge(items, (i) => (i.enchantment ?? 0) >= HIGH_ENCHANT_MIN, HIGH_ENCHANT_RATE);

const isKnownItemType = (type: string): boolean =>
  COMPONENT_TYPES.has(type) || type in MAIN_ITEM_BASE;

// Reject a quote up front if it lists any item type we cannot price.
const assertKnownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) throw new Error(`Unknown item type: ${item.type}`);
  }
};

const quotePremium = (step: QuoteStep, customer: Customer, isFollowUp: boolean): number => {
  assertKnownItemTypes(step.items);
  const components = step.items.filter((i) => COMPONENT_TYPES.has(i.type));
  const mainItems = step.items.filter((i) => i.type in MAIN_ITEM_BASE);

  const policyBase = componentsBasePremium(components) + mainItemsBasePremium(mainItems);

  const firstInsuranceLoading = policyBase * FIRST_INSURANCE_RATE;
  const curse = curseSurcharge(mainItems);
  const highEnchant = highEnchantSurcharge(mainItems);
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS ? policyBase * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUp ? policyBase * FOLLOWUP_RATE : 0;

  const premium =
    policyBase +
    firstInsuranceLoading +
    curse +
    highEnchant -
    loyaltyDiscount -
    followUpDiscount +
    PROCESSING_FEE;

  return Math.ceil(premium);
};

const itemInsuranceValue = (item: Item): number =>
  INSURANCE_VALUE[item.type] ?? COMPONENT_INSURANCE_VALUE;

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, i) => sum + itemInsuranceValue(i), 0);

const damagePayout = (item: Item, amount: number): number => {
  const reimbursed =
    (item.enchantment ?? 0) >= HIGH_ENCHANT_PAYOUT_MIN
      ? amount * HIGH_ENCHANT_PAYOUT_RATE
      : amount;
  return Math.max(0, reimbursed - DEDUCTIBLE);
};

// Remove and return the insured item matching `type`, so each damage maps to a
// distinct item. Rejects the claim when no unclaimed item of that type remains.
const takeMatchingItem = (unclaimedItems: Item[], type: string): Item => {
  const idx = unclaimedItems.findIndex((i) => i.type === type);
  if (idx === -1) throw new Error(`Damaged item not in policy: ${type}`);
  return unclaimedItems.splice(idx, 1)[0];
};

// Reject a claim up front if any damage reports a negative amount, mirroring the
// quote path's `assertKnownItemTypes` so validation stays separate from payout math.
const assertNonNegativeDamages = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
  }
};

const processClaim = (step: ClaimStep, policy: Policy): ClaimResult => {
  assertNonNegativeDamages(step.incident.damages);
  const unclaimedItems = [...policy.items];
  const requestedPayout = step.incident.damages.reduce((sum, damage) => {
    const item = takeMatchingItem(unclaimedItems, damage.itemType);
    return sum + damagePayout(item, damage.amount);
  }, 0);
  const payout = Math.min(Math.floor(requestedPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;

  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount += 1;
      policies.set(index, {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
      });
      return { premium: quotePremium(step, scenario.customer, isFollowUp) };
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) throw new Error(`Unknown policy: ${step.policy}`);
    return processClaim(step, policy);
  });
  return { results };
};
