export interface Customer {
  yearsWithMHPCO: number;
}

export interface ItemInput {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: 'quote';
  items: ItemInput[];
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
  op: 'claim';
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

/** A scenario the MHPCO refuses to process. */
export class ClaimOfficeError extends Error {}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

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

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const PARTIAL_REIMBURSEMENT_THRESHOLD = 8;
const PARTIAL_REIMBURSEMENT_RATE = 0.5;

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

/**
 * The base premium each item contributes, with the block discount for exactly
 * three alike components already spread across the block's members.
 */
function basePremiums(items: ItemInput[]): number[] {
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
  }

  return items.map((item) => {
    const listed = BASE_PREMIUMS[item.type];
    if (isComponent(item.type) && componentCounts.get(item.type) === BLOCK_SIZE) {
      return BLOCK_BASE_PREMIUM / BLOCK_SIZE;
    }
    return listed;
  });
}

/**
 * Surcharges tied to a single item, expressed as a fraction of that item's own
 * base premium — not of the policy total.
 */
function itemSurchargeRate(item: ItemInput): number {
  let rate = FIRST_INSURANCE_SURCHARGE;
  if (item.cursed) rate += CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    rate += HIGH_ENCHANTMENT_SURCHARGE;
  }
  return rate;
}

/**
 * Modifiers tied to the customer rather than any one item, expressed as a
 * fraction of the policy base premium.
 */
function policyModifierRate(customer: Customer, precedingContracts: number): number {
  let rate = 0;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) rate -= LOYALTY_DISCOUNT;
  if (precedingContracts > 0) rate -= FOLLOW_UP_CONTRACT_DISCOUNT;
  return rate;
}

function quotePremium(
  items: ItemInput[],
  customer: Customer,
  precedingContracts: number,
): number {
  const bases = basePremiums(items);
  const policyBase = bases.reduce((sum, base) => sum + base, 0);
  const itemModifiers = bases.reduce(
    (sum, base, index) => sum + base * itemSurchargeRate(items[index]),
    0,
  );
  const policyModifiers = policyBase * policyModifierRate(customer, precedingContracts);

  // Rounding favors the MHPCO: premiums round up.
  return Math.ceil(policyBase + itemModifiers + policyModifiers + PROCESSING_FEE);
}

function assertInsurable(items: ItemInput[]): void {
  for (const item of items) {
    if (!(item.type in INSURANCE_VALUES)) {
      throw new ClaimOfficeError(`the MHPCO does not insure items of type ${item.type}`);
    }
  }
}

function assertWellFormed(incident: Incident): void {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new ClaimOfficeError(
        `damage amount ${damage.amount} for ${damage.itemType} is negative`,
      );
    }
  }
}

/** A policy created by a quote step, tracking how much of its cap is left. */
interface Policy {
  items: ItemInput[];
  remainingCap: number;
}

function openPolicy(items: ItemInput[]): Policy {
  const insuranceSum = items.reduce(
    (sum, item) => sum + INSURANCE_VALUES[item.type],
    0,
  );
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function reimbursableAmount(damage: Damage, item: ItemInput): number {
  if ((item.enchantment ?? 0) >= PARTIAL_REIMBURSEMENT_THRESHOLD) {
    return damage.amount * PARTIAL_REIMBURSEMENT_RATE;
  }
  return damage.amount;
}

/**
 * Pairs each damage with a distinct insured item, so a policy covering one
 * sword cannot absorb two sword damages.
 */
function matchDamagesToItems(policy: Policy, damages: Damage[]): ItemInput[] {
  const unclaimed = [...policy.items];

  return damages.map((damage) => {
    const index = unclaimed.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new ClaimOfficeError(
        `the policy does not cover a ${damage.itemType} for this damage entry`,
      );
    }
    return unclaimed.splice(index, 1)[0];
  });
}

function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  assertWellFormed(incident);
  const damagedItems = matchDamagesToItems(policy, incident.damages);
  const desired = incident.damages.reduce(
    (sum, damage, index) =>
      sum + Math.max(0, reimbursableAmount(damage, damagedItems[index]) - DEDUCTIBLE),
    0,
  );
  // Rounding favors the MHPCO: payouts round down.
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let contractsSoFar = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      assertInsurable(step.items);
      results.push({
        premium: quotePremium(step.items, scenario.customer, contractsSoFar),
      });
      policies.set(index, openPolicy(step.items));
      contractsSoFar += 1;
      return;
    }

    const policy = policies.get(step.policy);
    if (!policy) {
      throw new ClaimOfficeError(`step ${step.policy} did not create a policy`);
    }
    results.push(settleClaim(policy, step.incident));
  });

  return { results };
}
