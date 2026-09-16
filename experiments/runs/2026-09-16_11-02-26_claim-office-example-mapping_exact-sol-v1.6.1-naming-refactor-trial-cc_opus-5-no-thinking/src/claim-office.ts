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
  op: "quote";
  items: ItemInput[];
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
  customer: Customer;
  steps: Step[];
}

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
  // Components are sold in building blocks; main items are not.
  isComponent?: true;
}

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25, isComponent: true },
  moonstone: { insuranceValue: 250, basePremium: 25, isComponent: true },
};

function priceListEntryFor(type: string): PriceListEntry {
  const entry = PRICE_LIST[type];
  if (entry === undefined) {
    throw new Error(`unknown item type: ${type}`);
  }
  return entry;
}

function basePremiumFor(item: ItemInput): number {
  return priceListEntryFor(item.type).basePremium;
}

// The MHPCO rounds every final amount in its own favor: a premium the
// customer pays goes up, a payout the MHPCO pays goes down.
function roundPremiumInMHPCOFavor(amount: number): number {
  return Math.ceil(amount);
}

function roundPayoutInMHPCOFavor(amount: number): number {
  return Math.floor(amount);
}

function isComponent(item: ItemInput): boolean {
  return priceListEntryFor(item.type).isComponent === true;
}

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function countByType(items: ItemInput[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function basePremiumForComponentGroup(type: string, count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * basePremiumFor({ type });
}

function policyBasePremium(items: ItemInput[]): number {
  const mainItems = items.filter((item) => !isComponent(item));
  const components = items.filter((item) => isComponent(item));

  let total = mainItems.reduce((sum, item) => sum + basePremiumFor(item), 0);
  for (const [type, count] of countByType(components)) {
    total += basePremiumForComponentGroup(type, count);
  }
  return total;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;

function riskSurchargeRateFor(item: ItemInput): number {
  let rate = 0;
  if (item.cursed === true) {
    rate += CURSE_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    rate += HIGH_ENCHANTMENT_SURCHARGE;
  }
  return rate;
}

function itemSurcharges(items: ItemInput[]): number {
  return items.reduce(
    (total, item) => total + basePremiumFor(item) * riskSurchargeRateFor(item),
    0,
  );
}

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;

const FOLLOW_UP_DISCOUNT = 0.15;

function policyWideModifierRate(
  customer: Customer,
  previousContracts: number,
): number {
  let rate = FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    rate -= LOYALTY_DISCOUNT;
  }
  if (previousContracts > 0) {
    rate -= FOLLOW_UP_DISCOUNT;
  }
  return rate;
}

function quotePremium(
  items: ItemInput[],
  customer: Customer,
  previousContracts: number,
): number {
  const basePremium = policyBasePremium(items);

  return roundPremiumInMHPCOFavor(
    basePremium +
      itemSurcharges(items) +
      basePremium * policyWideModifierRate(customer, previousContracts) +
      PROCESSING_FEE,
  );
}

const CAP_FACTOR = 2;
const DEDUCTIBLE = 100;

interface Policy {
  items: ItemInput[];
  remainingCap: number;
}

function insuranceSum(items: ItemInput[]): number {
  return items.reduce(
    (sum, item) => sum + priceListEntryFor(item.type).insuranceValue,
    0,
  );
}

function openPolicy(items: ItemInput[]): Policy {
  return { items, remainingCap: insuranceSum(items) * CAP_FACTOR };
}

const REDUCED_REIMBURSEMENT = 0.5;
const REDUCED_REIMBURSEMENT_LEVEL = 8;

function reimbursementRateFor(item: ItemInput): number {
  if ((item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL) {
    return REDUCED_REIMBURSEMENT;
  }
  return 1;
}

function reimbursementFor(damage: Damage, item: ItemInput): number {
  if (damage.amount < 0) {
    throw new Error(`invalid damage amount: ${damage.amount}`);
  }
  return Math.max(0, damage.amount * reimbursementRateFor(item) - DEDUCTIBLE);
}

function claimInsuredItem(unclaimed: ItemInput[], damage: Damage): ItemInput {
  const index = unclaimed.findIndex(
    (insured) => insured.type === damage.itemType,
  );
  if (index === -1) {
    throw new Error(`item not insured: ${damage.itemType}`);
  }
  return unclaimed.splice(index, 1)[0];
}

function settleClaim(policy: Policy, damages: Damage[]): StepResult {
  const unclaimed = [...policy.items];
  const desiredPayout = damages.reduce(
    (total, damage) =>
      total + reimbursementFor(damage, claimInsuredItem(unclaimed, damage)),
    0,
  );
  const payout = roundPayoutInMHPCOFavor(
    Math.min(desiredPayout, policy.remainingCap),
  );

  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  let previousContracts = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (policy === undefined) {
        throw new Error(`no policy at step ${step.policy}`);
      }
      return settleClaim(policy, step.incident.damages);
    }

    const premium = quotePremium(step.items, scenario.customer, previousContracts);
    previousContracts += 1;
    policies.set(index, openPolicy(step.items));
    return { premium };
  });
}
