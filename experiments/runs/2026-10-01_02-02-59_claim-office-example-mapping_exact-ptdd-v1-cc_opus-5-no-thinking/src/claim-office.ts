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
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = ["rune", "moonstone"];

const DEDUCTIBLE_PER_DAMAGE = 100;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const REDUCED_REIMBURSEMENT_THRESHOLD = 8;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

function fromPriceList(table: Record<string, number>, type: string): number {
  const amount = table[type];
  if (amount === undefined) {
    throw new Error(`MHPCO does not insure items of type "${type}"`);
  }
  return amount;
}

function basePremiumFor(type: string): number {
  return fromPriceList(BASE_PREMIUMS, type);
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function qualifiesForComponentBlock(type: string, count: number): boolean {
  return COMPONENT_TYPES.includes(type) && count === BLOCK_SIZE;
}

function basePremiumForGroup(type: string, count: number): number {
  if (qualifiesForComponentBlock(type, count)) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * basePremiumFor(type);
}

function policyBasePremium(items: Item[]): number {
  let base = 0;
  for (const [type, count] of countByType(items)) {
    base += basePremiumForGroup(type, count);
  }
  return base;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function itemRiskSurcharges(items: Item[]): number {
  let surcharges = 0;
  for (const item of items) {
    const itemBase = basePremiumFor(item.type);
    if (item.cursed === true) {
      surcharges += itemBase * CURSE_SURCHARGE_RATE;
    }
    if (isHighlyEnchanted(item)) {
      surcharges += itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
  }
  return surcharges;
}

function roundPremiumInOfficesFavour(premium: number): number {
  return Math.ceil(premium);
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

function isFollowUpContract(previousContracts: number): boolean {
  return previousContracts > 0;
}

function policyWideModifiers(
  customer: Customer,
  base: number,
  previousContracts: number,
): number {
  const loyaltyDiscount = isLongStanding(customer) ? base * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUpContract(previousContracts)
    ? base * FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    : 0;
  return base * FIRST_INSURANCE_SURCHARGE_RATE - loyaltyDiscount - followUpDiscount;
}

export function quote(customer: Customer, items: Item[], previousContracts = 0): number {
  const base = policyBasePremium(items);
  const premium =
    base +
    itemRiskSurcharges(items) +
    policyWideModifiers(customer, base, previousContracts);
  return roundPremiumInOfficesFavour(premium + PROCESSING_FEE);
}

function insuranceValueFor(type: string): number {
  return fromPriceList(INSURANCE_VALUES, type);
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueFor(item.type), 0);
}

function roundPayoutInOfficesFavour(payout: number): number {
  return Math.floor(payout);
}

function hasReducedReimbursement(item: Item): boolean {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_THRESHOLD;
}

const FULL_REIMBURSEMENT_RATE = 1;

// The office reimburses a damage in full unless a clause reduces it. Dragon
// material guarantees full reimbursement; the high-enchantment clause reduces
// it and takes precedence when both apply.
function reimbursedShare(item: Item, amount: number): number {
  const rate = hasReducedReimbursement(item)
    ? REDUCED_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;
  return amount * rate;
}

function reimbursement(item: Item, damage: Damage): number {
  const reimbursed = reimbursedShare(item, damage.amount);
  return Math.max(reimbursed - DEDUCTIBLE_PER_DAMAGE, 0);
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
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

interface Policy {
  items: Item[];
  remainingCap: number;
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

interface CoveredDamage {
  item: Item;
  damage: Damage;
}

function assertReportableDamage(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`A damage amount cannot be negative, but was ${damage.amount}`);
  }
}

function coveredDamages(policy: Policy, damages: Damage[]): CoveredDamage[] {
  const unmatched = [...policy.items];
  return damages.map((damage) => {
    assertReportableDamage(damage);
    const index = unmatched.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`The policy does not cover a damaged item of type "${damage.itemType}"`);
    }
    return { item: unmatched.splice(index, 1)[0], damage };
  });
}

function drawFromCap(policy: Policy, desired: number): number {
  const granted = roundPayoutInOfficesFavour(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= granted;
  return granted;
}

function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  const desired = coveredDamages(policy, incident.damages).reduce(
    (total, covered) => total + reimbursement(covered.item, covered.damage),
    0,
  );
  return { payout: drawFromCap(policy, desired), remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): StepResult[] {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let contracts = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push({ premium: quote(scenario.customer, step.items, contracts) });
      contracts += 1;
      policies.set(index, {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_MULTIPLE_OF_INSURANCE_SUM,
      });
      return;
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`No policy was created by step ${step.policy}`);
    }
    results.push(settleClaim(policy, step.incident));
  });
  return results;
}
