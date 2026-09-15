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

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_PREMIUM_LEVEL = 5;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const CAP_MULTIPLIER = 2;
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function basePremiumFor(items: Item[]): number {
  for (const item of items) {
    if (BASE_PREMIUM[item.type] === undefined) throw new Error(`Unknown item type: ${item.type}`);
  }
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return [...counts].reduce((sum, [type, count]) => {
    const premium = COMPONENT_TYPES.has(type) && count === BLOCK_SIZE ? BLOCK_PREMIUM : BASE_PREMIUM[type] * count;
    return sum + premium;
  }, 0);
}

function riskSurchargeFor(item: Item): number {
  const curse = item.cursed ? BASE_PREMIUM[item.type] * CURSE_RATE : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_LEVEL
    ? BASE_PREMIUM[item.type] * HIGH_ENCHANTMENT_RATE : 0;
  return curse + enchantment;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, previousContracts = 0): number {
  const basePremium = basePremiumFor(items);
  const itemSurcharges = items.reduce((sum, item) => sum + riskSurchargeFor(item), 0);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
  const followUpDiscount = previousContracts > 0 ? basePremium * FOLLOW_UP_RATE : 0;
  return Math.ceil(basePremium + itemSurcharges + basePremium * INITIAL_ASSESSMENT_RATE
    - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

interface PolicyState {
  items: Item[];
  remainingCap: number;
}

function reimbursementFor(item: Item | undefined, amount: number): number {
  const rate = (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL ? HIGH_ENCHANTMENT_REIMBURSEMENT : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}

function processClaim(policy: PolicyState, damages: Damage[]): Result {
  const availableItems = [...policy.items];
  const desired = damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    const itemIndex = availableItems.findIndex((covered) => covered.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Damage is not covered: ${damage.itemType}`);
    const [item] = availableItems.splice(itemIndex, 1);
    return sum + reimbursementFor(item, damage.amount);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  let contracts = 0;
  const policies = new Map<number, PolicyState>();
  const results: Result[] = [];
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, contracts++);
      const insuranceSum = step.items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
      policies.set(index, { items: step.items, remainingCap: insuranceSum * CAP_MULTIPLIER });
      results.push({ premium });
      return;
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
    results.push(processClaim(policy, step.incident.damages));
  });
  return { results };
}
