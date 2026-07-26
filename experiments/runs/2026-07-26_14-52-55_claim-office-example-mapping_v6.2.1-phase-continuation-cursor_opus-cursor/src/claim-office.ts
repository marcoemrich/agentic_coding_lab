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

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

const PROCESSING_FEE = 5;
const COMPONENT_BASE_PREMIUM = 25;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_CONTRACT_DISCOUNT = 0.15;

const MAIN_ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const MAIN_ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const countByKey = <T>(items: T[], key: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(key(item), (counts.get(key(item)) ?? 0) + 1);
  }
  return counts;
};

const componentsBasePremium = (items: Item[]): number => {
  const countsByType = countByKey(items, (item) => item.type);
  let total = 0;
  for (const count of countsByType.values()) {
    if (count === COMPONENT_BLOCK_SIZE) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * COMPONENT_BASE_PREMIUM;
    }
  }
  return total;
};

const itemSurcharges = (item: Item): number => {
  const base = MAIN_ITEM_BASE_PREMIUM[item.type] ?? COMPONENT_BASE_PREMIUM;
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * CURSE_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
};

const isKnownItemType = (type: string): boolean => {
  return type in MAIN_ITEM_BASE_PREMIUM || COMPONENT_TYPES.has(type);
};

const assertKnownItems = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const quotePremium = (
  step: QuoteStep,
  customer: Customer,
  isFollowUpContract: boolean
): number => {
  assertKnownItems(step.items);
  const mainItems = step.items.filter((item) => !COMPONENT_TYPES.has(item.type));
  const components = step.items.filter((item) => COMPONENT_TYPES.has(item.type));

  const mainBase = mainItems.reduce(
    (sum, item) => sum + (MAIN_ITEM_BASE_PREMIUM[item.type] ?? 0),
    0
  );
  const policyBase = mainBase + componentsBasePremium(components);

  const surcharges = step.items.reduce((sum, item) => sum + itemSurcharges(item), 0);

  let policyModifiers = policyBase * FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    policyModifiers -= policyBase * LOYALTY_DISCOUNT;
  }
  if (isFollowUpContract) {
    policyModifiers -= policyBase * FOLLOWUP_CONTRACT_DISCOUNT;
  }

  return Math.ceil(policyBase + surcharges + policyModifiers + PROCESSING_FEE);
};

const itemInsuranceValue = (item: Item): number => {
  return MAIN_ITEM_INSURANCE_VALUE[item.type] ?? COMPONENT_INSURANCE_VALUE;
};

const insuranceSum = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

const reimbursedAmount = (damage: Damage, item: Item): number => {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD) {
    return damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATE;
  }
  return damage.amount;
};

const damagePayout = (damage: Damage, item: Item): number => {
  return reimbursedAmount(damage, item) - DEDUCTIBLE;
};

const assertValidDamages = (step: ClaimStep, policy: Policy): void => {
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Invalid damage amount: ${damage.amount}`);
    }
  }
  const insuredCounts = countByKey(policy.items, (item) => item.type);
  const claimedCounts = countByKey(step.incident.damages, (damage) => damage.itemType);
  for (const [type, claimed] of claimedCounts) {
    if (claimed > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`Claim rejected: ${claimed} ${type} damages but not enough insured`);
    }
  }
};

const processClaim = (
  step: ClaimStep,
  policy: Policy
): { payout: number; remainingCap: number } => {
  assertValidDamages(step, policy);
  let rawPayout = 0;
  for (const damage of step.incident.damages) {
    const item = policy.items.find((i) => i.type === damage.itemType)!;
    rawPayout += damagePayout(damage, item);
  }
  const payout = Math.floor(Math.min(rawPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): { results: unknown[] } => {
  const policiesByStep = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      policiesByStep.set(index, {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
      });
      const isFollowUpContract = quoteCount > 0;
      quoteCount += 1;
      return { premium: quotePremium(step, scenario.customer, isFollowUpContract) };
    }
    return processClaim(step, policiesByStep.get(step.policy)!);
  });
  return { results };
};
