export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

interface QuoteStep { op: "quote"; items: Item[] }
interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
type Step = QuoteStep | ClaimStep;
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
export interface ScenarioResult { results: Array<Record<string, number>> }
interface Policy { items: Item[]; remainingCap: number }

const PROCESSING_FEE = 5;
const INITIAL_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const CURSE_RATE = 0.5;
const ENCHANTMENT_RATE = 0.3;
const ENCHANTMENT_PREMIUM_LEVEL = 5;
const ENCHANTMENT_CLAIM_LEVEL = 8;
const HALF = 0.5;
const DEDUCTIBLE = 100;
const COMPONENT_PRICE = 25;
const COMPONENT_BLOCK_PRICE = 60;
const COMPONENT_BLOCK_SIZE = 3;
const CAP_MULTIPLIER = 2;
const LOYALTY_YEARS = 2;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function requireKnownType(type: string): void {
  if (BASE_PREMIUM[type] === undefined) throw new Error(`Unknown item type: ${type}`);
}

function componentBase(items: Item[], type: string): number {
  const count = items.filter((item) => item.type === type).length;
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PRICE : count * COMPONENT_PRICE;
}

function policyBase(items: Item[]): number {
  items.forEach((item) => requireKnownType(item.type));
  const main = items
    .filter((item) => !COMPONENT_TYPES.has(item.type))
    .reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0);
  return main + componentBase(items, "rune") + componentBase(items, "moonstone");
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => {
    const base = BASE_PREMIUM[item.type];
    const curse = item.cursed ? base * CURSE_RATE : 0;
    const enchanted = (item.enchantment ?? 0) >= ENCHANTMENT_PREMIUM_LEVEL;
    return sum + curse + (enchanted ? base * ENCHANTMENT_RATE : 0);
  }, 0);
}

function quotePremium(items: Item[], years: number, previousQuotes: number): number {
  const base = policyBase(items);
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = previousQuotes > 0 ? base * FOLLOW_UP_RATE : 0;
  const raw = base + itemSurcharges(items) + base * INITIAL_RATE - loyalty - followUp;
  return Math.ceil(raw + PROCESSING_FEE);
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
}

function desiredDamagePayout(item: Item, damage: Damage): number {
  if (damage.amount < 0) throw new Error("Damage amount must not be negative");
  const rate = (item.enchantment ?? 0) >= ENCHANTMENT_CLAIM_LEVEL ? HALF : 1;
  return Math.max(0, damage.amount * rate - DEDUCTIBLE);
}

function claim(policy: Policy, damages: Damage[]): Record<string, number> {
  const used = new Map<string, number>();
  const desired = damages.reduce((sum, damage) => {
    requireKnownType(damage.itemType);
    const matches = policy.items.filter((item) => item.type === damage.itemType);
    const index = used.get(damage.itemType) ?? 0;
    if (index >= matches.length) throw new Error(`Item not covered: ${damage.itemType}`);
    used.set(damage.itemType, index + 1);
    return sum + desiredDamagePayout(matches[index], damage);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function executeScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  let previousQuotes = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
      return claim(policy, step.incident.damages);
    }
    const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, previousQuotes);
    policies.set(index, { items: step.items, remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER });
    previousQuotes += 1;
    return { premium };
  });
  return { results };
}
