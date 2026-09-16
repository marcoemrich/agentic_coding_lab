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

export interface ScenarioResults {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_TYPES = ["rune", "moonstone"];

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.includes(type);
}

/** The MHPCO insures only the items on its price list. */
function isInsurable(type: string): boolean {
  return isComponent(type) || type in MAIN_ITEM_BASE_PREMIUMS;
}

function requireInsurableItems(items: Item[]): void {
  for (const item of items) {
    if (!isInsurable(item.type)) {
      throw new Error(`The MHPCO does not insure items of type "${item.type}"`);
    }
  }
}
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

/** The MHPCO rounds every premium up: a fraction of a G always favours the office. */
function roundPremiumInMHPCOsFavour(amount: number): number {
  return Math.ceil(amount);
}

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

/** Components are priced per piece, with a special offer for a block of exactly 3 alike ones. */
function componentsBasePremium(count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * COMPONENT_BASE_PREMIUM;
}

function basePremiumForType(type: string, count: number): number {
  if (isComponent(type)) {
    return componentsBasePremium(count);
  }
  return count * MAIN_ITEM_BASE_PREMIUMS[type];
}

const CURSE_SURCHARGE_RATE = 0.5;

function itemBasePremium(item: Item): number {
  if (isComponent(item.type)) {
    return COMPONENT_BASE_PREMIUM;
  }
  return MAIN_ITEM_BASE_PREMIUMS[item.type];
}

const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function itemSurchargeRate(item: Item): number {
  const curse = item.cursed === true ? CURSE_SURCHARGE_RATE : 0;
  const enchantment = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return curse + enchantment;
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemBasePremium(item) * itemSurchargeRate(item), 0);
}

/** The sum of all insured items' base premiums, per the MHPCO price list. */
function policyBasePremium(items: Item[]): number {
  let basePremium = 0;
  for (const [type, count] of countByType(items)) {
    basePremium += basePremiumForType(type, count);
  }
  return basePremium;
}

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;
}

const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

function policyModifierRate(customer: Customer, previousContracts: number): number {
  const loyalty = isLongStanding(customer) ? -LOYALTY_DISCOUNT_RATE : 0;
  const followUp = previousContracts > 0 ? -FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0;
  return FIRST_INSURANCE_SURCHARGE_RATE + loyalty + followUp;
}

/** Policy-wide modifiers apply to the policy base premium; the fee is added at the very end. */
function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  requireInsurableItems(items);
  const basePremium = policyBasePremium(items);
  const policyModifiers = basePremium * policyModifierRate(customer, previousContracts);
  return roundPremiumInMHPCOsFavour(
    basePremium + itemSurcharges(items) + policyModifiers + PROCESSING_FEE,
  );
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE_PER_DAMAGE = 100;

function itemInsuranceValue(item: Item): number {
  if (isComponent(item.type)) {
    return COMPONENT_INSURANCE_VALUE;
  }
  return INSURANCE_VALUES[item.type];
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

/** The MHPCO rounds every payout down: a fraction of a G always favours the office. */
function roundPayoutInMHPCOsFavour(amount: number): number {
  return Math.floor(amount);
}

const SEVERE_ENCHANTMENT_THRESHOLD = 8;
const SEVERE_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function isSeverelyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= SEVERE_ENCHANTMENT_THRESHOLD;
}

/**
 * Damage to a severely enchanted item is reimbursed at 50 %. Damage to a
 * dragon-material item is reimbursed in full, as is any other damage, so the
 * dragon-material clause never changes the rate; where both clauses apply the
 * 50 % rule wins.
 */
function reimbursementRate(item: Item): number {
  return isSeverelyEnchanted(item) ? SEVERE_ENCHANTMENT_REIMBURSEMENT_RATE : 1;
}

function reimbursementFor(damage: Damage, item: Item): number {
  return Math.max(damage.amount * reimbursementRate(item) - DEDUCTIBLE_PER_DAMAGE, 0);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

/** What the MHPCO owes for the incident before the policy cap is considered. */
/** Each damage entry names one insured item, and no insured item is damaged twice. */
function coveredItemsFor(damages: Damage[], items: Item[]): Item[] {
  const unclaimed = [...items];
  return damages.map((damage) => {
    const index = unclaimed.findIndex((candidate) => candidate.type === damage.itemType);
    if (index === -1) {
      throw new Error(`The policy does not cover an item of type "${damage.itemType}"`);
    }
    return unclaimed.splice(index, 1)[0];
  });
}

function requireReportableDamages(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`A damage amount cannot be negative, but was ${damage.amount} G`);
    }
  }
}

function desiredReimbursement(incident: Incident, items: Item[]): number {
  requireReportableDamages(incident.damages);
  const damagedItems = coveredItemsFor(incident.damages, items);
  return incident.damages.reduce(
    (sum, damage, index) => sum + reimbursementFor(damage, damagedItems[index]),
    0,
  );
}

/** The total payout per policy is capped at twice the insurance sum. */
function withdrawFromCap(policy: Policy, desired: number): number {
  const payout = roundPayoutInMHPCOsFavour(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return payout;
}

function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  const payout = withdrawFromCap(policy, desiredReimbursement(incident, policy.items));
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResults {
  const policies = new Map<number, Policy>();
  let contracts = 0;
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (policy === undefined) {
        throw new Error(`No policy was created by step ${step.policy}`);
      }
      return settleClaim(policy, step.incident);
    }
    const premium = quotePremium(step.items, scenario.customer, contracts);
    contracts += 1;
    policies.set(index, {
      items: step.items,
      remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
    });
    return { premium };
  });
  return { results };
}
