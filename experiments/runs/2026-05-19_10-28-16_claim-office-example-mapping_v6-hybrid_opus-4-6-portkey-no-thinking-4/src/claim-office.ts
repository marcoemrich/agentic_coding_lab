interface Item {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

interface ScenarioOutput {
  results: (QuoteResult | ClaimResult)[];
}

const PROCESSING_FEE = 5;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const DEDUCTIBLE = 100;
const VOLATILE_ENCHANTMENT_THRESHOLD = 8;
const VOLATILE_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const countBy = <T>(items: T[], keyFn: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyFn(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const calculateComponentPremium = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * (BASE_PREMIUMS[type] ?? 0);

const calculateItemPremium = (item: Item): { base: number; total: number } => {
  const base = BASE_PREMIUMS[item.type] ?? 0;
  const cursedSurcharge = item.cursed ? base * CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge =
    item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD
      ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return { base, total: base + cursedSurcharge + enchantmentSurcharge };
};

const validateItems = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const groupComponentCounts = (items: Item[]): Map<string, number> =>
  countBy(
    items.filter((item) => COMPONENT_TYPES.has(item.type)),
    (item) => item.type,
  );

const calculatePremiums = (items: Item[]): { basePremiumTotal: number; totalWithSurcharges: number } => {
  validateItems(items);

  const mainItems = items.filter((item) => !COMPONENT_TYPES.has(item.type));
  const mainPremiums = mainItems.reduce(
    (acc, item) => {
      const { base, total } = calculateItemPremium(item);
      return { base: acc.base + base, total: acc.total + total };
    },
    { base: 0, total: 0 },
  );

  const componentCounts = groupComponentCounts(items);
  const componentTotal = [...componentCounts.entries()].reduce(
    (sum, [type, count]) => sum + calculateComponentPremium(type, count),
    0,
  );

  return {
    basePremiumTotal: mainPremiums.base + componentTotal,
    totalWithSurcharges: mainPremiums.total + componentTotal,
  };
};

const calculatePolicyModifier = (
  basePremiumTotal: number,
  yearsWithMHPCO: number,
  isFollowUp: boolean,
): number => {
  const firstInsurance = basePremiumTotal * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? basePremiumTotal * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUp ? basePremiumTotal * FOLLOW_UP_DISCOUNT_RATE : 0;
  return firstInsurance - loyaltyDiscount - followUpDiscount;
};

const calculateInsuranceCap = (items: Item[]): number =>
  items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0) * 2;

const processQuote = (
  step: QuoteStep,
  yearsWithMHPCO: number,
  isFollowUp: boolean,
): QuoteResult => {
  const { basePremiumTotal, totalWithSurcharges } = calculatePremiums(step.items);
  const policyModifier = calculatePolicyModifier(basePremiumTotal, yearsWithMHPCO, isFollowUp);
  const premium = Math.ceil(totalWithSurcharges + policyModifier) + PROCESSING_FEE;
  return { premium };
};

const processClaim = (
  step: ClaimStep,
  policyItems: Item[],
  capRemaining: Map<number, number>,
): ClaimResult => {
  const damageCounts = countBy(step.incident.damages, (d) => d.itemType);
  const policyItemCounts = countBy(policyItems, (i) => i.type);
  for (const [itemType, count] of damageCounts) {
    if (count > (policyItemCounts.get(itemType) ?? 0)) {
      throw new Error(`More damages of type ${itemType} than policy covers`);
    }
  }
  const totalPayout = step.incident.damages.reduce((sum, damage) => {
    const item = policyItems.find((i) => i.type === damage.itemType);
    if (item === undefined) {
      throw new Error(`Damage references item type not in policy: ${damage.itemType}`);
    }
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
    const isVolatile = item.enchantment >= VOLATILE_ENCHANTMENT_THRESHOLD;
    const reimbursementRate = isVolatile ? VOLATILE_ENCHANTMENT_REIMBURSEMENT_RATE : 1;
    const reimbursement = damage.amount * reimbursementRate;
    return sum + Math.max(0, reimbursement - DEDUCTIBLE);
  }, 0);
  const cap = capRemaining.get(step.policy) ?? 0;
  const payout = Math.floor(Math.min(totalPayout, cap));
  const remaining = cap - payout;
  capRemaining.set(step.policy, remaining);
  return { payout, remainingCap: remaining };
};

export function processScenario(scenario: Scenario): ScenarioOutput {
  const policies: Item[][] = [];
  const capRemaining = new Map<number, number>();

  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      policies.push(step.items);
      capRemaining.set(policies.length - 1, calculateInsuranceCap(step.items));
      return processQuote(step, scenario.customer.yearsWithMHPCO, index > 0);
    } else {
      return processClaim(step, policies[step.policy], capRemaining);
    }
  });
  return { results };
}
