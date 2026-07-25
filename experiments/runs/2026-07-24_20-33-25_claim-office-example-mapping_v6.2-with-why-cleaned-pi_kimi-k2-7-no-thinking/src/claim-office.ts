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

export type Result = QuoteResult | ClaimResult;

export interface Results {
  results: Result[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

function basePremiumForType(type: string): number {
  return ITEM_BASE_PREMIUMS[type] ?? 0;
}

function isComponentItem(item: Item): boolean {
  return basePremiumForType(item.type) === COMPONENT_BASE_PREMIUM;
}

function countBy<T>(items: T[], keyFn: (item: T) => string): Record<string, number> {
  return items.reduce((counts, item) => {
    const key = keyFn(item);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {} as Record<string, number>);
}

function countItemsByType(items: Item[]): Record<string, number> {
  return countBy(items, (item) => item.type);
}

function validateQuoteItems(items: Item[]): void {
  for (const item of items) {
    if (ITEM_BASE_PREMIUMS[item.type] === undefined) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function calculateBasePremium(items: Item[]): number {
  validateQuoteItems(items);
  const counts = countItemsByType(items);
  const onlyComponentItems = items.every(isComponentItem);
  return Object.entries(counts).reduce((sum, [type, count]) => {
    if (onlyComponentItems && count === COMPONENT_BLOCK_SIZE) {
      return sum + COMPONENT_BLOCK_PREMIUM;
    }
    return sum + count * basePremiumForType(type);
  }, 0);
}

function calculateItemSurcharge(item: Item): number {
  const basePremium = basePremiumForType(item.type);
  const curseRate = item.cursed ? CURSE_SURCHARGE_RATE : 0;
  const enchantmentRate = effectiveEnchantment(item) >= HIGH_ENCHANTMENT_THRESHOLD
    ? HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return basePremium * (curseRate + enchantmentRate);
}

function calculateTotalPremium(
  basePremium: number,
  itemModifiers: number,
  policyDiscount: number,
): number {
  const firstInsurance = Math.ceil(basePremium * FIRST_INSURANCE_RATE);
  return basePremium + itemModifiers + firstInsurance - policyDiscount + PROCESSING_FEE;
}

function calculatePolicyDiscount(
  basePremium: number,
  customer: Customer,
  quoteIndex: number,
): number {
  const loyaltyRate = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? LOYALTY_DISCOUNT_RATE : 0;
  const followUpRate = quoteIndex > 0 ? FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0;
  return basePremium * (loyaltyRate + followUpRate);
}

function calculateQuotePremium(
  items: Item[],
  customer: Customer,
  quoteIndex: number,
): number {
  const basePremium = calculateBasePremium(items);
  const itemModifiers = items.reduce((sum, item) => sum + calculateItemSurcharge(item), 0);
  const policyDiscount = calculatePolicyDiscount(basePremium, customer, quoteIndex);
  return calculateTotalPremium(basePremium, itemModifiers, policyDiscount);
}

const DEDUCTIBLE = 100;
const INSURANCE_VALUE_MULTIPLIER = 10;
const POLICY_CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function effectiveEnchantment(item: Item): number {
  return item.enchantment ?? 0;
}

function calculateInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + basePremiumForType(item.type) * INSURANCE_VALUE_MULTIPLIER, 0);
}

function calculatePolicyCap(items: Item[]): number {
  return calculateInsuranceSum(items) * POLICY_CAP_MULTIPLIER;
}

function findPolicyItem(items: Item[], itemType: string): Item | undefined {
  return items.find((item) => item.type === itemType);
}

function calculateReimbursableDamage(damage: Damage, item: Item): number {
  if (effectiveEnchantment(item) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return damage.amount;
}

function validateClaim(claim: ClaimStep, policy: QuoteStep): void {
  for (const damage of claim.incident.damages) {
    if (damage.amount < 0) {
      throw new Error("Damage amount cannot be negative");
    }
  }
  const damageCounts = countBy(claim.incident.damages, (damage) => damage.itemType);
  const policyCounts = countItemsByType(policy.items);
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] ?? 0)) {
      throw new Error(`Claim damages more ${type} items than policy covers`);
    }
  }
}

function calculateClaimResult(
  claim: ClaimStep,
  policy: QuoteStep,
  remainingCap: number,
): ClaimResult {
  validateClaim(claim, policy);
  let totalPayout = 0;
  for (const damage of claim.incident.damages) {
    const item = findPolicyItem(policy.items, damage.itemType)!;
    const reimbursableDamage = calculateReimbursableDamage(damage, item);
    totalPayout += Math.max(0, reimbursableDamage - DEDUCTIBLE);
  }
  const payout = Math.floor(Math.min(totalPayout, remainingCap));
  return { payout, remainingCap: remainingCap - payout };
}

interface PolicyState {
  policy: QuoteStep;
  remainingCap: number;
}

export function processScenario(scenario: Scenario): Results {
  const policyStates: PolicyState[] = [];
  const results: Result[] = [];
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const quoteIndex = policyStates.length;
      policyStates.push({
        policy: step,
        remainingCap: calculatePolicyCap(step.items),
      });
      results.push({ premium: calculateQuotePremium(step.items, scenario.customer, quoteIndex) });
    } else {
      const state = policyStates[step.policy];
      const result = calculateClaimResult(step, state.policy, state.remainingCap);
      state.remainingCap = result.remainingCap;
      results.push(result);
    }
  }
  return { results };
}
