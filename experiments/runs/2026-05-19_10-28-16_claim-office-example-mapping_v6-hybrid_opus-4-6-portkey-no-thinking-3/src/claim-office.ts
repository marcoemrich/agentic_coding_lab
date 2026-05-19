interface Item {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
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
  incident: {
    cause: string;
    damages: Damage[];
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

interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

interface ScenarioOutput {
  results: (QuoteResult | ClaimResult)[];
}

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_RATE = 0.5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const isComponent = (item: Item): boolean =>
  COMPONENT_TYPES.includes(item.type);

const calculateItemPremium = (item: Item): number => {
  const base = BASE_PREMIUMS[item.type] ?? 0;
  let premium = base;
  if (item.cursed) {
    premium += base * CURSE_SURCHARGE_RATE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    premium += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return premium;
};

const calculateComponentPremium = (
  componentCounts: Record<string, number>,
): number => {
  let total = 0;
  for (const [type, count] of Object.entries(componentCounts)) {
    total +=
      count === BLOCK_SIZE
        ? BLOCK_PREMIUM
        : count * (BASE_PREMIUMS[type] ?? 0);
  }
  return total;
};

const countByType = (items: { type: string }[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return counts;
};

const roundUpPremium = (value: number): number =>
  Math.ceil(parseFloat(value.toFixed(10)));

const roundDownPayout = (value: number): number =>
  Math.floor(parseFloat(value.toFixed(10)));

const processQuote = (
  step: QuoteStep,
  customer: { yearsWithMHPCO: number },
  quoteCount: number,
): { result: QuoteResult; policy: Omit<Policy, "remainingCap"> } => {
  const componentCounts: Record<string, number> = {};
  let itemTotal = 0;
  let policyBase = 0;
  let insuranceSum = 0;

  for (const item of step.items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    insuranceSum += INSURANCE_VALUES[item.type] ?? 0;
    if (isComponent(item)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      itemTotal += calculateItemPremium(item);
      policyBase += BASE_PREMIUMS[item.type] ?? 0;
    }
  }

  const componentPremium = calculateComponentPremium(componentCounts);
  itemTotal += componentPremium;
  policyBase += componentPremium;

  let totalBeforeFee = itemTotal;

  // Policy-wide modifiers (all percentages of policyBase)
  totalBeforeFee += policyBase * FIRST_INSURANCE_SURCHARGE_RATE;

  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    totalBeforeFee -= policyBase * LOYALTY_DISCOUNT_RATE;
  }

  if (quoteCount > 1) {
    totalBeforeFee -= policyBase * FOLLOW_UP_DISCOUNT_RATE;
  }

  const finalPremium = totalBeforeFee + PROCESSING_FEE;

  return {
    result: { premium: roundUpPremium(finalPremium) },
    policy: { items: step.items, insuranceSum },
  };
};

const validateDamages = (damages: Damage[], policyItems: Item[]): void => {
  const damageCounts = countByType(damages.map((d) => ({ type: d.itemType })));
  const insuredCounts = countByType(policyItems);

  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (insuredCounts[type] ?? 0)) {
      throw new Error(`More damages of type "${type}" than items insured`);
    }
  }
};

const processClaim = (step: ClaimStep, policy: Policy): ClaimResult => {
  validateDamages(step.incident.damages, policy.items);

  let totalPayout = 0;
  for (const damage of step.incident.damages) {
    const item = policy.items.find((i) => i.type === damage.itemType);
    if (!item) {
      throw new Error(`Damage for item type "${damage.itemType}" not in policy`);
    }
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    let reimbursement = damage.amount;

    if ((item.enchantment ?? 0) >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD) {
      reimbursement = reimbursement * CLAIM_HIGH_ENCHANTMENT_RATE;
    }

    const payout = Math.max(0, reimbursement - DEDUCTIBLE);
    totalPayout += payout;
  }

  totalPayout = Math.min(totalPayout, policy.remainingCap);
  totalPayout = roundDownPayout(totalPayout);
  policy.remainingCap -= totalPayout;

  return { payout: totalPayout, remainingCap: policy.remainingCap };
};

export const processScenario = (scenario: Scenario): ScenarioOutput => {
  let quoteCount = 0;
  const policies: Map<number, Policy> = new Map();

  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      quoteCount++;
      const { result, policy } = processQuote(step, scenario.customer, quoteCount);
      policies.set(stepIndex, {
        ...policy,
        remainingCap: policy.insuranceSum * 2,
      });
      return result;
    } else {
      const policy = policies.get(step.policy)!;
      return processClaim(step, policy);
    }
  });

  return { results };
};
