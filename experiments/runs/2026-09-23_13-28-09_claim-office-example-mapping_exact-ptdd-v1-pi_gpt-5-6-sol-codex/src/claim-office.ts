const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT = 5;
const CLAIM_ENCHANTMENT = 8;
const DEDUCTIBLE = 100;
const HALF = 0.5;
const CAP_MULTIPLIER = 2;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const BASE_PREMIUM: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}
export interface QuoteStep { op: "quote"; items: Item[] }
export interface Damage { itemType: string; amount: number }
export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}
export type Result = { premium: number } | { payout: number; remainingCap: number };

function requireKnownType(type: string): void {
  if (BASE_PREMIUM[type] === undefined) throw new Error(`Unknown item type: ${type}`);
}

function componentPremium(items: Item[], type: string): number {
  const count = items.filter((item) => item.type === type).length;
  return count === BLOCK_SIZE ? BLOCK_PREMIUM : count * BASE_PREMIUM[type];
}

function policyBasePremium(items: Item[]): number {
  items.forEach((item) => requireKnownType(item.type));
  const main = items.filter((item) => !COMPONENT_TYPES.has(item.type))
    .reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0);
  return main + componentPremium(items, "rune") + componentPremium(items, "moonstone");
}

function itemRiskPremium(items: Item[]): number {
  return items.reduce((sum, item) => {
    const base = BASE_PREMIUM[item.type];
    const curse = item.cursed ? base * CURSE_RATE : 0;
    const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? base * HIGH_ENCHANTMENT_RATE : 0;
    return sum + curse + enchantment;
  }, 0);
}

function quotePremium(items: Item[], years: number, previousQuotes: number): number {
  const base = policyBasePremium(items);
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = previousQuotes > 0 ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + itemRiskPremium(items) + base * FIRST_INSURANCE_RATE - loyalty - followUp + PROCESSING_FEE);
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
}

function matchDamages(items: Item[], damages: Damage[]): Item[] {
  const available = [...items];
  return damages.map((damage) => {
    if (damage.amount < 0) throw new Error("Damage amount must not be negative");
    requireKnownType(damage.itemType);
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index < 0) throw new Error(`Item is not covered: ${damage.itemType}`);
    return available.splice(index, 1)[0];
  });
}

function desiredPayout(items: Item[], damages: Damage[]): number {
  const matched = matchDamages(items, damages);
  return damages.reduce((sum, damage, index) => {
    const enchanted = (matched[index].enchantment ?? 0) >= CLAIM_ENCHANTMENT;
    const reimbursable = damage.amount * (enchanted ? HALF : 1);
    return sum + Math.max(0, reimbursable - DEDUCTIBLE);
  }, 0);
}

export function executeScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount);
      policies.set(index, { items: step.items, remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER });
      results.push({ premium });
      quoteCount += 1;
    } else {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error("Claim policy must reference an earlier quote");
      const payout = Math.floor(Math.min(desiredPayout(policy.items, step.incident.damages), policy.remainingCap));
      policy.remainingCap -= payout;
      results.push({ payout, remainingCap: policy.remainingCap });
    }
  });
  return { results };
}
