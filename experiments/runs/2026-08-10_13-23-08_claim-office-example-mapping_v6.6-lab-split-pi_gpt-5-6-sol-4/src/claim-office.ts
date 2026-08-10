export type Item = {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
};
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
};

const COMPONENT_BUNDLE_SIZE = 3;
const COMPONENT_BUNDLE_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const STANDARD_SURCHARGE_RATE = 0.1;
const PROCESSING_FEE = 5;
const POLICY_CAP_MULTIPLIER = 2;
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const DAMAGE_DEDUCTIBLE = 100;

const premiumBaseByItemType: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const insuranceValueByItemType: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const calculateQuotePremium = (items: Item[], yearsWithMHPCO: number, priorQuoteCount: number) => {
  const itemCountByType = items.reduce<Record<string, number>>((countByType, item) => {
    countByType[item.type] = (countByType[item.type] ?? 0) + 1;
    return countByType;
  }, {});
  const basePremium = Object.entries(itemCountByType).reduce(
    (subtotal, [type, count]) => subtotal + (count === COMPONENT_BUNDLE_SIZE && ["rune", "moonstone"].includes(type)
      ? COMPONENT_BUNDLE_PREMIUM
      : count * premiumBaseByItemType[type]),
    0,
  );
  const itemSurcharges = items.reduce(
    (subtotal, item) => subtotal
      + (item.cursed ? premiumBaseByItemType[item.type] * CURSE_SURCHARGE_RATE : 0)
      + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
        ? premiumBaseByItemType[item.type] * HIGH_ENCHANTMENT_SURCHARGE_RATE
        : 0),
    0,
  );
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = priorQuoteCount > 0 ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(
    basePremium + itemSurcharges + basePremium * STANDARD_SURCHARGE_RATE
      - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
  );
};

export const processScenario = (scenario: Scenario) => {
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  let priorQuoteCount = 0;
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      for (const item of step.items) {
        if (!(item.type in insuranceValueByItemType)) throw new Error(`Unknown item type '${item.type}'`);
      }
      const totalInsuranceValue = step.items.reduce((sum, item) => sum + insuranceValueByItemType[item.type], 0);
      policies.set(stepIndex, { items: step.items, remainingCap: totalInsuranceValue * POLICY_CAP_MULTIPLIER });
      return { premium: calculateQuotePremium(step.items, scenario.customer.yearsWithMHPCO, priorQuoteCount++) };
    }
    const policy = policies.get(step.policy)!;
    const processedDamageCountByItemType: Record<string, number> = {};
    const uncappedPayout = step.incident.damages.reduce((total, damage) => {
      if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
      const damageOccurrenceIndex = processedDamageCountByItemType[damage.itemType] ?? 0;
      const item = policy.items.filter(candidate => candidate.type === damage.itemType)[damageOccurrenceIndex];
      if (!item) throw new Error(`Damage item type '${damage.itemType}' is not covered by policy`);
      processedDamageCountByItemType[damage.itemType] = damageOccurrenceIndex + 1;
      const reimbursableDamage = (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL
        ? damage.amount * REDUCED_REIMBURSEMENT_RATE : damage.amount;
      return total + Math.max(0, reimbursableDamage - DAMAGE_DEDUCTIBLE);
    }, 0);
    const payout = Math.floor(Math.min(uncappedPayout, policy.remainingCap));
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
};
