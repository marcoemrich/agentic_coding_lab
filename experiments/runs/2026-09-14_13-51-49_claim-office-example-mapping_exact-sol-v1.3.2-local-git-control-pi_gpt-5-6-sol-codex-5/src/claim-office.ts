export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep { op: "quote"; items: Item[] }
interface Damage { itemType: string; amount: number }
interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
type Step = QuoteStep | ClaimStep;
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}
type Result = { premium: number } | { payout: number; remainingCap: number };
interface Policy { items: Item[]; remainingCap: number }

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_UNIT_PREMIUM = 25;
const COMPONENT_BLOCK_SAVING = COMPONENT_UNIT_PREMIUM * COMPONENT_BLOCK_SIZE - COMPONENT_BLOCK_PREMIUM;
const COMPONENT_TYPES = ["rune", "moonstone"];
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const CAP_MULTIPLIER = 2;
const BASE_PREMIUM: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40,
  rune: COMPONENT_UNIT_PREMIUM, moonstone: COMPONENT_UNIT_PREMIUM,
};
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400,
  rune: 250, moonstone: 250,
};

function validateItems(items: Item[]): void {
  items.forEach((item) => {
    if (BASE_PREMIUM[item.type] === undefined) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  });
}

function basePremium(items: Item[]): number {
  const ordinary = items.reduce((total, item) => total + BASE_PREMIUM[item.type], 0);
  return COMPONENT_TYPES.reduce((total, type) => {
    const count = items.filter((item) => item.type === type).length;
    return count === COMPONENT_BLOCK_SIZE ? total - COMPONENT_BLOCK_SAVING : total;
  }, ordinary);
}

function quote(items: Item[], years: number, isFollowUp: boolean): number {
  validateItems(items);
  const base = basePremium(items);
  const curse = items.reduce((sum, item) => sum + (item.cursed ? BASE_PREMIUM[item.type] * CURSE_RATE : 0), 0);
  const enchanted = items.reduce((sum, item) => sum + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? BASE_PREMIUM[item.type] * HIGH_ENCHANTMENT_RATE : 0), 0);
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = isFollowUp ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + curse + enchanted + base * INITIAL_ASSESSMENT_RATE - loyalty - followUp + PROCESSING_FEE);
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function reimbursableDamage(damage: Damage, item: Item): number {
  const rate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_REIMBURSEMENT : 1;
  return Math.max(0, damage.amount * rate - DEDUCTIBLE);
}

function desiredPayout(damages: Damage[], policy: Policy): number {
  const available = [...policy.items];
  return damages.reduce((sum, damage) => {
    if (damage.amount < 0) {
      throw new Error("Negative damage amount is invalid");
    }
    const itemIndex = available.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) {
      throw new Error("Damage item is not insured or there are more damage entries than insured items");
    }
    const [item] = available.splice(itemIndex, 1);
    return sum + reimbursableDamage(damage, item);
  }, 0);
}

function processClaim(step: ClaimStep, policy: Policy): Result {
  const desired = desiredPayout(step.incident.damages, policy);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push({ premium: quote(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
      policies.set(index, createPolicy(step.items));
      quoteCount += 1;
    } else {
      results.push(processClaim(step, policies.get(step.policy)!));
    }
  });
  return { results };
}
