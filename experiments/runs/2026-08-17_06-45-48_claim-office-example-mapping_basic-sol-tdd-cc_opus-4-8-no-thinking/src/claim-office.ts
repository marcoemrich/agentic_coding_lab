const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;

const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT = 0.15;

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function isMainItem(type: string): boolean {
  return type in BASE_PREMIUMS;
}

function assertKnownItemType(type: string): void {
  if (!isMainItem(type) && !isComponent(type)) {
    throw new Error(`Unknown item type: ${type}`);
  }
}

function componentBase(count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * COMPONENT_BASE_PREMIUM;
}

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

function componentCountsByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (isComponent(item.type)) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
  }
  return counts;
}

function mainItemsBase(items: Item[]): number {
  return items
    .filter((item) => !isComponent(item.type))
    .reduce((sum, item) => sum + BASE_PREMIUMS[item.type], 0);
}

function componentsBase(items: Item[]): number {
  let total = 0;
  for (const count of componentCountsByType(items).values()) {
    total += componentBase(count);
  }
  return total;
}

function policyBasePremium(items: Item[]): number {
  return mainItemsBase(items) + componentsBase(items);
}

function itemOwnBase(item: Item): number {
  if (isComponent(item.type)) {
    return COMPONENT_BASE_PREMIUM;
  }
  return BASE_PREMIUMS[item.type];
}

function isHighlyEnchanted(item: Item): boolean {
  return item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD;
}

function itemSurcharge(item: Item): number {
  const ownBase = itemOwnBase(item);
  const curse = item.cursed === true ? ownBase * CURSE_SURCHARGE : 0;
  const enchantment = isHighlyEnchanted(item) ? ownBase * HIGH_ENCHANTMENT_SURCHARGE : 0;
  return curse + enchantment;
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemSurcharge(item), 0);
}

function policyModifiers(policyBase: number, customer: Customer, isFollowUp: boolean): number {
  const firstInsurance = policyBase * FIRST_INSURANCE_SURCHARGE;
  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? -policyBase * LOYALTY_DISCOUNT : 0;
  const followUp = isFollowUp ? -policyBase * FOLLOWUP_DISCOUNT : 0;
  return firstInsurance + loyalty + followUp;
}

function quotePremium(step: QuoteStep, customer: Customer, isFollowUp: boolean): number {
  step.items.forEach((item) => assertKnownItemType(item.type));
  const policyBase = policyBasePremium(step.items);
  const surcharges = itemSurcharges(step.items);
  const modifiers = policyModifiers(policyBase, customer, isFollowUp);
  return Math.ceil(policyBase + surcharges + modifiers + PROCESSING_FEE);
}

function itemInsuranceValue(item: Item): number {
  if (isComponent(item.type)) {
    return COMPONENT_INSURANCE_VALUE;
  }
  return INSURANCE_VALUES[item.type];
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

interface Policy {
  remainingCap: number;
  items: Item[];
}

function isHighlyEnchantedForClaim(item: Item): boolean {
  return item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

function reimbursementRate(item: Item): number {
  if (isHighlyEnchantedForClaim(item)) {
    return HIGH_ENCHANTMENT_REIMBURSEMENT;
  }
  return 1;
}

function damagePayout(damage: Damage, item: Item): number {
  const reimbursed = damage.amount * reimbursementRate(item);
  return Math.max(0, reimbursed - DEDUCTIBLE);
}

function assertValidDamageAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

function matchDamagesToItems(policy: Policy, damages: Damage[]): Item[] {
  const available = [...policy.items];
  return damages.map((damage) => {
    const index = available.findIndex((candidate) => candidate.type === damage.itemType);
    if (index === -1) {
      throw new Error(`Damage to ${damage.itemType} is not part of the policy coverage`);
    }
    return available.splice(index, 1)[0];
  });
}

function processClaim(step: ClaimStep, policies: Map<number, Policy>): ClaimResult {
  const policy = policies.get(step.policy);
  if (policy === undefined) {
    throw new Error(`No policy at step ${step.policy}`);
  }
  const damages = step.incident.damages;
  damages.forEach(assertValidDamageAmount);
  const matchedItems = matchDamagesToItems(policy, damages);
  const desired = damages.reduce((sum, damage, i) => sum + damagePayout(damage, matchedItems[i]), 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "claim") {
      return processClaim(step, policies);
    }
    const isFollowUp = quoteCount > 0;
    quoteCount += 1;
    const premium = quotePremium(step, scenario.customer, isFollowUp);
    policies.set(index, {
      remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
      items: step.items,
    });
    return { premium };
  });
  return { results };
}
