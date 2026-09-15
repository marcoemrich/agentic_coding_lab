export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<Record<string, unknown>>;
}

export interface ScenarioResult {
  results: Array<Record<string, number>>;
}

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const COMPONENT_VALUE = 250;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const MAIN_ITEM_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

interface Policy {
  items: Array<Record<string, unknown>>;
  remainingCap: number;
}

function componentPremium(items: Array<Record<string, unknown>>): number {
  const counts = new Map<string, number>();
  for (const item of items) {
    const type = item.type as string;
    if (COMPONENT_TYPES.has(type)) counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return [...counts.values()].reduce(
    (sum, count) => sum + (count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_PREMIUM),
    0,
  );
}

function itemRiskSurcharge(items: Array<Record<string, unknown>>): number {
  return items.reduce((sum, item) => {
    const itemBase = MAIN_ITEM_PREMIUMS[item.type as string] ?? 0;
    const curse = item.cursed === true ? itemBase * CURSE_RATE : 0;
    const level = item.enchantment as number | undefined;
    const enchantment = level !== undefined && level >= HIGH_ENCHANTMENT_LEVEL
      ? itemBase * HIGH_ENCHANTMENT_RATE : 0;
    return sum + curse + enchantment;
  }, 0);
}

function validateItems(items: Array<Record<string, unknown>>): void {
  for (const item of items) {
    const type = item.type as string;
    if (!(type in MAIN_ITEM_PREMIUMS) && !COMPONENT_TYPES.has(type)) {
      throw new Error(`Unknown item type: ${type}`);
    }
  }
}

function quotePremium(step: Record<string, unknown>, yearsWithMHPCO: number, isFollowUp: boolean): number {
  const items = step.items as Array<Record<string, unknown>>;
  validateItems(items);
  const mainItems = items.reduce((sum, item) => sum + (MAIN_ITEM_PREMIUMS[item.type as string] ?? 0), 0);
  const base = mainItems + componentPremium(items);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUp ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(
    base + itemRiskSurcharge(items) + base * INITIAL_ASSESSMENT_RATE - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
  );
}

function insuranceValue(item: Record<string, unknown>): number {
  const type = item.type as string;
  return MAIN_ITEM_VALUES[type] ?? COMPONENT_VALUE;
}

function reimbursableDamage(damage: Record<string, unknown>, policy: Policy): number {
  const item = policy.items.find((candidate) => candidate.type === damage.itemType);
  if (item === undefined) throw new Error(`Uninsured damage item: ${String(damage.itemType)}`);
  const level = item.enchantment as number | undefined;
  const rate = level !== undefined && level >= CLAIM_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_REIMBURSEMENT : 1;
  return Math.max(0, (damage.amount as number) * rate - DEDUCTIBLE);
}

function validateDamages(damages: Array<Record<string, unknown>>, policy: Policy): void {
  const remaining = new Map<string, number>();
  for (const item of policy.items) {
    const type = item.type as string;
    remaining.set(type, (remaining.get(type) ?? 0) + 1);
  }
  for (const damage of damages) {
    if ((damage.amount as number) < 0) throw new Error("Negative damage amount");
    const type = damage.itemType as string;
    const count = remaining.get(type) ?? 0;
    if (count === 0) throw new Error(`More ${type} damages than insured`);
    remaining.set(type, count - 1);
  }
}

function settleClaim(step: Record<string, unknown>, policies: Map<number, Policy>): Record<string, number> {
  const policy = policies.get(step.policy as number);
  if (policy === undefined) throw new Error("Unknown policy");
  const incident = step.incident as Record<string, unknown>;
  const damages = incident.damages as Array<Record<string, unknown>>;
  validateDamages(damages, policy);
  const desired = damages.reduce((sum, damage) => sum + reimbursableDamage(damage, policy), 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results: Array<Record<string, number>> = [];
  scenario.steps.forEach((step, index) => {
    if (step.op === "claim") {
      results.push(settleClaim(step, policies));
      return;
    }
    const items = step.items as Array<Record<string, unknown>>;
    results.push({ premium: quotePremium(step, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
    const sum = items.reduce((total, item) => total + insuranceValue(item), 0);
    policies.set(index, { items, remainingCap: sum * CAP_MULTIPLIER });
    quoteCount += 1;
  });
  return { results };
}
