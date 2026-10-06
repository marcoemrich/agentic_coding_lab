const PROCESSING_FEE = 5;
const FIRST_INSURANCE_PERCENT = 10;
const PERCENT = 100;

/**
 * The MHPCO price list: every insurable item type with its insurance value and
 * base premium. Components, such as runes and moonstones, qualify for the
 * building-block offer.
 */
interface ListedItem {
  insuranceValue: number;
  basePremium: number;
  isComponent?: true;
}

const PRICE_LIST: Record<string, ListedItem> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25, isComponent: true },
  moonstone: { insuranceValue: 250, basePremium: 25, isComponent: true },
};

const CAP_FACTOR = 2;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const CURSE_PERCENT = 50;
const HIGH_ENCHANTMENT_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_PERCENT = 15;
const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT_PERCENT = 50;
const REDUCED_REIMBURSEMENT_LEVEL = 8;

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

/** Premiums are rounded in the MHPCO's favor, i.e. up. */
function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

/** The MHPCO insures only the item types on its price list. */
function listed(itemType: string): ListedItem {
  const entry = PRICE_LIST[itemType];
  if (entry === undefined) {
    throw new Error(`MHPCO does not insure items of type "${itemType}"`);
  }
  return entry;
}

function basePremium(item: Item): number {
  return listed(item.type).basePremium;
}

function countsByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

/**
 * A building block of exactly 3 alike components is offered at a special
 * base premium; otherwise every item is priced from the price list.
 */
function groupBasePremium(type: string, count: number): number {
  const entry = listed(type);
  const isBuildingBlock = entry.isComponent === true && count === BLOCK_SIZE;
  return isBuildingBlock ? BLOCK_BASE_PREMIUM : count * entry.basePremium;
}

function policyBasePremium(items: Item[]): number {
  let total = 0;
  for (const [type, count] of countsByType(items)) {
    total += groupBasePremium(type, count);
  }
  return total;
}

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function itemSurchargePercent(item: Item): number {
  const curse = isCursed(item) ? CURSE_PERCENT : 0;
  const enchantment = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_PERCENT : 0;
  return curse + enchantment;
}

/**
 * Item-specific risk surcharges apply to the base premium of the affected item
 * (reading adopted: its price-list base premium, independent of any
 * building-block discount, which the specification applies to the policy
 * premium only).
 */
function itemSurcharges(items: Item[]): number {
  return items.reduce(
    (sum, item) => sum + (basePremium(item) * itemSurchargePercent(item)) / PERCENT,
    0,
  );
}

export interface Customer {
  yearsWithMHPCO: number;
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

const NEW_CUSTOMER: Customer = { yearsWithMHPCO: 0 };

/**
 * Policy-wide modifiers apply to the policy base premium: an initial
 * assessment surcharge on every newly insured item, a loyalty discount for
 * long-standing customers, and a discount on each contract after the
 * customer's first.
 */
function policyWideModifiers(policyBase: number, history: CustomerHistory): number {
  const firstInsuranceSurcharge = (policyBase * FIRST_INSURANCE_PERCENT) / PERCENT;
  const loyaltyDiscount = isLongStanding(history.customer)
    ? (policyBase * LOYALTY_PERCENT) / PERCENT
    : 0;
  const followUpDiscount =
    history.previousContracts > 0 ? (policyBase * FOLLOW_UP_PERCENT) / PERCENT : 0;
  return firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;
}

export interface CustomerHistory {
  customer: Customer;
  previousContracts: number;
}

const NEW_CUSTOMER_HISTORY: CustomerHistory = {
  customer: NEW_CUSTOMER,
  previousContracts: 0,
};

export function quote(items: Item[], history: CustomerHistory = NEW_CUSTOMER_HISTORY): number {
  const policyBase = policyBasePremium(items);
  const premium = policyBase + itemSurcharges(items);
  return roundPremium(premium + policyWideModifiers(policyBase, history) + PROCESSING_FEE);
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

/** Payouts are rounded in the MHPCO's favor, i.e. down. */
function roundPayout(amount: number): number {
  return Math.floor(amount);
}

/**
 * Damage to items with enchantment level >= 8 is reimbursed at 50 % of the
 * damage amount; otherwise the damage is reimbursed in full.
 */
function reimbursableDamage(damage: Damage, item: Item): number {
  if ((item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL) {
    return (damage.amount * REDUCED_REIMBURSEMENT_PERCENT) / PERCENT;
  }
  return damage.amount;
}

/** A reported damage must name a non-negative amount to be settled. */
function validateDamage(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`A damage amount cannot be negative: ${damage.amount}`);
  }
}

/** A deductible applies per damage event. */
function reimbursement(damage: Damage, item: Item): number {
  return reimbursableDamage(damage, item) - DEDUCTIBLE;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + listed(item.type).insuranceValue, 0);
}

/**
 * A policy created by a quote step. The total payout per policy is capped at
 * twice its insurance sum, so each claim is paid only up to the cap that is
 * still available.
 */
class Policy {
  remainingCap: number;

  constructor(readonly items: Item[]) {
    this.remainingCap = insuranceSum(items) * CAP_FACTOR;
  }

  payUpToCap(desiredPayout: number): number {
    const payout = Math.min(desiredPayout, this.remainingCap);
    this.remainingCap -= payout;
    return payout;
  }
}

/**
 * The policies a scenario has issued. A policy is identified by the index of
 * the quote step that created it, and its total payout is capped at twice its
 * insurance sum.
 */
class PolicyRegister {
  private readonly policies = new Map<number, Policy>();

  issue(stepIndex: number, items: Item[]): void {
    this.policies.set(stepIndex, new Policy(items));
  }

  find(stepIndex: number): Policy {
    const policy = this.policies.get(stepIndex);
    if (policy === undefined) {
      throw new Error(`No policy was created by step ${stepIndex}`);
    }
    return policy;
  }
}

/**
 * Every damage entry refers to one insured item of its type, so a damaged item
 * is claimed at most once per incident. A claim naming more items of a type
 * than the policy covers is rejected as a whole.
 */
class InsuredItems {
  private readonly unclaimed: Item[];

  constructor(items: Item[]) {
    this.unclaimed = [...items];
  }

  claim(itemType: string): Item {
    const index = this.unclaimed.findIndex((insured) => insured.type === itemType);
    if (index < 0) {
      throw new Error(`The policy does not cover a further item of type "${itemType}"`);
    }
    return this.unclaimed.splice(index, 1)[0];
  }
}

function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  const insured = new InsuredItems(policy.items);
  incident.damages.forEach(validateDamage);
  const desired = incident.damages.reduce(
    (sum, damage) => sum + reimbursement(damage, insured.claim(damage.itemType)),
    0,
  );
  const payout = policy.payUpToCap(roundPayout(desired));
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new PolicyRegister();
  let contracts = 0;
  return scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      return settleClaim(policies.find(step.policy), step.incident);
    }
    const premium = quote(step.items, {
      customer: scenario.customer,
      previousContracts: contracts,
    });
    contracts += 1;
    policies.issue(index, step.items);
    return { premium };
  });
}
