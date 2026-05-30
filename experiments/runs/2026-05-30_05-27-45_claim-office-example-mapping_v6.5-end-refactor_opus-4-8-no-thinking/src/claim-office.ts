const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const LOYALTY_THRESHOLD = 2;
const LOYALTY_RATE = 0.2;
const FOLLOWUP_RATE = 0.15;

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

type Step = QuoteStep | ClaimStep;

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BASE = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE = 60;

const componentBase = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE : count * COMPONENT_BASE;

const lookupByType = (
  type: string,
  componentValue: number,
  mainItemValues: Record<string, number>,
): number =>
  COMPONENT_TYPES.has(type) ? componentValue : (mainItemValues[type] ?? 0);

const unitBase = (type: string): number =>
  lookupByType(type, COMPONENT_BASE, BASE_PREMIUMS);

const baseForType = (type: string, count: number): number =>
  COMPONENT_TYPES.has(type)
    ? componentBase(count)
    : unitBase(type) * count;

const countBy = <T>(values: T[], key: (value: T) => string): Map<string, number> =>
  values.reduce((counts, value) => {
    const group = key(value);
    return counts.set(group, (counts.get(group) ?? 0) + 1);
  }, new Map<string, number>());

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const baseForItems = (items: Item[]): number =>
  [...countByType(items)].reduce(
    (total, [type, count]) => total + baseForType(type, count),
    0,
  );

const enchantmentLevel = (item: Item | undefined): number =>
  item?.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD;

const surchargeRate = (item: Item): number =>
  (item.cursed ? CURSE_RATE : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_RATE : 0);

const itemSurcharges = (item: Item): number =>
  unitBase(item.type) * surchargeRate(item);

const surchargesForItems = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharges(item), 0);

const firstInsuranceSurcharge = (policyBase: number): number =>
  policyBase * FIRST_INSURANCE_RATE;

const loyaltyDiscount = (policyBase: number, customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD ? policyBase * LOYALTY_RATE : 0;

const followUpDiscount = (policyBase: number, isFollowUp: boolean): number =>
  isFollowUp ? policyBase * FOLLOWUP_RATE : 0;

const isKnownType = (type: string): boolean =>
  COMPONENT_TYPES.has(type) || type in BASE_PREMIUMS;

const validateKnownTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownType(item.type));
  if (unknown) {
    throw new Error(`Unknown item type: ${unknown.type}`);
  }
};

const priceQuote = (
  items: Item[],
  customer: Customer,
  isFollowUp: boolean,
): { premium: number } => {
  validateKnownTypes(items);
  const policyBase = baseForItems(items);
  const surcharges = surchargesForItems(items);
  const premium = Math.ceil(
    policyBase +
      surcharges +
      firstInsuranceSurcharge(policyBase) -
      loyaltyDiscount(policyBase, customer) -
      followUpDiscount(policyBase, isFollowUp) +
      PROCESSING_FEE,
  );
  return { premium };
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_REIMBURSE_THRESHOLD = 8;
const REIMBURSE_RATE = 0.5;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

const insuranceValue = (type: string): number =>
  lookupByType(type, COMPONENT_INSURANCE_VALUE, INSURANCE_VALUES);

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValue(item.type), 0);

const hasReducedReimbursement = (item: Item | undefined): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_REIMBURSE_THRESHOLD;

const reimbursableAmount = (damage: Damage, item: Item | undefined): number =>
  hasReducedReimbursement(item)
    ? damage.amount * REIMBURSE_RATE
    : damage.amount;

const damagePayout = (damage: Damage, items: Item[]): number => {
  const item = items.find((candidate) => candidate.type === damage.itemType);
  return Math.max(0, reimbursableAmount(damage, item) - DEDUCTIBLE);
};

const initialCap = (items: Item[]): number =>
  insuranceSum(items) * CAP_MULTIPLIER;

const uncappedPayout = (damages: Damage[], items: Item[]): number =>
  damages.reduce((sum, damage) => sum + damagePayout(damage, items), 0);

const validateDamageAmounts = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) {
    throw new Error(`Claim rejected: negative damage amount ${negative.amount}`);
  }
};

const validateDamageCounts = (damages: Damage[], items: Item[]): void => {
  const insuredCounts = countByType(items);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  const overClaimed = [...damageCounts].find(
    ([itemType, damaged]) => damaged > (insuredCounts.get(itemType) ?? 0),
  );
  if (overClaimed) {
    throw new Error(
      `Claim rejected: more "${overClaimed[0]}" damages than insured items`,
    );
  }
};

const validateClaim = (damages: Damage[], items: Item[]): void => {
  validateDamageAmounts(damages);
  validateDamageCounts(damages, items);
};

const processClaim = (
  step: ClaimStep,
  steps: Step[],
  remainingCapByPolicy: Map<number, number>,
): { payout: number; remainingCap: number } => {
  const policyStep = steps[step.policy] as QuoteStep;
  validateClaim(step.incident.damages, policyStep.items);
  const remaining =
    remainingCapByPolicy.get(step.policy) ?? initialCap(policyStep.items);
  const uncapped = uncappedPayout(step.incident.damages, policyStep.items);
  const payout = Math.floor(Math.min(uncapped, remaining));
  const remainingCap = remaining - payout;
  remainingCapByPolicy.set(step.policy, remainingCap);
  return { payout, remainingCap };
};

const firstQuoteIndex = (steps: Step[]): number =>
  steps.findIndex((step) => step.op === "quote");

export const runScenario = (scenario: Scenario): { results: unknown[] } => {
  const remainingCapByPolicy = new Map<number, number>();
  const firstQuote = firstQuoteIndex(scenario.steps);
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const isFollowUp = index > firstQuote;
      return priceQuote(step.items, scenario.customer, isFollowUp);
    }
    return processClaim(step, scenario.steps, remainingCapByPolicy);
  });
  return { results };
};
