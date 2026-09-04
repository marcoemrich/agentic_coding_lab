export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: 'quote';
  items: QuoteItem[];
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

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_TYPES = ['rune', 'moonstone'];

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.includes(type);
}

function isInsurable(type: string): boolean {
  return isComponent(type) || type in BASE_PREMIUMS;
}

function basePremiumOf(item: QuoteItem): number {
  return isComponent(item.type)
    ? COMPONENT_BASE_PREMIUM
    : BASE_PREMIUMS[item.type];
}

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

/**
 * Components of the same type are priced per type: exactly {@link BLOCK_SIZE}
 * alike components form a block at a reduced base premium.
 */
function componentsBasePremium(components: QuoteItem[]): number {
  const countsByType = new Map<string, number>();
  for (const component of components) {
    countsByType.set(
      component.type,
      (countsByType.get(component.type) ?? 0) + 1,
    );
  }

  let base = 0;
  for (const count of countsByType.values()) {
    base +=
      count === BLOCK_SIZE
        ? BLOCK_BASE_PREMIUM
        : count * COMPONENT_BASE_PREMIUM;
  }
  return base;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;

/**
 * Item-specific surcharges are charged on the base premium of the affected
 * item alone, never on the policy total.
 */
function itemSurcharges(item: QuoteItem): number {
  const base = basePremiumOf(item);
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;

const FOLLOW_UP_DISCOUNT = 0.15;

function quotePremium(
  items: QuoteItem[],
  customer: Customer,
  isFollowUpContract: boolean,
): number {
  for (const item of items) {
    if (!isInsurable(item.type)) {
      throw new Error(`The MHPCO does not insure items of type "${item.type}"`);
    }
  }

  const mainItems = items.filter((item) => !isComponent(item.type));
  const components = items.filter((item) => isComponent(item.type));

  const policyBase =
    mainItems.reduce((sum, item) => sum + basePremiumOf(item), 0) +
    componentsBasePremium(components);
  const surcharges = items.reduce((sum, item) => sum + itemSurcharges(item), 0);

  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_YEARS ? policyBase * LOYALTY_DISCOUNT : 0;

  const followUp = isFollowUpContract ? policyBase * FOLLOW_UP_DISCOUNT : 0;

  return Math.ceil(
    policyBase +
      surcharges -
      loyalty +
      policyBase * FIRST_INSURANCE_SURCHARGE -
      followUp +
      PROCESSING_FEE,
  );
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;

function insuranceValueOf(item: QuoteItem): number {
  return isComponent(item.type)
    ? COMPONENT_INSURANCE_VALUE
    : INSURANCE_VALUES[item.type];
}

interface Policy {
  items: QuoteItem[];
  remainingCap: number;
}

const REIMBURSED_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

/**
 * The reimbursement clauses reduce the damage amount; the deductible is
 * subtracted afterwards, once per damaged item.
 */
function payoutFor(damage: Damage, item: QuoteItem): number {
  const reimbursed =
    (item.enchantment ?? 0) >= REIMBURSED_ENCHANTMENT_LEVEL
      ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT
      : damage.amount;

  return reimbursed - DEDUCTIBLE;
}

function settleClaim(policy: Policy, damages: Damage[]): StepResult {
  // Each damage is settled against a distinct insured item, so a policy
  // covering one sword cannot answer two sword damages.
  const available = [...policy.items];
  const desired = damages.reduce((sum, damage) => {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative: ${damage.amount}`);
    }

    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(
        `The policy does not cover a damaged item of type "${damage.itemType}"`,
      );
    }

    const [item] = available.splice(index, 1);
    return sum + payoutFor(damage, item);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));

  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const policies = new Map<number, Policy>();

  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === 'claim') {
      const policy = policies.get(step.policy)!;
      return settleClaim(policy, step.incident.damages);
    }

    const premium = quotePremium(
      step.items,
      scenario.customer,
      policies.size > 0,
    );
    const insuranceSum = step.items.reduce(
      (sum, item) => sum + insuranceValueOf(item),
      0,
    );
    policies.set(index, {
      items: step.items,
      remainingCap: insuranceSum * CAP_FACTOR,
    });

    return { premium };
  });

  return { results };
}
