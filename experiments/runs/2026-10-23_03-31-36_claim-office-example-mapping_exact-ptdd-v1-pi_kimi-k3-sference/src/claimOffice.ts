export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const DEDUCTIBLE_PER_DAMAGE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

interface Policy {
  items: QuoteItem[];
  remainingCap: number;
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const policies: Policy[] = [];
  let quoteCount = 0;
  const results: StepResult[] = [];
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      for (const item of step.items) {
        requireKnownItemType(item.type);
      }
      results.push({ premium: quotePremium(step, scenario.customer, quoteCount > 0) });
      quoteCount += 1;
      policies.push(createPolicy(step));
    } else {
      results.push(processClaim(policies[step.policy], step));
    }
  }
  return { results };
}

function requireKnownItemType(type: string): void {
  if (!(type in INSURANCE_VALUES)) {
    throw new Error(`Unknown item type: ${type}`);
  }
}

function createPolicy(step: QuoteStep): Policy {
  const insuranceSum = step.items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  return { items: step.items, remainingCap: insuranceSum * CAP_MULTIPLE_OF_INSURANCE_SUM };
}

function processClaim(policy: Policy, step: ClaimStep): StepResult {
  const matched = matchDamages(policy, step.incident.damages);
  let payout = 0;
  for (const { item, damage } of matched) {
    payout += Math.max(0, reimbursement(item, damage.amount) - DEDUCTIBLE_PER_DAMAGE);
  }
  payout = Math.floor(Math.min(payout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function matchDamages(policy: Policy, damages: Damage[]): { item: QuoteItem; damage: Damage }[] {
  const pool = [...policy.items];
  return damages.map((damage) => {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative: ${damage.amount}`);
    }
    const index = pool.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`Damaged item is not covered by the policy: ${damage.itemType}`);
    }
    const [item] = pool.splice(index, 1);
    return { item, damage };
  });
}

function reimbursement(item: QuoteItem, amount: number): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return amount;
}

function quotePremium(
  step: QuoteStep,
  customer: { yearsWithMHPCO: number },
  isFollowUpContract: boolean,
): number {
  const base = policyBasePremium(step.items);
  const itemSurcharges = step.items.reduce((sum, item) => sum + itemRiskSurcharge(item), 0);
  const withModifiers =
    base + itemSurcharges + base * policyModifierRate(customer, isFollowUpContract);
  return Math.ceil(withModifiers + PROCESSING_FEE);
}

function policyModifierRate(
  customer: { yearsWithMHPCO: number },
  isFollowUpContract: boolean,
): number {
  let rate = FIRST_INSURANCE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    rate -= LOYALTY_DISCOUNT_RATE;
  }
  if (isFollowUpContract) {
    rate -= FOLLOW_UP_DISCOUNT_RATE;
  }
  return rate;
}

function itemRiskSurcharge(item: QuoteItem): number {
  const base = BASE_PREMIUMS[item.type];
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * CURSE_SURCHARGE_RATE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_RATE;
  }
  return surcharge;
}

function policyBasePremium(items: QuoteItem[]): number {
  const byType = new Map<string, number>();
  for (const item of items) {
    byType.set(item.type, (byType.get(item.type) ?? 0) + 1);
  }
  let sum = 0;
  for (const [type, count] of byType) {
    sum +=
      COMPONENT_TYPES.has(type) && count === BLOCK_SIZE
        ? BLOCK_PREMIUM
        : count * BASE_PREMIUMS[type];
  }
  return sum;
}
