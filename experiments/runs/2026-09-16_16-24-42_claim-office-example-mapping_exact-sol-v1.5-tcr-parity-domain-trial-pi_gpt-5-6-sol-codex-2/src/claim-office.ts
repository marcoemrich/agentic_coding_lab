export interface Customer { yearsWithMHPCO: number }
export interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
export interface Damage { itemType: string; amount: number }
export interface Incident { cause: string; damages: Damage[] }
export interface Step { op: string; items?: Item[]; policy?: number; incident?: Incident }
export interface Scenario { customer: Customer; steps: Step[] }
export type Result = { premium: number } | { payout: number; remainingCap: number };

interface Policy { items: Item[]; remainingCap: number }

const BASE_PREMIUM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const INSURANCE_VALUE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;
const FIRST_RATE = 0.1;
const CURSE_RATE = 0.5;
const ENCHANTED_RATE = 0.3;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const LOYALTY_YEARS = 2;
const PREMIUM_ENCHANTMENT = 5;
const CLAIM_ENCHANTMENT = 8;
const HALF_RATE = 0.5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

function assertKnown(type: string): void {
  if (BASE_PREMIUM[type] === undefined) throw new Error(`Unknown item type: ${type}`);
}

function basePremium(items: Item[]): number {
  const ordinary = items.reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0);
  return COMPONENT_TYPES.reduce((total, type) => {
    const count = items.filter((item) => item.type === type).length;
    return count === BLOCK_SIZE ? total - count * BASE_PREMIUM[type] + BLOCK_PREMIUM : total;
  }, ordinary);
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => {
    const price = BASE_PREMIUM[item.type];
    const curse = item.cursed ? price * CURSE_RATE : 0;
    const enchanted = (item.enchantment ?? 0) >= PREMIUM_ENCHANTMENT ? price * ENCHANTED_RATE : 0;
    return sum + curse + enchanted;
  }, 0);
}

function quotePremium(items: Item[], customer: Customer, quoteIndex: number): number {
  items.forEach((item) => assertKnown(item.type));
  const base = basePremium(items);
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = quoteIndex > 0 ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + itemSurcharges(items) + base * FIRST_RATE - loyalty - followUp + PROCESSING_FEE);
}

function insuranceCap(items: Item[]): number {
  return CAP_MULTIPLIER * items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
}

function desiredPayout(policy: Policy, incident: Incident): number {
  const available = new Map<string, Item[]>();
  policy.items.forEach((item) => available.set(item.type, [...(available.get(item.type) ?? []), item]));
  return incident.damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error("Damage amount must not be negative");
    assertKnown(damage.itemType);
    const item = available.get(damage.itemType)?.shift();
    if (!item) throw new Error(`Damaged item is not covered: ${damage.itemType}`);
    const rate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT ? HALF_RATE : 1;
    return sum + Math.max(0, damage.amount * rate - DEDUCTIBLE);
  }, 0);
}

function settleClaim(policy: Policy, incident: Incident): Result {
  const payout = Math.floor(Math.min(desiredPayout(policy, incident), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let quoteIndex = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      const items = step.items ?? [];
      const premium = quotePremium(items, scenario.customer, quoteIndex++);
      policies.set(stepIndex, { items, remainingCap: insuranceCap(items) });
      results.push({ premium });
      return;
    }
    const policy = policies.get(step.policy ?? -1);
    if (!policy || !step.incident) throw new Error("Claim references no prior policy");
    results.push(settleClaim(policy, step.incident));
  });
  return { results };
}
