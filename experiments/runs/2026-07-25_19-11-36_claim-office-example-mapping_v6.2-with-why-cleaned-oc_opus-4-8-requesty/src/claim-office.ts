export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type Step = QuoteStep | ClaimStep;

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export type Result = QuoteResult | ClaimResult;

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export interface ScenarioResult {
  results: Result[];
}

const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE_PER_DAMAGE = 100;
const COMPONENT_INSURANCE_VALUE = 250;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];

const isKnownItemType = (type: string): boolean =>
  type in BASE_PREMIUM_BY_ITEM_TYPE || COMPONENT_TYPES.includes(type);

const assertKnownItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item.type));
  if (unknown) {
    throw new Error(`Unknown item type: ${unknown.type}`);
  }
};

const groupPremium = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * COMPONENT_BASE_PREMIUM;

const countByType = (types: string[]): Record<string, number> =>
  types.reduce<Record<string, number>>((counts, type) => {
    counts[type] = (counts[type] ?? 0) + 1;
    return counts;
  }, {});

export const basePremium = (items: Item[]): number => {
  const counts = countByType(items.map((item) => item.type));
  return Object.values(counts).reduce(
    (total, count) => total + groupPremium(count),
    0,
  );
};

const proportionalAmount = (
  applies: boolean,
  base: number,
  rate: number,
): number => (applies ? base * rate : 0);

// Monetary results are always rounded in MHPCO's favor: premiums (money owed to
// MHPCO) round up, payouts (money MHPCO owes out) round down.
const roundPremiumInMhpcoFavor = (amount: number): number => Math.ceil(amount);
const roundPayoutInMhpcoFavor = (amount: number): number => Math.floor(amount);

const baseFor = (item: Item): number => BASE_PREMIUM_BY_ITEM_TYPE[item.type] ?? 0;

const itemPremium = (item: Item): number => {
  const base = baseFor(item);
  const firstInsurance = base * FIRST_INSURANCE_SURCHARGE_RATE;
  const curse = proportionalAmount(item.cursed ?? false, base, CURSE_SURCHARGE_RATE);
  const highEnchantment = proportionalAmount(
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    base,
    HIGH_ENCHANTMENT_SURCHARGE_RATE,
  );
  return base + firstInsurance + curse + highEnchantment;
};

// A priced group contributes an insured `premium` (with surcharges/first
// insurance) and a `base` value that discounts are calculated against.
interface PricedLine {
  premium: number;
  base: number;
}

const isMainItem = (item: Item): boolean =>
  item.type in BASE_PREMIUM_BY_ITEM_TYPE;

const mainItemsLine = (items: Item[]): PricedLine =>
  items.reduce<PricedLine>(
    (line, item) => ({
      premium: line.premium + itemPremium(item),
      base: line.base + baseFor(item),
    }),
    { premium: 0, base: 0 },
  );

const componentsLine = (items: Item[]): PricedLine => {
  const base = basePremium(items);
  return { premium: base + base * FIRST_INSURANCE_SURCHARGE_RATE, base };
};

const quotePremium = (
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): number => {
  const main = mainItemsLine(items.filter(isMainItem));
  const components = componentsLine(items.filter((item) => !isMainItem(item)));

  const premium = main.premium + components.premium;
  const policyBase = main.base + components.base;

  const loyaltyDiscount = proportionalAmount(
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS,
    policyBase,
    LOYALTY_DISCOUNT_RATE,
  );
  const followUpDiscount = proportionalAmount(
    isFollowUpContract,
    policyBase,
    FOLLOW_UP_CONTRACT_DISCOUNT_RATE,
  );
  return roundPremiumInMhpcoFavor(
    premium - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
  );
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

const insuranceValueFor = (item: Item): number =>
  isMainItem(item)
    ? INSURANCE_VALUE_BY_ITEM_TYPE[item.type]
    : COMPONENT_INSURANCE_VALUE;

const insuranceSum = (items: Item[]): number =>
  items.reduce((total, item) => total + insuranceValueFor(item), 0);

const reimbursementFor = (damage: Damage, item: Item): number => {
  const reimbursed =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
      ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
      : damage.amount;
  return reimbursed - DEDUCTIBLE_PER_DAMAGE;
};

const insuredItemFor = (policy: Policy, damage: Damage): Item => {
  const item = policy.items.find((candidate) => candidate.type === damage.itemType);
  if (!item) {
    throw new Error(`Claim references uninsured item type: ${damage.itemType}`);
  }
  return item;
};

const assertDamagesWithinCoverage = (policy: Policy, incident: Incident): void => {
  const insuredCounts = countByType(policy.items.map((item) => item.type));
  const damageCounts = countByType(incident.damages.map((damage) => damage.itemType));
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (insuredCounts[type] ?? 0)) {
      throw new Error(`Claim has more ${type} damages than are insured`);
    }
  }
};

const assertNonNegativeAmounts = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }
};

const validateClaim = (policy: Policy, incident: Incident): void => {
  assertNonNegativeAmounts(incident);
  assertDamagesWithinCoverage(policy, incident);
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  validateClaim(policy, incident);
  const rawPayout = incident.damages.reduce((total, damage) => {
    const item = insuredItemFor(policy, damage);
    return total + reimbursementFor(damage, item);
  }, 0);
  const desiredPayout = roundPayoutInMhpcoFavor(rawPayout);
  const payout = Math.min(desiredPayout, policy.remainingCap);
  const remainingCap = policy.remainingCap - payout;
  policy.remainingCap = remainingCap;
  return { payout, remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies: Policy[] = [];
  const results: Result[] = scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      return processClaim(policies[step.policy], step.incident);
    }
    const isFollowUpContract = index > 0;
    assertKnownItemTypes(step.items);
    policies[index] = {
      items: step.items,
      remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
    };
    return {
      premium: quotePremium(step.items, scenario.customer, isFollowUpContract),
    };
  });
  return { results };
};
