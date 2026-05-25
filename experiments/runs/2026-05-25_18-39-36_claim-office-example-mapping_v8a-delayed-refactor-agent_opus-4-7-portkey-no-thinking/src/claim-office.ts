// Types

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

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
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

// Item catalog

const MAIN_ITEMS: Record<string, { value: number; premium: number }> = {
  sword:  { value: 1000, premium: 100 },
  amulet: { value: 600,  premium: 60 },
  staff:  { value: 800,  premium: 80 },
  potion: { value: 400,  premium: 40 },
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);

const COMPONENT_VALUE = 250;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

const PROCESSING_FEE = 5;
const DEDUCTIBLE_PER_DAMAGE = 100;

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function isKnownType(type: string): boolean {
  return type in MAIN_ITEMS || isComponent(type);
}

function itemInsuranceValue(item: Item): number {
  if (item.type in MAIN_ITEMS) return MAIN_ITEMS[item.type].value;
  if (isComponent(item.type)) return COMPONENT_VALUE;
  throw new Error(`Unknown item type: ${item.type}`);
}

// Premium calculation

interface ItemBase {
  item: Item;
  basePremium: number;
}

function componentGroupTotal(count: number): number {
  // Block discount applies only when the count is exactly the block size.
  return count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * COMPONENT_PREMIUM;
}

function itemBasePremiums(items: Item[]): ItemBase[] {
  // Partition items into main items (priced individually) and components
  // (priced as a group per type, since they can earn a block discount).
  const mains: ItemBase[] = [];
  const componentsByType: Record<string, Item[]> = {};

  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    if (item.type in MAIN_ITEMS) {
      mains.push({ item, basePremium: MAIN_ITEMS[item.type].premium });
    } else {
      (componentsByType[item.type] ??= []).push(item);
    }
  }

  const componentBases: ItemBase[] = [];
  for (const group of Object.values(componentsByType)) {
    const perItem = componentGroupTotal(group.length) / group.length;
    for (const item of group) {
      componentBases.push({ item, basePremium: perItem });
    }
  }

  return [...mains, ...componentBases];
}

function itemSurcharge({ item, basePremium }: ItemBase): number {
  const curseSurcharge = item.cursed ? basePremium * 0.5 : 0;
  const enchantSurcharge = (item.enchantment ?? 0) >= 5 ? basePremium * 0.3 : 0;
  return curseSurcharge + enchantSurcharge;
}

function roundUp(n: number): number {
  return Math.ceil(n);
}

function roundDown(n: number): number {
  return Math.floor(n);
}

export function computePremium(items: Item[], customer: Customer, isFollowUpContract: boolean): number {
  const bases = itemBasePremiums(items);

  const policyBase = bases.reduce((sum, b) => sum + b.basePremium, 0);
  const itemSurcharges = bases.reduce((sum, b) => sum + itemSurcharge(b), 0);

  // Loyalty discount: 20% off the policy base for customers with >= 2 years.
  const loyaltyDiscount = customer.yearsWithMHPCO >= 2 ? -policyBase * 0.2 : 0;

  // First-insurance surcharge: 10% applied per item's base premium (each item is a
  // first insurance on its first contract).
  const firstInsuranceSurcharge = policyBase * 0.1;

  // Follow-up contract discount: 15% off the policy base on every contract after the first.
  const followUpDiscount = isFollowUpContract ? -policyBase * 0.15 : 0;

  const total =
    policyBase +
    itemSurcharges +
    loyaltyDiscount +
    firstInsuranceSurcharge +
    followUpDiscount +
    PROCESSING_FEE;

  return roundUp(total);
}

// Claim processing

interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

export function buildPolicy(items: Item[]): Policy {
  // Validate all known
  for (const it of items) {
    if (!isKnownType(it.type)) throw new Error(`Unknown item type: ${it.type}`);
  }
  const insuranceSum = items.reduce((sum, it) => sum + itemInsuranceValue(it), 0);
  const cap = insuranceSum * 2;
  return { items, insuranceSum, cap, remainingCap: cap };
}

function payoutForDamage(item: Item, amount: number): number {
  // High-enchantment 50% rule wins even when material is dragon.
  // Otherwise (dragon or standard) the full damage amount is reimbursable.
  const isHighlyEnchanted = (item.enchantment ?? 0) >= 8;
  const reimbursable = isHighlyEnchanted ? amount * 0.5 : amount;
  return Math.max(0, reimbursable - DEDUCTIBLE_PER_DAMAGE);
}

export function processClaim(policy: Policy, incident: Incident): { payout: number; remainingCap: number } {
  // Validate each damage entry up front.
  for (const d of incident.damages) {
    if (d.amount < 0) throw new Error(`Negative damage amount: ${d.amount}`);
    if (!isKnownType(d.itemType)) throw new Error(`Unknown damage item type: ${d.itemType}`);
  }

  // Group policy items by type so each damage entry can be matched to a distinct
  // insured item (e.g. dragon-material vs. plain) of the right type.
  const available: Record<string, Item[]> = {};
  for (const it of policy.items) {
    (available[it.type] ??= []).push(it);
  }

  let total = 0;
  for (const d of incident.damages) {
    const candidates = available[d.itemType];
    if (!candidates || candidates.length === 0) {
      throw new Error(`Damage references item type not in policy or exceeds count: ${d.itemType}`);
    }
    const item = candidates.shift()!;
    total += payoutForDamage(item, d.amount);
  }

  // Cap to remainingCap, then round down (in favor of MHPCO).
  const payout = roundDown(Math.min(total, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

// Scenario runner

export function runScenario(scenario: Scenario): ScenarioOutput {
  const results: StepResult[] = [];
  const policies: Record<number, Policy> = {};
  let quoteCount = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === 'quote') {
      const isFollowUp = quoteCount >= 1;
      const premium = computePremium(step.items, scenario.customer, isFollowUp);
      // Build policy and store
      const policy = buildPolicy(step.items);
      policies[i] = policy;
      results.push({ premium });
      quoteCount++;
    } else {
      const policy = policies[step.policy];
      if (!policy) throw new Error(`No policy at step ${step.policy}`);
      const r = processClaim(policy, step.incident);
      results.push(r);
    }
  }
  return { results };
}
