export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}
export interface Customer { yearsWithMHPCO: number }
export interface QuoteStep { op: "quote"; items: Item[] }
export interface Damage { itemType: string; amount: number }
export interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
export interface Scenario { customer: Customer; steps: Array<QuoteStep | ClaimStep> }
export interface QuoteResult { premium: number }
export interface ClaimResult { payout: number; remainingCap: number }
export interface ScenarioResults { results: Array<QuoteResult | ClaimResult> }

const BASE_PREMIUM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const INSURANCE_VALUE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_DISCOUNT = 15;
const INITIAL_DIVISOR = 10;
const CURSE_DIVISOR = 2;
const LOYALTY_YEARS = 2;
const LOYALTY_DIVISOR = 5;
const FOLLOW_UP_PERCENT = 15;
const HIGH_PREMIUM_ENCHANTMENT = 5;
const HIGH_CLAIM_ENCHANTMENT = 8;
const ENCHANTMENT_PERCENT = 30;
const PERCENT = 100;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_RATE = 0.5;

function basePremium(items: Item[]): number {
  const ordinary = items.reduce((total, item) => total + BASE_PREMIUM[item.type], 0);
  const discount = COMPONENT_TYPES.reduce((sum, type) => {
    const count = items.filter((item) => item.type === type).length;
    return sum + (count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_DISCOUNT : 0);
  }, 0);
  return ordinary - discount;
}

function quote(customer: Customer, items: Item[], index: number): QuoteResult {
  const base = basePremium(items);
  const curse = items.reduce((sum, item) => sum + (item.cursed ? BASE_PREMIUM[item.type] / CURSE_DIVISOR : 0), 0);
  const enchanted = items.reduce((sum, item) => sum + ((item.enchantment ?? 0) >= HIGH_PREMIUM_ENCHANTMENT ? BASE_PREMIUM[item.type] * ENCHANTMENT_PERCENT / PERCENT : 0), 0);
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_YEARS ? base / LOYALTY_DIVISOR : 0;
  const followUp = index > 0 ? base * FOLLOW_UP_PERCENT / PERCENT : 0;
  return { premium: Math.ceil(base + curse + enchanted + base / INITIAL_DIVISOR - loyalty - followUp + PROCESSING_FEE) };
}

function desiredPayout(items: Item[], damages: Damage[]): number {
  const available = [...items];
  return damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error("Negative damage amount");
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index < 0) throw new Error("Damage item is not covered by policy");
    const [item] = available.splice(index, 1);
    const rate = (item.enchantment ?? 0) >= HIGH_CLAIM_ENCHANTMENT ? HALF_REIMBURSEMENT_RATE : 1;
    return sum + Math.max(damage.amount * rate - DEDUCTIBLE, 0);
  }, 0);
}

export function runScenario(scenario: Scenario): ScenarioResults {
  const results: Array<QuoteResult | ClaimResult> = [];
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      if (step.items.some((item) => !(item.type in BASE_PREMIUM))) {
        throw new Error("Unknown item type");
      }
      results.push(quote(scenario.customer, step.items, index));
      const insuranceSum = step.items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
      policies.set(index, { items: step.items, remainingCap: insuranceSum * CAP_MULTIPLIER });
      return;
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) throw new Error("Policy does not exist");
    const payout = Math.floor(Math.min(desiredPayout(policy.items, step.incident.damages), policy.remainingCap));
    policy.remainingCap -= payout;
    results.push({ payout, remainingCap: policy.remainingCap });
  });
  return { results };
}
