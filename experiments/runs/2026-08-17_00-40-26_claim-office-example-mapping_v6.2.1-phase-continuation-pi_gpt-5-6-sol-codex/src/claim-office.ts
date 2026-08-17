export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_DISCOUNT = 15;
const CURSE_SURCHARGE_RATE = 0.5;
const ENCHANTMENT_SURCHARGE_LEVEL = 5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_DISCOUNT_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const STANDARD_SURCHARGE_RATE = 0.1;
const DAMAGE_REDUCTION_ENCHANTMENT_LEVEL = 8;
const DAMAGE_REIMBURSEMENT_RATE = 0.5;
const POLICY_CAP_MULTIPLIER = 2;

const PRICE_LIST: Record<string, { premium: number; value: number }> = {
  sword: { premium: 100, value: 1000 },
  amulet: { premium: 60, value: 600 },
  staff: { premium: 80, value: 800 },
  potion: { premium: 40, value: 400 },
  rune: { premium: 25, value: 250 },
  moonstone: { premium: 25, value: 250 },
};

const sumPriceListAmounts = (items: Item[], priceKind: "premium" | "value"): number =>
  items.reduce((total, item) => total + PRICE_LIST[item.type][priceKind], 0);

export const calculateBasePremium = (items: Item[]): number => {
  const total = sumPriceListAmounts(items, "premium");
  const exactComponentBlockDiscount = ["rune", "moonstone"].filter(
    (type) => items.filter((item) => item.type === type).length === COMPONENT_BLOCK_SIZE,
  ).length * COMPONENT_BLOCK_DISCOUNT;
  return total - exactComponentBlockDiscount;
};
export const calculateInsuranceSum = (items: Item[]): number =>
  sumPriceListAmounts(items, "value");
const PROCESSING_FEE = 5;
const ITEM_DAMAGE_DEDUCTIBLE = 100;

const calculateItemPremiumSurcharge = (item: Item): number => {
  const itemBasePremium = PRICE_LIST[item.type].premium;
  const curseSurcharge = item.cursed ? itemBasePremium * CURSE_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = (item.enchantment ?? 0) >= ENCHANTMENT_SURCHARGE_LEVEL
    ? itemBasePremium * ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curseSurcharge + enchantmentSurcharge;
};

export const calculatePremium = (items: Item[], yearsWithMHPCO: number, contractIndex: number): number => {
  const basePremium = calculateBasePremium(items);
  const itemSurcharges = items.reduce(
    (total, item) => total + calculateItemPremiumSurcharge(item),
    0,
  );
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_DISCOUNT_YEARS
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = contractIndex > 0 ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return roundPremium(
    basePremium
      + itemSurcharges
      + basePremium * STANDARD_SURCHARGE_RATE
      - loyaltyDiscount
      - followUpDiscount
      + PROCESSING_FEE,
  );
};
export const calculateDamagePayout = (item: Item, damageAmount: number): number => {
  const eligibleDamageAmount = (item.enchantment ?? 0) >= DAMAGE_REDUCTION_ENCHANTMENT_LEVEL
    ? damageAmount * DAMAGE_REIMBURSEMENT_RATE
    : damageAmount;
  return Math.max(eligibleDamageAmount - ITEM_DAMAGE_DEDUCTIBLE, 0);
};
export const roundPremium = (amount: number): number => Math.ceil(amount);
export const roundPayout = (amount: number): number => Math.floor(amount);

type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
};

type Policy = { items: Item[]; remainingCap: number };

const calculateUncappedPayout = (policy: Policy, damages: Damage[]): number => {
  const unmatchedItems = [...policy.items];
  return damages.reduce((total, damage) => {
    if (damage.amount < 0) throw new Error("Damage amount must be non-negative");
    const itemIndex = unmatchedItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Damage item ${damage.itemType} is not insured or occurs more times than insured`);
    const [insuredItem] = unmatchedItems.splice(itemIndex, 1);
    return total + calculateDamagePayout(insuredItem, damage.amount);
  }, 0);
};

export const processScenario = (input: unknown): { results: Array<Record<string, number>> } => {
  const scenario = input as Scenario;
  const policies = new Map<number, Policy>();
  const results: Array<Record<string, number>> = [];

  for (const [stepIndex, step] of scenario.steps.entries()) {
    if (step.op === "quote") {
      const unknownItem = step.items.find((item) => !PRICE_LIST[item.type]);
      if (unknownItem) throw new Error(`Unknown item type: ${unknownItem.type}`);
      results.push({
        premium: calculatePremium(step.items, scenario.customer.yearsWithMHPCO, policies.size),
      });
      policies.set(stepIndex, {
        items: step.items,
        remainingCap: calculateInsuranceSum(step.items) * POLICY_CAP_MULTIPLIER,
      });
      continue;
    }

    const policy = policies.get(step.policy)!;
    const uncappedPayout = calculateUncappedPayout(policy, step.incident.damages);
    const payout = roundPayout(Math.min(uncappedPayout, policy.remainingCap));
    policy.remainingCap -= payout;
    results.push({ payout, remainingCap: policy.remainingCap });
  }

  return { results };
};
