const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_DAMAGE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_DAMAGE_REDUCTION_RATE = 0.5;

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DAMAGE_DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

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

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
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
    damages: Array<{ itemType: string; amount: number }>;
  };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

const isComponent = (type: string): boolean => type === "rune" || type === "moonstone";

const lookupValue = (table: Record<string, number>, type: string): number => {
  const value = table[type];
  if (value === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return value;
};

const basePremiumForItem = (type: string): number => lookupValue(BASE_PREMIUMS, type);

const basePremiumForGroup = (type: string, count: number): number =>
  isComponent(type) && count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * basePremiumForItem(type);

const rateAdjustmentIf = (applies: boolean, base: number, rate: number): number =>
  applies ? base * rate : 0;

const surchargeForItem = (item: Item): number => {
  const base = basePremiumForItem(item.type);
  return (
    rateAdjustmentIf(item.cursed ?? false, base, CURSED_SURCHARGE_RATE) +
    rateAdjustmentIf(
      typeof item.enchantment === "number" && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD,
      base,
      HIGH_ENCHANTMENT_SURCHARGE_RATE
    )
  );
};

const insuredValueFor = (type: string): number => lookupValue(INSURANCE_VALUES, type);

const sum = <T>(items: T[], getValue: (item: T) => number): number =>
  items.reduce((total, item) => total + getValue(item), 0);

const insuranceSumForItems = (items: Item[]): number =>
  sum(items, (item) => insuredValueFor(item.type));

const basePremiumTotal = (items: Item[]): number => {
  const quantityByType = new Map<string, number>();
  items.forEach((item) => {
    quantityByType.set(item.type, (quantityByType.get(item.type) ?? 0) + 1);
  });

  return sum(Array.from(quantityByType.entries()), ([type, count]) =>
    basePremiumForGroup(type, count)
  );
};

const policyAdjustmentAmount = (
  baseTotal: number,
  customerYears: number,
  isFollowUp: boolean
): number => {
  const loyaltyDiscount = rateAdjustmentIf(
    customerYears >= LOYALTY_YEARS_THRESHOLD,
    baseTotal,
    LOYALTY_DISCOUNT_RATE
  );
  const firstInsuranceSurcharge = FIRST_INSURANCE_SURCHARGE_RATE * baseTotal;
  const followUpDiscount = rateAdjustmentIf(
    isFollowUp,
    baseTotal,
    FOLLOW_UP_DISCOUNT_RATE
  );

  return firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;
};

const quoteForItems = (
  items: Item[],
  customerYears: number,
  isFollowUp: boolean
): { premium: number } => {
  const baseTotal = basePremiumTotal(items);

  const itemSurcharges = sum(items, surchargeForItem);

  const policyBase = baseTotal + itemSurcharges;
  const rawPremium =
    policyBase + policyAdjustmentAmount(baseTotal, customerYears, isFollowUp) + PROCESSING_FEE;
  return { premium: Math.ceil(rawPremium) };
};

const reimbursementForDamage = (policyItem: Item, damageAmount: number): number => {
  const enchantment = typeof policyItem.enchantment === "number" ? policyItem.enchantment : 0;
  const damageAfterEnchantmentReduction =
    enchantment >= HIGH_ENCHANTMENT_DAMAGE_THRESHOLD
      ? damageAmount * HIGH_ENCHANTMENT_DAMAGE_REDUCTION_RATE
      : damageAmount;
  return Math.max(0, damageAfterEnchantmentReduction - DAMAGE_DEDUCTIBLE);
};

const reimbursementForDamageEntry = (
  policyItems: Item[],
  damage: { itemType: string; amount: number }
): number => {
  if (damage.amount < 0) {
    throw new Error("Damage amount cannot be negative");
  }
  const policyItem = policyItems.find((item) => item.type === damage.itemType);
  if (!policyItem) {
    throw new Error(`Item type ${damage.itemType} not insured`);
  }
  return reimbursementForDamage(policyItem, damage.amount);
};

const capForPolicy = (items: Item[]): number =>
  CAP_MULTIPLIER * insuranceSumForItems(items);

const requireQuoteStepAt = (steps: Step[], policyIndex: number): QuoteStep => {
  const step = steps[policyIndex];
  if (step.op !== "quote") {
    throw new Error(`Policy ${policyIndex} is not a quote step`);
  }
  return step;
};

const countByType = (items: Array<{ type?: string; itemType?: string }>): Map<string, number> => {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    const type = item.type ?? item.itemType;
    if (type) {
      counts.set(type, (counts.get(type) ?? 0) + 1);
    }
  });
  return counts;
};

const processClaim = (
  policyItems: Item[],
  damages: Array<{ itemType: string; amount: number }>,
  remainingCap: number
): { payout: number; remainingCap: number } => {
  const policyCounts = countByType(policyItems);
  const damageCounts = countByType(damages);
  damageCounts.forEach((count, type) => {
    if (count > (policyCounts.get(type) ?? 0)) {
      throw new Error(`More damages than insured items for type: ${type}`);
    }
  });

  const payoutBeforeCap = sum(damages, (damage) =>
    reimbursementForDamageEntry(policyItems, damage)
  );
  const payout = Math.floor(Math.min(payoutBeforeCap, remainingCap));
  return { payout, remainingCap: Math.floor(remainingCap - payout) };
};

export const processScenario = (scenario: Scenario): Array<{ premium: number } | { payout: number; remainingCap: number }> => {
  const remainingCapByPolicy = new Map<number, number>();
  return scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const isFollowUp = index > 0;
      return quoteForItems(step.items, scenario.customer.yearsWithMHPCO, isFollowUp);
    }
    const policyStep = requireQuoteStepAt(scenario.steps, step.policy);
    const cap = capForPolicy(policyStep.items);
    const remainingCap = remainingCapByPolicy.get(step.policy) ?? cap;
    const result = processClaim(policyStep.items, step.incident.damages, remainingCap);
    remainingCapByPolicy.set(step.policy, result.remainingCap);
    return result;
  });
};
