export interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
interface Damage { itemType: string; amount: number }
interface QuoteStep { op: "quote"; items: Item[] }
interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
type Step = QuoteStep | ClaimStep;
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
type Result = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const INITIAL_RATE = 0.1;
const CURSE_RATE = 0.5;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT = 5;
const CLAIM_ENCHANTMENT = 8;
const ENCHANTMENT_RATE = 0.3;
const DEDUCTIBLE = 100;
const BLOCK_SIZE = 3;
const BLOCK_SAVINGS = 15;
const CAP_MULTIPLIER = 2;
const ITEM_PREMIUMS: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const ITEM_VALUES: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const COMPONENT_TYPES = ["rune", "moonstone"];

function quoteBase(items: Item[]): number {
  const ordinaryBase = items.reduce((sum, item) => sum + (ITEM_PREMIUMS[item.type] ?? 0), 0);
  const blocks = COMPONENT_TYPES.filter((type) => items.filter((item) => item.type === type).length === BLOCK_SIZE).length;
  return ordinaryBase - blocks * BLOCK_SAVINGS;
}

function premium(items: Item[], years: number, followUp: boolean): number {
  items.forEach((item) => {
    if (!(item.type in ITEM_PREMIUMS)) throw new Error(`Unknown item type: ${item.type}`);
  });
  const base = quoteBase(items);
  const curse = items.reduce((sum, item) => sum + (item.cursed ? (ITEM_PREMIUMS[item.type] ?? 0) * CURSE_RATE : 0), 0);
  const enchanted = items.reduce((sum, item) => sum + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? (ITEM_PREMIUMS[item.type] ?? 0) * ENCHANTMENT_RATE : 0), 0);
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const contractDiscount = followUp ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + curse + enchanted + base * INITIAL_RATE - loyalty - contractDiscount + PROCESSING_FEE);
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + (ITEM_VALUES[item.type] ?? 0), 0);
}

function desiredPayout(items: Item[], damages: Damage[]): number {
  const available = [...items];
  return damages.reduce((total, damage) => {
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index < 0) throw new Error(`Damage item ${damage.itemType} is not covered by policy`);
    if (damage.amount < 0) throw new Error("Damage amount must not be negative");
    const [item] = available.splice(index, 1);
    const reimbursed = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT ? damage.amount * CURSE_RATE : damage.amount;
    return total + Math.max(0, reimbursed - DEDUCTIBLE);
  }, 0);
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const remainingCaps = new Map<number, number>();
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push({ premium: premium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
      quoteCount += 1;
      remainingCaps.set(index, insuranceSum(step.items) * CAP_MULTIPLIER);
      return;
    }
    const policy = scenario.steps[step.policy];
    if (!policy || policy.op !== "quote" || step.policy >= index) throw new Error("Claim policy must reference an earlier quote");
    const remaining = remainingCaps.get(step.policy) ?? 0;
    const payout = Math.floor(Math.min(desiredPayout(policy.items, step.incident.damages), remaining));
    results.push({ payout, remainingCap: remaining - payout });
    remainingCaps.set(step.policy, remaining - payout);
  });
  return { results };
}
