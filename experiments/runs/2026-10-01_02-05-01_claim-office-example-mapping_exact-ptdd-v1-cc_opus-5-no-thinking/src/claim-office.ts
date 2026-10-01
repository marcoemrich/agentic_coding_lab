const PROCESSING_FEE = 5;
const SWORD_INSURANCE_VALUE = 1000;
const AMULET_INSURANCE_VALUE = 600;
const STAFF_INSURANCE_VALUE = 800;
const POTION_INSURANCE_VALUE = 400;
const COMPONENT_INSURANCE_VALUE = 250;
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE_PER_DAMAGE = 100;
const REDUCED_REIMBURSEMENT_ENCHANTMENT = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const SWORD_BASE_PREMIUM = 100;
const AMULET_BASE_PREMIUM = 60;
const STAFF_BASE_PREMIUM = 80;
const POTION_BASE_PREMIUM = 40;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

interface PriceListEntry {
  basePremium: number;
  insuranceValue: number;
}

// The MHPCO price list: what the office insures, and on what terms.
const MAIN_ITEM_PRICE_LIST: Record<string, PriceListEntry> = {
  sword: {
    basePremium: SWORD_BASE_PREMIUM,
    insuranceValue: SWORD_INSURANCE_VALUE,
  },
  amulet: {
    basePremium: AMULET_BASE_PREMIUM,
    insuranceValue: AMULET_INSURANCE_VALUE,
  },
  staff: {
    basePremium: STAFF_BASE_PREMIUM,
    insuranceValue: STAFF_INSURANCE_VALUE,
  },
  potion: {
    basePremium: POTION_BASE_PREMIUM,
    insuranceValue: POTION_INSURANCE_VALUE,
  },
};

const COMPONENT_TYPES: ReadonlySet<string> = new Set(["rune", "moonstone"]);

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
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

export interface Customer {
  yearsWithMHPCO: number;
}

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

function isInsurable(type: string): boolean {
  return isComponent(type) || type in MAIN_ITEM_PRICE_LIST;
}

function requireInsurable(type: string): void {
  if (!isInsurable(type)) {
    throw new Error(`The MHPCO does not insure items of type "${type}"`);
  }
}

function basePremiumOf(item: Item): number {
  if (isComponent(item.type)) {
    return COMPONENT_BASE_PREMIUM;
  }
  return MAIN_ITEM_PRICE_LIST[item.type].basePremium;
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function alikeComponentsBasePremium(count: number): number {
  const formsBlock = count === COMPONENT_BLOCK_SIZE;
  return formsBlock
    ? COMPONENT_BLOCK_BASE_PREMIUM
    : count * COMPONENT_BASE_PREMIUM;
}

function componentsBasePremium(items: Item[]): number {
  const components = items.filter((item) => isComponent(item.type));
  let total = 0;
  for (const count of countByType(components).values()) {
    total += alikeComponentsBasePremium(count);
  }
  return total;
}

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function itemSurchargeRate(item: Item): number {
  const curse = isCursed(item) ? CURSE_SURCHARGE_RATE : 0;
  const enchantment = isHighlyEnchanted(item)
    ? HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curse + enchantment;
}

function itemSurcharges(item: Item): number {
  return basePremiumOf(item) * itemSurchargeRate(item);
}

function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

function policyModifierRate(history: CustomerHistory): number {
  const loyalty = isLongStandingCustomer(history.customer)
    ? -LOYALTY_DISCOUNT_RATE
    : 0;
  const followUp = history.isFollowUpContract()
    ? -FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    : 0;
  return loyalty + followUp + FIRST_INSURANCE_SURCHARGE_RATE;
}

class CustomerHistory {
  private contracts = 0;

  constructor(readonly customer: Customer) {}

  isFollowUpContract(): boolean {
    return this.contracts > 0;
  }

  recordContract(): void {
    this.contracts += 1;
  }
}

function insuranceValueOf(item: Item): number {
  return isComponent(item.type)
    ? COMPONENT_INSURANCE_VALUE
    : MAIN_ITEM_PRICE_LIST[item.type].insuranceValue;
}

function isDeeplyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT;
}

// Clause precedence: the deeply-enchanted clause settles at 50 %, and the
// specification gives it precedence where both clauses apply. The
// dragon-material clause reimburses in full -- the same as an item with no
// clause at all -- so under the specified rates it needs no branch of its own.
function reimbursementRateFor(item: Item): number {
  return isDeeplyEnchanted(item)
    ? REDUCED_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;
}

function requireReportableDamage(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(
      `A damage amount cannot be negative, but ${damage.amount} was reported`,
    );
  }
}

function reimbursementFor(item: Item, damageAmount: number): number {
  return damageAmount * reimbursementRateFor(item) - DEDUCTIBLE_PER_DAMAGE;
}

// Each damage entry is settled against a distinct insured item, so a policy
// cannot pay twice for one insured object.
class PolicyCoverage {
  private readonly unclaimed: Item[];

  constructor(items: Item[]) {
    this.unclaimed = [...items];
  }

  claimItemFor(damage: Damage): Item {
    const index = this.unclaimed.findIndex(
      (candidate) => candidate.type === damage.itemType,
    );
    if (index === -1) {
      throw new Error(
        `The policy does not cover a further item of type "${damage.itemType}"`,
      );
    }
    return this.unclaimed.splice(index, 1)[0];
  }
}

class Policy {
  private remainingCap: number;

  constructor(readonly items: Item[]) {
    const insuranceSum = items.reduce(
      (sum, item) => sum + insuranceValueOf(item),
      0,
    );
    this.remainingCap = insuranceSum * CAP_MULTIPLIER;
  }

  settle(incident: Incident): ClaimResult {
    incident.damages.forEach(requireReportableDamage);
    const coverage = new PolicyCoverage(this.items);
    const desired = incident.damages.reduce(
      (sum, damage) =>
        sum + reimbursementFor(coverage.claimItemFor(damage), damage.amount),
      0,
    );
    const payout = roundPayoutInOfficeFavour(
      Math.min(desired, this.remainingCap),
    );
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }
}

function settleClaim(
  policiesByStep: Map<number, Policy>,
  step: ClaimStep,
): ClaimResult {
  const policy = policiesByStep.get(step.policy);
  if (policy === undefined) {
    throw new Error(`Step ${step.policy} did not issue a policy`);
  }
  return policy.settle(step.incident);
}

function roundPremiumInOfficeFavour(amount: number): number {
  return Math.ceil(amount);
}

function roundPayoutInOfficeFavour(amount: number): number {
  return Math.floor(amount);
}

function quote(items: Item[], history: CustomerHistory): QuoteResult {
  items.forEach((item) => requireInsurable(item.type));
  const mainItems = items.filter((item) => !isComponent(item.type));
  const base =
    mainItems.reduce((sum, item) => sum + basePremiumOf(item), 0) +
    componentsBasePremium(items);
  const surcharges = items.reduce(
    (sum, item) => sum + itemSurcharges(item),
    0,
  );
  const policyModifiers = base * policyModifierRate(history);
  const premium = base + surcharges + policyModifiers + PROCESSING_FEE;
  return { premium: roundPremiumInOfficeFavour(premium) };
}

export function runScenario(scenario: Scenario): StepResult[] {
  const history = new CustomerHistory(scenario.customer);
  const policiesByStep = new Map<number, Policy>();
  return scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      return settleClaim(policiesByStep, step);
    }
    const result = quote(step.items, history);
    policiesByStep.set(stepIndex, new Policy(step.items));
    history.recordContract();
    return result;
  });
}
