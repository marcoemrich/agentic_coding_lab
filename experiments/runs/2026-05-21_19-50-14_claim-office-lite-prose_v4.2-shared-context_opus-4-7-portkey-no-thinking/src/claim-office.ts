type ScenarioResult = { premium?: number; payout?: number };
type ScenarioOutput = { results: ScenarioResult[] };

type Item = {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
};
type Damage = { itemType: string; amount: number };
type Incident = { cause?: string; damages: Damage[] };
type Step = {
  op: string;
  items: Item[];
  policy?: number;
  incident?: Incident;
};
type Customer = { yearsWithMHPCO?: number };
type Input = { customer?: Customer; steps: Step[] };

const HIGHLY_ENCHANTED_MIN = 5;
const LOYALTY_MIN_YEARS = 2;

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;
const COMPONENT_UNIT_PRICE = 25;

const COMPONENT_TYPES: readonly string[] = ["rune", "moonstone"];

const BASE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_UNIT_PRICE,
  moonstone: COMPONENT_UNIT_PRICE,
};

// Surcharge / discount multipliers expressed as integer percentages so the
// pricing arithmetic stays integer-exact until the final divide-and-ceil.
const PERCENT_SCALE = 100;
const PROCESSING_FEE = 5;
const CURSED_MULT_PCT = 150;
const HIGHLY_ENCHANTED_MULT_PCT = 130;
const LOYALTY_MULT_PCT = 80;
const FIRST_CONTRACT_MULT_PCT = 110;
const AFTER_FIRST_MULT_PCT = 85;

const isComponent = (item: Item): boolean =>
  COMPONENT_TYPES.includes(item.type);

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGHLY_ENCHANTED_MIN;

const hasLoyalty = (customer: Customer | undefined): boolean =>
  (customer?.yearsWithMHPCO ?? 0) >= LOYALTY_MIN_YEARS;

const isAfterFirstStep = (stepIndex: number): boolean => stepIndex >= 1;

const isMultiComponentStep = (step: Step): boolean =>
  step.items.length >= 2 && step.items.every(isComponent);

const baseForComponentCount = (count: number): number => {
  const blocks = Math.floor(count / COMPONENT_BLOCK_SIZE);
  const residual = count % COMPONENT_BLOCK_SIZE;
  return blocks * COMPONENT_BLOCK_PRICE + residual * COMPONENT_UNIT_PRICE;
};

const componentStepBase = (step: Step): number =>
  COMPONENT_TYPES.reduce((sum, type) => {
    const count = step.items.filter((i) => i.type === type).length;
    return sum + baseForComponentCount(count);
  }, 0);

const stepBase = (step: Step): number =>
  isMultiComponentStep(step)
    ? componentStepBase(step)
    : step.items.reduce((sum, i) => sum + BASE_BY_ITEM_TYPE[i.type], 0);

const itemSurchargeMultsPct = (item: Item): number[] => {
  const mults: number[] = [];
  if (item.cursed) mults.push(CURSED_MULT_PCT);
  if (isHighlyEnchanted(item)) mults.push(HIGHLY_ENCHANTED_MULT_PCT);
  return mults;
};

const stepMultsPct = (
  customer: Customer | undefined,
  stepIndex: number,
): number[] => {
  if (isAfterFirstStep(stepIndex)) return [AFTER_FIRST_MULT_PCT];
  const mults: number[] = [];
  if (hasLoyalty(customer)) mults.push(LOYALTY_MULT_PCT);
  mults.push(FIRST_CONTRACT_MULT_PCT);
  return mults;
};

const applyMultsAndFee = (base: number, multsPct: number[]): number => {
  const numerator = multsPct.reduce((n, m) => n * m, base);
  const denominator = Math.pow(PERCENT_SCALE, multsPct.length);
  return Math.ceil(numerator / denominator) + PROCESSING_FEE;
};

const quoteStep = (
  step: Step,
  stepIndex: number,
  customer: Customer | undefined,
): ScenarioResult => {
  const multsPct = [
    ...itemSurchargeMultsPct(step.items[0]),
    ...stepMultsPct(customer, stepIndex),
  ];
  return { premium: applyMultsAndFee(stepBase(step), multsPct) };
};

const CLAIM_DEDUCTIBLE = 100;
const DRAGON_REIMBURSEMENT_RATE_PCT = 100;
const HIGHLY_ENCHANTED_REIMBURSEMENT_RATE_PCT = 50;
const CLAIM_HIGHLY_ENCHANTED_MIN = 8;

const isHighlyEnchantedForClaim = (item: Item): boolean =>
  (item.enchantment ?? 0) >= CLAIM_HIGHLY_ENCHANTED_MIN;

const reimbursementRatePct = (item: Item | undefined): number => {
  if (!item) return 0;
  const rates: number[] = [0];
  if (item.material === "dragon") rates.push(DRAGON_REIMBURSEMENT_RATE_PCT);
  if (isHighlyEnchantedForClaim(item))
    rates.push(HIGHLY_ENCHANTED_REIMBURSEMENT_RATE_PCT);
  return Math.max(...rates);
};

const damageReimbursement = (damage: Damage, policyStep: Step): number => {
  const item = policyStep.items.find((i) => i.type === damage.itemType);
  return (damage.amount * reimbursementRatePct(item)) / PERCENT_SCALE;
};

const payoutAfterDeductible = (grossReimbursable: number): number =>
  Math.max(0, grossReimbursable - CLAIM_DEDUCTIBLE);

const claimStep = (step: Step, steps: Step[]): ScenarioResult => {
  const policyStep = steps[step.policy ?? 0];
  const grossReimbursable = (step.incident?.damages ?? []).reduce(
    (sum, damage) => sum + damageReimbursement(damage, policyStep),
    0,
  );
  return { payout: payoutAfterDeductible(grossReimbursable) };
};

export function runScenario(input: unknown): ScenarioOutput {
  const { customer, steps } = input as Input;
  const results = steps.map((step, stepIndex) =>
    step.op === "claim"
      ? claimStep(step, steps)
      : quoteStep(step, stepIndex, customer),
  );
  return { results };
}
