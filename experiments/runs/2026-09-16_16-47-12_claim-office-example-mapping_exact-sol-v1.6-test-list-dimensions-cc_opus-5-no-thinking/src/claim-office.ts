export interface Customer {
  yearsWithMHPCO: number;
  previousContracts: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;
const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;
const HALF_REIMBURSEMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

/** Payouts round down: the MHPCO's favor. */
function roundPayoutInMHPCOsFavor(payout: number): number {
  return Math.floor(payout);
}

function rejectNegativeAmounts(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount ${damage.amount} must not be negative`);
    }
  }
}

function isDeeplyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_LEVEL;
}

export class Policy {
  private remainingCap: number;

  constructor(private readonly items: Item[]) {
    this.remainingCap = insuranceSum(items) * CAP_MULTIPLE_OF_INSURANCE_SUM;
  }

  settle(incident: Incident): ClaimResult {
    rejectNegativeAmounts(incident.damages);
    this.rejectUncoveredDamages(incident.damages);
    const desired = incident.damages.reduce(
      (total, damage) => total + this.reimbursementFor(damage),
      0,
    );
    const payout = roundPayoutInMHPCOsFavor(Math.min(desired, this.remainingCap));
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }

  private rejectUncoveredDamages(damages: Damage[]): void {
    const covered = countAlikeItems(this.items);
    for (const [itemType, claimed] of countDamagesByItemType(damages)) {
      if (claimed > (covered.get(itemType) ?? 0)) {
        throw new Error(`policy does not cover ${claimed} damaged ${itemType}(s)`);
      }
    }
  }

  private reimbursementFor(damage: Damage): number {
    const item = this.items.find((candidate) => candidate.type === damage.itemType);
    const rate = item !== undefined && isDeeplyEnchanted(item) ? HALF_REIMBURSEMENT_RATE : 1;
    return Math.max(0, damage.amount * rate - DEDUCTIBLE_PER_DAMAGE);
  }
}


function catalogueEntryFor(type: string): CatalogueEntry {
  const entry = ITEM_CATALOGUE[type];
  if (entry === undefined) {
    throw new Error(`the MHPCO does not insure items of type "${type}"`);
  }
  return entry;
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + catalogueEntryFor(item.type).insuranceValue, 0);
}

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;

interface CatalogueEntry {
  insuranceValue: number;
  basePremium: number;
}

/** The MHPCO price list: every insurable item type with its value and premium. */
const ITEM_CATALOGUE: Record<string, CatalogueEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function countBy<T>(values: T[], keyOf: (value: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = keyOf(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function countAlikeItems(items: Item[]): Map<string, number> {
  return countBy(items, (item) => item.type);
}

function countDamagesByItemType(damages: Damage[]): Map<string, number> {
  return countBy(damages, (damage) => damage.itemType);
}

function qualifiesForBlock(type: string, count: number): boolean {
  return COMPONENT_TYPES.includes(type) && count === BLOCK_SIZE;
}

function basePremiumForGroup(type: string, count: number): number {
  if (qualifiesForBlock(type, count)) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * catalogueEntryFor(type).basePremium;
}

export function policyBasePremium(items: Item[]): number {
  let total = 0;
  for (const [type, count] of countAlikeItems(items)) {
    total += basePremiumForGroup(type, count);
  }
  return total;
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function hasPreviousContract(customer: Customer): boolean {
  return customer.previousContracts >= 1;
}

function policyModifierRate(customer: Customer): number {
  let rate = FIRST_INSURANCE_SURCHARGE_RATE;
  if (isLongStanding(customer)) {
    rate -= LOYALTY_DISCOUNT_RATE;
  }
  if (hasPreviousContract(customer)) {
    rate -= FOLLOW_UP_DISCOUNT_RATE;
  }
  return rate;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function riskSurchargeRate(item: Item): number {
  let rate = 0;
  if (item.cursed === true) {
    rate += CURSE_SURCHARGE_RATE;
  }
  if (isHighlyEnchanted(item)) {
    rate += HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return rate;
}

function itemRiskSurcharges(items: Item[]): number {
  return items.reduce(
    (total, item) => total + catalogueEntryFor(item.type).basePremium * riskSurchargeRate(item),
    0,
  );
}

/** Premiums round up: the MHPCO's favor. */
function roundPremiumInMHPCOsFavor(premium: number): number {
  return Math.ceil(premium);
}

export function quote(customer: Customer, items: Item[]): number {
  const base = policyBasePremium(items);
  const premium =
    base + itemRiskSurcharges(items) + base * policyModifierRate(customer) + PROCESSING_FEE;
  return roundPremiumInMHPCOsFavor(premium);
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type StepResult = { premium: number } | ClaimResult;

/** Runs a scenario's steps in order, carrying the customer's contract history and policies. */
export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  let previousContracts = 0;
  const results: StepResult[] = [];

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const customer: Customer = {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        previousContracts,
      };
      results.push({ premium: quote(customer, step.items) });
      policies.set(index, new Policy(step.items));
      previousContracts += 1;
    } else {
      const policy = policies.get(step.policy);
      if (policy === undefined) {
        throw new Error(`step ${index} refers to unknown policy ${step.policy}`);
      }
      results.push(policy.settle(step.incident));
    }
  });

  return results;
}
