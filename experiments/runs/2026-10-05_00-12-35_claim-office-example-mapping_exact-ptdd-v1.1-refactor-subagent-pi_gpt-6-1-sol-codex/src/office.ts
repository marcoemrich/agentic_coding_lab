export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}
export interface Damage { itemType: string; amount: number }
export type Step = { op: 'quote'; items: Item[] } | {
  op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] };
};
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
export type Result = { premium: number } | { payout: number; remainingCap: number };
const PROCESSING_FEE = 5;
const COMPONENT_BASE_PREMIUM = 25;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40,
  rune: COMPONENT_BASE_PREMIUM, moonstone: COMPONENT_BASE_PREMIUM,
};
const INITIAL_ASSESSMENT_RATE = 0.1;

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
function assertKnownItemType(type: string): void {
  if (!Object.hasOwn(BASE_PREMIUMS, type)) throw new Error(`Unknown item type: ${type}`);
}

function calculateTypeGroupBasePremium(type: string, count: number): number {
  assertKnownItemType(type);
  const component = type === 'rune' || type === 'moonstone';
  return component && count === BLOCK_SIZE ? BLOCK_PREMIUM : count * BASE_PREMIUMS[type];
}

function calculateBasePremium(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  let base = 0;
  for (const [type, count] of counts) {
    base += calculateTypeGroupBasePremium(type, count);
  }
  return base;
}

function calculateInitialAssessment(basePremium: number): number {
  return basePremium * INITIAL_ASSESSMENT_RATE;
}

function finalizePremium(premiumBeforeFee: number): number {
  return Math.ceil(premiumBeforeFee + PROCESSING_FEE);
}

const CURSE_RATE = 0.5;
function calculateItemCurseSurcharge(item: Item): number {
  return item.cursed ? BASE_PREMIUMS[item.type] * CURSE_RATE : 0;
}

function calculateCurseSurcharge(items: Item[]): number {
  return items.reduce((sum, item) => sum + calculateItemCurseSurcharge(item), 0);
}

const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_RISK_RATE = 0.3;
function calculateItemEnchantmentSurcharge(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
    ? BASE_PREMIUMS[item.type] * ENCHANTMENT_RISK_RATE : 0;
}

function calculateEnchantmentSurcharge(items: Item[]): number {
  return items.reduce((sum, item) => sum + calculateItemEnchantmentSurcharge(item), 0);
}

const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
function calculateLoyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
}

const FOLLOW_UP_RATE = 0.15;
function calculateFollowUpDiscount(basePremium: number, previousContracts: number): number {
  return previousContracts > 0 ? basePremium * FOLLOW_UP_RATE : 0;
}

function calculateQuotePremium(items: Item[], yearsWithMHPCO: number, previousContracts: number): number {
  const basePremium = calculateBasePremium(items);
  return finalizePremium(basePremium + calculateInitialAssessment(basePremium)
    + calculateCurseSurcharge(items) + calculateEnchantmentSurcharge(items)
    - calculateLoyaltyDiscount(basePremium, yearsWithMHPCO)
    - calculateFollowUpDiscount(basePremium, previousContracts));
}

const COMPONENT_INSURANCE_VALUE = 250;
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400,
  rune: COMPONENT_INSURANCE_VALUE, moonstone: COMPONENT_INSURANCE_VALUE,
};
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
interface Policy { items: Item[]; remainingCap: number }

function calculateInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
}

function calculatePolicyCap(items: Item[]): number {
  return calculateInsuranceSum(items) * CAP_MULTIPLIER;
}

const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL ? REDUCED_REIMBURSEMENT_RATE : 1;
}

function applyDamageDeductible(reimbursement: number): number {
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function assertNonNegativeDamageAmount(amount: number): void {
  if (amount < 0) throw new Error('Damage amount must not be negative');
}

function calculateDamageReimbursement(damage: Damage, item: Item): number {
  return applyDamageDeductible(damage.amount * reimbursementRate(item));
}

function takeNextInsuredItem(availableItems: Item[], itemType: string): Item {
  const index = availableItems.findIndex(item => item.type === itemType);
  if (index < 0) throw new Error(`No insured item available for damage: ${itemType}`);
  const [item] = availableItems.splice(index, 1);
  return item;
}

function calculateClaimReimbursement(damages: Damage[], items: Item[]): number {
  const availableItems = [...items];
  return damages.reduce((sum, damage) => {
    const item = takeNextInsuredItem(availableItems, damage.itemType);
    assertNonNegativeDamageAmount(damage.amount);
    return sum + calculateDamageReimbursement(damage, item);
  }, 0);
}

function limitPayoutToRemainingCap(reimbursement: number, remainingCap: number): number {
  return Math.min(reimbursement, remainingCap);
}

function finalizePayout(payout: number): number {
  return Math.floor(payout);
}

function settleClaim(damages: Damage[], policy: Policy): { payout: number; remainingCap: number } {
  const reimbursement = calculateClaimReimbursement(damages, policy.items);
  const payout = finalizePayout(limitPayoutToRemainingCap(reimbursement, policy.remainingCap));
  return { payout, remainingCap: policy.remainingCap - payout };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  let previousContracts = 0;
  const policies = new Map<number, Policy>();
  return { results: scenario.steps.map((step, index) => {
    if (step.op === 'quote') {
      const premium = calculateQuotePremium(step.items, scenario.customer.yearsWithMHPCO, previousContracts);
      previousContracts += 1;
      policies.set(index, { items: step.items, remainingCap: calculatePolicyCap(step.items) });
      return { premium };
    }
    const policy = policies.get(step.policy)!;
    const settlement = settleClaim(step.incident.damages, policy);
    policy.remainingCap = settlement.remainingCap;
    return settlement;
  }) };
}
