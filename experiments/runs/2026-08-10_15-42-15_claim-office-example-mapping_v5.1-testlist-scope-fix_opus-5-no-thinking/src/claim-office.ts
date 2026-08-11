export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_PERCENT = 10;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

/** Base premium for `count` alike components: a block of exactly 3 is discounted. */
function componentsBasePremium(type: string, count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * BASE_PREMIUMS[type];
}

function policyBasePremium(items: Item[]): number {
  let base = 0;
  for (const [type, count] of countByType(items)) {
    base += COMPONENT_TYPES.has(type)
      ? componentsBasePremium(type, count)
      : count * BASE_PREMIUMS[type];
  }
  return base;
}

const CURSE_PERCENT = 50;
const HIGH_ENCHANTMENT_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

/** Percentage surcharge that this item's own attributes add to its base premium. */
function itemSurchargePercent(item: Item): number {
  const curse = item.cursed === true ? CURSE_PERCENT : 0;
  const enchantment =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_PERCENT : 0;
  return curse + enchantment;
}

/**
 * Item-specific modifiers apply to the base premium of the affected item, so
 * each item's own base premium is needed — for a discounted block, the block
 * price is shared equally among its components.
 */
function itemBasePremium(item: Item, countOfType: number): number {
  if (COMPONENT_TYPES.has(item.type)) {
    return componentsBasePremium(item.type, countOfType) / countOfType;
  }
  return BASE_PREMIUMS[item.type];
}

const PERCENT_WHOLE = 100;

/** `percent` % of `amount`, e.g. percentOf(100, 50) === 50. */
function percentOf(amount: number, percent: number): number {
  return (amount * percent) / PERCENT_WHOLE;
}

/**
 * Item-specific modifiers apply to the affected item's base premium; policy-wide
 * modifiers apply to the policy base premium; the processing fee is added last.
 * Intermediate amounts stay fractional — only the final premium is rounded, in
 * the MHPCO's favour (up).
 */
function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
  const counts = countByType(items);
  const itemSurcharges = items.reduce(
    (sum, item) =>
      sum + percentOf(itemBasePremium(item, counts.get(item.type)!), itemSurchargePercent(item)),
    0,
  );
  const policyBase = policyBasePremium(items);
  const policyModifiers = percentOf(policyBase, policyModifierPercent(customer, previousContracts));
  return Math.ceil(policyBase + itemSurcharges + policyModifiers + PROCESSING_FEE);
}

const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

/** Net percentage that policy-wide modifiers add to (or take off) the policy base premium. */
function policyModifierPercent(customer: Customer, previousContracts: number): number {
  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? -LOYALTY_DISCOUNT_PERCENT : 0;
  const followUp = previousContracts > 0 ? -FOLLOW_UP_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_PERCENT + loyalty + followUp;
}

const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT_PERCENT = 50;
const REDUCED_REIMBURSEMENT_THRESHOLD = 8;

/**
 * Reimbursement before the deductible: highly enchanted items are reimbursed at
 * 50 %, which takes precedence over the dragon-material full reimbursement.
 */
function reimbursement(item: Item, amount: number): number {
  if ((item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_THRESHOLD) {
    return percentOf(amount, REDUCED_REIMBURSEMENT_PERCENT);
  }
  return amount;
}

/** Payout for one damaged item: reimbursement less the per-event deductible, never negative. */
function damagePayout(item: Item, damage: Damage): number {
  return Math.max(0, reimbursement(item, damage.amount) - DEDUCTIBLE);
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;

/**
 * Pairs every damage with a distinct insured item: two damages of the same type
 * need two insured items of that type. A damage that cannot be matched means the
 * claim covers something the policy does not, so the whole claim is rejected.
 */
function matchDamagesToItems(insured: Item[], damages: Damage[]): [Item, Damage][] {
  const available = [...insured];
  return damages.map((damage) => {
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`damaged item is not covered by the policy: ${damage.itemType}`);
    }
    return [available.splice(index, 1)[0], damage];
  });
}

/** The policy's insurance sum: the unmodified insurance values of all insured items. */
function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
}

/**
 * Payout for one claim against a policy with `cap` G of cover left: the desired
 * reimbursement, limited by the remaining cap and rounded in the MHPCO's favour
 * (down). Rejects damages the policy does not cover.
 */
function claimPayout(insured: Item[], damages: Damage[], cap: number): number {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must not be negative: ${damage.amount}`);
    }
  }
  const desired = matchDamagesToItems(insured, damages).reduce(
    (sum, [item, damage]) => sum + damagePayout(item, damage),
    0,
  );
  return Math.floor(Math.min(desired, cap));
}

export function runScenario(scenario: Scenario): ScenarioResult {
  let contracts = 0;
  const remainingCaps = new Map<number, number>();

  const runClaim = (step: ClaimStep): ClaimResult => {
    const insured = (scenario.steps[step.policy] as QuoteStep).items;
    const cap = remainingCaps.get(step.policy) ?? insuranceSum(insured) * CAP_MULTIPLIER;
    const payout = claimPayout(insured, step.incident.damages, cap);
    remainingCaps.set(step.policy, cap - payout);
    return { payout, remainingCap: cap - payout };
  };

  const runQuote = (step: QuoteStep): QuoteResult => {
    const premium = quotePremium(step.items, scenario.customer, contracts);
    contracts += 1;
    return { premium };
  };

  return {
    results: scenario.steps.map((step) => (step.op === "claim" ? runClaim(step) : runQuote(step))),
  };
}
