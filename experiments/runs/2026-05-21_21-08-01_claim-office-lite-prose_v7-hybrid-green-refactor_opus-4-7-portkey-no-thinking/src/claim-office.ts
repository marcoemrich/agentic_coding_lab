type Item = { type: string; material: string; enchantment: number; cursed: boolean };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type QuoteResult = { premium: number };
type ClaimResult = { payout: number };
type StepResult = QuoteResult | ClaimResult;
type Customer = { yearsWithMHPCO: number };
type ScenarioInput = { customer: Customer; steps: Step[] };
type ScenarioOutput = { results: StepResult[] };

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BUNDLE_PREMIUM = 60;
const COMPONENT_BUNDLE_SIZE = 3;
const COMPONENT_TYPES = ["rune", "moonstone"];
const SAVINGS_PER_BUNDLE =
  COMPONENT_BUNDLE_SIZE * COMPONENT_BASE_PREMIUM - COMPONENT_BUNDLE_PREMIUM;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
};

const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSED_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_THRESHOLD_YEARS = 2;
const REPEAT_CONTRACT_DISCOUNT_PERCENT = 15;
const PROCESSING_FEE = 5;

const addSurchargePercent = (amount: number, percent: number): number =>
  (amount * (100 + percent)) / 100;

const applyDiscountPercent = (amount: number, percent: number): number =>
  (amount * (100 - percent)) / 100;

const addSurchargeIf = (amount: number, condition: boolean, percent: number): number =>
  condition ? addSurchargePercent(amount, percent) : amount;

const applyDiscountIf = (amount: number, condition: boolean, percent: number): number =>
  condition ? applyDiscountPercent(amount, percent) : amount;

const itemPremium = (item: Item): number => {
  const base = BASE_PREMIUMS[item.type];
  const withCursed = addSurchargeIf(base, item.cursed, CURSED_SURCHARGE_PERCENT);
  return addSurchargeIf(
    withCursed,
    item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD,
    HIGH_ENCHANTMENT_SURCHARGE_PERCENT,
  );
};

const sumItemPremiums = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemPremium(item), 0);

const countItemsOfType = (items: Item[], type: string): number =>
  items.filter((item) => item.type === type).length;

const bundlesOfType = (items: Item[], type: string): number =>
  Math.floor(countItemsOfType(items, type) / COMPONENT_BUNDLE_SIZE);

const componentBundleDiscount = (items: Item[]): number =>
  COMPONENT_TYPES.reduce(
    (savings, type) => savings + bundlesOfType(items, type) * SAVINGS_PER_BUNDLE,
    0,
  );

const applyContractAdjustment = (amount: number, isFirstQuote: boolean): number =>
  isFirstQuote
    ? addSurchargePercent(amount, FIRST_INSURANCE_SURCHARGE_PERCENT)
    : applyDiscountPercent(amount, REPEAT_CONTRACT_DISCOUNT_PERCENT);

const applyLoyaltyDiscount = (amount: number, yearsWithMHPCO: number): number =>
  applyDiscountIf(amount, yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS, LOYALTY_DISCOUNT_PERCENT);

const itemsSubtotal = (items: Item[]): number =>
  sumItemPremiums(items) - componentBundleDiscount(items);

const quotePremium = (items: Item[], yearsWithMHPCO: number, isFirstQuote: boolean): number => {
  const afterContract = applyContractAdjustment(itemsSubtotal(items), isFirstQuote);
  const afterLoyalty = applyLoyaltyDiscount(afterContract, yearsWithMHPCO);
  return Math.ceil(afterLoyalty + PROCESSING_FEE);
};

const CLAIM_DEDUCTIBLE = 100;
const DRAGON_MATERIAL = "dragon";
const REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const PARTIAL_REIMBURSEMENT_PERCENT = 50;

const reimbursementPercent = (item: Item | undefined): number => {
  if (!item) return 0;
  if (item.material === DRAGON_MATERIAL) return 100;
  if (item.enchantment >= REIMBURSEMENT_ENCHANTMENT_THRESHOLD) return PARTIAL_REIMBURSEMENT_PERCENT;
  return 0;
};

const damageReimbursement = (damage: Damage, policyItems: Item[]): number => {
  const item = policyItems.find((i) => i.type === damage.itemType);
  return (damage.amount * reimbursementPercent(item)) / 100;
};

const policyItemsFor = (steps: Step[], policyIndex: number): Item[] => {
  const policyStep = steps[policyIndex];
  return policyStep?.op === "quote" ? policyStep.items : [];
};

const claimPayout = (claim: ClaimStep, policyItems: Item[]): number => {
  const grossReimbursement = claim.incident.damages.reduce(
    (sum, damage) => sum + damageReimbursement(damage, policyItems),
    0,
  );
  return Math.max(0, grossReimbursement - CLAIM_DEDUCTIBLE);
};

const runStep = (step: Step, customer: Customer, steps: Step[], stepIndex: number): StepResult =>
  step.op === "claim"
    ? { payout: claimPayout(step, policyItemsFor(steps, step.policy)) }
    : { premium: quotePremium(step.items, customer.yearsWithMHPCO, stepIndex === 0) };

export const runScenario = (input: ScenarioInput): ScenarioOutput => ({
  results: input.steps.map((step, index) => runStep(step, input.customer, input.steps, index)),
});
