export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

export class ScenarioError extends Error {}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

const MAIN_ITEMS: Record<string, { value: number; basePremium: number }> = {
  sword: { value: 1000, basePremium: 100 },
  amulet: { value: 600, basePremium: 60 },
  staff: { value: 800, basePremium: 80 },
  potion: { value: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
}

// Amounts are kept in hundredths of a G (exact integers) until final rounding.
function itemBasePremium(item: Item, counts: Map<string, number>): number {
  if (COMPONENT_TYPES.has(item.type)) {
    return counts.get(item.type) === BLOCK_SIZE
      ? (BLOCK_BASE_PREMIUM * 100) / BLOCK_SIZE
      : COMPONENT_BASE_PREMIUM * 100;
  }
  return MAIN_ITEMS[item.type].basePremium * 100;
}

interface QuoteContext {
  yearsWithMHPCO: number;
  isFollowUpContract: boolean;
}

function assertKnownItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!COMPONENT_TYPES.has(item.type) && !Object.hasOwn(MAIN_ITEMS, item.type)) {
      throw new ScenarioError(`Unknown item type: ${item.type}`);
    }
  }
}

function quotePremium(items: Item[], context: QuoteContext): number {
  assertKnownItemTypes(items);
  const counts = countByType(items);
  let policyBase = 0;
  let itemSurcharges = 0;
  for (const item of items) {
    const base = itemBasePremium(item, counts);
    policyBase += base;
    if (item.cursed) itemSurcharges += (base * CURSE_SURCHARGE_PERCENT) / 100;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      itemSurcharges += (base * HIGH_ENCHANTMENT_SURCHARGE_PERCENT) / 100;
    }
  }
  let policyModifierPercent = FIRST_INSURANCE_SURCHARGE_PERCENT;
  if (context.yearsWithMHPCO >= LOYALTY_YEARS) policyModifierPercent -= LOYALTY_DISCOUNT_PERCENT;
  if (context.isFollowUpContract) policyModifierPercent -= FOLLOW_UP_DISCOUNT_PERCENT;
  const premium = policyBase + itemSurcharges + (policyBase * policyModifierPercent) / 100;
  return Math.ceil(premium / 100) + PROCESSING_FEE;
}

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const REDUCED_REIMBURSEMENT_ENCHANTMENT = 8;
const REDUCED_REIMBURSEMENT_PERCENT = 50;

interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceValue(item: Item): number {
  return COMPONENT_TYPES.has(item.type) ? COMPONENT_VALUE : MAIN_ITEMS[item.type].value;
}

// Dragon material means full reimbursement, which is already the default;
// the reduced rate for highly enchanted items takes precedence over it.
function reimbursement(item: Item, amount: number): number {
  const reimbursed =
    (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT
      ? (amount * REDUCED_REIMBURSEMENT_PERCENT) / 100
      : amount;
  return Math.max(0, reimbursed - DEDUCTIBLE);
}

function matchDamagedItems(policy: Policy, damages: Damage[]): { item: Item; amount: number }[] {
  const available = [...policy.items];
  return damages.map((damage) => {
    if (damage.amount < 0) throw new ScenarioError(`Negative damage amount: ${damage.amount}`);
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) throw new ScenarioError(`Damaged item not covered by policy: ${damage.itemType}`);
    const [item] = available.splice(index, 1);
    return { item, amount: damage.amount };
  });
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const desired = matchDamagedItems(policy, damages).reduce(
    (sum, { item, amount }) => sum + reimbursement(item, amount),
    0,
  );
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  let contractsSoFar = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new ScenarioError(`No policy created by step ${step.policy}`);
      return processClaim(policy, step.incident.damages);
    }
    const premium = quotePremium(step.items, {
      yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
      isFollowUpContract: contractsSoFar > 0,
    });
    contractsSoFar++;
    const insuranceSum = step.items.reduce((sum, item) => sum + insuranceValue(item), 0);
    policies.set(index, { items: step.items, remainingCap: insuranceSum * CAP_FACTOR });
    return { premium };
  });
  return { results };
}
