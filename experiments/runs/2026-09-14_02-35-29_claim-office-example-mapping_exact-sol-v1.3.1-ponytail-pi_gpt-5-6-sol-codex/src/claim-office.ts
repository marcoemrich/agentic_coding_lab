export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: { itemType: string; amount: number }[] };
};

export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: (QuoteStep | ClaimStep)[];
};

export type Result = { premium: number } | { payout: number; remainingCap: number };

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

const ASSESSED_PERCENT = 110;
const PERCENT = 100;
const PROCESSING_FEE = 5;
const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_SAVING = 15;
const CURSE_PERCENT = 50;
const LOYALTY_YEARS = 2;
const LOYALTY_PERCENT = 20;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_PERCENT = 30;
const FOLLOW_UP_PERCENT = 15;
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT = 8;
const HALF = 2;

type Policy = { items: Item[]; remainingCap: number };

const claimItems = (policy: Policy, damages: ClaimStep["incident"]["damages"]): Item[] => {
  const used: Record<string, number> = {};
  return damages.map(damage => {
    if (damage.amount < 0) throw new Error("Damage amount must not be negative");
    const matches = policy.items.filter(item => item.type === damage.itemType);
    const occurrence = used[damage.itemType] ?? 0;
    const item = matches[occurrence];
    if (!item) throw new Error(`Item is not covered: ${damage.itemType}`);
    used[damage.itemType] = occurrence + 1;
    return item;
  });
};

const quote = (items: Item[], yearsWithMHPCO: number, followUp: boolean): Result => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) throw new Error(`Unknown item type: ${item.type}`);
  }
  let base = items.reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0);
  for (const type of COMPONENT_TYPES) {
    if (items.filter(item => item.type === type).length === BLOCK_SIZE) base -= BLOCK_SAVING;
  }
  const curse = items.reduce(
    (sum, item) => sum + (item.cursed ? BASE_PREMIUM[item.type] * CURSE_PERCENT / PERCENT : 0), 0,
  );
  const enchantment = items.reduce((sum, item) => sum +
    ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? BASE_PREMIUM[item.type] * ENCHANTMENT_PERCENT / PERCENT : 0), 0);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_PERCENT / PERCENT : 0;
  const followUpDiscount = followUp ? base * FOLLOW_UP_PERCENT / PERCENT : 0;
  return { premium: Math.ceil(base * ASSESSED_PERCENT / PERCENT + curse + enchantment - loyalty - followUpDiscount + PROCESSING_FEE) };
};

export const runScenario = (scenario: Scenario): { results: Result[] } => {
  let quoteCount = 0;
  const policies: Record<number, Policy> = {};
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      policies[index] = {
        items: step.items,
        remainingCap: step.items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0) * CAP_MULTIPLIER,
      };
      const result = quote(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
      quoteCount += 1;
      return result;
    }
    const policy = policies[step.policy];
    if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
    const items = claimItems(policy, step.incident.damages);
    const desired = step.incident.damages.reduce((sum, damage, index) => {
      const reimbursed = (items[index].enchantment ?? 0) >= CLAIM_ENCHANTMENT ? damage.amount / HALF : damage.amount;
      return sum + Math.max(0, reimbursed - DEDUCTIBLE);
    }, 0);
    const payout = Math.floor(Math.min(desired, policy.remainingCap));
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
};
