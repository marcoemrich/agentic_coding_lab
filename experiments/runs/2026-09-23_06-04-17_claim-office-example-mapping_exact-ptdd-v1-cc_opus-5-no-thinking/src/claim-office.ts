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

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

function roundPremiumInMHPCOsFavour(premium: number): number {
  return Math.ceil(premium);
}

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }

  return counts;
}

function basePremiumForAlike(type: string, count: number): number {
  const basePremium = BASE_PREMIUMS[type];

  if (basePremium === undefined) {
    throw new Error(`the MHPCO does not insure items of type ${type}`);
  }

  if (COMPONENT_TYPES.includes(type) && count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }

  return count * basePremium;
}

function policyBasePremium(items: Item[]): number {
  let total = 0;

  for (const [type, count] of countByType(items)) {
    total += basePremiumForAlike(type, count);
  }

  return total;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function itemBasePremium(item: Item, counts: Map<string, number>): number {
  const count = counts.get(item.type) ?? 0;

  return basePremiumForAlike(item.type, count) / count;
}

function itemSurcharges(items: Item[]): number {
  const counts = countByType(items);
  let surcharges = 0;

  for (const item of items) {
    const base = itemBasePremium(item, counts);

    if (item.cursed === true) {
      surcharges += base * CURSE_SURCHARGE;
    }

    if (isHighlyEnchanted(item)) {
      surcharges += base * HIGH_ENCHANTMENT_SURCHARGE;
    }
  }

  return surcharges;
}

function customerModifiers(
  premium: number,
  customer: Customer,
  previousContracts: number,
): number {
  const firstInsurance = premium * FIRST_INSURANCE_SURCHARGE;
  const loyalty = isLongStanding(customer) ? premium * LOYALTY_DISCOUNT : 0;
  const followUp =
    previousContracts > 0 ? premium * FOLLOW_UP_CONTRACT_DISCOUNT : 0;

  return firstInsurance - loyalty - followUp;
}

function quotePremium(
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number {
  const basePremium = policyBasePremium(items);

  return roundPremiumInMHPCOsFavour(
    basePremium +
      itemSurcharges(items) +
      customerModifiers(basePremium, customer, previousContracts) +
      PROCESSING_FEE,
  );
}

const DEDUCTIBLE_PER_DAMAGE = 100;
const HEAVY_ENCHANTMENT_LEVEL = 8;
const HEAVY_ENCHANTMENT_REIMBURSEMENT = 0.5;

function isHeavilyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HEAVY_ENCHANTMENT_LEVEL;
}
const CAP_FACTOR = 2;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0);
}

function underwritePolicy(items: Item[]): Policy {
  return {
    items,
    remainingCap: insuranceSum(items) * CAP_FACTOR,
  };
}

function roundPayoutInMHPCOsFavour(payout: number): number {
  return Math.floor(payout);
}

const FULL_REIMBURSEMENT = 1;
// Damage to dragon-material items is fully reimbursed, which is also the
// rate for items with no special clause. The heavy-enchantment clause takes
// precedence over both.
function reimbursementRateFor(item: Item): number {
  if (isHeavilyEnchanted(item)) {
    return HEAVY_ENCHANTMENT_REIMBURSEMENT;
  }

  return FULL_REIMBURSEMENT;
}

function reimbursementFor(damage: Damage, item: Item): number {
  if (damage.amount < 0) {
    throw new Error(
      `a damage amount cannot be negative, but was ${String(damage.amount)}`,
    );
  }

  const reimbursed = damage.amount * reimbursementRateFor(item);

  return Math.max(reimbursed - DEDUCTIBLE_PER_DAMAGE, 0);
}

function settleClaim(policy: Policy, incident: Incident): StepResult {
  const unclaimed = [...policy.items];
  let claimed = 0;

  for (const damage of incident.damages) {
    const covered = unclaimed.findIndex((item) => item.type === damage.itemType);

    if (covered === -1) {
      throw new Error(
        `the policy does not cover a further ${damage.itemType} for this incident`,
      );
    }

    const [item] = unclaimed.splice(covered, 1);

    claimed += reimbursementFor(damage, item);
  }
  const payout = roundPayoutInMHPCOsFavour(
    Math.min(claimed, policy.remainingCap),
  );

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
        throw new Error(`no policy created by step ${String(step.policy)}`);
      }

      return settleClaim(policy, step.incident);
    }

    const premium = quotePremium(step.items, scenario.customer, contracts);
    contracts += 1;
    policies.set(index, underwritePolicy(step.items));

    return { premium };
  });
}
