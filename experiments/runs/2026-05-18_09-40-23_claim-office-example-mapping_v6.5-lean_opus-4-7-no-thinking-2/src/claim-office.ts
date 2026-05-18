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
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause?: string;
    damages: Damage[];
  };
}

export type Step = QuoteStep | ClaimStep;

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

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;

const ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const basePremiumFor = (item: Item): number => {
  const premium = ITEM_BASE_PREMIUM[item.type];
  if (premium === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return premium;
};

const COMPONENT_BLOCK_PREMIUM = 60;

const sumBasePremiums = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumFor(item), 0);

const COMPONENT_TYPES = ["rune", "moonstone"];

const isComponent = (item: Item): boolean => COMPONENT_TYPES.includes(item.type);

const componentGroupTotal = (group: Item[]): number =>
  group.length === 3 ? COMPONENT_BLOCK_PREMIUM : sumBasePremiums(group);

const componentsTotal = (items: Item[]): number =>
  COMPONENT_TYPES.reduce(
    (sum, type) => sum + componentGroupTotal(items.filter((i) => i.type === type)),
    0,
  );

const itemsBaseTotal = (items: Item[]): number =>
  sumBasePremiums(items.filter((i) => !isComponent(i))) + componentsTotal(items);

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const isCursed = (item: Item): boolean => item.cursed === true;
const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const ITEM_SURCHARGE_RATES: ReadonlyArray<(item: Item) => number> = [
  (item) => (isCursed(item) ? CURSE_SURCHARGE_RATE : 0),
  (item) => (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0),
];

const itemSurchargeRate = (item: Item): number =>
  ITEM_SURCHARGE_RATES.reduce((sum, rate) => sum + rate(item), 0);

const itemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumFor(item) * itemSurchargeRate(item), 0);

const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const policyDiscountRate = (customer: Customer): number =>
  isLoyal(customer) ? LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscountRate = (isFollowUp: boolean): number =>
  isFollowUp ? FOLLOW_UP_DISCOUNT_RATE : 0;

const policyAdjustedBase = (
  baseTotal: number,
  customer: Customer,
  isFollowUp: boolean,
): number =>
  baseTotal * (1 - policyDiscountRate(customer) - followUpDiscountRate(isFollowUp)) +
  baseTotal * FIRST_INSURANCE_SURCHARGE_RATE;

const quote = (
  { items }: QuoteStep,
  customer: Customer,
  isFollowUp: boolean,
): QuoteResult => ({
  premium: Math.ceil(
    policyAdjustedBase(itemsBaseTotal(items), customer, isFollowUp) +
      itemSurcharges(items) +
      PROCESSING_FEE,
  ),
});

const hasPriorQuote = (steps: Step[], index: number): boolean =>
  steps.slice(0, index).some((s) => s.op === "quote");

const ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const insuranceValueFor = (item: Item): number => ITEM_INSURANCE_VALUE[item.type];

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueFor(item), 0);

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const reimbursementRate = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;

const findInsuredItem = (items: Item[], itemType: string): Item =>
  items.find((i) => i.type === itemType) as Item;

const damagePayout = (damage: Damage, items: Item[]): number => {
  if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
  const insured = findInsuredItem(items, damage.itemType);
  return damage.amount * reimbursementRate(insured) - DEDUCTIBLE;
};

const sumDamagePayouts = (damages: Damage[], items: Item[]): number =>
  damages.reduce((sum, d) => sum + damagePayout(d, items), 0);

const insuranceCap = (items: Item[]): number => insuranceSum(items) * CAP_MULTIPLIER;

const policyItems = (steps: Step[], policyIndex: number): Item[] =>
  (steps[policyIndex] as QuoteStep).items;

const roundDownInFavor = (amount: number): number => Math.floor(amount);

const cappedAt = (amount: number, cap: number): number => Math.min(amount, cap);

const priorPayoutsOnPolicy = (
  steps: Step[],
  results: StepResult[],
  policy: number,
): number =>
  results.reduce((sum, result, i) => {
    const priorStep = steps[i];
    return priorStep.op === "claim" && priorStep.policy === policy
      ? sum + (result as ClaimResult).payout
      : sum;
  }, 0);

const countDamagesOfType = (damages: Damage[], itemType: string): number =>
  damages.filter((d) => d.itemType === itemType).length;

const countItemsOfType = (items: Item[], itemType: string): number =>
  items.filter((i) => i.type === itemType).length;

const validateDamageCounts = (damages: Damage[], items: Item[]): void => {
  damages.forEach((d) => {
    const damageCount = countDamagesOfType(damages, d.itemType);
    const insuredCount = countItemsOfType(items, d.itemType);
    if (damageCount > insuredCount) {
      throw new Error(
        `More damage entries (${damageCount}) than insured items (${insuredCount}) of type ${d.itemType}`,
      );
    }
  });
};

const claim = (step: ClaimStep, steps: Step[], results: StepResult[]): ClaimResult => {
  const items = policyItems(steps, step.policy);
  validateDamageCounts(step.incident.damages, items);
  const cap = insuranceCap(items);
  const alreadyPaid = priorPayoutsOnPolicy(steps, results, step.policy);
  const remaining = cap - alreadyPaid;
  const uncappedPayout = roundDownInFavor(sumDamagePayouts(step.incident.damages, items));
  const payout = cappedAt(uncappedPayout, remaining);
  return { payout, remainingCap: remaining - payout };
};

export const runScenario = (scenario: Scenario): ScenarioResult => ({
  results: scenario.steps.reduce<StepResult[]>((results, step, index) => {
    const result =
      step.op === "quote"
        ? quote(step, scenario.customer, hasPriorQuote(scenario.steps, index))
        : claim(step, scenario.steps, results);
    return [...results, result];
  }, []),
});
