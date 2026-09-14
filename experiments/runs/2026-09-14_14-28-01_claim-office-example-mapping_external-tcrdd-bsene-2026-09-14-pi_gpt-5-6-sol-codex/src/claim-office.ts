export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: 'quote'; items: Item[] } | ClaimStep>;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Array<{ itemType: string; amount: number }> };
}

export interface ScenarioResult {
  results: Array<{ premium: number } | { payout: number; remainingCap: number }>;
}

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_DISCOUNT = 15;
const CURSE_DIVISOR = 2;
const HIGH_PREMIUM_LEVEL = 5;
const HIGH_PREMIUM_NUMERATOR = 3;
const PERCENT_DENOMINATOR = 100;
const TENTHS_DENOMINATOR = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_DIVISOR = 5;
const FOLLOW_UP_PERCENT = 15;
const PROCESSING_FEE = 5;
const POLICY_CAP_MULTIPLIER = 2;
const HIGH_CLAIM_LEVEL = 8;
const CLAIM_REIMBURSEMENT_DIVISOR = 2;
const DEDUCTIBLE = 100;

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

function componentBlockDiscount(items: Item[]): number {
  const runeCount = items.filter((item) => item.type === 'rune').length;
  const moonstoneCount = items.filter((item) => item.type === 'moonstone').length;
  const runeDiscount = runeCount === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_DISCOUNT : 0;
  const moonstoneDiscount = moonstoneCount === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_DISCOUNT : 0;
  return runeDiscount + moonstoneDiscount;
}

function quotePremium(items: Item[], years: number, quoteIndex: number): number {
  const unknown = items.find((item) => BASE_PREMIUM[item.type] === undefined);
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
  const listed = items.reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0);
  const base = listed - componentBlockDiscount(items);
  const curse = items
    .filter((item) => item.cursed)
    .reduce((sum, item) => sum + BASE_PREMIUM[item.type] / CURSE_DIVISOR, 0);
  const enchantment = items
    .filter((item) => (item.enchantment ?? 0) >= HIGH_PREMIUM_LEVEL)
    .reduce((sum, item) => sum + (BASE_PREMIUM[item.type] * HIGH_PREMIUM_NUMERATOR) / TENTHS_DENOMINATOR, 0);
  const loyalty = years >= LOYALTY_YEARS ? base / LOYALTY_DIVISOR : 0;
  const followUp = quoteIndex > 0 ? (base * FOLLOW_UP_PERCENT) / PERCENT_DENOMINATOR : 0;
  return Math.ceil(base + base / TENTHS_DENOMINATOR + curse + enchantment - loyalty - followUp + PROCESSING_FEE);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

export function processScenario(scenario: Scenario): ScenarioResult {
  let quoteIndex = 0;
  const policies = new Map<number, Policy>();
  const results: ScenarioResult['results'] = [];
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteIndex++);
      const sum = step.items.reduce((total, item) => total + INSURANCE_VALUE[item.type], 0);
      policies.set(stepIndex, { items: step.items, remainingCap: sum * POLICY_CAP_MULTIPLIER });
      results.push({ premium });
      return;
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
    const available = [...policy.items];
    const desired = step.incident.damages.reduce((total, damage) => {
      if (damage.amount < 0) throw new Error('Damage amount cannot be negative');
      const itemIndex = available.findIndex((candidate) => candidate.type === damage.itemType);
      if (itemIndex < 0) throw new Error(`Item not covered by policy: ${damage.itemType}`);
      const [item] = available.splice(itemIndex, 1);
      const isHighlyEnchanted = (item.enchantment ?? 0) >= HIGH_CLAIM_LEVEL;
      const reimbursable = isHighlyEnchanted ? damage.amount / CLAIM_REIMBURSEMENT_DIVISOR : damage.amount;
      return total + Math.max(0, reimbursable - DEDUCTIBLE);
    }, 0);
    const payout = Math.floor(Math.min(desired, policy.remainingCap));
    policy.remainingCap -= payout;
    results.push({ payout, remainingCap: policy.remainingCap });
  });
  return { results };
}
