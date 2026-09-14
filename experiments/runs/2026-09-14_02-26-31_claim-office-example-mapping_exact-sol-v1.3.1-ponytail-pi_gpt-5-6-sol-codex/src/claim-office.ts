export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: string; items?: Item[]; policy?: number; incident?: Incident }>;
};

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type Incident = {
  cause: string;
  damages: Array<{ itemType: string; amount: number }>;
};

type Result = { premium: number } | { payout: number; remainingCap: number };
type Policy = { items: Item[]; remainingCap: number };

const PROCESSING_FEE = 5;
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
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const FOLLOW_UP_RATE = 0.15;
const BLOCK_SIZE = 3;
const BLOCK_SAVING = 15;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const PARTIAL_REIMBURSEMENT_RATE = 0.5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

function policyBase(items: Item[]): number {
  const ordinary = items.reduce((sum, item) => sum + (BASE_PREMIUM[item.type] ?? 0), 0);
  const savings = ["rune", "moonstone"].filter(
    (component) => items.filter(({ type }) => type === component).length === BLOCK_SIZE,
  ).length * BLOCK_SAVING;
  return ordinary - savings;
}

function quotePremium(items: Item[], years: number, followUp: boolean): number {
  if (items.some(({ type }) => BASE_PREMIUM[type] === undefined)) throw new Error("Unknown item type");
  const base = policyBase(items);
  const itemModifier = items.reduce((sum, item) => sum + (BASE_PREMIUM[item.type] ?? 0) *
    ((item.cursed ? CURSE_RATE : 0) + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_RATE : 0)), 0);
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const contractDiscount = followUp ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + itemModifier + base * FIRST_INSURANCE_RATE - loyalty - contractDiscount + PROCESSING_FEE);
}

function processClaim(policy: Policy, incident: Incident): Result {
  if (incident.damages.some(({ amount }) => amount < 0)) throw new Error("Damage amount cannot be negative");
  const types = new Set(incident.damages.map(({ itemType }) => itemType));
  if ([...types].some((type) =>
    incident.damages.filter(({ itemType }) => itemType === type).length >
    policy.items.filter((item) => item.type === type).length)) throw new Error("Damage exceeds insured items");
  const desired = incident.damages.reduce((sum, damage) => {
    const item = policy.items.find(({ type }) => type === damage.itemType);
    const reimbursed = (item?.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
      ? damage.amount * PARTIAL_REIMBURSEMENT_RATE : damage.amount;
    return sum + Math.max(0, reimbursed - DEDUCTIBLE);
  }, 0);
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  return { results: scenario.steps.map((step, index) => {
    if (step.op === "claim") return processClaim(policies.get(step.policy ?? -1)!, step.incident!);
    const items = step.items ?? [];
    policies.set(index, {
      items,
      remainingCap: items.reduce((sum, item) => sum + (INSURANCE_VALUE[item.type] ?? 0), 0) * CAP_MULTIPLIER,
    });
    return { premium: quotePremium(items, scenario.customer.yearsWithMHPCO, quoteCount++ > 0) };
  }) };
}
