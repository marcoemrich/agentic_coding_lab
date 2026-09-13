const PROCESSING_FEE = 5;
const CAP_MULTIPLIER = 2;

const SWORD_PREMIUM = 100;
const SWORD_VALUE = 1000;
const AMULET_PREMIUM = 60;
const AMULET_VALUE = 600;
const STAFF_PREMIUM = 80;
const STAFF_VALUE = 800;
const POTION_PREMIUM = 40;
const POTION_VALUE = 400;
const COMPONENT_PREMIUM = 25;
const COMPONENT_VALUE = 250;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSE_RATE = 0.5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_RATE = 0.3;
const FOLLOW_UP_RATE = 0.15;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const DEDUCTIBLE = 100;

const PRICE_LIST: Record<string, { premium: number; value: number }> = {
  sword: { premium: SWORD_PREMIUM, value: SWORD_VALUE },
  amulet: { premium: AMULET_PREMIUM, value: AMULET_VALUE },
  staff: { premium: STAFF_PREMIUM, value: STAFF_VALUE },
  potion: { premium: POTION_PREMIUM, value: POTION_VALUE },
  rune: { premium: COMPONENT_PREMIUM, value: COMPONENT_VALUE },
  moonstone: { premium: COMPONENT_PREMIUM, value: COMPONENT_VALUE },
};

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { damages: Damage[] } };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
type Result = { premium: number } | { payout: number; remainingCap: number };
type Policy = { items: Item[]; remainingCap: number };

function priceFor(type: string): { premium: number; value: number } {
  const price = PRICE_LIST[type];
  if (price === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return price;
}

function componentBlockAdjustment(items: Item[], type: string): number {
  const count = items.filter((item) => item.type === type).length;
  const adjustment = COMPONENT_BLOCK_PREMIUM - COMPONENT_PREMIUM * COMPONENT_BLOCK_SIZE;
  return count === COMPONENT_BLOCK_SIZE ? adjustment : 0;
}

export function calculateBasePremium(items: Item[]): number {
  const ordinaryPremium = items.reduce((total, item) => total + priceFor(item.type).premium, 0);
  return ordinaryPremium + componentBlockAdjustment(items, "rune") + componentBlockAdjustment(items, "moonstone");
}

function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + priceFor(item.type).value, 0);
}

function damageReimbursement(policy: Policy, damage: Damage): number {
  const item = policy.items.find((candidate) => candidate.type === damage.itemType) as Item;
  const rate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL ? REDUCED_REIMBURSEMENT_RATE : 1;
  return Math.max(damage.amount * rate - DEDUCTIBLE, 0);
}

function validateDamageCoverage(policy: Policy, damages: Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) {
    throw new Error("Damage amount cannot be negative");
  }
  const exceedsCoverage = damages.some((damage) =>
    damages.filter((candidate) => candidate.itemType === damage.itemType).length
      > policy.items.filter((item) => item.type === damage.itemType).length,
  );
  if (exceedsCoverage) {
    throw new Error("Damage entries exceed insured items");
  }
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  validateDamageCoverage(policy, damages);
  const desired = damages.reduce((total, damage) => total + damageReimbursement(policy, damage), 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function itemSurcharge(item: Item): number {
  const base = priceFor(item.type).premium;
  const curse = item.cursed === true ? base * CURSE_RATE : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? base * ENCHANTMENT_RATE : 0;
  return curse + enchantment;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, priorContracts: number): number {
  const base = calculateBasePremium(items);
  const itemSurcharges = items.reduce((total, item) => total + itemSurcharge(item), 0);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUpDiscount = priorContracts > 0 ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + itemSurcharges + base * INITIAL_ASSESSMENT_RATE - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

export function processScenario(input: unknown): { results: Result[] } {
  const scenario = input as Scenario;
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let priorContracts = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      policies.set(index, { items: step.items, remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER });
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, priorContracts) });
      priorContracts += 1;
    } else {
      const policy = policies.get(step.policy) as Policy;
      results.push(processClaim(policy, step.incident.damages));
    }
  });
  return { results };
}
