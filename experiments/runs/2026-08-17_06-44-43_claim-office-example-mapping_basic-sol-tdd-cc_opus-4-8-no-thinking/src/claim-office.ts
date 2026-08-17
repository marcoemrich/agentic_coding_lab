const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_RATE = 0.15;

const ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function isKnownType(type: string): boolean {
  return type in ITEM_BASE_PREMIUM || isComponent(type);
}

function assertKnownItems(items: Item[]): void {
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function componentGroupBase(count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * COMPONENT_BASE_PREMIUM;
}

function itemBasePremium(items: Item[]): number {
  const componentCounts = new Map<string, number>();
  let base = 0;
  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      base += ITEM_BASE_PREMIUM[item.type];
    }
  }
  for (const count of componentCounts.values()) {
    base += componentGroupBase(count);
  }
  return base;
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

interface Policy {
  items: Item[];
  remainingCap: number;
}

function itemOwnBase(item: Item): number {
  if (isComponent(item.type)) {
    return COMPONENT_BASE_PREMIUM;
  }
  return ITEM_BASE_PREMIUM[item.type];
}

function itemSurcharge(item: Item): number {
  const own = itemOwnBase(item);
  let surcharge = 0;
  if (item.cursed === true) {
    surcharge += own * CURSE_SURCHARGE_RATE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += own * HIGH_ENCHANTMENT_RATE;
  }
  return surcharge;
}

function policyAdjustments(
  policyBase: number,
  customer: Customer,
  isFollowUp: boolean,
): number {
  let adjustment = policyBase * FIRST_INSURANCE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    adjustment -= policyBase * LOYALTY_RATE;
  }
  if (isFollowUp) {
    adjustment -= policyBase * FOLLOW_UP_RATE;
  }
  return adjustment;
}

function quotePremium(
  items: Item[],
  customer: Customer,
  isFollowUp: boolean,
): number {
  const policyBase = itemBasePremium(items);
  const surcharges = items.reduce((sum, item) => sum + itemSurcharge(item), 0);
  const adjustments = policyAdjustments(policyBase, customer, isFollowUp);
  return Math.ceil(policyBase + surcharges + adjustments + PROCESSING_FEE);
}

function itemInsuranceValue(item: Item): number {
  if (isComponent(item.type)) {
    return COMPONENT_INSURANCE_VALUE;
  }
  return ITEM_INSURANCE_VALUE[item.type];
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

function damageReimbursement(damage: Damage, item: Item): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD) {
    return damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATE;
  }
  return damage.amount;
}

function damagePayout(damage: Damage, item: Item): number {
  const reimbursement = damageReimbursement(damage, item);
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function matchDamagesToItems(policy: Policy, damages: Damage[]): Item[] {
  const available = [...policy.items];
  return damages.map((damage) => {
    const index = available.findIndex((i) => i.type === damage.itemType);
    if (index === -1) {
      throw new Error(`Damaged item not covered by policy: ${damage.itemType}`);
    }
    return available.splice(index, 1)[0];
  });
}

function assertValidDamages(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative: ${damage.amount}`);
    }
  }
}

function processClaim(policy: Policy, incident: Incident): ClaimResult {
  assertValidDamages(incident.damages);
  const items = matchDamagesToItems(policy, incident.damages);
  const payout = incident.damages.reduce(
    (sum, damage, i) => sum + damagePayout(damage, items[i]),
    0,
  );
  const granted = Math.floor(Math.min(payout, policy.remainingCap));
  policy.remainingCap -= granted;
  return { payout: granted, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount += 1;
      assertKnownItems(step.items);
      policies.set(index, {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
      });
      return { premium: quotePremium(step.items, scenario.customer, isFollowUp) };
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`Claim references unknown policy: ${step.policy}`);
    }
    return processClaim(policy, step.incident);
  });
  return { results };
}
