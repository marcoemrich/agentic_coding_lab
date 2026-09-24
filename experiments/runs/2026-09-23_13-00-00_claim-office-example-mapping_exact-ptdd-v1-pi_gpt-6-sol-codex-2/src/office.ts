export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}
export interface Damage { itemType: string; amount: number }
export type Step = { op: "quote"; items: Item[] } | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
export type Result = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const PERCENT = 100;
const FIRST_INSURANCE_PERCENT = 10;
const CURSE_PERCENT = 50;
const ENCHANTMENT_PERCENT = 30;
const LOYALTY_PERCENT = 20;
const FOLLOW_UP_PERCENT = 15;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 2;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};

function basePremium(item: Item): number {
  const premium = BASE_PREMIUMS[item.type];
  if (premium === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return premium;
}

function isComponent(item: Item): boolean {
  return item.type === "rune" || item.type === "moonstone";
}

function componentBlockReduction(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items.filter(isComponent)) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return [...counts].reduce((discount, [type, count]) =>
    discount + (count === COMPONENT_BLOCK_SIZE
      ? count * BASE_PREMIUMS[type] - COMPONENT_BLOCK_PREMIUM : 0), 0);
}

function itemRiskSurcharge(item: Item): number {
  const percent = (item.cursed ? CURSE_PERCENT : 0)
    + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? ENCHANTMENT_PERCENT : 0);
  return basePremium(item) * percent / PERCENT;
}

function contractModifierPercent(years: number, previousQuotes: number): number {
  return FIRST_INSURANCE_PERCENT
    - (years >= LOYALTY_YEARS ? LOYALTY_PERCENT : 0)
    - (previousQuotes > 0 ? FOLLOW_UP_PERCENT : 0);
}

function quotePremium(items: Item[], years: number, previousQuotes: number): number {
  const base = items.reduce((sum, item) => sum + basePremium(item), 0);
  const risk = items.reduce((sum, item) => sum + itemRiskSurcharge(item), 0);
  const policyBase = base - componentBlockReduction(items);
  const modifiers = policyBase * contractModifierPercent(years, previousQuotes) / PERCENT;
  return Math.ceil(policyBase + risk + modifiers + PROCESSING_FEE);
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
}

function reimbursableDamage(item: Item | undefined, amount: number): number {
  return (item?.enchantment ?? 0) >= CLAIM_ENCHANTMENT
    ? amount / HIGH_ENCHANTMENT_REIMBURSEMENT : amount;
}

function damageEventPayout(item: Item, amount: number): number {
  return Math.max(0, reimbursableDamage(item, amount) - DEDUCTIBLE);
}

function settleClaim(step: Extract<Step, { op: "claim" }>, steps: Step[], remaining: number): { payout: number; remainingCap: number } {
  const policy = steps[step.policy];
  if (policy?.op !== "quote") throw new Error("Claim must reference an earlier quote");
  const available = [...policy.items];
  const payout = step.incident.damages.reduce((total, damage) => {
    if (damage.amount < 0) throw new Error("Negative damage amount");
    const index = available.findIndex(item => item.type === damage.itemType);
    if (index < 0) throw new Error(`Uninsured damage item: ${damage.itemType}`);
    const [item] = available.splice(index, 1);
    return total + damageEventPayout(item, damage.amount);
  }, 0);
  const paid = Math.floor(Math.min(payout, remaining));
  return { payout: paid, remainingCap: remaining - paid };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  let previousQuotes = 0;
  const caps = new Map<number, number>();
  for (const [index, step] of scenario.steps.entries()) {
    if (step.op === "quote") {
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, previousQuotes) });
      previousQuotes += 1;
      caps.set(index, insuranceSum(step.items) * CAP_MULTIPLIER);
    } else {
      const remaining = caps.get(step.policy);
      if (remaining === undefined) throw new Error("Claim must reference an earlier quote");
      const result = settleClaim(step, scenario.steps, remaining);
      caps.set(step.policy, result.remainingCap);
      results.push(result);
    }
  }
  return { results };
}
