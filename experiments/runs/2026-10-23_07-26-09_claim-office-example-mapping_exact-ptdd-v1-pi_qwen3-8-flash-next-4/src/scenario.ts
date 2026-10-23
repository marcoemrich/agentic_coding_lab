export interface ItemSpec {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: ItemSpec[];
}

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: DamageEntry[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Customer {
  yearsWithMHPCO: number;
}

export interface ScenarioInput {
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

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_MIN_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const PAYOUT_CAP_MULTIPLIER = 2;
const DEDUCTIBLE_PER_DAMAGE_EVENT = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

interface Policy {
  items: ItemSpec[];
  remainingCap: number;
}

export function runScenario(input: ScenarioInput): StepResult[] {
  const policies: Policy[] = [];
  const results: StepResult[] = [];
  input.steps.forEach((step) => {
    if (step.op === "quote") {
      const quoteResult = processQuote(step, input.customer, policies.length + 1);
      policies.push(createPolicy(step));
      results.push(quoteResult);
      return;
    }
    results.push(processClaim(step, policies));
  });
  return results;
}

function createPolicy(step: QuoteStep): Policy {
  const insuranceSum = step.items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  return { items: step.items, remainingCap: insuranceSum * PAYOUT_CAP_MULTIPLIER };
}

function processClaim(step: ClaimStep, policies: Policy[]): ClaimResult {
  const policy = policies[step.policy];
  step.incident.damages.forEach(rejectNegativeDamageAmount);
  const claimedItems = [...policy.items];
  const reimbursed = step.incident.damages.reduce((sum, damage) => {
    return sum + reimburse(damage, takeInsuredItem(claimedItems, damage));
  }, 0);
  const payout = roundPayoutInMHPCOFavor(Math.min(reimbursed, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function roundPayoutInMHPCOFavor(payout: number): number {
  return Math.floor(payout);
}

function reimburse(damage: DamageEntry, item: ItemSpec): number {
  return applyReimbursementClauses(damage.amount, item) - DEDUCTIBLE_PER_DAMAGE_EVENT;
}

function takeInsuredItem(claimedItems: ItemSpec[], damage: DamageEntry): ItemSpec {
  const itemIndex = claimedItems.findIndex((item) => item.type === damage.itemType);
  if (itemIndex === -1) {
    throw new Error(`Damaged item not insured on this policy: ${damage.itemType}`);
  }
  return claimedItems.splice(itemIndex, 1)[0];
}

function rejectNegativeDamageAmount(damage: DamageEntry): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

function applyReimbursementClauses(amount: number, item: ItemSpec): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_LEVEL) {
    return amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return amount;
}

function processQuote(step: QuoteStep, customer: Customer, contractNumber: number): QuoteResult {
  step.items.forEach(rejectUnknownItemType);
  const basePremium = sumItemBasePremiums(step.items);
  const premium =
    basePremium +
    itemLevelSurcharges(step.items) +
    firstInsuranceSurcharge(basePremium) +
    loyaltyDiscount(basePremium, customer) +
    followUpDiscount(basePremium, contractNumber) +
    PROCESSING_FEE;
  return { premium: roundPremiumInMHPCOFavor(premium) };
}

function loyaltyDiscount(basePremium: number, customer: Customer): number {
  return customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS ? -basePremium * LOYALTY_DISCOUNT_RATE : 0;
}

function followUpDiscount(basePremium: number, contractNumber: number): number {
  return contractNumber > 1 ? -basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
}

function itemLevelSurcharges(items: ItemSpec[]): number {
  return items.reduce((sum, item) => sum + cursedSurcharge(item) + highEnchantmentSurcharge(item), 0);
}

function cursedSurcharge(item: ItemSpec): number {
  return item.cursed === true ? itemBasePremium(item) * CURSED_SURCHARGE_RATE : 0;
}

function highEnchantmentSurcharge(item: ItemSpec): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? itemBasePremium(item) * HIGH_ENCHANTMENT_RATE : 0;
}

function firstInsuranceSurcharge(basePremium: number): number {
  return basePremium * FIRST_INSURANCE_RATE;
}

function roundPremiumInMHPCOFavor(premium: number): number {
  return Math.ceil(premium);
}

function sumItemBasePremiums(items: ItemSpec[]): number {
  return groupByType(items).reduce((sum, group) => sum + groupBasePremium(group), 0);
}

function groupBasePremium(group: ItemSpec[]): number {
  const pieces = group.length;
  if (isComponent(group[0])) {
    return pieces === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : pieces * COMPONENT_BASE_PREMIUM;
  }
  return pieces * itemBasePremium(group[0]);
}

function itemBasePremium(item: ItemSpec): number {
  return isComponent(item) ? COMPONENT_BASE_PREMIUM : BASE_PREMIUMS[item.type];
}

function groupByType(items: ItemSpec[]): ItemSpec[][] {
  const groups = new Map<string, ItemSpec[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return [...groups.values()];
}

function isComponent(item: ItemSpec): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function rejectUnknownItemType(item: ItemSpec): void {
  if (!isComponent(item) && !(item.type in BASE_PREMIUMS)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
}

