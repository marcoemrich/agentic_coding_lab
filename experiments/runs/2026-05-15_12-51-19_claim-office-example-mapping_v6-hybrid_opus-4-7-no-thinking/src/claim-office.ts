const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_DAMAGE_RATE = 0.5;
const HIGH_ENCHANTMENT_DAMAGE_THRESHOLD = 8;
const DRAGON_MATERIAL = "dragon";

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Damage = { itemType: string; amount: number };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: { cause?: string; damages: Damage[] } };
type Step = { op: string; items?: Item[]; policy?: number; incident?: { damages: Damage[] } };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

type Policy = { items: Item[]; insuranceSum: number; remainingCap: number };

const computeItemBasePremium = (item: Item): number => BASE_PREMIUM[item.type];

const computeItemModifierSurcharge = (item: Item, basePremium: number): number => {
  let surcharge = 0;
  if (item.cursed) surcharge += basePremium * CURSED_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += basePremium * HIGH_ENCHANTMENT_RATE;
  }
  return surcharge;
};

const computeBasePremiumFromItems = (items: Item[]): number => {
  let basePremium = 0;
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      basePremium += computeItemBasePremium(item);
    }
  }
  for (const [type, count] of Object.entries(componentCounts)) {
    if (count === COMPONENT_BLOCK_SIZE) {
      basePremium += COMPONENT_BLOCK_PREMIUM;
    } else {
      basePremium += count * BASE_PREMIUM[type];
    }
  }
  return basePremium;
};

const computeTotalItemModifierSurcharge = (items: Item[]): number => {
  let total = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) continue;
    total += computeItemModifierSurcharge(item, computeItemBasePremium(item));
  }
  return total;
};

const computeQuotePremium = (
  items: Item[],
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number => {
  const basePremium = computeBasePremiumFromItems(items);
  const itemSurcharges = computeTotalItemModifierSurcharge(items);
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? basePremium * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUpContract ? basePremium * FOLLOWUP_DISCOUNT_RATE : 0;
  return Math.ceil(
    basePremium + itemSurcharges + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
  );
};

const computeInsuranceSum = (items: Item[]): number => {
  let sum = 0;
  for (const item of items) sum += INSURANCE_VALUE[item.type];
  return sum;
};

const findItemOfType = (items: Item[], itemType: string): Item | undefined =>
  items.find((it) => it.type === itemType);

const computeDamagePayout = (item: Item, damageAmount: number): number => {
  let reimbursement = damageAmount;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_DAMAGE_THRESHOLD) {
    reimbursement = damageAmount * HIGH_ENCHANTMENT_DAMAGE_RATE;
  } else if (item.material === DRAGON_MATERIAL) {
    reimbursement = damageAmount;
  }
  return Math.max(0, reimbursement - DEDUCTIBLE);
};

const processClaim = (
  policy: Policy,
  damages: Damage[],
): { payout: number; remainingCap: number } => {
  const damageCountsByType: Record<string, number> = {};
  for (const dmg of damages) damageCountsByType[dmg.itemType] = (damageCountsByType[dmg.itemType] ?? 0) + 1;
  const policyCountsByType: Record<string, number> = {};
  for (const item of policy.items) policyCountsByType[item.type] = (policyCountsByType[item.type] ?? 0) + 1;
  for (const [type, count] of Object.entries(damageCountsByType)) {
    if ((policyCountsByType[type] ?? 0) < count) {
      throw new Error(`claim has ${count} damage(s) of type ${type}, but policy covers only ${policyCountsByType[type] ?? 0}`);
    }
  }

  let totalPayout = 0;
  for (const dmg of damages) {
    if (dmg.amount < 0) throw new Error(`damage amount must be non-negative, got ${dmg.amount}`);
    const item = findItemOfType(policy.items, dmg.itemType);
    if (!item) throw new Error(`claim references item type ${dmg.itemType} not in policy`);
    const itemPayout = computeDamagePayout(item, dmg.amount);
    totalPayout += itemPayout;
  }
  const cappedPayout = Math.min(totalPayout, policy.remainingCap);
  policy.remainingCap -= cappedPayout;
  return { payout: Math.floor(cappedPayout), remainingCap: policy.remainingCap };
};

const validateItems = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
};

export const runScenario = (input: unknown): unknown => {
  const scenario = input as Scenario;
  const years = scenario.customer.yearsWithMHPCO;
  let quoteCount = 0;
  const policies: Record<number, Policy> = {};
  const results = scenario.steps.map((step, idx) => {
    if (step.op === "quote") {
      const isFollowUpContract = quoteCount > 0;
      quoteCount++;
      const items = step.items ?? [];
      validateItems(items);
      const insuranceSum = computeInsuranceSum(items);
      policies[idx] = {
        items,
        insuranceSum,
        remainingCap: insuranceSum * CAP_MULTIPLIER,
      };
      return { premium: computeQuotePremium(items, years, isFollowUpContract) };
    }
    if (step.op === "claim") {
      const policy = policies[step.policy!];
      return processClaim(policy, step.incident!.damages);
    }
    return {};
  });
  return { results };
};
