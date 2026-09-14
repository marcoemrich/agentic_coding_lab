export const ITEM_CATALOG = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
} as const;

export type ItemType = keyof typeof ITEM_CATALOG;
export interface InsuredItem {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}
export interface QuoteStep { op: "quote"; items: InsuredItem[] }
export interface Damage { itemType: string; amount: number }
export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}
export type StepResult = { premium: number } | { payout: number; remainingCap: number };
export interface ScenarioResult { results: StepResult[] }

interface Policy {
  items: InsuredItem[];
  remainingCap: number;
}

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_ITEM_PREMIUM = 20;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_PREMIUM_LEVEL = 5;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const ENCHANTMENT_PREMIUM_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const INITIAL_RATE = 0.1;
const FOLLOW_UP_RATE = 0.15;
const PROCESSING_FEE = 5;
const POLICY_CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;

function fail(message: string): never {
  throw new Error(message);
}

function isItemType(value: unknown): value is ItemType {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(ITEM_CATALOG, value);
}

function validateItem(item: InsuredItem): void {
  if (!item || !isItemType(item.type)) fail(`Unknown item type: ${String(item?.type)}`);
  if (item.material !== undefined && typeof item.material !== "string") {
    fail(`Invalid material for item: ${item.type}`);
  }
  if (item.enchantment !== undefined && !Number.isInteger(item.enchantment)) {
    fail(`Invalid enchantment for item: ${item.type}`);
  }
  if (item.cursed !== undefined && typeof item.cursed !== "boolean") {
    fail(`Invalid cursed flag for item: ${item.type}`);
  }
}

/** Returns the unmodified premium assigned to every item in policy order. */
function itemBasePremiums(items: InsuredItem[]): number[] {
  const counts = new Map<ItemType, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);

  return items.map((item) => {
    if ((item.type === "rune" || item.type === "moonstone") &&
        (counts.get(item.type) ?? 0) === COMPONENT_BLOCK_SIZE) {
      return COMPONENT_BLOCK_ITEM_PREMIUM;
    }
    return ITEM_CATALOG[item.type].basePremium;
  });
}

export function quotePremium(
  items: InsuredItem[],
  yearsWithMHPCO: number,
  previousContracts = 0,
): number {
  items.forEach(validateItem);
  const bases = itemBasePremiums(items);
  const policyBase = bases.reduce((sum, value) => sum + value, 0);
  let premium = policyBase;

  items.forEach((item, index) => {
    if (item.cursed) premium += bases[index] * CURSE_RATE;
    if (typeof item.enchantment === "number" &&
        item.enchantment >= HIGH_ENCHANTMENT_PREMIUM_LEVEL) {
      premium += bases[index] * ENCHANTMENT_PREMIUM_RATE;
    }
  });
  if (yearsWithMHPCO >= LOYALTY_YEARS) premium -= policyBase * LOYALTY_RATE;
  // Every item presented in a quote is a first insurance. Thus this applies
  // to every quote, independently of the customer's prior contracts.
  premium += policyBase * INITIAL_RATE;
  if (previousContracts > 0) premium -= policyBase * FOLLOW_UP_RATE;
  return Math.ceil(premium + PROCESSING_FEE);
}

function createPolicy(items: InsuredItem[]): Policy {
  const insuranceSum = items.reduce(
    (sum, item) => sum + ITEM_CATALOG[item.type].insuranceValue,
    0,
  );
  return {
    items: items.map((item) => ({ ...item })),
    remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER,
  };
}

function reimbursement(
  policy: Policy,
  damage: Damage,
  usedByType: Map<ItemType, number>,
): number {
  if (!damage || !isItemType(damage.itemType)) {
    fail(`Unknown damaged item type: ${String(damage?.itemType)}`);
  }
  if (!Number.isInteger(damage.amount) || damage.amount < 0) {
    fail(`Invalid damage amount: ${String(damage.amount)}`);
  }
  const matching = policy.items.filter((item) => item.type === damage.itemType);
  const occurrence = usedByType.get(damage.itemType) ?? 0;
  if (occurrence >= matching.length) fail(`Damage to uninsured item: ${damage.itemType}`);
  usedByType.set(damage.itemType, occurrence + 1);
  const enchantment = matching[occurrence].enchantment;
  const rate = typeof enchantment === "number" && enchantment >= HIGH_ENCHANTMENT_CLAIM_LEVEL
    ? CURSE_RATE : 1;
  return Math.max(0, damage.amount * rate - DEDUCTIBLE);
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  if (!Array.isArray(damages)) fail("Claim damages must be an array");
  const usedByType = new Map<ItemType, number>();
  const desired = damages.reduce(
    (sum, damage) => sum + reimbursement(policy, damage, usedByType),
    0,
  );
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

interface ProcessingState {
  years: number;
  results: StepResult[];
  policies: Map<number, Policy>;
  contractCount: number;
}

function processStep(step: QuoteStep | ClaimStep, index: number, state: ProcessingState): void {
  if (step?.op === "quote") {
    if (!Array.isArray(step.items)) fail("Quote items must be an array");
    step.items.forEach(validateItem);
    state.results.push({ premium: quotePremium(step.items, state.years, state.contractCount) });
    state.policies.set(index, createPolicy(step.items));
    state.contractCount += 1;
    return;
  }
  if (step?.op !== "claim") fail(`Unknown operation: ${String((step as { op?: unknown })?.op)}`);
  if (!Number.isInteger(step.policy) || !state.policies.has(step.policy)) {
    fail(`Invalid policy reference: ${String(step.policy)}`);
  }
  if (!step.incident || typeof step.incident.cause !== "string" ||
      !Array.isArray(step.incident.damages)) {
    fail("A claim incident with cause and damages is required");
  }
  state.results.push(processClaim(state.policies.get(step.policy)!, step.incident.damages));
}

export function processScenario(scenario: Scenario): ScenarioResult {
  if (!scenario || !scenario.customer || !Number.isInteger(scenario.customer.yearsWithMHPCO)) {
    fail("A customer with integer yearsWithMHPCO is required");
  }
  if (!Array.isArray(scenario.steps)) fail("Steps must be an array");
  const state: ProcessingState = {
    years: scenario.customer.yearsWithMHPCO,
    results: [],
    policies: new Map<number, Policy>(),
    contractCount: 0,
  };
  scenario.steps.forEach((step, index) => processStep(step, index, state));
  return { results: state.results };
}
