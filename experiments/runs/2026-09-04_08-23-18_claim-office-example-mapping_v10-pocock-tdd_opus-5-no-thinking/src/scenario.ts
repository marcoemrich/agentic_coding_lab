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
  customer: Customer;
  steps: Step[];
}

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export interface ScenarioOutput {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const COMPONENT_INSURANCE_VALUE = 250;
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

const MAIN_ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const MAIN_ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function isKnownType(type: string): boolean {
  return type in MAIN_ITEM_BASE_PREMIUM || isComponent(type);
}

function basePremiumOf(item: Item): number {
  return isComponent(item.type)
    ? COMPONENT_BASE_PREMIUM
    : MAIN_ITEM_BASE_PREMIUM[item.type];
}

/**
 * Components of the same type are priced in blocks: a group of exactly
 * BLOCK_SIZE alike components costs BLOCK_BASE_PREMIUM instead of the
 * per-component rate. Other counts are priced per component.
 */
function policyBasePremium(items: Item[]): number {
  const componentCounts = new Map<string, number>();
  let total = 0;

  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts.set(
        item.type,
        (componentCounts.get(item.type) ?? 0) + 1,
      );
    } else {
      total += basePremiumOf(item);
    }
  }

  for (const count of componentCounts.values()) {
    total +=
      count === BLOCK_SIZE
        ? BLOCK_BASE_PREMIUM
        : count * COMPONENT_BASE_PREMIUM;
  }

  return total;
}

function quotePremium(
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number {
  const policyBase = policyBasePremium(items);
  const itemSurcharges = items.reduce((sum, item) => {
    const base = basePremiumOf(item);
    const curse = item.cursed ? base * CURSE_SURCHARGE : 0;
    const enchanted =
      (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
        ? base * HIGH_ENCHANTMENT_SURCHARGE
        : 0;
    return sum + curse + enchanted;
  }, 0);
  const firstInsurance = policyBase * FIRST_INSURANCE_SURCHARGE;
  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_YEARS
      ? policyBase * LOYALTY_DISCOUNT
      : 0;
  const followUp =
    previousContracts > 0 ? policyBase * FOLLOW_UP_CONTRACT_DISCOUNT : 0;
  return Math.ceil(
    policyBase +
      itemSurcharges +
      firstInsurance -
      loyalty -
      followUp +
      PROCESSING_FEE,
  );
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceSum(items: Item[]): number {
  return items.reduce(
    (sum, item) =>
      sum +
      (isComponent(item.type)
        ? COMPONENT_INSURANCE_VALUE
        : MAIN_ITEM_INSURANCE_VALUE[item.type]),
    0,
  );
}

function settleClaim(policy: Policy, damages: Damage[]): StepResult {
  let desired = 0;
  // Each damage entry must name a distinct insured item, so two damages of
  // one type are only valid when two such items are covered.
  const unclaimed = [...policy.items];

  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(
        `negative damage amount for ${damage.itemType}: ${damage.amount}`,
      );
    }

    const index = unclaimed.findIndex((i) => i.type === damage.itemType);
    if (index === -1) {
      throw new Error(`item not covered by this policy: ${damage.itemType}`);
    }
    const [item] = unclaimed.splice(index, 1);

    const reimbursable =
      (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL
        ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT
        : damage.amount;
    desired += Math.max(0, reimbursable - DEDUCTIBLE);
  }

  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioOutput {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let contracts = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      for (const item of step.items) {
        if (!isKnownType(item.type)) {
          throw new Error(`unknown item type: ${item.type}`);
        }
      }
      results.push({
        premium: quotePremium(step.items, scenario.customer, contracts),
      });
      contracts += 1;
      policies.set(index, {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
      });
    } else {
      results.push(
        settleClaim(policies.get(step.policy)!, step.incident.damages),
      );
    }
  });

  return { results };
}
