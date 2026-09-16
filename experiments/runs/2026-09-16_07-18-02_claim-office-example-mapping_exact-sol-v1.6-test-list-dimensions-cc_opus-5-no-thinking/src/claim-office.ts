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

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;

interface Policy {
  items: Item[];
  remainingCap: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const DEDUCTIBLE_PER_DAMAGE = 100;
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  let previousContracts = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      return settleClaim(step, policies);
    }

    const premium = quotePremium(step.items, scenario.customer, previousContracts);
    previousContracts += 1;
    policies.set(index, { items: step.items, remainingCap: capFor(step.items) });

    return { premium };
  });
}

function capFor(items: Item[]): number {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValueOf(item.type), 0);

  return insuranceSum * CAP_MULTIPLIER;
}

function insuranceValueOf(type: string): number {
  return pricedAmount(INSURANCE_VALUES, type);
}

/** The MHPCO insures only the item types listed in its price list. */
function pricedAmount(priceList: Record<string, number>, type: string): number {
  const amount = priceList[type];
  if (amount === undefined) {
    throw new Error(`The MHPCO price list does not cover items of type "${type}".`);
  }

  return amount;
}

function settleClaim(step: ClaimStep, policies: Map<number, Policy>): ClaimResult {
  const policy = policies.get(step.policy);
  if (policy === undefined) {
    throw new Error(`Step ${step.policy} did not create a policy.`);
  }

  rejectInadmissibleDamages(step.incident);

  const unclaimed = [...policy.items];
  const claimed = step.incident.damages.reduce(
    (sum, damage) => sum + reimbursementFor(damage, claimDamagedItem(unclaimed, damage)),
    0,
  );

  return payUpToRemainingCap(policy, claimed);
}

/** The MHPCO never pays more than a policy's remaining cap; each payout depletes it. */
function payUpToRemainingCap(policy: Policy, claimed: number): ClaimResult {
  const payout = Math.floor(Math.min(claimed, policy.remainingCap));
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}

/** The MHPCO accepts a damage report only for a non-negative amount of damage. */
function rejectInadmissibleDamages(incident: Incident): void {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`A damage report cannot claim a negative amount (${damage.amount} G).`);
    }
  }
}

/**
 * Each damage is settled against one insured item, so an incident cannot claim more
 * items of a type than the policy covers.
 */
function claimDamagedItem(unclaimed: Item[], damage: Damage): Item {
  const index = unclaimed.findIndex((candidate) => candidate.type === damage.itemType);
  if (index === -1) {
    throw new Error(`The policy does not cover a further item of type "${damage.itemType}".`);
  }

  return unclaimed.splice(index, 1)[0];
}

function reimbursementFor(damage: Damage, item: Item): number {
  const reimbursed = damage.amount * reimbursementRateFor(item);

  return Math.max(reimbursed - DEDUCTIBLE_PER_DAMAGE, 0);
}

/** The MHPCO reimburses damage in full unless a clause of the policy reduces it. */
function reimbursementRateFor(item: Item): number {
  if ((item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL) {
    return REDUCED_REIMBURSEMENT_RATE;
  }

  return 1;
}

function policyBasePremiumOf(items: Item[]): number {
  const countsByType = new Map<string, number>();
  for (const item of items) {
    countsByType.set(item.type, (countsByType.get(item.type) ?? 0) + 1);
  }

  let basePremium = 0;
  for (const [type, count] of countsByType) {
    basePremium += basePremiumForAlikeItems(type, count);
  }

  return basePremium;
}

function basePremiumOf(type: string): number {
  return pricedAmount(BASE_PREMIUMS, type);
}

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function basePremiumForAlikeItems(type: string, count: number): number {
  if (isComponent(type) && count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_PREMIUM;
  }

  return count * basePremiumOf(type);
}

function riskSurchargeFor(item: Item): number {
  const itemBasePremium = basePremiumOf(item.type);
  let surcharge = 0;

  if (item.cursed === true) {
    surcharge += itemBasePremium * CURSE_SURCHARGE_RATE;
  }
  if (isHighlyEnchanted(item)) {
    surcharge += itemBasePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }

  return surcharge;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  const policyBasePremium = policyBasePremiumOf(items);
  const riskSurcharges = items.reduce((sum, item) => sum + riskSurchargeFor(item), 0);
  const customerAdjustment =
    policyBasePremium * customerModifierRate(customer, previousContracts);

  return Math.ceil(
    policyBasePremium + riskSurcharges + customerAdjustment + PROCESSING_FEE,
  );
}

function customerModifierRate(customer: Customer, previousContracts: number): number {
  let rate = FIRST_INSURANCE_RATE;

  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    rate -= LOYALTY_DISCOUNT_RATE;
  }
  if (previousContracts > 0) {
    rate -= FOLLOW_UP_DISCOUNT_RATE;
  }

  return rate;
}
