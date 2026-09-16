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
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

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

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function basePremiumFor(type: string): number {
  const premium = BASE_PREMIUMS[type];
  if (premium === undefined) {
    throw new Error(`MHPCO does not insure items of type "${type}"`);
  }
  return premium;
}

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function groupByType(items: Item[]): Map<string, Item[]> {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return groups;
}

function groupBasePremium(type: string, group: Item[]): number {
  const perItem = basePremiumFor(type);
  if (isComponent(type) && group.length === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return group.length * perItem;
}

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function riskSurcharge(item: Item): number {
  const base = basePremiumFor(item.type);
  const curse = isCursed(item) ? base * CURSE_SURCHARGE_RATE : 0;
  const enchantment = isHighlyEnchanted(item)
    ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curse + enchantment;
}

function policyBasePremium(items: Item[]): number {
  let total = 0;
  for (const [type, group] of groupByType(items)) {
    total += groupBasePremium(type, group);
  }
  return total;
}

function itemRiskSurcharges(items: Item[]): number {
  return items.reduce((total, item) => total + riskSurcharge(item), 0);
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function isFollowUpContract(previousContracts: number): boolean {
  return previousContracts > 0;
}

function customerAdjustments(
  customer: Customer,
  basePremium: number,
  previousContracts: number,
): number {
  const loyalty = isLongStanding(customer) ? -basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const firstInsurance = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const followUp = isFollowUpContract(previousContracts)
    ? -basePremium * FOLLOW_UP_DISCOUNT_RATE
    : 0;
  return loyalty + firstInsurance + followUp;
}

function roundPremiumInMhpcoFavour(premium: number): number {
  return Math.ceil(premium);
}

export function quote(customer: Customer, items: Item[], previousContracts = 0): number {
  const basePremium = policyBasePremium(items);
  const premium =
    basePremium +
    itemRiskSurcharges(items) +
    customerAdjustments(customer, basePremium, previousContracts) +
    PROCESSING_FEE;
  return roundPremiumInMhpcoFavour(premium);
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

interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceValueFor(type: string): number {
  const value = INSURANCE_VALUES[type];
  if (value === undefined) {
    throw new Error(`MHPCO does not insure items of type "${type}"`);
  }
  return value;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + insuranceValueFor(item.type), 0);
}

function isDangerouslyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL;
}

// MHPCO's clauses: enchantment >= 8 halves the reimbursement and takes
// precedence; dragon material is reimbursed in full, which is also the
// reimbursement for an item to which no special clause applies.
function reimbursement(item: Item, amount: number): number {
  return isDangerouslyEnchanted(item) ? amount * REDUCED_REIMBURSEMENT_RATE : amount;
}

function payoutFor(item: Item, damage: Damage): number {
  return Math.max(0, reimbursement(item, damage.amount) - DEDUCTIBLE);
}

function roundPayoutInMhpcoFavour(payout: number): number {
  return Math.floor(payout);
}

interface DamagedItem {
  item: Item;
  damage: Damage;
}

// Each damage entry refers to one insured item, so an item already damaged by
// an earlier entry of the same incident cannot answer for a later one.
function allocateDamagedItems(policy: Policy, damages: Damage[]): DamagedItem[] {
  const unclaimed = [...policy.items];
  return damages.map((damage) => {
    const index = unclaimed.findIndex((insured) => insured.type === damage.itemType);
    if (index === -1) {
      throw new Error(`The policy does not cover an item of type "${damage.itemType}"`);
    }
    return { item: unclaimed.splice(index, 1)[0], damage };
  });
}

function rejectInvalidDamageReports(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`A damage amount cannot be negative: ${damage.amount}`);
    }
  }
}

function desiredPayout(policy: Policy, incident: Incident): number {
  return allocateDamagedItems(policy, incident.damages).reduce(
    (total, { item, damage }) => total + payoutFor(item, damage),
    0,
  );
}

function limitToRemainingCap(desired: number, remainingCap: number): number {
  return Math.min(desired, remainingCap);
}

function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  rejectInvalidDamageReports(incident.damages);
  const granted = limitToRemainingCap(desiredPayout(policy, incident), policy.remainingCap);
  const payout = roundPayoutInMhpcoFavour(granted);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  let contracts = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const premium = quote(scenario.customer, step.items, contracts);
      contracts += 1;
      policies.set(index, {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
      });
      return { premium };
    }

    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`Step ${step.policy} did not create a policy`);
    }
    return settleClaim(policy, step.incident);
  });
}
