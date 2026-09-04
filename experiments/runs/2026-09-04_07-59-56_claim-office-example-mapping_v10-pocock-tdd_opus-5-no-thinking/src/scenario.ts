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

export interface ScenarioOutput {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;

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
const BLOCK_PREMIUM = 60;

/**
 * A building block is exactly BLOCK_SIZE alike components — four runes are
 * priced per unit, not as a block plus a spare (prompt: "4 runes -> 100 G").
 */
function componentBase(type: string, count: number): number {
  if (count === BLOCK_SIZE) return BLOCK_PREMIUM;
  return count * BASE_PREMIUMS[type];
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

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
    base += componentBase(type, count);
  }

  return base;
}

/**
 * Surcharges that attach to a single item, each a fraction of that item's own
 * base premium rather than of the policy total.
 */
function itemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => {
    if (COMPONENT_TYPES.has(item.type)) return sum;
    const itemBase = BASE_PREMIUMS[item.type];
    const curse = item.cursed ? itemBase * CURSE_SURCHARGE : 0;
    const enchanted =
      (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
        ? itemBase * HIGH_ENCHANTMENT_SURCHARGE
        : 0;
    return sum + curse + enchanted;
  }, 0);
}

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;

/**
 * Discounts and surcharges that attach to the policy as a whole, each a
 * fraction of the summed item base premiums.
 */
function policyAdjustments(
  policyBase: number,
  customer: Customer,
  isFollowUpContract: boolean,
): number {
  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
      ? -policyBase * LOYALTY_DISCOUNT
      : 0;
  const followUp = isFollowUpContract ? -policyBase * FOLLOW_UP_DISCOUNT : 0;
  return loyalty + followUp + policyBase * FIRST_INSURANCE_SURCHARGE;
}

function quotePremium(
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): number {
  const policyBase = policyBasePremium(items);
  const total =
    policyBase +
    itemSurcharges(items) +
    policyAdjustments(policyBase, customer, isFollowUpContract);
  return Math.ceil(total + PROCESSING_FEE);
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;

interface Policy {
  items: Item[];
  remainingCap: number;
}

function openPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce(
    (sum, item) => sum + INSURANCE_VALUES[item.type],
    0,
  );
  return { items, remainingCap: insuranceSum * CAP_MULTIPLE };
}

const HALVED_ENCHANTMENT_THRESHOLD = 8;
const HALVED_REIMBURSEMENT = 0.5;

/**
 * Reimbursement for one damaged item, before the policy cap is applied.
 * The high-enchantment clause takes precedence over full dragon-material
 * reimbursement when both would apply.
 */
function reimbursement(item: Item, amount: number): number {
  const covered =
    (item.enchantment ?? 0) >= HALVED_ENCHANTMENT_THRESHOLD
      ? amount * HALVED_REIMBURSEMENT
      : amount;
  return Math.max(0, covered - DEDUCTIBLE);
}

/**
 * Pairs each damage with a distinct insured item, so a policy covering one
 * sword cannot absorb two sword damages.
 */
function matchDamagesToItems(policy: Policy, damages: Damage[]): Item[] {
  const unclaimed = [...policy.items];

  return damages.map((damage) => {
    if (damage.amount < 0) {
      throw new ScenarioError(`negative damage amount: ${damage.amount}`);
    }
    const index = unclaimed.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new ScenarioError(`policy does not cover a damaged ${damage.itemType}`);
    }
    return unclaimed.splice(index, 1)[0];
  });
}

function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  const damagedItems = matchDamagesToItems(policy, incident.damages);
  const desired = incident.damages.reduce(
    (sum, damage, i) => sum + reimbursement(damagedItems[i], damage.amount),
    0,
  );
  // Rounded in the MHPCO's favour, then the cap draws down by what was paid.
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

/** Rejects a whole scenario; the CLI turns this into a non-zero exit. */
export class ScenarioError extends Error {}

function assertKnownItems(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new ScenarioError(`unknown item type: ${item.type}`);
    }
  }
}

export function runScenario(scenario: Scenario): ScenarioOutput {
  const policies = new Map<number, Policy>();
  let quotesSoFar = 0;

  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy)!;
      return settleClaim(policy, step.incident);
    }

    assertKnownItems(step.items);

    const premium = quotePremium(step.items, scenario.customer, quotesSoFar > 0);
    quotesSoFar += 1;
    policies.set(index, openPolicy(step.items));
    return { premium };
  });

  return { results };
}
