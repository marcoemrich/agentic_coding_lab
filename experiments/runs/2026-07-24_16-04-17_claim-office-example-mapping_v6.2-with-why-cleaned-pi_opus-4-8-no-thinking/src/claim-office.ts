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

interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type { Scenario };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOWUP_DISCOUNT = 0.15;

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const MAIN_ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const isKnownItemType = (item: Item): boolean =>
  isComponent(item) || item.type in MAIN_ITEM_BASE_PREMIUM;

const assertKnownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item))
      throw new Error(`Unknown item type: ${item.type}`);
  }
};

const componentGroupBasePremium = (count: number): number => {
  if (count === BLOCK_SIZE) return BLOCK_BASE_PREMIUM;
  return count * COMPONENT_BASE_PREMIUM;
};

const countOccurrences = (values: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
};

const countItemTypes = (items: Item[]): Map<string, number> =>
  countOccurrences(items.map((item) => item.type));

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;

const itemValueByType = (
  item: Item,
  componentValue: number,
  mainItemTable: Record<string, number>,
): number =>
  isComponent(item) ? componentValue : mainItemTable[item.type];

const itemBaseFor = (item: Item): number =>
  itemValueByType(item, COMPONENT_BASE_PREMIUM, MAIN_ITEM_BASE_PREMIUM);

const itemSurcharges = (item: Item): number => {
  const base = itemBaseFor(item);
  const curseSurcharge = item.cursed ? base * CURSE_SURCHARGE : 0;
  const highEnchantmentSurcharge =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
      ? base * HIGH_ENCHANTMENT_SURCHARGE
      : 0;
  return curseSurcharge + highEnchantmentSurcharge;
};

const policyBasePremium = (items: Item[]): number => {
  const components = items.filter(isComponent);
  const mainItems = items.filter((item) => !isComponent(item));
  const mainItemsBase = mainItems.reduce(
    (sum, item) => sum + itemBaseFor(item),
    0,
  );
  const componentsBase = [...countItemTypes(components).values()].reduce(
    (sum, count) => sum + componentGroupBasePremium(count),
    0,
  );
  return mainItemsBase + componentsBase;
};

const loyaltyDiscountFor = (customer: Customer, policyBase: number): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS ? policyBase * LOYALTY_DISCOUNT : 0;

const quotePremium = (
  items: Item[],
  customer: Customer,
  isFollowUp: boolean,
): number => {
  assertKnownItemTypes(items);
  const policyBase = policyBasePremium(items);
  const itemSurchargeTotal = items.reduce(
    (sum, item) => sum + itemSurcharges(item),
    0,
  );
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_SURCHARGE;
  const loyaltyDiscount = loyaltyDiscountFor(customer, policyBase);
  const followUpDiscount = isFollowUp ? policyBase * FOLLOWUP_DISCOUNT : 0;
  return Math.ceil(
    policyBase +
      itemSurchargeTotal +
      firstInsuranceSurcharge -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE,
  );
};

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

type StepResult = QuoteResult | ClaimResult;

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_PAYOUT_LEVEL = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

const COMPONENT_INSURANCE_VALUE = 250;
const MAIN_ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const itemInsuranceValue = (item: Item): number =>
  itemValueByType(item, COMPONENT_INSURANCE_VALUE, MAIN_ITEM_INSURANCE_VALUE);

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

const damagePayout = (item: Item, amount: number): number => {
  const isHighEnchantment =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_LEVEL;
  const reimbursed = isHighEnchantment
    ? amount * HIGH_ENCHANTMENT_PAYOUT_RATE
    : amount;
  return reimbursed - DEDUCTIBLE;
};

const assertDamagesWithinCoverage = (
  policyItems: Item[],
  damages: Damage[],
): void => {
  const coveredCounts = countItemTypes(policyItems);
  const damageCounts = countOccurrences(
    damages.map((damage) => damage.itemType),
  );
  for (const [type, count] of damageCounts) {
    if (count > (coveredCounts.get(type) ?? 0))
      throw new Error(`More ${type} damages than insured`);
  }
};

const assertDamagesNonNegative = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0)
      throw new Error(`Negative damage amount: ${damage.amount}`);
  }
};

const processClaim = (
  policyItems: Item[],
  incident: Incident,
  remainingCap: number,
): ClaimResult => {
  assertDamagesWithinCoverage(policyItems, incident.damages);
  assertDamagesNonNegative(incident.damages);
  const uncappedPayout = incident.damages.reduce((sum, damage) => {
    const item = policyItems.find((i) => i.type === damage.itemType)!;
    return sum + damagePayout(item, damage.amount);
  }, 0);
  const finalPayout = Math.min(Math.floor(uncappedPayout), remainingCap);
  return { payout: finalPayout, remainingCap: remainingCap - finalPayout };
};

const initialCapFor = (items: Item[]): number =>
  insuranceSum(items) * CAP_MULTIPLIER;

export const runScenario = (
  scenario: Scenario,
): { results: StepResult[] } => {
  const remainingCaps = new Map<number, number>();
  const results: StepResult[] = scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      const policyStep = scenario.steps[step.policy] as QuoteStep;
      const currentCap =
        remainingCaps.get(step.policy) ?? initialCapFor(policyStep.items);
      const result = processClaim(policyStep.items, step.incident, currentCap);
      remainingCaps.set(step.policy, result.remainingCap);
      return result;
    }
    return {
      premium: quotePremium(step.items, scenario.customer, index > 0),
    };
  });
  return { results };
};
