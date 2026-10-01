export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
export type QuoteStep = { op: 'quote'; items: Item[] };
export type Damage = { itemType: string; amount: number };
export type ClaimStep = { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };
export type Scenario = { customer: { yearsWithMHPCO: number }; steps: (QuoteStep | ClaimStep)[] };
export type Result = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
// Percentages are whole numbers; amounts multiplied by a percentage are kept in
// hundredths of a G so intermediate values stay exact until the final rounding.
const FIRST_INSURANCE_SURCHARGE_PCT = 10;
const LOYALTY_DISCOUNT_PCT = 20;
const LOYALTY_MIN_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PCT = 15;
const CURSE_SURCHARGE_PCT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PCT = 30;
const HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5;

function itemSurchargePct(item: Item): number {
  let pct = 0;
  if (item.cursed) pct += CURSE_SURCHARGE_PCT;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD) pct += HIGH_ENCHANTMENT_SURCHARGE_PCT;
  return pct;
}

const BASE_PREMIUMS: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function policyBasePremium(items: Item[]): number {
  const componentCounts = new Map<string, number>();
  let base = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      base += BASE_PREMIUMS[item.type];
    }
  }
  for (const [type, count] of componentCounts) {
    base += count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * BASE_PREMIUMS[type];
  }
  return base;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const base = policyBasePremium(items);
  const itemSurcharges = items.reduce(
    (sum, item) => sum + BASE_PREMIUMS[item.type] * itemSurchargePct(item),
    0,
  );
  let policyPct = 100 + FIRST_INSURANCE_SURCHARGE_PCT;
  if (yearsWithMHPCO >= LOYALTY_MIN_YEARS) policyPct -= LOYALTY_DISCOUNT_PCT;
  if (isFollowUp) policyPct -= FOLLOW_UP_DISCOUNT_PCT;
  const hundredths = base * policyPct + itemSurcharges;
  return Math.ceil(hundredths / 100) + PROCESSING_FEE;
}

const INSURANCE_VALUES: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
// Integer damages halved are exact in floating point, so no scaling is needed here.
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function reimbursable(item: Item, amount: number): number {
  // The 50 % clause wins over dragon material's full reimbursement.
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) return amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  return amount;
}

type Policy = { items: Item[]; remainingCap: number };

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const unclaimed = [...policy.items];
  const desired = damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error(`Invalid damage amount: ${damage.amount}`);
    const index = unclaimed.findIndex((candidate) => candidate.type === damage.itemType);
    if (index === -1) throw new Error(`Damaged item not covered by policy: ${damage.itemType}`);
    const [item] = unclaimed.splice(index, 1);
    return sum + Math.max(0, reimbursable(item, damage.amount) - DEDUCTIBLE);
  }, 0);
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  let contracts = 0;
  const policies = new Map<number, Policy>();
  return {
    results: scenario.steps.map((step, index): Result => {
      if (step.op === 'claim') {
        return processClaim(policies.get(step.policy)!, step.incident.damages);
      }
      for (const item of step.items) {
        if (!(item.type in BASE_PREMIUMS)) throw new Error(`Unknown item type: ${item.type}`);
      }
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, contracts > 0);
      contracts++;
      policies.set(index, createPolicy(step.items));
      return { premium };
    }),
  };
}
