type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const PAYOUT_CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BUILDING_BLOCK_PREMIUM = 60;

const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const itemRiskMultiplier = (item: Item): number => {
  let multiplier = 1;
  if (item.cursed) multiplier += CURSED_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) multiplier += HIGH_ENCHANTMENT_SURCHARGE;
  return multiplier;
};

const premiumContributionsForItems = (items: Item[]): number => {
  const componentBuckets: Record<string, Item[]> = {};
  let total = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      (componentBuckets[item.type] ??= []).push(item);
    } else {
      total += BASE_PREMIUM[item.type] * itemRiskMultiplier(item);
    }
  }
  for (const type of Object.keys(componentBuckets)) {
    const bucket = componentBuckets[type];
    const blocks = Math.floor(bucket.length / 3);
    const leftovers = bucket.length % 3;
    const bucketBase = blocks * BUILDING_BLOCK_PREMIUM + leftovers * BASE_PREMIUM[type];
    const avgRisk = bucket.reduce((acc, i) => acc + itemRiskMultiplier(i), 0) / bucket.length;
    total += bucketBase * avgRisk;
  }
  return total;
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const REPEAT_CONTRACT_DISCOUNT = 0.15;

const roundUpInMHPCOFavor = (value: number): number =>
  Math.ceil(Math.round(value * 100) / 100);

type Policy = { items: Item[]; insuranceSum: number; remainingCap: number };

const insuranceSumForItems = (items: Item[]): number =>
  items.reduce((sum, item) => sum + (INSURANCE_VALUE[item.type] ?? 0), 0);

export const processScenario = (scenario: Scenario): { results: StepResult[] } => {
  const loyaltyFactor =
    scenario.customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? 1 - LOYALTY_DISCOUNT : 1;
  const policies: Record<number, Policy> = {};
  let quoteCount = 0;
  const results: StepResult[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const base = premiumContributionsForItems(step.items);
      const contractFactor =
        quoteCount === 0 ? 1 + FIRST_INSURANCE_SURCHARGE : 1 - REPEAT_CONTRACT_DISCOUNT;
      quoteCount += 1;
      const premium = roundUpInMHPCOFavor(base * contractFactor * loyaltyFactor) + PROCESSING_FEE;
      const insuranceSum = insuranceSumForItems(step.items);
      policies[index] = {
        items: step.items,
        insuranceSum,
        remainingCap: insuranceSum * PAYOUT_CAP_MULTIPLIER,
      };
      return { premium };
    }
    const policy = policies[step.policy];
    const reimbursableDamage = step.incident.damages.reduce((sum, d) => {
      const item = policy.items.find((i) => i.type === d.itemType);
      const isDragon = item?.material === "dragon";
      const isHighlyEnchanted = (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;
      const factor = isDragon ? 1 : isHighlyEnchanted ? 0.5 : 1;
      return sum + d.amount * factor;
    }, 0);
    const uncappedPayout = Math.max(0, Math.floor(reimbursableDamage) - DEDUCTIBLE);
    const payout = Math.min(uncappedPayout, policy.remainingCap);
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
};
