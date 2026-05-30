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

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
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
const CAP_MULTIPLIER = 2;
const HIGH_DAMAGE_ENCH_THRESHOLD = 8;
const HIGH_DAMAGE_REIMBURSE_RATE = 0.5;

const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCH_RATE = 0.3;
const HIGH_ENCH_THRESHOLD = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD = 2;
const FOLLOWUP_RATE = 0.15;
const PROCESSING_FEE = 5;

const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const KNOWN_ITEM_TYPES = new Set([...Object.keys(BASE_PREMIUM), ...COMPONENT_TYPES]);

const validateQuoteItems = (items: Item[]): void => {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const componentBasePremium = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const isMainItem = (item: Item): boolean => !isComponent(item);

const countValues = (values: string[]): Map<string, number> =>
  values.reduce(
    (counts, value) => counts.set(value, (counts.get(value) ?? 0) + 1),
    new Map<string, number>(),
  );

const countByType = (items: Item[]): Map<string, number> =>
  countValues(items.map((item) => item.type));

const componentTotal = (items: Item[]): number =>
  [...countByType(items.filter(isComponent)).values()].reduce(
    (sum, count) => sum + componentBasePremium(count),
    0,
  );

const mainItemBase = (item: Item): number => BASE_PREMIUM[item.type];

const basePremium = (items: Item[]): number => {
  const mainTotal = items
    .filter(isMainItem)
    .reduce((sum, item) => sum + mainItemBase(item), 0);
  return mainTotal + componentTotal(items);
};

const surchargeFor = (
  items: Item[],
  qualifies: (item: Item) => boolean,
  rate: number,
): number =>
  items
    .filter((item) => isMainItem(item) && qualifies(item))
    .reduce((sum, item) => sum + mainItemBase(item) * rate, 0);

const isCursed = (item: Item): boolean => item.cursed === true;

const curseSurcharge = (items: Item[]): number =>
  surchargeFor(items, isCursed, CURSE_RATE);

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCH_THRESHOLD;

const highEnchantmentSurcharge = (items: Item[]): number =>
  surchargeFor(items, isHighlyEnchanted, HIGH_ENCH_RATE);

const discountWhen = (policyBase: number, qualifies: boolean, rate: number): number =>
  qualifies ? policyBase * rate : 0;

const isLoyal = (years: number): boolean => years >= LOYALTY_THRESHOLD;

const quotePremium = (items: Item[], years: number, isFollowUp: boolean): number => {
  const policyBase = basePremium(items);
  const firstInsurance = policyBase * FIRST_INSURANCE_RATE;
  const itemSurcharges = curseSurcharge(items) + highEnchantmentSurcharge(items);
  const loyalty = discountWhen(policyBase, isLoyal(years), LOYALTY_RATE);
  const followUp = discountWhen(policyBase, isFollowUp, FOLLOWUP_RATE);
  return Math.ceil(
    policyBase + itemSurcharges + firstInsurance - loyalty - followUp + PROCESSING_FEE,
  );
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);

const reimbursableAmount = (amount: number, item: Item | undefined): number => {
  if ((item?.enchantment ?? 0) >= HIGH_DAMAGE_ENCH_THRESHOLD) {
    return amount * HIGH_DAMAGE_REIMBURSE_RATE;
  }
  return amount;
};

const damagePayout = (damage: Damage, item: Item | undefined): number =>
  Math.max(reimbursableAmount(damage.amount, item) - DEDUCTIBLE, 0);

const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: insuranceSum(items) * CAP_MULTIPLIER,
});

const insuredItem = (policy: Policy, itemType: string): Item | undefined =>
  policy.items.find((item) => item.type === itemType);

const desiredPayout = (policy: Policy, damages: Damage[]): number =>
  Math.floor(
    damages.reduce(
      (sum, damage) => sum + damagePayout(damage, insuredItem(policy, damage.itemType)),
      0,
    ),
  );

const validateDamageCounts = (policy: Policy, damages: Damage[]): void => {
  const insuredCounts = countByType(policy.items);
  const damageCounts = countValues(damages.map((damage) => damage.itemType));
  for (const [type, count] of damageCounts) {
    if (count > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`Claim references more ${type} than insured`);
    }
  }
};

const validateDamageAmounts = (damages: Damage[]): void => {
  if (damages.some((damage) => damage.amount < 0)) {
    throw new Error("Negative damage amount");
  }
};

const validateClaim = (policy: Policy, damages: Damage[]): void => {
  validateDamageAmounts(damages);
  validateDamageCounts(policy, damages);
};

const processClaim = (policy: Policy, claim: ClaimStep): ClaimResult => {
  const { damages } = claim.incident;
  validateClaim(policy, damages);
  const payout = Math.min(desiredPayout(policy, damages), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const years = scenario.customer.yearsWithMHPCO;
  const policies: Policy[] = [];
  let quoteCount = 0;
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "quote") {
      validateQuoteItems(step.items);
      const isFollowUp = quoteCount > 0;
      quoteCount += 1;
      policies[index] = openPolicy(step.items);
      return { premium: quotePremium(step.items, years, isFollowUp) };
    }
    return processClaim(policies[step.policy], step);
  });
  return { results };
};
