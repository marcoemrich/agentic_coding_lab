// MHPCO Claim Office — scenario processing.

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANT_RATE = 0.3;
const HIGH_ENCHANT_THRESHOLD = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD = 2;
const FOLLOW_UP_RATE = 0.15;

/** Claim processing. */
const DEDUCTIBLE = 100;
const HIGH_ENCHANT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANT_CLAIM_RATE = 0.5;
const CAP_MULTIPLIER = 2;

/** Absorb floating-point noise before applying the MHPCO's whole-G rounding. */
const EPSILON = 1e-9;
const roundUp = (amount: number): number => Math.ceil(amount - EPSILON);
const roundDown = (amount: number): number => Math.floor(amount + EPSILON);

/** A quoted item: type plus optional magical attributes. */
type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

/** Base premium per single main item type. */
const BASE_PREMIUM: Partial<Record<string, number>> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

/** Insurance value per single main item type; components are 250 G each. */
const INSURANCE_VALUE: Partial<Record<string, number>> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

/** Components are insured at a flat per-item value; a block of 3 alike is offered cheaper. */
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BASE = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const isComponent = (type: string): boolean => COMPONENT_TYPES.has(type);

/** Whether `type` is a recognized MHPCO item (main item or component). */
const isKnownItemType = (type: string): boolean =>
  BASE_PREMIUM[type] !== undefined || isComponent(type);

/** Throw if any quoted item has an unrecognized type. */
function assertKnownItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
}

/** Summed base premium of all quoted items, applying the 3-alike-component block. */
function policyBasePremium(items: Item[]): number {
  let total = 0;
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      total += itemBasePremium(item);
    }
  }
  for (const count of Object.values(componentCounts)) {
    total += count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_BASE;
  }
  return total;
}

/** Per-item base premium before block discounts. */
function itemBasePremium(item: Item): number {
  return isComponent(item.type) ? COMPONENT_BASE : BASE_PREMIUM[item.type] ?? 0;
}

/** Per-item insurance value (block discounts do not change the insurance sum). */
function itemInsuranceValue(item: Item): number {
  return isComponent(item.type) ? COMPONENT_INSURANCE_VALUE : INSURANCE_VALUE[item.type] ?? 0;
}

/** Total insured value of a list of items (cap = CAP_MULTIPLIER * this). */
function insuranceSum(items: Item[]): number {
  return items.reduce((sum, it) => sum + itemInsuranceValue(it), 0);
}

/** Item-specific risk surcharges (cursed, high enchantment). Applied to the affected item's base premium. */
function itemSurcharges(item: Item): number {
  const base = itemBasePremium(item);
  let surcharge = 0;
  if (item.cursed) surcharge += CURSE_RATE * base;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD) surcharge += HIGH_ENCHANT_RATE * base;
  return surcharge;
}

/** Input shape for `runScenario`: a single customer and a list of steps. */
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items?: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

/** A policy created by a quote: its insured items and the remaining payout cap. */
type Policy = { items: Item[]; remainingCap: number };

/** Reimbursement rate for a damaged item: 50% if highly enchanted (>= 8), else full. */
function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANT_CLAIM_THRESHOLD
    ? HIGH_ENCHANT_CLAIM_RATE
    : 1;
}

/** Validate a damage entry and remove one matching insured item from the pool. */
function takeInsuredItem(pool: Item[], damage: Damage): Item {
  if (damage.amount < 0) {
    throw new Error(`damage amount must not be negative: ${damage.amount}`);
  }
  const index = pool.findIndex((it) => it.type === damage.itemType);
  if (index === -1) {
    throw new Error(`damage references item not covered by policy: ${damage.itemType}`);
  }
  const [item] = pool.splice(index, 1);
  return item;
}

/** Process a claim against a policy, mutating its remaining cap. */
function processClaim(policy: Policy, incident: Incident): ClaimResult {
  const pool = [...policy.items];
  let uncappedPayout = 0;
  for (const damage of incident.damages) {
    const item = takeInsuredItem(pool, damage);
    uncappedPayout += reimbursementRate(item) * damage.amount - DEDUCTIBLE;
  }
  const payout = roundDown(Math.min(uncappedPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

/** Total premium for a quote, applying item-specific and policy-wide modifiers plus the fee. */
function quotePremium(
  customer: { yearsWithMHPCO: number },
  items: Item[],
  isFollowUp: boolean,
): number {
  const policyBase = policyBasePremium(items);
  const surcharges = items.reduce((sum, it) => sum + itemSurcharges(it), 0);
  const firstInsurance = policyBase * FIRST_INSURANCE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD ? LOYALTY_RATE * policyBase : 0;
  const followUpDiscount = isFollowUp ? FOLLOW_UP_RATE * policyBase : 0;
  return roundUp(
    policyBase + surcharges + firstInsurance - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
  );
}

export function runScenario(input: unknown): { results: StepResult[] } {
  const scenario = input as Scenario;
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let hasPriorQuote = false;
  for (const [index, step] of scenario.steps.entries()) {
    if (step.op === "quote") {
      const items = step.items ?? [];
      assertKnownItemTypes(items);
      results.push({ premium: quotePremium(scenario.customer, items, hasPriorQuote) });
      hasPriorQuote = true;
      policies.set(index, { items, remainingCap: CAP_MULTIPLIER * insuranceSum(items) });
    } else {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`claim references unknown policy: ${step.policy}`);
      results.push(processClaim(policy, step.incident));
    }
  }
  return { results };
}
