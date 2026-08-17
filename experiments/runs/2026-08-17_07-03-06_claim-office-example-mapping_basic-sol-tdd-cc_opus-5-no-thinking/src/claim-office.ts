export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;

const COMPONENT_BASE_PREMIUM = 25;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function componentsBasePremium(components: Item[]): number {
  let total = 0;
  for (const count of countByType(components).values()) {
    total += count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
  }
  return total;
}

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function itemPremium(item: Item): number {
  const base = basePremiumOf(item);
  const curseSurcharge = item.cursed === true ? base * CURSE_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = isHighlyEnchanted(item) ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return base + curseSurcharge + enchantmentSurcharge;
}

function lookupByType(priceList: Record<string, number>, item: Item): number {
  const value = priceList[item.type];
  if (value === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return value;
}

function basePremiumOf(item: Item): number {
  return lookupByType(BASE_PREMIUMS, item);
}

function sumPolicy(items: Item[], premiumOf: (item: Item) => number): number {
  const mainItems = items.filter((item) => !isComponent(item));
  const components = items.filter(isComponent);
  return mainItems.reduce((sum, item) => sum + premiumOf(item), 0) + componentsBasePremium(components);
}

/** Sum of the item base premiums including item-specific surcharges (curse, high enchantment). */
export function policyBasePremium(items: Item[]): number {
  return sumPolicy(items, itemPremium);
}

/**
 * The sum of the items' unmodified base premiums. Policy-wide modifiers
 * (loyalty, first insurance, follow-up contract) are percentages of this
 * amount, not of the item-modified subtotal -- see the spec's integration
 * examples, where the surcharges are 10 % and 20 % of 100 G, not of 150 G.
 */
function unmodifiedBasePremium(items: Item[]): number {
  return sumPolicy(items, basePremiumOf);
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

// Policy-wide modifier rates, applied to the unmodified base premium sum.
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

export function quote(customer: Customer, items: Item[], isFollowUpContract = false): number {
  const withItemModifiers = policyBasePremium(items);
  const unmodifiedBase = unmodifiedBasePremium(items);
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_YEARS ? unmodifiedBase * LOYALTY_DISCOUNT_RATE : 0;
  const firstInsuranceSurcharge = unmodifiedBase * FIRST_INSURANCE_SURCHARGE_RATE;
  const followUpDiscount = isFollowUpContract ? unmodifiedBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  const premium =
    withItemModifiers - loyaltyDiscount + firstInsuranceSurcharge - followUpDiscount + PROCESSING_FEE;
  return Math.ceil(premium);
}

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const COMPONENT_INSURANCE_VALUE = 250;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: COMPONENT_INSURANCE_VALUE,
  moonstone: COMPONENT_INSURANCE_VALUE,
};

function insuranceValueOf(item: Item): number {
  return lookupByType(INSURANCE_VALUES, item);
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

const REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

function damagePayout(damage: Damage, item: Item): number {
  const reduced = (item.enchantment ?? 0) >= REIMBURSEMENT_ENCHANTMENT_LEVEL;
  const reimbursed = reduced ? damage.amount * REDUCED_REIMBURSEMENT_RATE : damage.amount;
  return Math.max(0, reimbursed - DEDUCTIBLE);
}

/**
 * Matches each damage entry to a distinct insured item. A policy covering one
 * sword cannot absorb two sword damages -- the spec rejects the whole claim.
 */
function matchDamagesToItems(policy: Policy, damages: Damage[]): { damage: Damage; item: Item }[] {
  const available = [...policy.items];
  return damages.map((damage) => {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative: ${String(damage.amount)}`);
    }
    const index = available.findIndex((candidate) => candidate.type === damage.itemType);
    if (index === -1) {
      throw new Error(`Damaged item is not covered by the policy: ${damage.itemType}`);
    }
    const [item] = available.splice(index, 1);
    return { damage, item };
  });
}

function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  const matched = matchDamagesToItems(policy, incident.damages);
  const desired = matched.reduce((sum, { damage, item }) => sum + damagePayout(damage, item), 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (policy === undefined) {
        throw new Error(`Claim references unknown policy at step ${String(step.policy)}`);
      }
      return settleClaim(policy, step.incident);
    }
    const premium = quote(scenario.customer, step.items, quoteCount > 0);
    quoteCount += 1;
    policies.set(index, { items: step.items, remainingCap: insuranceSum(step.items) * CAP_FACTOR });
    return { premium };
  });
}
