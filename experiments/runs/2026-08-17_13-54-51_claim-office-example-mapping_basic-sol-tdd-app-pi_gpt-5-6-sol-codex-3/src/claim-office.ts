const PROCESSING_FEE = 5;
const SWORD_BASE_PREMIUM = 100;
const AMULET_BASE_PREMIUM = 60;
const STAFF_BASE_PREMIUM = 80;
const POTION_BASE_PREMIUM = 40;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_DISCOUNT = COMPONENT_BLOCK_SIZE * COMPONENT_BASE_PREMIUM
  - COMPONENT_BLOCK_PREMIUM;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const SWORD_INSURANCE_VALUE = 1000;
const AMULET_INSURANCE_VALUE = 600;
const STAFF_INSURANCE_VALUE = 800;
const POTION_INSURANCE_VALUE = 400;
const COMPONENT_INSURANCE_VALUE = 250;

const BASE_PREMIUMS: Record<string, number> = {
  sword: SWORD_BASE_PREMIUM, amulet: AMULET_BASE_PREMIUM,
  staff: STAFF_BASE_PREMIUM, potion: POTION_BASE_PREMIUM,
  rune: COMPONENT_BASE_PREMIUM, moonstone: COMPONENT_BASE_PREMIUM,
};
const INSURANCE_VALUES: Record<string, number> = {
  sword: SWORD_INSURANCE_VALUE, amulet: AMULET_INSURANCE_VALUE,
  staff: STAFF_INSURANCE_VALUE, potion: POTION_INSURANCE_VALUE,
  rune: COMPONENT_INSURANCE_VALUE, moonstone: COMPONENT_INSURANCE_VALUE,
};

type InputItem = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type QuoteStep = { op: "quote"; items: InputItem[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
type Policy = { items: InputItem[]; remainingCap: number };

function policyBasePremium(items: InputItem[]): number {
  const ordinaryPremium = items.reduce(
    (total, item) => total + (BASE_PREMIUMS[item.type] ?? 0), 0,
  );
  const runeCount = items.filter((item) => item.type === "rune").length;
  const moonstoneCount = items.filter((item) => item.type === "moonstone").length;
  const runeDiscount = runeCount === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_DISCOUNT : 0;
  const moonstoneDiscount = moonstoneCount === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_DISCOUNT : 0;
  return ordinaryPremium - runeDiscount - moonstoneDiscount;
}

function itemRiskSurcharge(item: InputItem): number {
  const itemBase = BASE_PREMIUMS[item.type] ?? 0;
  const curse = item.cursed ? itemBase * CURSE_SURCHARGE_RATE : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return curse + enchantment;
}

function quotePremium(items: InputItem[], yearsWithMHPCO: number, isFollowUp = false): number {
  const basePremium = policyBasePremium(items);
  const riskSurcharge = items.reduce((total, item) => total + itemRiskSurcharge(item), 0);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(basePremium + riskSurcharge + basePremium * INITIAL_ASSESSMENT_RATE
    - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

function assertKnownItems(items: InputItem[]): void {
  if (items.some((item) => BASE_PREMIUMS[item.type] === undefined)) {
    throw new Error("unknown item type");
  }
}

function createPolicy(items: InputItem[]): Policy {
  assertKnownItems(items);
  const insuranceSum = items.reduce(
    (total, item) => total + (INSURANCE_VALUES[item.type] ?? 0), 0,
  );
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function assertDamagesCovered(policy: Policy, damages: Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) {
    throw new Error("damage amount must not be negative");
  }
  const available = new Map<string, number>();
  for (const item of policy.items) {
    available.set(item.type, (available.get(item.type) ?? 0) + 1);
  }
  const used = new Map<string, number>();
  for (const damage of damages) {
    const nextCount = (used.get(damage.itemType) ?? 0) + 1;
    if (nextCount > (available.get(damage.itemType) ?? 0)) {
      throw new Error("damage entries exceed insured items");
    }
    used.set(damage.itemType, nextCount);
  }
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  assertDamagesCovered(policy, damages);
  const desired = damages.reduce((total, damage) => {
    const item = policy.items.find((candidate) => candidate.type === damage.itemType);
    const reimbursed = (item?.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD
      ? damage.amount * REDUCED_REIMBURSEMENT_RATE : damage.amount;
    return total + Math.max(0, reimbursed - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(input: unknown): { results: unknown[] } {
  const scenario = input as Scenario;
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      policies.set(index, createPolicy(step.items));
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
      quoteCount += 1;
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error("Claim references no quoted policy");
    return processClaim(policy, step.incident.damages);
  });
  return { results };
}
