// Domain types

export type ItemType = 'sword' | 'amulet' | 'staff' | 'potion' | 'rune' | 'moonstone' | string;

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
  op: 'quote';
  items: Item[];
}

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: DamageEntry[];
}

export interface ClaimStep {
  op: 'claim';
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

// Price list

const MAIN_ITEMS: Record<string, { value: number; basePremium: number }> = {
  sword:  { value: 1000, basePremium: 100 },
  amulet: { value: 600,  basePremium: 60 },
  staff:  { value: 800,  basePremium: 80 },
  potion: { value: 400,  basePremium: 40 },
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_VALUE = 250;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function priceListEntry(type: string): { value: number; basePremium: number } {
  if (type in MAIN_ITEMS) return MAIN_ITEMS[type];
  if (isComponent(type)) return { value: COMPONENT_VALUE, basePremium: COMPONENT_PREMIUM };
  throw new Error(`Unknown item type: ${type}`);
}

function isKnownItemType(type: string): boolean {
  return type in MAIN_ITEMS || COMPONENT_TYPES.has(type);
}

function itemInsuranceValue(type: string): number {
  return priceListEntry(type).value;
}

function itemBasePremium(type: string): number {
  return priceListEntry(type).basePremium;
}

// Premium calculation

interface PolicyRecord {
  insuranceSum: number;
  cap: number;
  remainingCap: number;
  items: Item[];
}

function validateItems(items: Item[]): void {
  for (const it of items) {
    if (!isKnownItemType(it.type)) {
      throw new Error(`Unknown item type: ${it.type}`);
    }
  }
}

function policyInsuranceSum(items: Item[]): number {
  return items.reduce((sum, it) => sum + itemInsuranceValue(it.type), 0);
}

function itemSurcharge(item: Item): number {
  const base = itemBasePremium(item.type);
  let surcharge = 0;
  if (item.cursed) surcharge += base * 0.5;
  if ((item.enchantment ?? 0) >= 5) surcharge += base * 0.3;
  return surcharge;
}

function componentBlockAdjustment(items: Item[]): number {
  // For each component type, replace each full block of 3 with the discounted price
  const counts = new Map<string, number>();
  for (const it of items) {
    if (isComponent(it.type)) {
      counts.set(it.type, (counts.get(it.type) ?? 0) + 1);
    }
  }
  let adjustment = 0;
  for (const [, count] of counts) {
    if (count === COMPONENT_BLOCK_SIZE) {
      const blockSavings = COMPONENT_BLOCK_SIZE * COMPONENT_PREMIUM - COMPONENT_BLOCK_PREMIUM;
      adjustment -= blockSavings;
    }
  }
  return adjustment;
}

function roundUp(value: number): number {
  // Round in MHPCO's favor for premium: ceiling
  return Math.ceil(value - 1e-9); // tolerate floating-point noise
}

function roundDown(value: number): number {
  // Round in MHPCO's favor for payout: floor
  return Math.floor(value + 1e-9);
}

export function computePremium(items: Item[], customer: Customer, isFirstContract: boolean): number {
  validateItems(items);

  if (items.length === 0) {
    return PROCESSING_FEE;
  }

  // Sum item base premiums
  const itemBaseSum = items.reduce((sum, it) => sum + itemBasePremium(it.type), 0);

  // Component block discount
  const blockAdjustment = componentBlockAdjustment(items);

  const policyBase = itemBaseSum + blockAdjustment;

  // Per-item surcharges (cursed, high enchantment) — applied to item base premiums
  const itemSurchargeTotal = items.reduce((sum, it) => sum + itemSurcharge(it), 0);

  // Policy-wide modifiers applied to policyBase
  let policyMods = 0;
  if (customer.yearsWithMHPCO >= 2) policyMods -= policyBase * 0.2;
  // First-insurance surcharge: each item in a quote is treated as a first insurance
  policyMods += policyBase * 0.1;
  if (!isFirstContract) policyMods -= policyBase * 0.15;

  const subtotal = policyBase + itemSurchargeTotal + policyMods;
  const total = subtotal + PROCESSING_FEE;
  return roundUp(total);
}

// Claim calculation

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= 8;
}

function reimbursableAmount(item: Item, damage: number): number {
  // High-enchantment clause overrides dragon-material clause; both other cases
  // (dragon material, plain item) yield full reimbursement.
  return isHighlyEnchanted(item) ? damage * 0.5 : damage;
}

function findAndConsumeItem(pool: Item[], itemType: string): Item | undefined {
  const idx = pool.findIndex(it => it.type === itemType);
  if (idx === -1) return undefined;
  return pool.splice(idx, 1)[0];
}

function resolveDamages(policy: PolicyRecord, incident: Incident): { item: Item; amount: number }[] {
  const pool: Item[] = policy.items.map(it => ({ ...it }));
  const resolved: { item: Item; amount: number }[] = [];

  for (const dmg of incident.damages) {
    if (dmg.amount < 0) {
      throw new Error(`Negative damage amount: ${dmg.amount}`);
    }
    if (!isKnownItemType(dmg.itemType)) {
      throw new Error(`Unknown item type in claim: ${dmg.itemType}`);
    }
    const item = findAndConsumeItem(pool, dmg.itemType);
    if (!item) {
      throw new Error(`Damaged item ${dmg.itemType} is not part of the policy`);
    }
    resolved.push({ item, amount: dmg.amount });
  }
  return resolved;
}

export function computeClaim(policy: PolicyRecord, incident: Incident): { payout: number; remainingCap: number } {
  const resolved = resolveDamages(policy, incident);

  let totalPayout = 0;
  let remaining = policy.remainingCap;
  for (const { item, amount } of resolved) {
    const afterDeductible = Math.max(0, reimbursableAmount(item, amount) - DEDUCTIBLE);
    const granted = Math.min(roundDown(afterDeductible), remaining);
    totalPayout += granted;
    remaining -= granted;
  }

  return { payout: totalPayout, remainingCap: remaining };
}

// Scenario runner

function createPolicy(items: Item[]): PolicyRecord {
  const insuranceSum = policyInsuranceSum(items);
  return {
    insuranceSum,
    cap: insuranceSum * 2,
    remainingCap: insuranceSum * 2,
    items: items.map(it => ({ ...it })),
  };
}

export function runScenario(scenario: Scenario): ScenarioOutput {
  const results: StepResult[] = [];
  const policies: Map<number, PolicyRecord> = new Map();
  let quoteCount = 0;

  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === 'quote') {
      const premium = computePremium(step.items, scenario.customer, quoteCount === 0);
      policies.set(stepIndex, createPolicy(step.items));
      quoteCount++;
      results.push({ premium });
      return;
    }
    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`Claim references unknown policy step: ${step.policy}`);
      }
      const { payout, remainingCap } = computeClaim(policy, step.incident);
      policy.remainingCap = remainingCap;
      results.push({ payout, remainingCap });
      return;
    }
    throw new Error(`Unknown op: ${(step as { op: string }).op}`);
  });

  return { results };
}
