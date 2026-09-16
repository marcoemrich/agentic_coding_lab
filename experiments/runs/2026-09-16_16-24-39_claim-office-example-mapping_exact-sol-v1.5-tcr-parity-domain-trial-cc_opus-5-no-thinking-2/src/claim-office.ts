export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

const PROCESSING_FEE = 5;

const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

const MAIN_ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;

const DEDUCTIBLE_PER_DAMAGE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const CAP_FACTOR = 2;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

function isInsurable(type: string): boolean {
  return type in MAIN_ITEM_BASE_PREMIUMS || COMPONENT_TYPES.includes(type);
}

/** The MHPCO insures only the item types on its price list. */
function requireInsurableItems(items: Item[]): void {
  for (const item of items) {
    if (!isInsurable(item.type)) {
      throw new Error(`The MHPCO does not insure items of type "${item.type}"`);
    }
  }
}

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

/** A building block of 3 alike components is offered at a special base premium. */
function basePremiumForAlikeComponents(count: number): number {
  if (count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_BASE_PREMIUM;
  }
  return count * COMPONENT_BASE_PREMIUM;
}

function componentsBasePremium(components: Item[]): number {
  let total = 0;
  for (const [, count] of countByType(components)) {
    total += basePremiumForAlikeComponents(count);
  }
  return total;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function riskSurchargeFor(item: Item, basePremium: number): number {
  let surcharge = 0;
  if (item.cursed === true) {
    surcharge += basePremium * CURSE_SURCHARGE_RATE;
  }
  if (isHighlyEnchanted(item)) {
    surcharge += basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
}

function mainItemsBasePremium(mainItems: Item[]): number {
  return mainItems.reduce(
    (total, item) => total + MAIN_ITEM_BASE_PREMIUMS[item.type],
    0,
  );
}

/** The policy base premium is the sum of all item base premiums. */
export function policyBasePremium(items: Item[]): number {
  return (
    mainItemsBasePremium(items.filter((item) => !isComponent(item))) +
    componentsBasePremium(items.filter(isComponent))
  );
}

/** Item-specific modifiers apply to the base premium of the affected item. */
function itemRiskSurcharges(items: Item[]): number {
  return items
    .filter((item) => !isComponent(item))
    .reduce(
      (total, item) =>
        total + riskSurchargeFor(item, MAIN_ITEM_BASE_PREMIUMS[item.type]),
      0,
    );
}

function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

/** Policy-wide modifiers apply to the policy base premium. */
function customerModifiers(
  customer: Customer,
  previousContracts: number,
  basePremium: number,
): number {
  let modifiers = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  if (isLongStandingCustomer(customer)) {
    modifiers -= basePremium * LOYALTY_DISCOUNT_RATE;
  }
  if (previousContracts > 0) {
    modifiers -= basePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
  }
  return modifiers;
}

/** All amounts are rounded to whole G in the MHPCO's favor. */
function roundPremiumInMhpcoFavor(premium: number): number {
  return Math.ceil(premium);
}

export function quote(
  customer: Customer,
  items: Item[],
  previousContracts = 0,
): number {
  requireInsurableItems(items);
  const basePremium = policyBasePremium(items);
  return roundPremiumInMhpcoFavor(
    basePremium +
      itemRiskSurcharges(items) +
      customerModifiers(customer, previousContracts, basePremium) +
      PROCESSING_FEE,
  );
}

export function insuranceValueFor(item: Item): number {
  return isComponent(item)
    ? COMPONENT_INSURANCE_VALUE
    : MAIN_ITEM_INSURANCE_VALUES[item.type];
}

/** The insurance sum is the sum of the items' insurance values. */
export function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + insuranceValueFor(item), 0);
}

export interface Damage {
  itemType: string;
  amount: number;
}

/** All amounts are rounded to whole G in the MHPCO's favor. */
function roundPayoutInMhpcoFavor(payout: number): number {
  return Math.floor(payout);
}

/** Damage to items with enchantment level >= 8 is reimbursed at 50 %. */
function isHighlyEnchantedForClaims(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

/**
 * Damage to dragon-material items is fully reimbursed -- which is also the
 * default rate. Where both clauses apply, the 50 % rule wins, so the material
 * never changes the outcome and needs no branch of its own.
 */
function reimbursementRateFor(item: Item): number {
  return isHighlyEnchantedForClaims(item)
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;
}

/** A damage event reports how much damage was done, never a negative amount. */
function requireReportedDamage(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(
      `A damage amount cannot be negative, but was ${String(damage.amount)}`,
    );
  }
}

/** A deductible of 100 G applies per damage event. */
function reimbursementFor(damage: Damage, item: Item): number {
  requireReportedDamage(damage);
  return damage.amount * reimbursementRateFor(item) - DEDUCTIBLE_PER_DAMAGE;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
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

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

/**
 * Each damage entry is a separate damage to a separate insured item, so every
 * entry claims one still-unclaimed item of its type.
 */
function coveredItemFor(unclaimed: Item[], damage: Damage): Item {
  const index = unclaimed.findIndex(
    (insured) => insured.type === damage.itemType,
  );
  if (index === -1) {
    throw new Error(
      `The policy does not cover a further item of type "${damage.itemType}"`,
    );
  }
  return unclaimed.splice(index, 1)[0];
}

/** A claim pays the reimbursable damage, limited by the policy's remaining cap. */
function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  const unclaimed = [...policy.items];
  const reimbursable = incident.damages.reduce(
    (total, damage) =>
      total + reimbursementFor(damage, coveredItemFor(unclaimed, damage)),
    0,
  );
  const payout = roundPayoutInMhpcoFavor(
    Math.min(reimbursable, policy.remainingCap),
  );
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  // Each quote is a contract; later ones are follow-up contracts.
  let previousContracts = 0;
  const policies = new Map<number, Policy>();

  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "quote") {
      const premium = quote(scenario.customer, step.items, previousContracts);
      previousContracts += 1;
      policies.set(index, {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_FACTOR,
      });
      return { premium };
    }

    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`No policy was created by step ${String(step.policy)}`);
    }

    return settleClaim(policy, step.incident);
  });

  return { results };
}
