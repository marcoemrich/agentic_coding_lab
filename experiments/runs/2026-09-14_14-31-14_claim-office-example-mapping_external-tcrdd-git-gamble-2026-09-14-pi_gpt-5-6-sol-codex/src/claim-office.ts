export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: string; items?: Item[]; policy?: number; incident?: Incident }>;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Incident {
  cause: string;
  damages: Array<{ itemType: string; amount: number }>;
}

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = ['rune', 'moonstone'];
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const TWENTIETHS = 20;
const CURSE_TWENTIETHS = 10;
const ENCHANTMENT_TWENTIETHS = 6;
const LOYALTY_TWENTIETHS = 4;
const INITIAL_TWENTIETHS = 2;
const FOLLOW_UP_TWENTIETHS = 3;
const PROCESSING_FEE_TWENTIETHS = 100;
const LOYALTY_YEARS = 2;
const PREMIUM_ENCHANTMENT_THRESHOLD = 5;

function basePremium(items: Item[]): number {
  const mainItems = items.reduce((sum, item) => sum + (BASE_PREMIUM[item.type] ?? 0), 0);
  const components = COMPONENT_TYPES.reduce((sum, type) => {
    const count = items.filter(item => item.type === type).length;
    return sum + (count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_PREMIUM);
  }, 0);
  return mainItems + components;
}

const ITEM_TYPES = new Set([...Object.keys(BASE_PREMIUM), ...COMPONENT_TYPES]);

function quotePremium(items: Item[], yearsWithMHPCO: number, previousContracts: number): number {
  for (const item of items) {
    if (!ITEM_TYPES.has(item.type)) throw new Error(`Unknown item type: ${item.type}`);
  }
  const base = basePremium(items);
  const itemRiskTwentieths = items.reduce((sum, item) => {
    const itemBase = BASE_PREMIUM[item.type] ?? COMPONENT_PREMIUM;
    return sum + (item.cursed ? itemBase * CURSE_TWENTIETHS : 0)
      + ((item.enchantment ?? 0) >= PREMIUM_ENCHANTMENT_THRESHOLD
        ? itemBase * ENCHANTMENT_TWENTIETHS : 0);
  }, 0);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? -base * LOYALTY_TWENTIETHS : 0;
  const followUp = previousContracts > 0 ? -base * FOLLOW_UP_TWENTIETHS : 0;
  const total = base * TWENTIETHS + itemRiskTwentieths + loyalty
    + base * INITIAL_TWENTIETHS + followUp + PROCESSING_FEE_TWENTIETHS;
  return Math.ceil(total / TWENTIETHS);
}

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

interface PolicyState {
  items: Item[];
  remainingCap: number;
}

const POLICY_CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_DIVISOR = 2;
const DEDUCTIBLE = 100;

function processClaim(policy: PolicyState, incident?: Incident): { payout: number; remainingCap: number } {
  const usedByType = new Map<string, number>();
  const desiredFractional = (incident?.damages ?? []).reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error('Negative damage amount');
    const occurrence = usedByType.get(damage.itemType) ?? 0;
    const item = policy.items.filter(candidate => candidate.type === damage.itemType)[occurrence];
    if (!item) throw new Error(`Damaged item is not covered: ${damage.itemType}`);
    usedByType.set(damage.itemType, occurrence + 1);
    const reimbursement = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? damage.amount / HIGH_ENCHANTMENT_DIVISOR : damage.amount;
    return sum + Math.max(0, reimbursement - DEDUCTIBLE);
  }, 0);
  const payout = Math.min(Math.floor(desiredFractional), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export type Result =
  | { premium: number; payout?: never; remainingCap?: never }
  | { premium?: never; payout: number; remainingCap: number };

export function processScenario(scenario: Scenario): { results: Result[] } {
  let quoteCount = 0;
  const policies = new Map<number, PolicyState>();
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === 'quote') {
      const items = step.items ?? [];
      const premium = quotePremium(items, scenario.customer.yearsWithMHPCO, quoteCount);
      const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
      policies.set(stepIndex, { items, remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER });
      quoteCount += 1;
      return { premium };
    }

    const policy = policies.get(step.policy ?? -1);
    if (!policy) throw new Error('Claim does not reference a quote policy');
    return processClaim(policy, step.incident);
  });
  return { results };
}
