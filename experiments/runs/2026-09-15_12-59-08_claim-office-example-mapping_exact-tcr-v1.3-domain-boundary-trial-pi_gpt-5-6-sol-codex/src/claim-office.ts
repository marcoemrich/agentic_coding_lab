interface Item {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

type Result = { premium: number } | { payout: number; remainingCap: number };
interface Policy { items: Item[]; remainingCap: number }

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const POLICY_CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

function isComponentBlock(type: string, count: number): boolean {
  const isComponent = type === "rune" || type === "moonstone";
  return isComponent && count === COMPONENT_BLOCK_SIZE;
}

function policyBasePremium(items: Item[]): number {
  const counts = items.reduce<Record<string, number>>((byType, item) => {
    byType[item.type] = (byType[item.type] ?? 0) + 1;
    return byType;
  }, {});
  return Object.entries(counts).reduce((total, [type, count]) => {
    const groupPremium = isComponentBlock(type, count) ? COMPONENT_BLOCK_PREMIUM : BASE_PREMIUMS[type] * count;
    return total + groupPremium;
  }, 0);
}

function highEnchantmentSurcharge(item: Item, basePremium: number): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
    ? basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
}

function itemRiskSurcharge(item: Item): number {
  const basePremium = BASE_PREMIUMS[item.type];
  const curse = item.cursed ? basePremium * CURSE_SURCHARGE_RATE : 0;
  return curse + highEnchantmentSurcharge(item, basePremium);
}

function loyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
}

function followUpDiscount(basePremium: number, isFollowUp: boolean): number {
  return isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
}

function validateItemTypes(items: Item[]): void {
  items.forEach((item) => {
    if (!(item.type in BASE_PREMIUMS)) throw new Error(`Unknown item type: ${item.type}`);
  });
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  validateItemTypes(items);
  const basePremium = policyBasePremium(items);
  const risk = items.reduce((total, item) => total + itemRiskSurcharge(item), 0);
  const discounts = loyaltyDiscount(basePremium, yearsWithMHPCO) + followUpDiscount(basePremium, isFollowUp);
  return Math.ceil(basePremium + risk + basePremium * FIRST_INSURANCE_RATE - discounts + PROCESSING_FEE);
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0);
  return { items, remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER };
}

function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL
    ? REDUCED_REIMBURSEMENT_RATE : 1;
}

function damagePayout(damage: Damage, item: Item): number {
  return Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);
}

function validateDamageCoverage(damages: Damage[], items: Item[]): void {
  const types = new Set(damages.map((damage) => damage.itemType));
  types.forEach((type) => {
    const damageCount = damages.filter((damage) => damage.itemType === type).length;
    const coveredCount = items.filter((item) => item.type === type).length;
    if (damageCount > coveredCount) throw new Error("Damage quantity exceeds policy coverage");
  });
}

function validateDamageAmounts(damages: Damage[]): void {
  damages.forEach((damage) => {
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
  });
}

function incidentPayout(damages: Damage[], items: Item[]): number {
  validateDamageAmounts(damages);
  validateDamageCoverage(damages, items);
  const desiredPayout = damages.reduce((total, damage) => {
    const item = items.find((coveredItem) => coveredItem.type === damage.itemType)!;
    return total + damagePayout(damage, item);
  }, 0);
  return Math.floor(desiredPayout);
}

function processClaim(step: ClaimStep, policy: Policy): Result {
  const payout = Math.min(incidentPayout(step.incident.damages, policy.items), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
      policies.set(index, createPolicy(step.items));
      quoteCount += 1;
    } else {
      results.push(processClaim(step, policies.get(step.policy)!));
    }
  });
  return { results };
}
