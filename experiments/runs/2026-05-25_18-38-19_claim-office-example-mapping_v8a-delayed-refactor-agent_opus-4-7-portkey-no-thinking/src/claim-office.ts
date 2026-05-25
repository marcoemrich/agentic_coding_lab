export type ItemType = 'sword' | 'amulet' | 'staff' | 'potion' | 'rune' | 'moonstone';

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

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
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

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_VALUE = 250;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

const DEDUCTIBLE = 100;
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_RATE = 0.5;
const HIGH_ENCHANT_RATE = 0.3;
const HIGH_ENCHANT_THRESHOLD = 5;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const HALF_PAYOUT_ENCHANT_THRESHOLD = 8;

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function assertKnownType(type: string, role = 'item'): void {
  if (!(type in MAIN_ITEMS) && !isComponent(type)) {
    throw new Error(`Unknown ${role} type: ${type}`);
  }
}

function itemInsuranceValue(item: Item): number {
  if (item.type in MAIN_ITEMS) return MAIN_ITEMS[item.type].value;
  return COMPONENT_VALUE;
}

function modifierFactor(item: Item): number {
  let factor = 1;
  if (item.cursed) factor += CURSED_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD) factor += HIGH_ENCHANT_RATE;
  return factor;
}

// Group items by their "premium unit": each main item is its own unit; all
// components of the same type share a unit so the block discount can be
// applied once. Returns the per-unit base premium together with the items
// that belong to that unit (modifiers are applied per item within the unit).
interface PremiumUnit {
  unitBase: number;
  items: Item[];
}

function premiumUnits(items: Item[]): PremiumUnit[] {
  const units: PremiumUnit[] = [];
  const componentUnitByType: Record<string, PremiumUnit> = {};

  for (const item of items) {
    assertKnownType(item.type);
    if (isComponent(item.type)) {
      const unit = componentUnitByType[item.type] ??= { unitBase: 0, items: [] };
      unit.items.push(item);
      unit.unitBase = componentGroupBase(unit.items.length);
      if (unit.items.length === 1) units.push(unit);
    } else {
      units.push({ unitBase: MAIN_ITEMS[item.type].premium, items: [item] });
    }
  }
  return units;
}

function componentGroupBase(count: number): number {
  return count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * COMPONENT_PREMIUM;
}

export interface PremiumContext {
  yearsWithMHPCO: number;
  isFollowUpContract: boolean; // any contract after the first
}

export function computePremium(items: Item[], ctx: PremiumContext): number {
  if (items.length === 0) return PROCESSING_FEE;

  let policyBaseTotal = 0;
  let itemModifierTotal = 0;

  for (const unit of premiumUnits(items)) {
    policyBaseTotal += unit.unitBase;
    const perItemBase = unit.unitBase / unit.items.length;
    for (const item of unit.items) {
      itemModifierTotal += perItemBase * (modifierFactor(item) - 1);
    }
  }

  const firstInsuranceSurcharge = policyBaseTotal * FIRST_INSURANCE_RATE;
  const loyaltyDiscount =
    ctx.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? policyBaseTotal * LOYALTY_RATE : 0;
  const followUpDiscount = ctx.isFollowUpContract ? policyBaseTotal * FOLLOW_UP_RATE : 0;

  const total =
    policyBaseTotal +
    itemModifierTotal +
    firstInsuranceSurcharge -
    loyaltyDiscount -
    followUpDiscount +
    PROCESSING_FEE;

  // Round up in MHPCO's favor
  return Math.ceil(total);
}

export interface PolicyState {
  insuranceSum: number;
  cap: number;
  remainingCap: number;
  itemCounts: Record<string, number>;
  itemsByType: Record<string, Item[]>;
}

export function createPolicy(items: Item[]): PolicyState {
  let insuranceSum = 0;
  const itemCounts: Record<string, number> = {};
  const itemsByType: Record<string, Item[]> = {};
  for (const item of items) {
    assertKnownType(item.type);
    insuranceSum += itemInsuranceValue(item);
    itemCounts[item.type] = (itemCounts[item.type] ?? 0) + 1;
    (itemsByType[item.type] ??= []).push(item);
  }
  const cap = insuranceSum * 2;
  return { insuranceSum, cap, remainingCap: cap, itemCounts, itemsByType };
}

function damageReimbursable(item: Item, amount: number): number {
  const ench = item.enchantment ?? 0;
  if (ench >= HALF_PAYOUT_ENCHANT_THRESHOLD) return amount * 0.5;
  return amount;
}

export function processClaim(policy: PolicyState, incident: Incident): ClaimResult {
  const perTypeIndex: Record<string, number> = {};
  let totalPayout = 0;

  for (const d of incident.damages) {
    assertKnownType(d.itemType, 'damage item');
    if (d.amount < 0) throw new Error(`Negative damage amount: ${d.amount}`);

    const idx = perTypeIndex[d.itemType] ?? 0;
    perTypeIndex[d.itemType] = idx + 1;
    if ((policy.itemCounts[d.itemType] ?? 0) <= idx) {
      throw new Error(`Damage entry references item not in policy: ${d.itemType}`);
    }
    const item = policy.itemsByType[d.itemType][idx];

    const reimbursable = damageReimbursable(item, d.amount);
    const perDamagePayout = Math.max(0, reimbursable - DEDUCTIBLE);
    totalPayout += perDamagePayout;
  }

  // Round down in MHPCO's favor; then cap.
  const payout = Math.min(Math.floor(totalPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioOutput {
  const results: StepResult[] = [];
  const policies: Record<number, PolicyState> = {};
  let quoteCount = 0;

  scenario.steps.forEach((step, i) => {
    if (step.op === 'quote') {
      const ctx: PremiumContext = {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        isFollowUpContract: quoteCount > 0,
      };
      results.push({ premium: computePremium(step.items, ctx) });
      policies[i] = createPolicy(step.items);
      quoteCount++;
    } else if (step.op === 'claim') {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error(`Claim references unknown policy index: ${step.policy}`);
      }
      results.push(processClaim(policy, step.incident));
    } else {
      throw new Error(`Unknown step op`);
    }
  });

  return { results };
}
