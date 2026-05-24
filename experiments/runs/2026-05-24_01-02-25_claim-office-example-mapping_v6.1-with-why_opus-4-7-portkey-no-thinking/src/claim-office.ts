type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = {
  customer: Customer;
  steps: Step[];
};
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

export const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const componentsBase = (components: Item[]): number => {
  let total = 0;
  for (const [type, count] of countByType(components)) {
    total += count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * BASE_PREMIUMS[type];
  }
  return total;
};

const mainItemsBase = (items: Item[]): number =>
  items.reduce((sum, item) => sum + BASE_PREMIUMS[item.type], 0);

const itemSurcharges = (item: Item): number => {
  const base = BASE_PREMIUMS[item.type];
  const curse = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const highEnchant = (item.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD ? base * HIGH_ENCHANT_SURCHARGE_RATE : 0;
  return curse + highEnchant;
};

const loyaltyDiscount = (policyBase: number, customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS ? policyBase * LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscount = (policyBase: number, isFollowUp: boolean): number =>
  isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;

const quotePremium = (step: QuoteStep, customer: Customer, isFollowUp: boolean): QuoteResult => {
  const mainItems = step.items.filter((i) => !COMPONENT_TYPES.has(i.type));
  const components = step.items.filter((i) => COMPONENT_TYPES.has(i.type));

  const policyBase = mainItemsBase(mainItems) + componentsBase(components);
  const firstInsurance = policyBase * FIRST_INSURANCE_SURCHARGE_RATE;
  const surcharges = mainItems.reduce((sum, item) => sum + itemSurcharges(item), 0);
  const loyalty = loyaltyDiscount(policyBase, customer);
  const followUp = followUpDiscount(policyBase, isFollowUp);

  return { premium: Math.ceil(policyBase + firstInsurance + surcharges - loyalty - followUp + PROCESSING_FEE) };
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

const HIGH_ENCHANT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANT_PAYOUT_RATE = 0.5;

const reimbursementRate = (item: Item | undefined): number =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANT_PAYOUT_THRESHOLD ? HIGH_ENCHANT_PAYOUT_RATE : 1;

const damagePayout = (damage: Damage, policyItems: Item[]): number => {
  const item = policyItems.find((i) => i.type === damage.itemType);
  return Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);
};

const claimResult = (step: ClaimStep, policyItems: Item[], availableCap: number): ClaimResult => {
  const rawPayout = step.incident.damages.reduce(
    (sum, d) => sum + damagePayout(d, policyItems),
    0,
  );
  const cappedPayout = Math.min(rawPayout, availableCap);
  const payout = Math.floor(cappedPayout);
  return { payout, remainingCap: availableCap - payout };
};

const policyItemsFor = (step: ClaimStep, steps: Step[]): Item[] => {
  const policyStep = steps[step.policy];
  if (policyStep.op !== "quote") {
    throw new Error(`step ${step.policy} is not a quote`);
  }
  return policyStep.items;
};

const initialCap = (policyItems: Item[]): number =>
  insuranceSum(policyItems) * CAP_MULTIPLIER;

const processClaim = (
  step: ClaimStep,
  scenario: Scenario,
  remainingCapByPolicy: Map<number, number>,
): ClaimResult => {
  const policyItems = policyItemsFor(step, scenario.steps);
  const availableCap = remainingCapByPolicy.get(step.policy) ?? initialCap(policyItems);
  const result = claimResult(step, policyItems, availableCap);
  remainingCapByPolicy.set(step.policy, result.remainingCap);
  return result;
};

export const run = (scenario: Scenario): { results: StepResult[] } => {
  const remainingCapByPolicy = new Map<number, number>();
  let isFollowUp = false;
  return {
    results: scenario.steps.map((step) => {
      if (step.op === "quote") {
        const result = quotePremium(step, scenario.customer, isFollowUp);
        isFollowUp = true;
        return result;
      }
      return processClaim(step, scenario, remainingCapByPolicy);
    }),
  };
};
