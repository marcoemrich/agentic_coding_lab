type Item = { type: string; enchantment?: number; cursed?: boolean; material?: string };
type Damage = { itemType: string; amount: number };

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_PRICE = 25;
const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;

const priceOf = (item: Item): number => BASE_PREMIUMS[item.type] ?? 0;

const componentPremium = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PRICE : count * COMPONENT_PRICE;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const countByKey = <T>(
  items: T[],
  keyOf: (item: T) => string,
): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyOf(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
};

const countByType = (items: Item[]): Record<string, number> =>
  countByKey(items, (item) => item.type);

export const basePremium = (items: Item[]): number => {
  const mainItems = items.filter((item) => !isComponent(item));
  const componentCounts = countByType(items.filter(isComponent));

  const mainTotal = mainItems.reduce((sum, item) => sum + priceOf(item), 0);
  const componentTotal = Object.values(componentCounts).reduce(
    (sum, count) => sum + componentPremium(count),
    0,
  );

  return mainTotal + componentTotal;
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const LOYALTY_MIN_YEARS = 2;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_MIN = 5;
const CURSE_RATE = 0.5;
const FOLLOWUP_RATE = 0.15;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_MIN;

const itemSurcharge = (item: Item): number => {
  const surchargeOf = (applies: boolean, rate: number): number =>
    applies ? priceOf(item) * rate : 0;

  return (
    surchargeOf(item.cursed ?? false, CURSE_RATE) +
    surchargeOf(isHighlyEnchanted(item), HIGH_ENCHANTMENT_RATE)
  );
};

export const premium = (
  items: Item[],
  opts: { yearsWithMHPCO: number; isFollowUp: boolean },
): number => {
  const base = basePremium(items);
  const adjustment = (applies: boolean, rate: number): number =>
    applies ? base * rate : 0;

  const firstInsurance = adjustment(true, FIRST_INSURANCE_RATE);
  const loyalty = adjustment(
    opts.yearsWithMHPCO >= LOYALTY_MIN_YEARS,
    LOYALTY_RATE,
  );
  const followUp = adjustment(opts.isFollowUp, FOLLOWUP_RATE);
  const surcharges = items.reduce((sum, item) => sum + itemSurcharge(item), 0);
  return Math.ceil(
    base + firstInsurance - loyalty - followUp + surcharges + PROCESSING_FEE,
  );
};

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_MIN = 8;
const HIGH_ENCHANTMENT_REIMBURSE_RATE = 0.5;

const reimbursableAmount = (damage: Damage, item: Item | undefined): number =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_MIN
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSE_RATE
    : damage.amount;

const reimbursementFor = (damage: Damage, policyItems: Item[]): number => {
  const item = policyItems.find((i) => i.type === damage.itemType);
  return reimbursableAmount(damage, item) - DEDUCTIBLE;
};

export const payout = (damages: Damage[], policyItems: Item[]): number =>
  Math.floor(
    damages.reduce(
      (sum, damage) => sum + reimbursementFor(damage, policyItems),
      0,
    ),
  );

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const insuranceValueOf = (item: Item): number =>
  INSURANCE_VALUES[item.type] ?? 0;

export const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueOf(item), 0);

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

type Policy = { items: Item[]; remainingCap: number };

const CAP_MULTIPLIER = 2;
const KNOWN_TYPES = new Set(Object.keys(INSURANCE_VALUES));

// --- Validation: reject impossible quotes/claims before pricing/settling ---

const validateQuoteItems = (items: Item[]): void => {
  const unknown = items.find((item) => !KNOWN_TYPES.has(item.type));
  if (unknown) {
    throw new Error(`Unknown item type: ${unknown.type}`);
  }
};

type ClaimCheck = (policy: Policy, damages: Damage[]) => void;

const rejectDamageWhere = (
  damages: Damage[],
  isInvalid: (damage: Damage) => boolean,
  describe: (damage: Damage) => string,
): void => {
  const offender = damages.find(isInvalid);
  if (offender) {
    throw new Error(describe(offender));
  }
};

const rejectDamagesNotInPolicy: ClaimCheck = (policy, damages) =>
  rejectDamageWhere(
    damages,
    (damage) => !policy.items.some((item) => item.type === damage.itemType),
    (damage) => `Item not in policy: ${damage.itemType}`,
  );

const rejectNegativeAmounts: ClaimCheck = (_policy, damages) =>
  rejectDamageWhere(
    damages,
    (damage) => damage.amount < 0,
    (damage) => `Negative damage amount: ${damage.amount}`,
  );

const rejectOverclaimedTypes: ClaimCheck = (policy, damages) => {
  const insuredCounts = countByType(policy.items);
  const damageCounts = countByKey(damages, (damage) => damage.itemType);
  const overclaimed = Object.keys(damageCounts).find(
    (itemType) => damageCounts[itemType] > (insuredCounts[itemType] ?? 0),
  );
  if (overclaimed) {
    throw new Error(`More ${overclaimed} damages than insured`);
  }
};

const CLAIM_CHECKS: ClaimCheck[] = [
  rejectDamagesNotInPolicy,
  rejectNegativeAmounts,
  rejectOverclaimedTypes,
];

const validateClaimDamages = (policy: Policy, damages: Damage[]): void => {
  CLAIM_CHECKS.forEach((check) => check(policy, damages));
};

const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: CAP_MULTIPLIER * insuranceSum(items),
});

const settleClaim = (policy: Policy, damages: Damage[]): number => {
  const desired = payout(damages, policy.items);
  const actual = Math.min(desired, policy.remainingCap);
  policy.remainingCap -= actual;
  return actual;
};

export const runScenario = (scenario: Scenario): { results: unknown[] } => {
  const policies: Record<number, Policy> = {};
  let quoteCount = 0;
  const results: unknown[] = [];

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      validateQuoteItems(step.items);
      const opts = {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        isFollowUp: quoteCount > 0,
      };
      quoteCount += 1;
      policies[index] = openPolicy(step.items);
      results.push({ premium: premium(step.items, opts) });
    } else {
      const policy = policies[step.policy];
      validateClaimDamages(policy, step.incident.damages);
      const paidOut = settleClaim(policy, step.incident.damages);
      results.push({ payout: paidOut, remainingCap: policy.remainingCap });
    }
  });

  return { results };
};
