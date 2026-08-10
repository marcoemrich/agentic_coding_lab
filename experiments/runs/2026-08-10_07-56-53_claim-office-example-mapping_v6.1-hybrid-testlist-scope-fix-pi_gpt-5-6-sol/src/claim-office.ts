export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
export type QuoteStep = { op: "quote"; items: Item[] };
export type Damage = { itemType: string; amount: number };
export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: unknown[];
};

const PROCESSING_FEE = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};

const quotePremium = (items: Item[], yearsWithMHPCO: number, priorQuoteCount: number): number => {
  for (const item of items) {
    if (BASE_PREMIUM_BY_ITEM_TYPE[item.type] === undefined) throw new Error(`Unknown item type: ${item.type}`);
  }
  const itemCountsByType = items.reduce<Record<string, number>>((counts, item) => {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
    return counts;
  }, {});
  const totalBasePremium = Object.entries(itemCountsByType).reduce(
    (total, [type, count]) => total + ((type === "rune" || type === "moonstone") && count === 3
      ? 60 : BASE_PREMIUM_BY_ITEM_TYPE[type] * count), 0,
  );
  const itemSurcharges = items.reduce((total, item) => {
    const base = BASE_PREMIUM_BY_ITEM_TYPE[item.type];
    return total + (item.cursed ? base / 2 : 0)
      + ((item.enchantment ?? 0) >= 5 ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);
  }, 0);
  const loyaltyDiscount = yearsWithMHPCO >= 2 ? totalBasePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = priorQuoteCount > 0 ? totalBasePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(totalBasePremium + itemSurcharges + totalBasePremium / 10
    - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
};

type Policy = { items: Item[]; remainingCap: number };

export const runScenario = (scenario: Scenario): { results: unknown[] } => {
  let priorQuoteCount = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((rawStep, stepIndex) => {
    const step = rawStep as QuoteStep | ClaimStep;
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, priorQuoteCount);
      priorQuoteCount += 1;
      const insuranceSum = step.items.reduce(
        (sum, item) => sum + INSURANCE_VALUE_BY_ITEM_TYPE[item.type], 0,
      );
      policies.set(stepIndex, { items: step.items, remainingCap: insuranceSum * 2 });
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
    const availableInsuredItems = [...policy.items];
    const uncappedPayout = step.incident.damages.reduce((sum, damage) => {
      if (damage.amount < 0) throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
      const itemIndex = availableInsuredItems.findIndex((item) => item.type === damage.itemType);
      if (itemIndex < 0) throw new Error(`Damage item not insured or exceeds count: ${damage.itemType}`);
      const [item] = availableInsuredItems.splice(itemIndex, 1);
      const reimbursableDamageAmount = (item.enchantment ?? 0) >= 8
        ? damage.amount / 2
        : damage.amount;
      return sum + Math.max(0, reimbursableDamageAmount - 100);
    }, 0);
    const payout = Math.floor(Math.min(uncappedPayout, policy.remainingCap));
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
};
