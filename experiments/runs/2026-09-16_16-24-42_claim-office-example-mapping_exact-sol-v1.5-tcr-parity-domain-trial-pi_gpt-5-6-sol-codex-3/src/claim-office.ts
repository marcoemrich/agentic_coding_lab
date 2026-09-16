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

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_PERCENT = 10;
const CURSED_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const LOYALTY_YEARS = 2;
const PERCENT = 100;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const HIGH_CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_CLAIM_REIMBURSEMENT_PERCENT = 50;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function isComponentBlock(itemType: string, count: number): boolean {
  return COMPONENT_TYPES.has(itemType) && count === COMPONENT_BLOCK_SIZE;
}

function itemBasePremium(itemType: string): number {
  const premium = BASE_PREMIUMS[itemType];
  if (premium === undefined) throw new Error(`Unknown item type: ${itemType}`);
  return premium;
}

function premiumForType(itemType: string, count: number): number {
  return isComponentBlock(itemType, count)
    ? COMPONENT_BLOCK_PREMIUM
    : itemBasePremium(itemType) * count;
}

function itemTypeCounts(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
}

function policyBasePremium(items: Item[]): number {
  return [...itemTypeCounts(items)].reduce(
    (total, [itemType, count]) => total + premiumForType(itemType, count),
    0,
  );
}

function percentageOfItemBase(item: Item, percentage: number): number {
  return (itemBasePremium(item.type) * percentage) / PERCENT;
}

function cursedSurcharge(items: Item[]): number {
  return items
    .filter((item) => item.cursed)
    .reduce((total, item) => total + percentageOfItemBase(item, CURSED_SURCHARGE_PERCENT), 0);
}

function enchantmentSurcharge(items: Item[]): number {
  return items
    .filter((item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL)
    .reduce(
      (total, item) => total + percentageOfItemBase(item, HIGH_ENCHANTMENT_SURCHARGE_PERCENT),
      0,
    );
}

function firstInsuranceSurcharge(basePremium: number): number {
  return (basePremium * FIRST_INSURANCE_PERCENT) / PERCENT;
}

function loyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS
    ? (basePremium * LOYALTY_DISCOUNT_PERCENT) / PERCENT
    : 0;
}

function followUpDiscount(basePremium: number, previousContracts: number): number {
  return previousContracts > 0 ? (basePremium * FOLLOW_UP_DISCOUNT_PERCENT) / PERCENT : 0;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, previousContracts: number): number {
  const basePremium = policyBasePremium(items);
  return Math.ceil(
    basePremium
      + cursedSurcharge(items)
      + enchantmentSurcharge(items)
      + firstInsuranceSurcharge(basePremium)
      - loyaltyDiscount(basePremium, yearsWithMHPCO)
      - followUpDiscount(basePremium, previousContracts)
      + PROCESSING_FEE,
  );
}

function policyCap(items: Item[]): number {
  return items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0) * CAP_MULTIPLIER;
}

function insuredItemForDamage(policy: Policy, itemType: string, occurrence: number): Item {
  const item = policy.items.filter((candidate) => candidate.type === itemType)[occurrence];
  if (!item) throw new Error(`Damage item is not insured: ${itemType}`);
  return item;
}

function claimReimbursementPercent(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_CLAIM_ENCHANTMENT_LEVEL
    ? HIGH_CLAIM_REIMBURSEMENT_PERCENT
    : PERCENT;
}

function validateDamageAmount(damage: Damage): void {
  if (damage.amount < 0) throw new Error(`Damage amount must not be negative: ${damage.amount}`);
}

function desiredClaimPayout(policy: Policy, damages: Damage[]): number {
  const usedByType = new Map<string, number>();
  return damages.reduce((total, damage) => {
    validateDamageAmount(damage);
    const used = usedByType.get(damage.itemType) ?? 0;
    const item = insuredItemForDamage(policy, damage.itemType, used);
    usedByType.set(damage.itemType, used + 1);
    const reimbursed = (damage.amount * claimReimbursementPercent(item)) / PERCENT;
    return total + Math.max(0, reimbursed - DEDUCTIBLE);
  }, 0);
}

function settleClaim(policy: Policy, damages: Damage[]): ClaimResult {
  const payout = Math.floor(Math.min(desiredClaimPayout(policy, damages), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Array<QuoteResult | ClaimResult> } {
  const results: Array<QuoteResult | ClaimResult> = [];
  const policies = new Map<number, Policy>();
  let previousContracts = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, previousContracts) });
      policies.set(index, { items: step.items, remainingCap: policyCap(step.items) });
      previousContracts += 1;
    } else {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Policy does not reference a quote: ${step.policy}`);
      results.push(settleClaim(policy, step.incident.damages));
    }
  });
  return { results };
}
