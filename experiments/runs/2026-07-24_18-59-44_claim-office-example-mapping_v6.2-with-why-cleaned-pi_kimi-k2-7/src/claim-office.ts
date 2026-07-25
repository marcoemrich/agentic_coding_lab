const rateBasedAdjustment = (
  applies: boolean,
  base: number,
  rate: number,
): number => (applies ? base * rate : 0);

const PROCESSING_FEE = 5;
type ItemDefinition = { basePremium: number; insuranceValue: number };

const ITEM_DEFINITIONS: Record<string, ItemDefinition> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;
const COMPONENT_BLOCK_TYPES = ["rune", "moonstone"];
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_THRESHOLD = 2;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_CONTRACT_RATE = 0.15;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;

const DAMAGE_DEDUCTIBLE = 100;
const DAMAGE_ENCHANTMENT_THRESHOLD = 8;
const DAMAGE_ENCHANTMENT_RATE = 0.5;
const POLICY_CAP_MULTIPLIER = 2;

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Customer = { yearsWithMHPCO: number };

type QuoteStep = { op: "quote"; items?: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: Customer;
  steps: Step[];
};

const basePremiumFor = (itemType: string): number => ITEM_DEFINITIONS[itemType]?.basePremium ?? 0;
const insuranceValueFor = (itemType: string): number => ITEM_DEFINITIONS[itemType]?.insuranceValue ?? 0;

const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in ITEM_DEFINITIONS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const countItemsByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const premiumForComponentGroup = (type: string, count: number): number => {
  if (COMPONENT_BLOCK_TYPES.includes(type) && count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_PRICE;
  }
  return count * basePremiumFor(type);
};

const basePremiumForItems = (items: Item[]): number => {
  let total = 0;
  for (const [type, count] of countItemsByType(items)) {
    total += premiumForComponentGroup(type, count);
  }
  return total;
};

const itemSurchargeAmount = (item: Item): number => {
  const base = basePremiumFor(item.type);
  const curseSurcharge = rateBasedAdjustment(item.cursed ?? false, base, CURSE_RATE);
  const enchantmentSurcharge = rateBasedAdjustment(
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    base,
    HIGH_ENCHANTMENT_RATE,
  );
  return curseSurcharge + enchantmentSurcharge;
};

const quotePremium = (
  items: Item[],
  customer: Customer,
  isFollowUp: boolean,
): number => {
  const itemsBase = basePremiumForItems(items);
  const itemSurcharges = items.reduce((sum, item) => sum + itemSurchargeAmount(item), 0);
  const firstInsuranceSurcharge = itemsBase * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = rateBasedAdjustment(
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD,
    itemsBase,
    LOYALTY_RATE,
  );
  const followUpDiscount = rateBasedAdjustment(
    isFollowUp,
    itemsBase,
    FOLLOW_UP_CONTRACT_RATE,
  );
  const subtotal =
    itemsBase +
    itemSurcharges +
    firstInsuranceSurcharge -
    loyaltyDiscount -
    followUpDiscount +
    PROCESSING_FEE;
  return Math.ceil(subtotal);
};

type Policy = { items: Item[]; cap: number };

const policyInsuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueFor(item.type), 0);

const policyCapFor = (items: Item[]): number =>
  policyInsuranceSum(items) * POLICY_CAP_MULTIPLIER;

const damageReimbursementRate = (item: Item): number =>
  (item.enchantment ?? 0) >= DAMAGE_ENCHANTMENT_THRESHOLD ? DAMAGE_ENCHANTMENT_RATE : 1;

const damagePayout = (damage: Damage, item: Item): number => {
  const reimbursement = damage.amount * damageReimbursementRate(item);
  return Math.max(0, reimbursement - DAMAGE_DEDUCTIBLE);
};

const validateDamages = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error("Damage amount cannot be negative");
    }
  }
};

const processClaim = (policy: Policy, incident: ClaimStep["incident"]): { payout: number; remainingCap: number } => {
  validateDamages(incident.damages);
  const rawPayout = incident.damages.reduce((sum, damage) => {
    const item = policy.items.find((i) => i.type === damage.itemType);
    if (!item) {
      throw new Error(`Item type ${damage.itemType} is not part of the policy`);
    }
    return sum + damagePayout(damage, item);
  }, 0);
  const payout = Math.floor(Math.min(rawPayout, policy.cap));
  return { payout, remainingCap: policy.cap - payout };
};

export const processScenario = (scenario: Scenario): { results: Array<{ premium: number } | { payout: number; remainingCap: number }> } => {
  const results: Array<{ premium: number } | { payout: number; remainingCap: number }> = [];
  const policies: Policy[] = [];
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const items = step.items ?? [];
      validateItemTypes(items);
      const isFollowUp = policies.length > 0;
      policies.push({ items, cap: policyCapFor(items) });
      results.push({ premium: quotePremium(items, scenario.customer, isFollowUp) });
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      const result = processClaim(policy, step.incident);
      policy.cap = result.remainingCap;
      results.push(result);
    }
  }
  return { results };
};
