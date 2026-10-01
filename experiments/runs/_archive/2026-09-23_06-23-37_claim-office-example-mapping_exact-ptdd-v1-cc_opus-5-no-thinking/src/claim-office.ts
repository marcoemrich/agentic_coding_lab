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

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const COMPONENT_BASE_PREMIUM = 25;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_FACTOR = 2;
const SEVERE_ENCHANTMENT_LEVEL = 8;
const SEVERE_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const COMPONENT_INSURANCE_VALUE = 250;

const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const MAIN_ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function basePremiumOf(item: Item): number {
  requireInsurableType(item.type);
  if (isComponent(item)) {
    return COMPONENT_BASE_PREMIUM;
  }
  return MAIN_ITEM_BASE_PREMIUMS[item.type];
}

/** The MHPCO insures only the item types on its price list. */
function requireInsurableType(type: string): void {
  if (!isInsurableType(type)) {
    throw new Error(`The MHPCO does not insure items of type "${type}"`);
  }
}

function insuranceValueOf(item: Item): number {
  requireInsurableType(item.type);
  if (isComponent(item)) {
    return COMPONENT_INSURANCE_VALUE;
  }
  return MAIN_ITEM_INSURANCE_VALUES[item.type];
}

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

function isInsurableType(type: string): boolean {
  return COMPONENT_TYPES.includes(type) || type in MAIN_ITEM_BASE_PREMIUMS;
}

/** A block of exactly 3 alike components is offered at a special base premium. */
function componentGroupBasePremium(items: Item[]): number {
  if (items.length === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return items.reduce((sum, item) => sum + basePremiumOf(item), 0);
}

/** "Alike" components are components of exactly the same type. */
function groupAlikeComponents(items: Item[]): Item[][] {
  const groups = new Map<string, Item[]>();
  for (const item of items.filter(isComponent)) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return [...groups.values()];
}

function policyBasePremium(items: Item[]): number {
  const mainItems = items.filter((item) => !isComponent(item));
  const mainBase = mainItems.reduce((sum, item) => sum + basePremiumOf(item), 0);
  const componentBase = groupAlikeComponents(items).reduce(
    (sum, group) => sum + componentGroupBasePremium(group),
    0,
  );
  return mainBase + componentBase;
}

/** The MHPCO rounds a premium in its own favour: up to the next whole G. */
function roundPremiumInMhpcoFavour(amount: number): number {
  return Math.ceil(amount);
}

/** The MHPCO rounds a payout in its own favour: down to the previous whole G. */
function roundPayoutInMhpcoFavour(amount: number): number {
  return Math.floor(amount);
}

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

/** Item-specific surcharges apply to the base premium of the affected item. */
function itemSurchargeRate(item: Item): number {
  return (
    (isCursed(item) ? CURSE_SURCHARGE_RATE : 0) +
    (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0)
  );
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => sum + basePremiumOf(item) * itemSurchargeRate(item), 0);
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

/** Every contract after the customer's first is a follow-up contract. */
function isFollowUpContract(previousContracts: number): boolean {
  return previousContracts > 0;
}

/** Policy-wide modifiers apply to the policy base premium. */
function policyModifierRate(customer: Customer, previousContracts: number): number {
  return (
    FIRST_INSURANCE_SURCHARGE_RATE -
    (isLongStanding(customer) ? LOYALTY_DISCOUNT_RATE : 0) -
    (isFollowUpContract(previousContracts) ? FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0)
  );
}

function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  const base = policyBasePremium(items);
  const adjusted =
    base + itemSurcharges(items) + base * policyModifierRate(customer, previousContracts);
  return roundPremiumInMhpcoFavour(adjusted + PROCESSING_FEE);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function isSeverelyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= SEVERE_ENCHANTMENT_LEVEL;
}

/**
 * Damage to a severely enchanted item is reimbursed at 50 %; damage to a
 * dragon-material item is reimbursed in full. Where both clauses apply, the
 * 50 % clause wins.
 */
function reimbursementFor(item: Item, amount: number): number {
  if (isSeverelyEnchanted(item)) {
    return amount * SEVERE_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return amount;
}

/** The insurance sum is the sum of the items' unmodified insurance values. */
function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
}

/** A policy caps its total payout at twice the insurance sum. */
function openPolicy(items: Item[]): Policy {
  return { items, remainingCap: insuranceSum(items) * CAP_FACTOR };
}

/** A deductible applies per damage event, after the reimbursement clauses. */
function payoutForDamage(item: Item, amount: number): number {
  return Math.max(reimbursementFor(item, amount) - DEDUCTIBLE_PER_DAMAGE, 0);
}

/**
 * Every damage is settled against a distinct insured item: a policy covering
 * one sword cannot answer two sword damages. The whole claim is rejected when
 * any damage has no item left to settle against.
 */
function allocateDamagesToInsuredItems(policy: Policy, damages: Damage[]): Item[] {
  const available = [...policy.items];
  return damages.map((damage) => {
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`The policy does not cover an item of type "${damage.itemType}"`);
    }
    return available.splice(index, 1)[0];
  });
}

/** A claim refers to the policy opened by an earlier quote step. */
function policyAt(policies: Map<number, Policy>, step: number): Policy {
  const policy = policies.get(step);
  if (policy === undefined) {
    throw new Error(`Step ${step} did not create a policy`);
  }
  return policy;
}

/** A damage report describes a loss, so its amount can never be negative. */
function requireReportableDamage(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`A damage amount cannot be negative: ${damage.amount}`);
  }
}

function settleClaim(policy: Policy, step: ClaimStep): StepResult {
  const damages = step.incident.damages;
  damages.forEach(requireReportableDamage);
  const insuredItems = allocateDamagesToInsuredItems(policy, damages);
  const desired = damages.reduce(
    (sum, entry, index) => sum + payoutForDamage(insuredItems[index], entry.amount),
    0,
  );
  const payout = roundPayoutInMhpcoFavour(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): StepResult[] {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let contracts = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push({ premium: quotePremium(step.items, scenario.customer, contracts) });
      policies.set(index, openPolicy(step.items));
      contracts += 1;
    } else {
      results.push(settleClaim(policyAt(policies, step.policy), step));
    }
  });
  return results;
}
