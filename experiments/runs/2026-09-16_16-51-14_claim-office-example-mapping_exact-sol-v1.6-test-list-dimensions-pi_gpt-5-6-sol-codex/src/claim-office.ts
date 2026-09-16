const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_PREMIUM_LEVEL = 5;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_SAVING = COMPONENT_BASE_PREMIUM * COMPONENT_BLOCK_SIZE - COMPONENT_BLOCK_PREMIUM;
const COMPONENT_TYPES = ["rune", "moonstone"];
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;
const SWORD_INSURANCE_VALUE = 1000;
const AMULET_INSURANCE_VALUE = 600;
const STAFF_INSURANCE_VALUE = 800;
const POTION_INSURANCE_VALUE = 400;
const COMPONENT_INSURANCE_VALUE = 250;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
};
const INSURANCE_VALUES: Record<string, number> = {
  sword: SWORD_INSURANCE_VALUE,
  amulet: AMULET_INSURANCE_VALUE,
  staff: STAFF_INSURANCE_VALUE,
  potion: POTION_INSURANCE_VALUE,
  rune: COMPONENT_INSURANCE_VALUE,
  moonstone: COMPONENT_INSURANCE_VALUE,
};

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Damage = { itemType: string; amount: number };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;
export type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
type Policy = { items: Item[]; remainingCap: number };

const basePremiumFor = (item: Item) => {
  const premium = BASE_PREMIUMS[item.type];
  if (premium === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return premium;
};

const policyBasePremium = (items: Item[]) => {
  const unitPrice = items.reduce((total, item) => total + basePremiumFor(item), 0);
  const blockSavings = COMPONENT_TYPES.filter(
    (type) => items.filter((item) => item.type === type).length === COMPONENT_BLOCK_SIZE,
  ).length * COMPONENT_BLOCK_SAVING;
  return unitPrice - blockSavings;
};

const itemRiskSurcharge = (item: Item) => {
  const basePremium = basePremiumFor(item);
  const curseSurcharge = item.cursed ? basePremium * CURSE_RATE : 0;
  const enchantmentSurcharge =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_LEVEL
      ? basePremium * HIGH_ENCHANTMENT_RATE
      : 0;
  return curseSurcharge + enchantmentSurcharge;
};

const policyWideAdjustment = (
  basePremium: number,
  yearsWithMHPCO: number,
  isFollowUp: boolean,
) => {
  const loyaltyDiscount =
    yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return basePremium * FIRST_INSURANCE_RATE - loyaltyDiscount - followUpDiscount;
};

const quotePremium = (items: Item[], yearsWithMHPCO: number, isFollowUp: boolean) => {
  const basePremium = policyBasePremium(items);
  const riskSurcharge = items.reduce((total, item) => total + itemRiskSurcharge(item), 0);
  return Math.ceil(
    basePremium +
      riskSurcharge +
      policyWideAdjustment(basePremium, yearsWithMHPCO, isFollowUp) +
      PROCESSING_FEE,
  );
};

const insuranceSum = (items: Item[]) =>
  items.reduce((total, item) => total + (INSURANCE_VALUES[item.type] ?? 0), 0);

const reimbursableDamage = (item: Item, amount: number) =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : amount;

const matchDamagesToItems = (items: Item[], damages: Damage[]) => {
  const available = [...items];
  return damages.map((damage) => {
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index < 0) throw new Error("Damage item is not covered by policy");
    const [item] = available.splice(index, 1);
    return { damage, item };
  });
};

const settleClaim = (policy: Policy, damages: Damage[]) => {
  if (damages.some((damage) => damage.amount < 0)) {
    throw new Error("Damage amount must not be negative");
  }
  const desiredPayout = matchDamagesToItems(policy.items, damages).reduce(
    (total, { damage, item }) =>
      total + Math.max(0, reimbursableDamage(item, damage.amount) - DEDUCTIBLE),
    0,
  );
  const payout = Math.min(Math.floor(desiredPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const processScenario = (scenario: Scenario) => {
  const results: Record<string, number>[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push({
        premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0),
      });
      policies.set(index, {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
      });
      quoteCount += 1;
    } else {
      results.push(settleClaim(policies.get(step.policy)!, step.incident.damages));
    }
  });
  return { results };
};
