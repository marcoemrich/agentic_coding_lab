const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const REDUCED_REIMBURSEMENT = 0.5;
const REDUCED_REIMBURSEMENT_LEVEL = 8;

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

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface ScenarioResults {
  results: (QuoteResult | ClaimResult)[];
}

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

/** A building block of 3 alike components -- alike meaning the very same type. */
function formsBlock(type: string, count: number): boolean {
  return COMPONENT_TYPES.has(type) && count === BLOCK_SIZE;
}

function policyBasePremium(items: Item[]): number {
  let total = 0;
  for (const [type, count] of countByType(items)) {
    total += formsBlock(type, count) ? BLOCK_PREMIUM : count * BASE_PREMIUMS[type];
  }
  return total;
}

/** The MHPCO only insures items on its price list. */
function requireInsurableType(type: string): void {
  if (!(type in BASE_PREMIUMS)) {
    throw new Error(`unknown item type: ${type}`);
  }
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
}

/** Payouts are rounded down: every fraction of a G stays with the MHPCO. */
function roundPayoutInMHPCOsFavour(amount: number): number {
  return Math.floor(amount);
}

/** Damage to a heavily enchanted item is reimbursed at only half the damage amount. */
function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL ? REDUCED_REIMBURSEMENT : 1;
}

function reimbursement(damage: Damage, item: Item): number {
  return damage.amount * reimbursementRate(item) - DEDUCTIBLE;
}

/** A quote issues a policy: the total payout is capped at twice the insurance sum. */
function issuePolicy(items: Item[]): Policy {
  return { items, remainingCap: insuranceSum(items) * CAP_MULTIPLIER };
}

/** Each damage entry names one insured item; admissibility is established beforehand. */
function insuredItemFor(policy: Policy, damage: Damage): Item {
  return policy.items.find((candidate) => candidate.type === damage.itemType) as Item;
}

/** A damage report states what was lost, so it cannot report a negative amount. */
function requireValidAmounts(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must not be negative: ${damage.amount}`);
    }
  }
}

/** A policy covers each damaged item once: no more damages of a type than items insured. */
function requireDamagesWithinPolicy(policy: Policy, damages: Damage[]): void {
  const insured = countByType(policy.items);
  for (const [type, count] of countByType(damages.map((damage) => ({ type: damage.itemType })))) {
    const covered = insured.get(type);
    if (covered === undefined) {
      throw new Error(`damaged item is not covered by the policy: ${type}`);
    }
    if (count > covered) {
      throw new Error(`claim reports more damaged ${type} items than the policy covers`);
    }
  }
}

function settleClaim(policy: Policy, damages: Damage[]): ClaimResult {
  requireValidAmounts(damages);
  requireDamagesWithinPolicy(policy, damages);
  const desired = damages.reduce(
    (sum, damage) => sum + reimbursement(damage, insuredItemFor(policy, damage)),
    0,
  );
  const payout = roundPayoutInMHPCOsFavour(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

/** Premiums are rounded up: every fraction of a G falls to the MHPCO. */
function roundPremiumInMHPCOsFavour(amount: number): number {
  return Math.ceil(amount);
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function riskRate(item: Item): number {
  const curse = item.cursed === true ? CURSE_SURCHARGE : 0;
  const enchantment = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE : 0;
  return curse + enchantment;
}

/** Item-specific risk surcharges apply to the base premium of the affected item. */
function itemRiskSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => sum + BASE_PREMIUMS[item.type] * riskRate(item), 0);
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

/** Policy-wide modifiers apply to the policy base premium -- the sum of all item base premiums. */
function policyModifierRate(customer: Customer, previousContracts: number): number {
  const loyalty = isLongStanding(customer) ? -LOYALTY_DISCOUNT : 0;
  const followUp = previousContracts > 0 ? -FOLLOW_UP_DISCOUNT : 0;
  return FIRST_INSURANCE_SURCHARGE + loyalty + followUp;
}

function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  const base = policyBasePremium(items);
  return roundPremiumInMHPCOsFavour(
    base +
      itemRiskSurcharges(items) +
      base * policyModifierRate(customer, previousContracts) +
      PROCESSING_FEE,
  );
}

/** The customer's running history: the contracts taken out and the policies they created. */
class ScenarioLedger {
  private readonly policies = new Map<number, Policy>();
  private contracts = 0;

  constructor(private readonly customer: Customer) {}

  takeOutContract(step: QuoteStep, stepIndex: number): QuoteResult {
    step.items.forEach((item) => requireInsurableType(item.type));
    const premium = quotePremium(step.items, this.customer, this.contracts);
    this.contracts += 1;
    this.policies.set(stepIndex, issuePolicy(step.items));
    return { premium };
  }

  reportIncident(step: ClaimStep): ClaimResult {
    return settleClaim(this.policyFor(step.policy), step.incident.damages);
  }

  private policyFor(stepIndex: number): Policy {
    const policy = this.policies.get(stepIndex);
    if (policy === undefined) {
      throw new Error(`claim refers to a step that created no policy: ${stepIndex}`);
    }
    return policy;
  }
}

export function runScenario(scenario: Scenario): ScenarioResults {
  const ledger = new ScenarioLedger(scenario.customer);
  const results = scenario.steps.map((step, index) =>
    step.op === "quote" ? ledger.takeOutContract(step, index) : ledger.reportIncident(step),
  );
  return { results };
}
