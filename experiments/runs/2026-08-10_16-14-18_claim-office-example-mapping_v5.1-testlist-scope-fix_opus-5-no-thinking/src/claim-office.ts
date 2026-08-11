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

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;

const FIRST_INSURANCE_SURCHARGE = 0.1;

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
  component?: true;
}

/** The MHPCO price list: insurance value and base premium per item type. */
const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25, component: true },
  moonstone: { insuranceValue: 250, basePremium: 25, component: true },
};

function basePremiumOf(type: string): number {
  return PRICE_LIST[type].basePremium;
}

function insuranceValueOf(type: string): number {
  return PRICE_LIST[type].insuranceValue;
}

/** Premiums are rounded in the MHPCO's favour, i.e. up. */
function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

function isComponent(item: Item): boolean {
  return PRICE_LIST[item.type].component === true;
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

/** A block of exactly 3 alike components is offered at a special premium. */
function componentsBasePremium(components: Item[]): number {
  let total = 0;
  for (const [type, count] of countByType(components)) {
    total += count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * basePremiumOf(type);
  }
  return total;
}

function mainItemsBasePremium(mainItems: Item[]): number {
  return mainItems.reduce((sum, item) => sum + basePremiumOf(item.type), 0);
}

function policyBasePremium(items: Item[]): number {
  return (
    mainItemsBasePremium(items.filter((item) => !isComponent(item))) +
    componentsBasePremium(items.filter(isComponent))
  );
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;

/** Item-specific modifiers apply to the base premium of the affected item. */
function itemSurcharge(item: Item): number {
  const base = basePremiumOf(item.type);
  const curse = item.cursed ? base * CURSE_SURCHARGE : 0;
  const enchantment =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? base * HIGH_ENCHANTMENT_SURCHARGE : 0;
  return curse + enchantment;
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((total, item) => total + itemSurcharge(item), 0);
}

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

/**
 * Policy-wide modifiers apply to the policy base premium (the sum of all item
 * base premiums). Discounts are negative, surcharges positive.
 */
function policyModifiers(policyBase: number, customer: Customer, previousContracts: number): number {
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_YEARS ? -policyBase * LOYALTY_DISCOUNT : 0;
  const firstInsurance = policyBase * FIRST_INSURANCE_SURCHARGE;
  const followUp = previousContracts > 0 ? -policyBase * FOLLOW_UP_CONTRACT_DISCOUNT : 0;
  return loyalty + firstInsurance + followUp;
}

function assertKnownItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in PRICE_LIST)) {
      throw new Error(`unknown item type "${item.type}"`);
    }
  }
}

function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  assertKnownItemTypes(items);
  const policyBase = policyBasePremium(items);
  return roundPremium(
    policyBase +
      itemSurcharges(items) +
      policyModifiers(policyBase, customer, previousContracts) +
      PROCESSING_FEE,
  );
}

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;

/** Payouts are rounded in the MHPCO's favour, i.e. down. */
function roundPayout(amount: number): number {
  return Math.floor(amount);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueOf(item.type), 0);
}

const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

/**
 * Damage to items with enchantment >= 8 is reimbursed at 50 %; the deductible
 * of 100 G then applies per damage event.
 */
function reimbursement(damage: Damage, item: Item): number {
  const covered =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL
      ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT
      : damage.amount;
  return Math.max(0, covered - DEDUCTIBLE);
}

/**
 * Matches each damage entry to a distinct insured item: two damages of the same
 * type require two insured items of that type. Throws if a damage cannot be
 * matched, which rejects the whole claim.
 */
function matchDamagesToItems(incident: Incident, policy: Policy): [Damage, Item][] {
  const available = [...policy.items];
  return incident.damages.map((damage) => {
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`damaged item "${damage.itemType}" is not covered by the policy`);
    }
    return [damage, available.splice(index, 1)[0]];
  });
}

function assertNonNegativeAmounts(incident: Incident): void {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount ${damage.amount} must not be negative`);
    }
  }
}

/** Settles the incident against the policy, consuming its remaining cap. */
function settleClaim(incident: Incident, policy: Policy): ClaimResult {
  assertNonNegativeAmounts(incident);
  const desired = matchDamagesToItems(incident, policy).reduce(
    (total, [damage, item]) => total + reimbursement(damage, item),
    0,
  );
  const payout = roundPayout(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  let contracts = 0;

  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`step ${index} claims against unknown policy ${step.policy}`);
      }
      return settleClaim(step.incident, policy);
    }

    const premium = quotePremium(step.items, scenario.customer, contracts);
    contracts += 1;
    policies.set(index, {
      items: step.items,
      remainingCap: insuranceSum(step.items) * CAP_FACTOR,
    });
    return { premium };
  });

  return { results };
}
