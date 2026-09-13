const PROCESSING_FEE = 5;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSE_RATE = 0.5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_RATE = 0.3;
const FOLLOW_UP_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep { op: "quote"; items: Item[] }
interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Array<{ itemType: string; amount: number }> } }
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Array<QuoteStep | ClaimStep> }
export type Result = { premium: number } | { payout: number; remainingCap: number };

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

export function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

export function calculateBasePremium(items: Item[]): number {
  const componentTypes = ["rune", "moonstone"];
  const mainBase = items.reduce((total, item) => total + (BASE_PREMIUM[item.type] ?? 0), 0);
  const componentBase = componentTypes.reduce((total, type) => {
    const count = items.filter((item) => item.type === type).length;
    return total + (count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_PREMIUM);
  }, 0);
  return mainBase + componentBase;
}

function calculatePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const policyBase = calculateBasePremium(items);
  const itemSurcharges = items.reduce((total, item) => {
    const base = BASE_PREMIUM[item.type] ?? COMPONENT_PREMIUM;
    const curse = item.cursed === true ? base * CURSE_RATE : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? base * ENCHANTMENT_RATE : 0;
    return total + curse + enchantment;
  }, 0);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? policyBase * LOYALTY_RATE : 0;
  const followUp = isFollowUp ? policyBase * FOLLOW_UP_RATE : 0;
  return roundPremium(policyBase + itemSurcharges + policyBase * INITIAL_ASSESSMENT_RATE - loyalty - followUp + PROCESSING_FEE);
}

function validateDamages(policyItems: Item[], damages: Array<{ itemType: string; amount: number }>): void {
  const negativeDamage = damages.find((damage) => damage.amount < 0);
  if (negativeDamage !== undefined) throw new Error("Damage amount cannot be negative");
  const types = new Set(damages.map((damage) => damage.itemType));
  for (const type of types) {
    const insuredCount = policyItems.filter((item) => item.type === type).length;
    const damageCount = damages.filter((damage) => damage.itemType === type).length;
    if (damageCount > insuredCount) throw new Error(`More ${type} damages than insured items`);
  }
}

function desiredPayout(policyItems: Item[], damages: Array<{ itemType: string; amount: number }>): number {
  return damages.reduce((total, damage) => {
    const item = policyItems.find((insured) => insured.type === damage.itemType);
    const reimbursementRate = (item?.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
      ? HIGH_ENCHANTMENT_REIMBURSEMENT
      : 1;
    return total + Math.max(0, damage.amount * reimbursementRate - DEDUCTIBLE);
  }, 0);
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  let quoteCount = 0;
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  const results = scenario.steps.map((step, stepIndex): Result => {
    if (step.op === "quote") {
      const unknownItem = step.items.find((item) => INSURANCE_VALUE[item.type] === undefined);
      if (unknownItem !== undefined) throw new Error(`Unknown item type: ${unknownItem.type}`);
      const insuranceSum = step.items.reduce((total, item) => total + (INSURANCE_VALUE[item.type] ?? 0), 0);
      policies.set(stepIndex, { items: step.items, remainingCap: insuranceSum * CAP_MULTIPLIER });
      const premium = calculatePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
      quoteCount += 1;
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) throw new Error("Unknown policy");
    validateDamages(policy.items, step.incident.damages);
    const desired = desiredPayout(policy.items, step.incident.damages);
    const payout = Math.floor(Math.min(desired, policy.remainingCap));
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
}
