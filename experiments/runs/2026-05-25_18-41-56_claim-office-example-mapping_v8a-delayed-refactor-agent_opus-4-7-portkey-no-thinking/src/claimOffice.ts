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

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface QuoteStep {
  op: 'quote';
  items: Item[];
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

export interface ScenarioResults {
  results: StepResult[];
}

const MAIN_ITEMS: Record<string, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_VALUE = 250;
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const PROCESSING_FEE = 5;

// Surcharge thresholds and rates (premium calculation)
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

// Policy-wide premium multipliers
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT = 0.2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const REPEAT_CONTRACT_DISCOUNT = 0.15;

// Claim calculation
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function isKnownType(type: string): boolean {
  return type in MAIN_ITEMS || isComponent(type);
}

function itemInsuranceValue(item: Item): number {
  if (isComponent(item.type)) return COMPONENT_VALUE;
  return MAIN_ITEMS[item.type].insuranceValue;
}

function itemBasePremium(item: Item): number {
  if (isComponent(item.type)) return COMPONENT_PREMIUM;
  return MAIN_ITEMS[item.type].basePremium;
}

function isHighEnchantmentForPremium(item: Item): boolean {
  return typeof item.enchantment === 'number' && item.enchantment >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD;
}

function itemSurchargeMultiplier(item: Item): number {
  const cursedSurcharge = item.cursed ? CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = isHighEnchantmentForPremium(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return cursedSurcharge + enchantmentSurcharge;
}

interface PremiumBreakdown {
  policyBase: number;
  itemSurcharges: number;
  insuranceSum: number;
}

function itemSurcharge(item: Item): number {
  return itemBasePremium(item) * itemSurchargeMultiplier(item);
}

function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    (groups[key(item)] ||= []).push(item);
  }
  return groups;
}

function sum(values: number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

function componentGroupBasePremium(group: Item[]): number {
  // Block discount applies only when the count of alike components is exactly BLOCK_SIZE.
  return group.length === BLOCK_SIZE ? BLOCK_PREMIUM : group.length * COMPONENT_PREMIUM;
}

function computePremiumBreakdown(items: Item[]): PremiumBreakdown {
  const mainItems = items.filter((item) => !isComponent(item.type));
  const componentGroups = Object.values(groupBy(items.filter((item) => isComponent(item.type)), (item) => item.type));

  const mainItemsBase = sum(mainItems.map(itemBasePremium));
  const componentsBase = sum(componentGroups.map(componentGroupBasePremium));
  const policyBase = mainItemsBase + componentsBase;

  const itemSurcharges = sum(items.map(itemSurcharge));
  const insuranceSum = sum(items.map(itemInsuranceValue));

  return { policyBase, itemSurcharges, insuranceSum };
}

export interface QuoteContext {
  customer: Customer;
  quoteIndex: number; // zero-based: 0 = first quote in scenario
}

function policyWideMultiplier(ctx: QuoteContext): number {
  const loyaltyDiscount = ctx.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? LOYALTY_DISCOUNT : 0;
  const repeatDiscount = ctx.quoteIndex >= 1 ? REPEAT_CONTRACT_DISCOUNT : 0;
  // First-insurance surcharge always applies (per-item interpretation: every new policy includes new items).
  return 1 + FIRST_INSURANCE_SURCHARGE - loyaltyDiscount - repeatDiscount;
}

function validateItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

export function computeQuote(items: Item[], ctx: QuoteContext): { premium: number; insuranceSum: number } {
  validateItemTypes(items);

  const { policyBase, itemSurcharges, insuranceSum } = computePremiumBreakdown(items);
  const total = policyBase * policyWideMultiplier(ctx) + itemSurcharges + PROCESSING_FEE;
  const premium = ceilWithEpsilon(total);

  return { premium, insuranceSum };
}

const EPSILON = 1e-9;

function roundWithEpsilon(value: number, fallback: (n: number) => number): number {
  const rounded = Math.round(value);
  return Math.abs(value - rounded) < EPSILON ? rounded : fallback(value);
}

// Premiums round up (in the company's favour), payouts round down (also in the company's favour).
function ceilWithEpsilon(value: number): number {
  return roundWithEpsilon(value, Math.ceil);
}

function floorWithEpsilon(value: number): number {
  return roundWithEpsilon(value, Math.floor);
}

interface PolicyState {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

function isHighEnchantmentForClaim(item: Item): boolean {
  return typeof item.enchantment === 'number' && item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

function payoutForDamage(item: Item, amount: number): number {
  // Spec: when both high-enchantment and dragon-material clauses apply, the 50% rule wins.
  // Dragon material alone reimburses the full damage. Then deductible applies.
  const reimbursementBase = isHighEnchantmentForClaim(item) ? amount * HIGH_ENCHANTMENT_PAYOUT_RATE : amount;
  return reimbursementBase - DEDUCTIBLE;
}

function countBy<T>(items: T[], key: (item: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[key(item)] = (counts[key(item)] || 0) + 1;
  }
  return counts;
}

function validateDamages(policy: PolicyState, damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
  const policyCounts = countBy(policy.items, (item) => item.type);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [itemType, count] of Object.entries(damageCounts)) {
    if (!(itemType in policyCounts) || count > policyCounts[itemType]) {
      throw new Error(`Damage to item not in policy or exceeds covered count: ${itemType}`);
    }
  }
}

export function computeClaim(policy: PolicyState, incident: Incident): { payout: number; remainingCap: number } {
  if (!incident.damages || incident.damages.length === 0) {
    return { payout: 0, remainingCap: policy.remainingCap };
  }

  validateDamages(policy, incident.damages);

  // Damage entries don't carry item attributes; use any item of the matching type as a representative.
  const itemsByType = groupBy(policy.items, (item) => item.type);
  const totalRaw = sum(
    incident.damages.map((damage) =>
      Math.max(0, payoutForDamage(itemsByType[damage.itemType][0], damage.amount)),
    ),
  );

  const payout = floorWithEpsilon(Math.min(totalRaw, policy.remainingCap));
  return { payout, remainingCap: policy.remainingCap - payout };
}

function openPolicy(items: Item[], insuranceSum: number): PolicyState {
  const cap = insuranceSum * CAP_MULTIPLIER;
  return { items, insuranceSum, cap, remainingCap: cap };
}

export function processScenario(scenario: Scenario): ScenarioResults {
  const results: StepResult[] = [];
  const policies: Record<number, PolicyState> = {};
  let quoteCount = 0;

  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === 'quote') {
      const { premium, insuranceSum } = computeQuote(step.items, {
        customer: scenario.customer,
        quoteIndex: quoteCount++,
      });
      policies[stepIndex] = openPolicy(step.items, insuranceSum);
      results.push({ premium });
      return;
    }
    const policy = policies[step.policy];
    if (!policy) {
      throw new Error(`Claim references unknown policy index: ${step.policy}`);
    }
    const { payout, remainingCap } = computeClaim(policy, step.incident);
    policy.remainingCap = remainingCap;
    results.push({ payout, remainingCap });
  });

  return { results };
}
