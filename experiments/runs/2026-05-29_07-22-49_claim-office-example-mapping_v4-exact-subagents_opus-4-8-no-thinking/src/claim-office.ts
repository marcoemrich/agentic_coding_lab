export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
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
  customer: Customer;
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

export interface ScenarioResult {
  results: StepResult[];
}

const basePremiums: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const PROCESSING_FEE = 5;

const BLOCK_SIZE = 3;

const BLOCK_OF_THREE_BASE = 60;

const componentTypes = new Set(["rune", "moonstone"]);

const tallyBy = <T>(
  items: T[],
  keyOf: (item: T) => string
): Record<string, number> =>
  items.reduce<Record<string, number>>((counts, item) => {
    const key = keyOf(item);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});

const countByType = (items: QuoteItem[]): Record<string, number> =>
  tallyBy(items, (item) => item.type);

const basePremiumFor = (type: string): number => {
  if (!(type in basePremiums)) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return basePremiums[type];
};

const basePremiumForGroup = (type: string, count: number): number => {
  if (componentTypes.has(type) && count === BLOCK_SIZE) {
    return BLOCK_OF_THREE_BASE;
  }
  return basePremiumFor(type) * count;
};

const CURSE_SURCHARGE_RATE = 0.5;

const FIRST_INSURANCE_RATE = 0.1;

const HIGH_ENCHANTMENT_THRESHOLD = 5;

const HIGH_ENCHANTMENT_RATE = 0.3;

const itemBasePremium = (item: QuoteItem): number =>
  basePremiumFor(item.type);

const isCursed = (item: QuoteItem): boolean => item.cursed === true;

const curseSurcharge = (item: QuoteItem): number =>
  isCursed(item) ? itemBasePremium(item) * CURSE_SURCHARGE_RATE : 0;

const enchantmentLevel = (item: QuoteItem): number => item.enchantment ?? 0;

const highEnchantmentSurcharge = (item: QuoteItem): number =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD
    ? itemBasePremium(item) * HIGH_ENCHANTMENT_RATE
    : 0;

const firstInsuranceSurcharge = (item: QuoteItem): number =>
  itemBasePremium(item) * FIRST_INSURANCE_RATE;

const itemSurcharges = (item: QuoteItem): number =>
  curseSurcharge(item) +
  highEnchantmentSurcharge(item) +
  firstInsuranceSurcharge(item);

const sumOfBasePremiums = (items: QuoteItem[]): number => {
  const counts = countByType(items);
  return Object.entries(counts).reduce(
    (sum, [type, count]) => sum + basePremiumForGroup(type, count),
    0
  );
};

const sumOfItemSurcharges = (items: QuoteItem[]): number =>
  items.reduce((sum, item) => sum + itemSurcharges(item), 0);

const LOYALTY_YEARS_THRESHOLD = 2;

const LOYALTY_DISCOUNT_RATE = 0.2;

const loyaltyDiscount = (customer: Customer, basePremium: number): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const followUpDiscount = (basePremium: number, isFollowUp: boolean): number =>
  isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;

const quotePremium = (
  items: QuoteItem[],
  customer: Customer,
  isFollowUp: boolean
): number => {
  const basePremium = sumOfBasePremiums(items);
  const surcharges = sumOfItemSurcharges(items);
  const discount =
    loyaltyDiscount(customer, basePremium) +
    followUpDiscount(basePremium, isFollowUp);
  return Math.ceil(basePremium + surcharges - discount + PROCESSING_FEE);
};

const isFollowUpQuote = (steps: Step[], index: number): boolean =>
  steps.slice(0, index).some((step) => step.op === "quote");

const insuranceValues: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;

const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const isHighEnchantmentClaim = (policyItem: QuoteItem): boolean =>
  enchantmentLevel(policyItem) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const insuredItemFor = (
  damage: Damage,
  policyItems: QuoteItem[]
): QuoteItem => {
  const policyItem = policyItems.find((item) => item.type === damage.itemType);
  if (policyItem === undefined) {
    throw new Error(`Damage item not in policy: ${damage.itemType}`);
  }
  return policyItem;
};

const damagePayout = (damage: Damage, policyItems: QuoteItem[]): number => {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
  const policyItem = insuredItemFor(damage, policyItems);
  const reimbursable = isHighEnchantmentClaim(policyItem)
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;
  return reimbursable - DEDUCTIBLE;
};

const CAP_MULTIPLIER = 2;

const insuranceCap = (policyItems: QuoteItem[]): number =>
  CAP_MULTIPLIER *
  policyItems.reduce((sum, item) => sum + insuranceValues[item.type], 0);

const totalDamagePayout = (
  damages: Damage[],
  policyItems: QuoteItem[]
): number =>
  damages.reduce((total, damage) => total + damagePayout(damage, policyItems), 0);

const policyItemsFor = (scenario: Scenario, policy: number): QuoteItem[] =>
  (scenario.steps[policy] as QuoteStep).items;

const countDamagesByType = (damages: Damage[]): Record<string, number> =>
  tallyBy(damages, (damage) => damage.itemType);

const validateDamageCounts = (
  damages: Damage[],
  policyItems: QuoteItem[]
): void => {
  const insuredCounts = countByType(policyItems);
  const damageCounts = countDamagesByType(damages);
  for (const [itemType, count] of Object.entries(damageCounts)) {
    if (count > (insuredCounts[itemType] ?? 0)) {
      throw new Error(`Too many damages for item type: ${itemType}`);
    }
  }
};

const claimResult = (
  step: ClaimStep,
  policyItems: QuoteItem[],
  cap: number
): ClaimResult => {
  validateDamageCounts(step.incident.damages, policyItems);
  const desiredPayout = Math.floor(
    totalDamagePayout(step.incident.damages, policyItems)
  );
  const payout = Math.min(desiredPayout, cap);
  return { payout, remainingCap: cap - payout };
};

export function runScenario(scenario: Scenario): ScenarioResult {
  const remainingCaps = new Map<number, number>();
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "claim") {
      const policyItems = policyItemsFor(scenario, step.policy);
      const cap = remainingCaps.get(step.policy) ?? insuranceCap(policyItems);
      const result = claimResult(step, policyItems, cap);
      remainingCaps.set(step.policy, result.remainingCap);
      return result;
    }
    const isFollowUp = isFollowUpQuote(scenario.steps, index);
    return {
      premium: quotePremium(step.items, scenario.customer, isFollowUp),
    };
  });
  return { results };
}
