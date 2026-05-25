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

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_RATE = 0.5;
const HIGH_ENCHANT_RATE = 0.3;
const HIGH_ENCHANT_THRESHOLD = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD = 2;
const FOLLOWUP_RATE = 0.15;
const COMPONENT_BASE = 25;
const COMPONENT_BLOCK_BASE = 60;
const COMPONENT_BLOCK_SIZE = 3;

const MAIN_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function isMainItem(item: Item): boolean {
  return item.type in MAIN_BASE_PREMIUMS;
}

function mainItemBase(item: Item): number {
  const base = MAIN_BASE_PREMIUMS[item.type];
  if (base === undefined) {
    throw new Error(`Unknown main item type: ${item.type}`);
  }
  return base;
}

function componentBlockBase(count: number): number {
  // Block applies only when count equals exactly COMPONENT_BLOCK_SIZE.
  if (count === COMPONENT_BLOCK_SIZE) return COMPONENT_BLOCK_BASE;
  return count * COMPONENT_BASE;
}

function policyBaseAndItemSurcharges(items: Item[]): { policyBase: number; itemSurcharges: number } {
  let policyBase = 0;
  let itemSurcharges = 0;

  // Main items: each has its own base and own item-specific modifiers.
  for (const item of items) {
    if (isMainItem(item)) {
      const base = mainItemBase(item);
      policyBase += base;
      if (item.cursed) itemSurcharges += base * CURSED_RATE;
      if ((item.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD) {
        itemSurcharges += base * HIGH_ENCHANT_RATE;
      }
    } else if (!isComponent(item)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  // Components: grouped by type for block detection.
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (isComponent(item)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
  }
  for (const count of componentCounts.values()) {
    policyBase += componentBlockBase(count);
  }

  return { policyBase, itemSurcharges };
}

function quotePremium(items: Item[], opts: { isFollowUp: boolean; loyal: boolean }): number {
  const { policyBase, itemSurcharges } = policyBaseAndItemSurcharges(items);

  let policyAdjustments = policyBase * FIRST_INSURANCE_RATE;
  if (opts.loyal) policyAdjustments -= policyBase * LOYALTY_RATE;
  if (opts.isFollowUp) policyAdjustments -= policyBase * FOLLOWUP_RATE;

  const total = policyBase + itemSurcharges + policyAdjustments + PROCESSING_FEE;
  return Math.ceil(total);
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_HIGH_ENCHANT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANT_RATE = 0.5;

const COMPONENT_INSURANCE_VALUE = 250;
const MAIN_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

function itemInsuranceValue(item: Item): number {
  if (isComponent(item)) return COMPONENT_INSURANCE_VALUE;
  const v = MAIN_INSURANCE_VALUES[item.type];
  if (v === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return v;
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function buildPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((s, i) => s + itemInsuranceValue(i), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function matchDamageToItem(remainingItems: Item[], itemType: string): Item {
  const idx = remainingItems.findIndex(i => i.type === itemType);
  if (idx < 0) {
    throw new Error(`Damage references item not in policy: ${itemType}`);
  }
  return remainingItems.splice(idx, 1)[0];
}

function reimbursementFor(item: Item, amount: number): number {
  const ench = item.enchantment ?? 0;
  if (ench >= CLAIM_HIGH_ENCHANT_THRESHOLD) {
    return amount * CLAIM_HIGH_ENCHANT_RATE;
  }
  return amount;
}

function processClaim(policy: Policy, incident: Incident): ClaimResult {
  const remainingItems = [...policy.items];
  let rawPayout = 0;
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    const item = matchDamageToItem(remainingItems, damage.itemType);
    const gross = reimbursementFor(item, damage.amount);
    const net = Math.max(0, gross - DEDUCTIBLE);
    rawPayout += net;
  }
  const payout = Math.min(rawPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout: Math.floor(payout), remainingCap: Math.floor(policy.remainingCap) };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const results: StepResult[] = [];
  const loyal = scenario.customer.yearsWithMHPCO >= LOYALTY_THRESHOLD;
  const policies: Map<number, Policy> = new Map();
  let quoteCount = 0;
  scenario.steps.forEach((step, idx) => {
    if (step.op === 'quote') {
      const isFollowUp = quoteCount > 0;
      results.push({ premium: quotePremium(step.items, { isFollowUp, loyal }) });
      policies.set(idx, buildPolicy(step.items));
      quoteCount++;
    } else {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Unknown policy at step ${step.policy}`);
      results.push(processClaim(policy, step.incident));
    }
  });
  return { results };
}
