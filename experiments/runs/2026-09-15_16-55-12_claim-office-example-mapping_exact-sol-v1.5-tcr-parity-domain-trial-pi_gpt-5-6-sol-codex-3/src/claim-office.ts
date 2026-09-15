export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<Record<string, unknown>>;
}

export interface ScenarioResult {
  results: Array<Record<string, number>>;
}

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

function itemBasePremium(item: { type: string }): number {
  const premium = MAIN_ITEM_PREMIUMS[item.type];
  if (premium === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return premium;
}

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function typeBasePremium(type: string, count: number): number {
  if (COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE) return COMPONENT_BLOCK_PREMIUM;
  return itemBasePremium({ type }) * count;
}

function policyBasePremium(items: Array<{ type: string }>): number {
  const counts = items.reduce<Record<string, number>>((result, { type }) => {
    result[type] = (result[type] ?? 0) + 1;
    return result;
  }, {});
  return Object.entries(counts).reduce((sum, [type, count]) => sum + typeBasePremium(type, count), 0);
}

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

function itemRiskSurcharge(item: Item): number {
  const basePremium = itemBasePremium(item);
  const curse = item.cursed ? basePremium * CURSE_SURCHARGE_RATE : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
    ? basePremium * HIGH_ENCHANTMENT_RATE
    : 0;
  return curse + enchantment;
}

function quote(step: Record<string, unknown>, yearsWithMHPCO: number, isFollowUp: boolean): Record<string, number> {
  const items = step.items as Item[];
  const basePremium = policyBasePremium(items);
  const riskSurcharge = items.reduce((sum, item) => sum + itemRiskSurcharge(item), 0);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  const premium = basePremium + riskSurcharge - loyaltyDiscount + basePremium * INITIAL_ASSESSMENT_RATE - followUpDiscount;
  return { premium: Math.ceil(premium + PROCESSING_FEE) };
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

interface Damage {
  itemType: string;
  amount: number;
}

function damageReimbursement(damage: Damage, item: Item): number {
  if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
  const rate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;
  return Math.max(0, damage.amount * rate - DEDUCTIBLE);
}

function takeCoveredItem(items: Item[], itemType: string): Item {
  const index = items.findIndex(({ type }) => type === itemType);
  if (index < 0) throw new Error(`Damage item is not covered: ${itemType}`);
  return items.splice(index, 1)[0];
}

function claim(step: Record<string, unknown>, policy: Policy): Record<string, number> {
  const incident = step.incident as { damages: Damage[] };
  const availableItems = [...policy.items];
  const desired = incident.damages.reduce((sum, damage) => {
    const item = takeCoveredItem(availableItems, damage.itemType);
    return sum + damageReimbursement(damage, item);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function executeScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  const results: Array<Record<string, number>> = [];
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "claim") {
      results.push(claim(step, policies.get(step.policy as number)!));
      return;
    }
    const items = step.items as Item[];
    policies.set(index, createPolicy(items));
    results.push(quote(step, scenario.customer.yearsWithMHPCO, quoteCount > 0));
    quoteCount += 1;
  });
  return { results };
}
