export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage { itemType: string; amount: number }
interface QuoteStep { op: "quote"; items: Item[] }
interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
type Step = QuoteStep | ClaimStep;
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
interface Policy { items: Item[]; remainingCap: number }

const PROCESSING_FEE = 5;
const BASE_PREMIUM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const INSURANCE_VALUE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_RATE = 0.3;
const FOLLOW_UP_RATE = 0.15;
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

function basePremiumFor(items: Item[]): number {
  const unknownItem = items.find((item) => BASE_PREMIUM[item.type] === undefined);
  if (unknownItem !== undefined) throw new Error(`Unknown item type: ${unknownItem.type}`);
  return items.reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0) - componentBlockDiscount(items);
}

function componentBlockDiscount(items: Item[]): number {
  return COMPONENT_TYPES
    .filter((type) => items.filter((item) => item.type === type).length === COMPONENT_BLOCK_SIZE)
    .reduce((discount, type) => discount + COMPONENT_BLOCK_SIZE * BASE_PREMIUM[type] - COMPONENT_BLOCK_PREMIUM, 0);
}

function itemRiskSurcharge(item: Item): number {
  const basePremium = BASE_PREMIUM[item.type];
  const curseRisk = item.cursed ? basePremium * CURSE_RATE : 0;
  const enchantmentRisk = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? basePremium * ENCHANTMENT_RATE : 0;
  return curseRisk + enchantmentRisk;
}

function customerDiscount(basePremium: number, yearsWithMHPCO: number, isFollowUp: boolean): number {
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
  const followUp = isFollowUp ? basePremium * FOLLOW_UP_RATE : 0;
  return loyalty + followUp;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const basePremium = basePremiumFor(items);
  const itemRisks = items.reduce((risk, item) => risk + itemRiskSurcharge(item), 0);
  return Math.ceil(basePremium + itemRisks + basePremium * FIRST_INSURANCE_RATE
    - customerDiscount(basePremium, yearsWithMHPCO, isFollowUp) + PROCESSING_FEE);
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function reimbursableDamage(policy: Policy, damage: Damage): number {
  const coveredItem = policy.items.find((item) => item.type === damage.itemType)!;
  return (coveredItem.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT
    : damage.amount;
}

function validateDamageCoverage(policy: Policy, damages: Damage[]): void {
  const negativeDamage = damages.find((damage) => damage.amount < 0);
  if (negativeDamage !== undefined) throw new Error(`Negative damage amount: ${negativeDamage.amount}`);
  const types = new Set(damages.map((damage) => damage.itemType));
  for (const type of types) {
    const coveredCount = policy.items.filter((item) => item.type === type).length;
    const damageCount = damages.filter((damage) => damage.itemType === type).length;
    if (damageCount > coveredCount) throw new Error(`Damage exceeds policy coverage for ${type}`);
  }
}

function processClaim(policy: Policy, damages: Damage[]): object {
  validateDamageCoverage(policy, damages);
  const desiredPayout = damages.reduce((sum, damage) => sum + Math.max(0, reimbursableDamage(policy, damage) - DEDUCTIBLE), 0);
  const payout = Math.min(Math.floor(desiredPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: object[] } {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") return processClaim(policies.get(step.policy)!, step.incident.damages);
    const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
    policies.set(index, createPolicy(step.items));
    quoteCount += 1;
    return { premium };
  });
  return { results };
}
