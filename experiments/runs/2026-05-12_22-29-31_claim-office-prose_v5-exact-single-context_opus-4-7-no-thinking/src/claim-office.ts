export type Item = {
  type: string;
  kind?: "component";
  material: string;
  enchantment: number;
  cursed: boolean;
};

export type Damage = { itemType: string; amount: number };
export type Incident = { cause: string; damages: Damage[] };
export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: Incident };

export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export type ScenarioResult = {
  results: StepResult[];
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_RATE = 0.5;

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PCT = 10;
const CURSED_SURCHARGE_PCT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PCT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_PCT = 20;
const LOYALTY_THRESHOLD_YEARS = 2;
const SUBSEQUENT_CONTRACT_DISCOUNT_PCT = 15;

const itemSurchargePct = (item: Item): number => {
  let pct = 0;
  if (item.cursed) pct += CURSED_SURCHARGE_PCT;
  if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD)
    pct += HIGH_ENCHANTMENT_SURCHARGE_PCT;
  return pct;
};

const sumBasePremiums = (items: Item[]): number => {
  // Group components by type and apply 3-of-a-kind block pricing.
  const componentCounts: Record<string, number> = {};
  let total = 0;
  for (const item of items) {
    if (item.kind === "component") {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      total += applyPercent(BASE_PREMIUMS[item.type], itemSurchargePct(item));
    }
  }
  for (const count of Object.values(componentCounts)) {
    const blocks = Math.floor(count / 3);
    const leftover = count % 3;
    total += blocks * COMPONENT_BLOCK_PREMIUM + leftover * COMPONENT_BASE_PREMIUM;
  }
  return total;
};

// Round up in MHPCO's favor: applies percent surcharge/discount via integer math.
const applyPercent = (amount: number, percent: number): number =>
  Math.ceil((amount * (100 + percent)) / 100);

const quotePremium = (
  items: Item[],
  customer: { yearsWithMHPCO: number },
  isFirstContract: boolean,
): number => {
  let amount = sumBasePremiums(items);
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    amount = applyPercent(amount, -LOYALTY_DISCOUNT_PCT);
  }
  if (isFirstContract) {
    amount = applyPercent(amount, FIRST_INSURANCE_SURCHARGE_PCT);
  } else {
    amount = applyPercent(amount, -SUBSEQUENT_CONTRACT_DISCOUNT_PCT);
  }
  return amount + PROCESSING_FEE;
};

type Policy = {
  items: Item[];
  remainingCap: number;
};

const insuranceSumFor = (items: Item[]): number =>
  items.reduce(
    (sum, item) =>
      sum +
      (item.kind === "component"
        ? COMPONENT_INSURANCE_VALUE
        : INSURANCE_VALUES[item.type]),
    0,
  );

const DRAGON_MATERIAL = "dragon";

const reimbursementRate = (item: Item | undefined): number => {
  if (!item) return 1;
  if (item.material === DRAGON_MATERIAL) return 1;
  if (item.enchantment >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD) {
    return CLAIM_HIGH_ENCHANTMENT_RATE;
  }
  return 1;
};

const processClaim = (
  policy: Policy,
  incident: Incident,
): { payout: number; remainingCap: number } => {
  const reimbursable = incident.damages.reduce((sum, d) => {
    const item = policy.items.find((i) => i.type === d.itemType);
    return sum + d.amount * reimbursementRate(item);
  }, 0);
  const afterDeductible = Math.max(0, reimbursable - DEDUCTIBLE);
  const payout = Math.min(afterDeductible, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  let quoteCount = 0;
  const policies: Policy[] = [];
  const results: StepResult[] = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const isFirst = quoteCount === 0;
      quoteCount++;
      policies.push({
        items: step.items,
        remainingCap: insuranceSumFor(step.items) * CAP_MULTIPLIER,
      });
      return {
        premium: quotePremium(step.items, scenario.customer, isFirst),
      };
    }
    return processClaim(policies[step.policy], step.incident);
  });
  return { results };
};
