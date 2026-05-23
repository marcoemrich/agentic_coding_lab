// --- Domain constants -------------------------------------------------------

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

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const PROCESSING_FEE = 5;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE = 60;

const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_PAYOUT_MULTIPLIER = 0.5;

// --- Shape interfaces (lightweight, no runtime validation) -----------------

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause?: string; damages: Damage[] };
}

type Step = QuoteStep | ClaimStep;

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

interface Policy {
  capRemaining: number;
  items: Item[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

type StepResult = QuoteResult | ClaimResult;

// --- Small helpers ---------------------------------------------------------

const countByType = <T extends { type?: string; itemType?: string }>(
  entries: T[],
  key: "type" | "itemType",
): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const k = entry[key] as string;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
};

const baseForType = (type: string, count: number): number => {
  if (COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_BASE;
  }
  return count * BASE_PREMIUMS[type];
};

// --- Quote handling --------------------------------------------------------

const sumItemBases = (items: Item[]): number => {
  const countsByType = countByType(items, "type");
  let total = 0;
  for (const [type, count] of countsByType) {
    total += baseForType(type, count);
  }
  return total;
};

const sumItemSurcharges = (items: Item[]): number => {
  let surcharges = 0;
  for (const item of items) {
    const itemBase = BASE_PREMIUMS[item.type];
    if (item.cursed) {
      surcharges += itemBase * CURSED_SURCHARGE_RATE;
    }
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      surcharges += itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
  }
  return surcharges;
};

const sumInsuranceValues = (items: Item[]): number => {
  let total = 0;
  for (const item of items) {
    total += INSURANCE_VALUES[item.type];
  }
  return total;
};

const assertKnownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
};

const handleQuoteStep = (
  step: QuoteStep,
  customer: Customer,
  isFollowUp: boolean,
): { result: QuoteResult; policy: Policy } => {
  const items = step.items;
  assertKnownItemTypes(items);

  const itemBasesSum = sumItemBases(items);
  const itemSurcharges = sumItemSurcharges(items);
  const insuranceSum = sumInsuranceValues(items);

  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? itemBasesSum * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = isFollowUp
    ? itemBasesSum * FOLLOW_UP_DISCOUNT_RATE
    : 0;
  const firstInsuranceSurcharge = itemBasesSum * FIRST_INSURANCE_SURCHARGE_RATE;

  const itemsTotal =
    itemBasesSum + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount + itemSurcharges;
  const premium = Math.ceil(itemsTotal + PROCESSING_FEE);

  return {
    result: { premium },
    policy: { capRemaining: insuranceSum * CAP_MULTIPLIER, items },
  };
};

// --- Claim handling --------------------------------------------------------

const assertNonNegativeDamages = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must be non-negative`);
    }
  }
};

const assertDamagesCoveredByPolicy = (damages: Damage[], items: Item[]): void => {
  const insuredCountsByType = countByType(items, "type");
  const damageCountsByType = countByType(damages, "itemType");
  for (const [type, count] of damageCountsByType) {
    if (count > (insuredCountsByType.get(type) ?? 0)) {
      throw new Error(`damage count for ${type} exceeds insured items`);
    }
  }
};

const payoutForDamage = (damage: Damage, insuredItem: Item | undefined): number => {
  let basis = damage.amount;
  if (insuredItem && (insuredItem.enchantment ?? 0) >= 8) {
    basis = basis * HIGH_ENCHANTMENT_PAYOUT_MULTIPLIER;
  }
  return Math.max(0, basis - DEDUCTIBLE);
};

const handleClaimStep = (step: ClaimStep, policy: Policy): ClaimResult => {
  const damages = step.incident.damages;
  assertNonNegativeDamages(damages);
  assertDamagesCoveredByPolicy(damages, policy.items);

  let payout = 0;
  for (const damage of damages) {
    const insuredItem = policy.items.find((i) => i.type === damage.itemType);
    payout += payoutForDamage(damage, insuredItem);
  }
  payout = Math.min(payout, policy.capRemaining);
  policy.capRemaining -= payout;
  return { payout, remainingCap: policy.capRemaining };
};

// --- Scenario orchestration ------------------------------------------------

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const results: StepResult[] = [];
  const policiesByStepIndex = new Map<number, Policy>();
  let quoteStepsSeen = 0;

  for (let stepIndex = 0; stepIndex < scenario.steps.length; stepIndex++) {
    const step = scenario.steps[stepIndex];
    if (step.op === "claim") {
      const policy = policiesByStepIndex.get(step.policy)!;
      results.push(handleClaimStep(step, policy));
      continue;
    }
    const { result, policy } = handleQuoteStep(step, scenario.customer, quoteStepsSeen > 0);
    results.push(result);
    policiesByStepIndex.set(stepIndex, policy);
    quoteStepsSeen++;
  }
  return { results };
};
