interface Item {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
}

const BASE_PREMIUMS: Record<string, number> = {
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

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];

function componentPremium(items: Item[], type: string): number {
  const count = items.filter((item) => item.type === type).length;
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * BASE_PREMIUMS[type];
}

export function basePremium(items: Item[]): number {
  const mainItems = items.filter(({ type }) => !COMPONENT_TYPES.includes(type));
  const mainPremium = mainItems.reduce((total, item) => total + BASE_PREMIUMS[item.type], 0);
  return COMPONENT_TYPES.reduce((total, type) => total + componentPremium(items, type), mainPremium);
}

export function insuranceValue(items: Item[]): number {
  return items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0);
}

function validateItems(items: Item[]): void {
  const unknown = items.find(({ type }) => BASE_PREMIUMS[type] === undefined);
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
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

const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;
const PROCESSING_FEE = 5;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

function curseSurcharge(item: Item): number {
  return item.cursed ? BASE_PREMIUMS[item.type] * CURSE_RATE : 0;
}

function enchantmentSurcharge(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
    ? BASE_PREMIUMS[item.type] * HIGH_ENCHANTMENT_RATE : 0;
}

function itemRiskSurcharge(items: Item[]): number {
  return items.reduce(
    (total, item) => total + curseSurcharge(item) + enchantmentSurcharge(item),
    0,
  );
}

function loyaltyDiscount(base: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
}

export function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

function initialAssessment(base: number): number {
  return base * INITIAL_ASSESSMENT_RATE;
}

function followUpDiscount(base: number, isFollowUp: boolean): number {
  return isFollowUp ? base * FOLLOW_UP_RATE : 0;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const base = basePremium(items);
  return roundPremium(
    base + itemRiskSurcharge(items) + initialAssessment(base)
      - loyaltyDiscount(base, yearsWithMHPCO) - followUpDiscount(base, isFollowUp)
      + PROCESSING_FEE,
  );
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

type Result = { premium: number } | { payout: number; remainingCap: number };

function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? HIGH_ENCHANTMENT_REIMBURSEMENT : 1;
}

function damagePayout(item: Item, amount: number): number {
  return Math.max(0, amount * reimbursementRate(item) - DEDUCTIBLE);
}

function validateDamageAmounts(damages: Damage[]): void {
  if (damages.some(({ amount }) => amount < 0)) {
    throw new Error("Damage amount cannot be negative");
  }
}

function damagedItems(policy: Policy, damages: Damage[]): Item[] {
  const available = [...policy.items];
  return damages.map(({ itemType }) => {
    const index = available.findIndex(({ type }) => type === itemType);
    if (index < 0) throw new Error(`Damage item ${itemType} is not insured or exceeds insured quantity`);
    return available.splice(index, 1)[0];
  });
}

export function roundPayout(amount: number): number {
  return Math.floor(amount);
}

function claimResult(policy: Policy, damages: Damage[]): Result {
  validateDamageAmounts(damages);
  const items = damagedItems(policy, damages);
  const desired = damages.reduce(
    (total, damage, index) => total + damagePayout(items[index], damage.amount),
    0,
  );
  const payout = Math.min(roundPayout(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      validateItems(step.items);
      policies.set(index, { items: step.items, remainingCap: insuranceValue(step.items) * CAP_MULTIPLIER });
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
      quoteCount += 1;
    } else {
      results.push(claimResult(policies.get(step.policy) as Policy, step.incident.damages));
    }
  });
  return { results };
}
