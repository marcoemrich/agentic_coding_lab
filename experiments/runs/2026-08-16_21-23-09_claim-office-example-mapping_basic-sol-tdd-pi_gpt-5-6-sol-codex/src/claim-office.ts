export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}
interface Damage { itemType: string; amount: number }
interface QuoteStep { op: "quote"; items: Item[] }
interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}
export type OperationResult = { premium: number } | { payout: number; remainingCap: number };

const BASE_PREMIUM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const INSURANCE_VALUE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const INITIAL_ASSESSMENT_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const ENCHANTED_REIMBURSEMENT_RATE = 0.5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

function calculateBasePremium(items: Item[]): number {
  const counts = items.reduce<Record<string, number>>((result, item) => {
    result[item.type] = (result[item.type] ?? 0) + 1;
    return result;
  }, {});
  return Object.entries(counts).reduce((total, [type, count]) => {
    if (COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE) return total + COMPONENT_BLOCK_PREMIUM;
    return total + requireValue(BASE_PREMIUM, type) * count;
  }, 0);
}

function requireValue(table: Record<string, number>, type: string): number {
  const value = table[type];
  if (value === undefined) throw new Error(`Unknown item type: ${type}`);
  return value;
}

function itemSurcharge(item: Item): number {
  const itemBase = requireValue(BASE_PREMIUM, item.type);
  const curse = item.cursed ? itemBase * CURSE_SURCHARGE_RATE : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curse + enchantment;
}

function calculatePremium(items: Item[], yearsWithMHPCO: number, quoteIndex: number): number {
  const basePremium = calculateBasePremium(items);
  const itemSurcharges = items.reduce((total, item) => total + itemSurcharge(item), 0);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUp = quoteIndex > 0 ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(basePremium + itemSurcharges + basePremium * INITIAL_ASSESSMENT_RATE
    - loyalty - followUp + PROCESSING_FEE);
}

interface Policy { items: Item[]; remainingCap: number }
function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((total, item) => total + requireValue(INSURANCE_VALUE, item.type), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function processClaim(step: ClaimStep, policy: Policy): { payout: number; remainingCap: number } {
  const available = [...policy.items];
  const desired = step.incident.damages.reduce((total, damage) => {
    if (damage.amount < 0) throw new Error("Damage amount must not be negative");
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index < 0) throw new Error(`Damaged item is not insured: ${damage.itemType}`);
    const [item] = available.splice(index, 1);
    const reimbursed = (item?.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD
      ? damage.amount * ENCHANTED_REIMBURSEMENT_RATE
      : damage.amount;
    return total + Math.max(0, reimbursed - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: OperationResult[] } {
  const policies = new Map<number, Policy>();
  const results: OperationResult[] = [];
  let quoteIndex = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      results.push({ premium: calculatePremium(step.items, scenario.customer.yearsWithMHPCO, quoteIndex) });
      policies.set(stepIndex, createPolicy(step.items));
      quoteIndex += 1;
    } else {
      const policy = policies.get(step.policy);
      if (policy === undefined) throw new Error(`Unknown policy: ${String(step.policy)}`);
      results.push(processClaim(step, policy));
    }
  });
  return { results };
}
