const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

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

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
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

export interface ScenarioOutput {
  results: StepResult[];
}

const KNOWN_ITEM_TYPES = new Set(Object.keys(BASE_PREMIUMS));

const assertKnownItem = (item: Item): void => {
  if (!KNOWN_ITEM_TYPES.has(item.type)) {
    throw new Error(`Unknown item type: '${item.type}'`);
  }
};

const itemBasePremium = (item: Item): number => BASE_PREMIUMS[item.type] ?? 0;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurchargesFor = (item: Item): number => {
  const base = itemBasePremium(item);
  const curseSurcharge = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const highEnchantmentSurcharge = isHighlyEnchanted(item)
    ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curseSurcharge + highEnchantmentSurcharge;
};

const countBy = <T>(values: T[], key: (value: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const k = key(value);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
};

const countItemsByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const countDamagesByType = (damages: Damage[]): Map<string, number> =>
  countBy(damages, (damage) => damage.itemType);

const basePremiumForType = (type: string, count: number): number => {
  if (COMPONENT_TYPES.has(type) && count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * itemBasePremium({ type });
};

const basePremiumFor = (items: Item[]): number => {
  let total = 0;
  for (const [type, count] of countItemsByType(items)) {
    total += basePremiumForType(type, count);
  }
  return total;
};

interface Customer {
  yearsWithMHPCO: number;
}

const loyaltyDiscountFor = (base: number, customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? base * LOYALTY_DISCOUNT_RATE : 0;

const itemSurchargeTotalFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurchargesFor(item), 0);

const followUpDiscountFor = (base: number, priorContractCount: number): number =>
  priorContractCount >= 1 ? base * FOLLOW_UP_DISCOUNT_RATE : 0;

const premiumFor = (
  items: Item[],
  customer: Customer,
  priorContractCount: number,
): number => {
  const base = basePremiumFor(items);
  const itemSurcharges = itemSurchargeTotalFor(items);
  const firstInsuranceSurcharge = base * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = loyaltyDiscountFor(base, customer);
  const followUpDiscount = followUpDiscountFor(base, priorContractCount);
  return Math.ceil(
    base +
      itemSurcharges +
      firstInsuranceSurcharge -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE,
  );
};

const insuranceSumFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);

interface Policy {
  items: Item[];
  remainingCap: number;
}

const reimbursementFor = (item: Item | undefined, amount: number): number => {
  if (item && (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return amount * HIGH_ENCHANTMENT_CLAIM_RATE;
  }
  return amount;
};

const payoutForDamage = (damage: Damage, item: Item | undefined): number =>
  Math.max(0, reimbursementFor(item, damage.amount) - DEDUCTIBLE);

const insuredItemFor = (policy: Policy, damage: Damage): Item | undefined =>
  policy.items.find((item) => item.type === damage.itemType);

const rejectNegativeAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Claim rejected: negative damage amount ${damage.amount}`);
    }
  }
};

const rejectOveraggregatedClaims = (policy: Policy, damages: Damage[]): void => {
  const insuredCounts = countItemsByType(policy.items);
  for (const [type, claimed] of countDamagesByType(damages)) {
    const insured = insuredCounts.get(type) ?? 0;
    if (claimed > insured) {
      throw new Error(
        `Claim rejected: ${claimed} damage entries for '${type}' but only ${insured} insured`,
      );
    }
  }
};

const validateDamages = (policy: Policy, damages: Damage[]): void => {
  rejectNegativeAmounts(damages);
  rejectOveraggregatedClaims(policy, damages);
};

const settleClaim = (
  policy: Policy,
  incident: Incident,
): { result: ClaimResult; policy: Policy } => {
  validateDamages(policy, incident.damages);
  const rawPayout = incident.damages.reduce(
    (sum, damage) => sum + payoutForDamage(damage, insuredItemFor(policy, damage)),
    0,
  );
  const payout = Math.min(rawPayout, policy.remainingCap);
  const remainingCap = policy.remainingCap - payout;
  return {
    result: { payout: Math.floor(payout), remainingCap },
    policy: { ...policy, remainingCap },
  };
};

const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: insuranceSumFor(items) * CAP_MULTIPLIER,
});

export const runScenario = (scenario: Scenario): ScenarioOutput => {
  const policies: Policy[] = [];
  const results: StepResult[] = [];
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      for (const item of step.items) assertKnownItem(item);
      const premium = premiumFor(step.items, scenario.customer, policies.length);
      policies.push(openPolicy(step.items));
      results.push({ premium });
    } else {
      const { result, policy } = settleClaim(policies[step.policy], step.incident);
      policies[step.policy] = policy;
      results.push(result);
    }
  }
  return { results };
};
