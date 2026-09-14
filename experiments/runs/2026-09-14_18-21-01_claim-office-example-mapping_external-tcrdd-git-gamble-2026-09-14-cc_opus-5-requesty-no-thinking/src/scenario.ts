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

const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = ['rune', 'moonstone'];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.includes(type);
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;

function itemSurchargeRate(item: Item): number {
  let rate = 0;
  if (item.cursed) rate += CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    rate += HIGH_ENCHANTMENT_SURCHARGE;
  }
  return rate;
}

function itemBasePremiums(items: Item[]): { item: Item; base: number }[] {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }

  const componentCounts = new Map<string, number>();
  for (const item of items.filter((i) => isComponent(i.type))) {
    componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
  }

  return items.map((item) => {
    if (!isComponent(item.type)) {
      return { item, base: BASE_PREMIUMS[item.type] };
    }
    const count = componentCounts.get(item.type) ?? 0;
    const base =
      count === BLOCK_SIZE
        ? BLOCK_PREMIUM / BLOCK_SIZE
        : BASE_PREMIUMS[item.type];
    return { item, base };
  });
}

const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;

function premiumOf(
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number {
  const priced = itemBasePremiums(items);
  const base = priced.reduce((sum, { base: itemBase }) => sum + itemBase, 0);
  const itemSurcharges = priced.reduce(
    (sum, { item, base: itemBase }) => sum + itemBase * itemSurchargeRate(item),
    0,
  );

  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_DISCOUNT : 0;
  const followUp = previousContracts > 0 ? base * FOLLOW_UP_DISCOUNT : 0;

  return Math.ceil(
    base +
      itemSurcharges -
      loyalty -
      followUp +
      base * FIRST_INSURANCE_SURCHARGE +
      PROCESSING_FEE,
  );
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
const CAP_FACTOR = 2;
const REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT = 0.5;

interface Policy {
  items: Item[];
  remainingCap: number;
}

function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= REIMBURSEMENT_ENCHANTMENT_LEVEL
    ? REDUCED_REIMBURSEMENT
    : 1;
}

function payoutFor(damage: Damage, item: Item): number {
  return Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);
}

function settle(policy: Policy, incident: Incident): ClaimResult {
  const available = [...policy.items];
  const desired = incident.damages.reduce((sum, damage) => {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`item not covered by the policy: ${damage.itemType}`);
    }
    const item = available.splice(index, 1)[0];
    return sum + payoutFor(damage, item);
  }, 0);

  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}

function openPolicy(items: Item[]): Policy {
  return {
    items,
    remainingCap:
      CAP_FACTOR *
      items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0),
  };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  let contracts = 0;
  const policies = new Map<number, Policy>();

  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === 'quote') {
        const premium = premiumOf(step.items, scenario.customer, contracts);
        contracts += 1;
        policies.set(index, openPolicy(step.items));
        return { premium };
      }

      const policy = policies.get(step.policy);
      if (policy === undefined) {
        throw new Error(`no policy created by step ${step.policy}`);
      }
      return settle(policy, step.incident);
    }),
  };
}
