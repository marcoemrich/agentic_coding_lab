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

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;

const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_PERCENT = 50;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
};

const WHOLE_PERCENT = 100;

/** Exact percentage of an amount, avoiding binary floating-point drift. */
function percentOf(amount: number, percent: number): number {
  return (amount * percent) / WHOLE_PERCENT;
}

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function itemBasePremium(item: Item): number {
  const basePremium = BASE_PREMIUMS[item.type];
  if (basePremium === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }

  return basePremium;
}

/**
 * Components of the same type form a block at a special price when there are
 * exactly BLOCK_SIZE of them; otherwise each is priced individually.
 */
function componentsBasePremium(components: Item[]): number {
  const countsByType = new Map<string, number>();
  for (const component of components) {
    countsByType.set(component.type, (countsByType.get(component.type) ?? 0) + 1);
  }

  let total = 0;
  for (const count of countsByType.values()) {
    total +=
      count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
  }

  return total;
}

function policyBasePremium(items: Item[]): number {
  const mainItems = items.filter((item) => !isComponent(item));
  const components = items.filter(isComponent);

  return (
    mainItems.reduce((sum, item) => sum + itemBasePremium(item), 0) +
    componentsBasePremium(components)
  );
}

/** Item-specific surcharges apply to the base premium of the affected item. */
function itemSurcharges(items: Item[]): number {
  return items.reduce((total, item) => {
    const base = itemBasePremium(item);
    const curse = item.cursed === true ? percentOf(base, CURSE_SURCHARGE_PERCENT) : 0;
    const enchantment =
      (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
        ? percentOf(base, HIGH_ENCHANTMENT_SURCHARGE_PERCENT)
        : 0;

    return total + curse + enchantment;
  }, 0);
}

function quotePremium(
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number {
  const policyBase = policyBasePremium(items);
  const firstInsurance = percentOf(policyBase, FIRST_INSURANCE_SURCHARGE_PERCENT);
  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_YEARS
      ? percentOf(policyBase, LOYALTY_DISCOUNT_PERCENT)
      : 0;
  const followUp =
    previousContracts > 0 ? percentOf(policyBase, FOLLOW_UP_DISCOUNT_PERCENT) : 0;

  return Math.ceil(
    policyBase +
      itemSurcharges(items) -
      loyalty +
      firstInsurance -
      followUp +
      PROCESSING_FEE,
  );
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: COMPONENT_INSURANCE_VALUE,
  moonstone: COMPONENT_INSURANCE_VALUE,
};

function itemInsuranceValue(item: Item): number {
  const value = INSURANCE_VALUES[item.type];
  if (value === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }

  return value;
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

/**
 * Reimbursement for a single damaged item, before the deductible.
 *
 * Highly enchanted items are reimbursed at half the damage; dragon-material
 * items are reimbursed in full. Where both clauses apply the reduced
 * reimbursement takes precedence, as the MHPCO price list provides.
 */
function reimbursement(item: Item, amount: number): number {
  if ((item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL) {
    return percentOf(amount, REDUCED_REIMBURSEMENT_PERCENT);
  }

  // Dragon material and ordinary items alike are reimbursed in full; the
  // clauses differ only where a reduction would otherwise apply.
  return amount;
}

function processClaim(policy: Policy, incident: Incident): ClaimResult {
  // Each damage entry is a separate event against a distinct insured item, so a
  // matched item is consumed and cannot answer for a second damage entry.
  const unclaimed = [...policy.items];

  const desired = incident.damages.reduce((total, damage) => {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${String(damage.amount)}`);
    }

    const index = unclaimed.findIndex((candidate) => candidate.type === damage.itemType);
    if (index === -1) {
      throw new Error(`Item not covered by this policy: ${damage.itemType}`);
    }
    const [item] = unclaimed.splice(index, 1);

    const afterDeductible = reimbursement(item, damage.amount) - DEDUCTIBLE;

    return total + Math.max(afterDeductible, 0);
  }, 0);

  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  let contracts = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (policy === undefined) {
        throw new Error(`No policy created by step ${String(step.policy)}`);
      }

      return processClaim(policy, step.incident);
    }

    const premium = quotePremium(step.items, scenario.customer, contracts);
    contracts += 1;
    policies.set(index, createPolicy(step.items));

    return { premium };
  });
}
