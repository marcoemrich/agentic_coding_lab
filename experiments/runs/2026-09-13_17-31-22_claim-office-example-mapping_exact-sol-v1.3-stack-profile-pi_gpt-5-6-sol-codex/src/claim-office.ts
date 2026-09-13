export interface ItemInput {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep { op: "quote"; items: ItemInput[] }
interface Damage { itemType: string; amount: number }
interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

type Result = { premium: number } | { payout: number; remainingCap: number };

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const ENCHANTMENT_RATE = 0.3;
const ENCHANTMENT_PREMIUM_THRESHOLD = 5;
const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

function componentBase(items: ItemInput[], type: string): number {
  const count = items.filter((item) => item.type === type).length;
  return count === BLOCK_SIZE ? BLOCK_PREMIUM : count * BASE_PREMIUM[type];
}

function premium(items: ItemInput[], yearsWithMHPCO: number, previousContracts: number): number {
  for (const item of items) {
    if (BASE_PREMIUM[item.type] === undefined) throw new Error(`Unknown item type: ${item.type}`);
  }
  const mainBase = items
    .filter((item) => item.type !== "rune" && item.type !== "moonstone")
    .reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0);
  const base = mainBase + componentBase(items, "rune") + componentBase(items, "moonstone");
  const curse = items
    .filter((item) => item.cursed === true)
    .reduce((sum, item) => sum + BASE_PREMIUM[item.type] * CURSE_RATE, 0);
  const enchantment = items
    .filter((item) => (item.enchantment ?? 0) >= ENCHANTMENT_PREMIUM_THRESHOLD)
    .reduce((sum, item) => sum + BASE_PREMIUM[item.type] * ENCHANTMENT_RATE, 0);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = previousContracts > 0 ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + curse + enchantment + base * ASSESSMENT_RATE - loyalty - followUp + PROCESSING_FEE);
}

interface Policy { items: ItemInput[]; remainingCap: number }

function createPolicy(items: ItemInput[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function processClaim(step: ClaimStep, policy: Policy): Result {
  const availableItems = [...policy.items];
  const desired = step.incident.damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error("Negative damage amount is invalid");
    const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Damaged item not covered: ${damage.itemType}`);
    const [item] = availableItems.splice(itemIndex, 1);
    const rate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD
      ? HIGH_ENCHANTMENT_REIMBURSEMENT
      : 1;
    return sum + Math.max(0, damage.amount * rate - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function executeScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push({ premium: premium(step.items, scenario.customer.yearsWithMHPCO, quoteCount) });
      policies.set(index, createPolicy(step.items));
      quoteCount += 1;
    } else {
      results.push(processClaim(step, policies.get(step.policy)!));
    }
  });
  return { results };
}
