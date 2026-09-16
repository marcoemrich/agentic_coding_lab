export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<Record<string, unknown> & { op: string }>;
}

export interface ScenarioResult {
  results: Array<Record<string, number>>;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const SEVERE_ENCHANTMENT_LEVEL = 8;
const SEVERE_REIMBURSEMENT_RATE = 0.5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep extends Record<string, unknown> {
  op: string;
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

function itemBasePremium(item: Item): number {
  const premium = BASE_PREMIUMS[item.type];
  if (premium === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return premium;
}

function policyBasePremium(items: Item[]): number {
  const counts = items.reduce<Record<string, number>>((all, item) => {
    all[item.type] = (all[item.type] ?? 0) + 1;
    return all;
  }, {});
  return Object.entries(counts).reduce((total, [type, count]) => {
    const contribution = COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE
      ? COMPONENT_BLOCK_PREMIUM
      : count * itemBasePremium({ type });
    return total + contribution;
  }, 0);
}

function enchantmentSurcharge(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
    ? itemBasePremium(item) * ENCHANTMENT_RATE : 0;
}

function itemRiskSurcharge(items: Item[]): number {
  return items.reduce((total, item) => {
    const curse = item.cursed ? itemBasePremium(item) * CURSE_RATE : 0;
    return total + curse + enchantmentSurcharge(item);
  }, 0);
}

function loyaltyDiscount(base: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
}

function followUpDiscount(base: number, isFollowUp: boolean): number {
  return isFollowUp ? base * FOLLOW_UP_RATE : 0;
}

function quotePremium(
  step: Record<string, unknown>,
  yearsWithMHPCO: number,
  isFollowUp: boolean,
): number {
  if (!Array.isArray(step.items) || step.items.length === 0) return PROCESSING_FEE;
  const items = step.items as Item[];
  const base = policyBasePremium(items);
  return Math.ceil(base + itemRiskSurcharge(items) + base * FIRST_INSURANCE_RATE
    - loyaltyDiscount(base, yearsWithMHPCO) - followUpDiscount(base, isFollowUp)
    + PROCESSING_FEE);
}

function policyCap(items: Item[]): number {
  return items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0)
    * CAP_MULTIPLIER;
}

function damagePayout(damage: Damage, item: Item): number {
  const rate = (item.enchantment ?? 0) >= SEVERE_ENCHANTMENT_LEVEL
    ? SEVERE_REIMBURSEMENT_RATE : 1;
  return Math.max(0, damage.amount * rate - DEDUCTIBLE);
}

function validateDamageAmounts(damages: Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) {
    throw new Error("Damage amount cannot be negative");
  }
}

function validateDamageQuantities(damages: Damage[], items: Item[]): void {
  const types = new Set(damages.map((damage) => damage.itemType));
  for (const type of types) {
    const insured = items.filter((item) => item.type === type).length;
    const damaged = damages.filter((damage) => damage.itemType === type).length;
    if (damaged > insured) throw new Error(`Damage exceeds insured ${type} quantity`);
  }
}

function desiredClaimPayout(damages: Damage[], items: Item[]): number {
  const unmatchedItems = [...items];
  return damages.reduce((total, damage) => {
    const itemIndex = unmatchedItems.findIndex(
      (item) => item.type === damage.itemType,
    );
    const [item] = unmatchedItems.splice(itemIndex, 1);
    return total + damagePayout(damage, item);
  }, 0);
}

function processClaim(
  step: ClaimStep,
  scenario: Scenario,
  remainingCaps: Map<number, number>,
): Record<string, number> {
  const policy = scenario.steps[step.policy];
  const items = policy.items as Item[];
  const remaining = remainingCaps.get(step.policy) ?? policyCap(items);
  validateDamageAmounts(step.incident.damages);
  validateDamageQuantities(step.incident.damages, items);
  const desired = desiredClaimPayout(step.incident.damages, items);
  const payout = Math.floor(Math.min(desired, remaining));
  remainingCaps.set(step.policy, remaining - payout);
  return { payout, remainingCap: remaining - payout };
}

export function processScenario(scenario: Scenario): ScenarioResult {
  const remainingCaps = new Map<number, number>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === "claim") {
        return processClaim(step as ClaimStep, scenario, remainingCaps);
      }
      const hasPriorQuote = scenario.steps.slice(0, index)
        .some((priorStep) => priorStep.op === "quote");
      return { premium: quotePremium(
        step, scenario.customer.yearsWithMHPCO, hasPriorQuote,
      ) };
    }),
  };
}
