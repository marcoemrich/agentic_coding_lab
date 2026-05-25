// Domain logic for MHPCO Claim Office

export type ItemType = "sword" | "amulet" | "staff" | "potion" | "rune" | "moonstone";

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
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

export interface ScenarioOutput {
  results: StepResult[];
}

const MAIN_ITEMS: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_VALUE = 250;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

const DEDUCTIBLE = 100;
const PROCESSING_FEE = 5;

function isMainItem(type: string): boolean {
  return type in MAIN_ITEMS;
}

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

export function validateItems(items: Item[]): void {
  for (const item of items) {
    if (!isMainItem(item.type) && !isComponent(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

export function insuranceValue(item: Item): number {
  if (isMainItem(item.type)) return MAIN_ITEMS[item.type].value;
  if (isComponent(item.type)) return COMPONENT_VALUE;
  throw new Error(`Unknown item type: ${item.type}`);
}

export function policyInsuranceSum(items: Item[]): number {
  return sum(items.map(insuranceValue));
}

// Per-type count of components in the policy, used for the block discount.
function countComponentsByType(items: Item[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (isComponent(item.type)) {
      counts[item.type] = (counts[item.type] ?? 0) + 1;
    }
  }
  return counts;
}

// Base premium contribution of one item, aware of the block discount that
// applies when a component type appears exactly COMPONENT_BLOCK_SIZE times.
function basePremiumFor(item: Item, componentCountForType: number): number {
  if (isMainItem(item.type)) return MAIN_ITEMS[item.type].premium;
  const blockApplies = componentCountForType === COMPONENT_BLOCK_SIZE;
  const groupTotal = blockApplies ? COMPONENT_BLOCK_PREMIUM : componentCountForType * COMPONENT_PREMIUM;
  return groupTotal / componentCountForType;
}

// Returns the base premium per item, aligned with items.
function itemBasePremiums(items: Item[]): number[] {
  const componentCounts = countComponentsByType(items);
  return items.map((item) => basePremiumFor(item, componentCounts[item.type] ?? 0));
}

function itemSurcharge(item: Item, basePremium: number): number {
  let surcharge = 0;
  if (item.cursed) surcharge += basePremium * 0.5;
  if (typeof item.enchantment === "number" && item.enchantment >= 5) surcharge += basePremium * 0.3;
  return surcharge;
}

export interface QuoteContext {
  yearsWithMHPCO: number;
  isFollowUpContract: boolean; // true when this quote is not the customer's first
}

function roundUp(value: number): number {
  // round up to whole G (favor MHPCO for premiums)
  return Math.ceil(value - 1e-9);
}

function roundDown(value: number): number {
  // round down to whole G (favor MHPCO for payouts)
  return Math.floor(value + 1e-9);
}

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

export function computePremium(items: Item[], context: QuoteContext): number {
  validateItems(items);

  const basePremiums = itemBasePremiums(items);
  const policyBase = sum(basePremiums);
  const itemSurcharges = sum(items.map((item, i) => itemSurcharge(item, basePremiums[i])));

  // Policy-wide modifiers applied to the policy base premium.
  // Per spec, each item in a quote is treated as a first insurance,
  // so the 10% first-insurance surcharge sums to 10% of the policy base.
  const loyaltyDiscount =
    context.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = context.isFollowUpContract ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_SURCHARGE_RATE;

  const subtotal =
    policyBase + itemSurcharges + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;

  return roundUp(subtotal + PROCESSING_FEE);
}

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

export interface PolicyState {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

export function createPolicy(items: Item[]): PolicyState {
  validateItems(items);
  const insuranceSum = policyInsuranceSum(items);
  const cap = insuranceSum * 2;
  return { items, insuranceSum, cap, remainingCap: cap };
}

function isHighlyEnchanted(item: Item): boolean {
  return typeof item.enchantment === "number" && item.enchantment >= 8;
}

function groupItemsByType(items: Item[]): Record<string, Item[]> {
  const byType: Record<string, Item[]> = {};
  for (const item of items) {
    (byType[item.type] ??= []).push(item);
  }
  return byType;
}

function validateDamage(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount not allowed: ${damage.amount}`);
  }
  if (!isMainItem(damage.itemType) && !isComponent(damage.itemType)) {
    throw new Error(`Unknown damage item type: ${damage.itemType}`);
  }
}

// Pairs each damage entry with the next available item of that type, treating
// repeat damages of the same type as separate items in the policy.
function pairDamagesWithItems(
  damages: Damage[],
  itemsByType: Record<string, Item[]>,
): { item: Item; amount: number }[] {
  const consumed: Record<string, number> = {};
  return damages.map((damage) => {
    const available = itemsByType[damage.itemType] ?? [];
    const used = consumed[damage.itemType] ?? 0;
    if (used >= available.length) {
      throw new Error(`Damage refers to item not in policy: ${damage.itemType}`);
    }
    consumed[damage.itemType] = used + 1;
    return { item: available[used], amount: damage.amount };
  });
}

// Per spec, the high-enchantment (>=8) clause halves the damage and wins
// over the dragon-material clause (which by itself does not change the
// damage figure — only the deductible reduces the final payout).
function payoutForPairing(item: Item, amount: number): number {
  const damage = isHighlyEnchanted(item) ? amount * 0.5 : amount;
  return Math.max(0, damage - DEDUCTIBLE);
}

export function processClaim(policy: PolicyState, incident: Incident): ClaimResult {
  incident.damages.forEach(validateDamage);

  const pairings = pairDamagesWithItems(incident.damages, groupItemsByType(policy.items));

  const totalPayout = pairings.reduce(
    (sum, { item, amount }) => sum + payoutForPairing(item, amount),
    0,
  );

  const capped = Math.min(roundDown(totalPayout), policy.remainingCap);
  policy.remainingCap -= capped;
  return { payout: capped, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioOutput {
  const policies: Record<number, PolicyState> = {};
  const results: StepResult[] = [];

  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      const isFollowUpContract = Object.keys(policies).length > 0;
      results.push({
        premium: computePremium(step.items, {
          yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
          isFollowUpContract,
        }),
      });
      policies[stepIndex] = createPolicy(step.items);
      return;
    }
    if (step.op === "claim") {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error(`Claim references unknown policy index: ${step.policy}`);
      }
      results.push(processClaim(policy, step.incident));
      return;
    }
    throw new Error(`Unknown operation`);
  });

  return { results };
}
