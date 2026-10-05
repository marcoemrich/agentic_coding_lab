export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}
export interface Damage { itemType: string; amount: number }
export interface Quote { op: 'quote'; items: Item[] }
export interface Claim {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: (Quote | Claim)[];
}
export interface Result { premium?: number; payout?: number; remainingCap?: number }
const PROCESSING_FEE = 5;
const COMPONENT_PREMIUM = 25;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40,
  rune: COMPONENT_PREMIUM, moonstone: COMPONENT_PREMIUM,
};
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_RISK_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function basePremium(item: Item): number {
  if (!Object.hasOwn(BASE_PREMIUMS, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  return BASE_PREMIUMS[item.type];
}

function isComponentBlock(type: string, count: number): boolean {
  return (type === 'rune' || type === 'moonstone') && count === BLOCK_SIZE;
}

function policyBasePremium(items: Item[]): number {
  return [...new Set(items.map(item => item.type))].reduce((sum, type) => {
    const count = items.filter(item => item.type === type).length;
    return sum + (isComponentBlock(type, count) ? BLOCK_PREMIUM : count * basePremium({ type }));
  }, 0);
}

function curseRiskRate(item: Item): number {
  return item.cursed ? CURSE_RATE : 0;
}

function enchantmentRiskRate(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? ENCHANTMENT_RISK_RATE : 0;
}

function itemRiskSurcharge(item: Item): number {
  return basePremium(item) * (curseRiskRate(item) + enchantmentRiskRate(item));
}

function loyaltyDiscount(base: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
}

function followUpDiscount(base: number, previousContracts: number): number {
  return previousContracts > 0 ? base * FOLLOW_UP_RATE : 0;
}

function firstInsuranceAssessment(base: number): number {
  return base * FIRST_INSURANCE_RATE;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, previousContracts: number): number {
  const base = policyBasePremium(items);
  const risk = items.reduce((sum, item) => sum + itemRiskSurcharge(item), 0);
  const loyalty = loyaltyDiscount(base, yearsWithMHPCO);
  const followUp = followUpDiscount(base, previousContracts);
  return Math.ceil(PROCESSING_FEE + base + firstInsuranceAssessment(base) + risk - loyalty - followUp);
}

const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const COMPONENT_VALUE = 250;
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400,
  rune: COMPONENT_VALUE, moonstone: COMPONENT_VALUE,
};
const CAP_MULTIPLIER = 2;
interface Policy { items: Item[]; remainingCap: number }

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
}

function initialCap(items: Item[]): number {
  return insuranceSum(items) * CAP_MULTIPLIER;
}

function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL ? REDUCED_REIMBURSEMENT_RATE : 1;
}

function damagePayout(item: Item, amount: number): number {
  return Math.max(0, amount * reimbursementRate(item) - DEDUCTIBLE);
}

function takeInsuredItemForDamage(availableItems: Item[], itemType: string): Item {
  const index = availableItems.findIndex(item => item.type === itemType);
  if (index === -1) throw new Error(`Item not insured or too many damage entries: ${itemType}`);
  return availableItems.splice(index, 1)[0];
}

function cappedPayout(desiredPayout: number, remainingCap: number): number {
  return Math.min(desiredPayout, remainingCap);
}

function validateDamageAmount(amount: number): void {
  if (amount < 0) throw new Error('Damage amount must not be negative');
}

function coveredDamages(items: Item[], damages: Damage[]): { item: Item; amount: number }[] {
  const availableItems = [...items];
  return damages.map(damage => {
    validateDamageAmount(damage.amount);
    return { item: takeInsuredItemForDamage(availableItems, damage.itemType), amount: damage.amount };
  });
}

function settleClaim(policy: Policy, damages: Damage[]): Result {
  const desiredPayout = coveredDamages(policy.items, damages)
    .reduce((sum, damage) => sum + damagePayout(damage.item, damage.amount), 0);
  const payout = Math.floor(cappedPayout(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  let previousContracts = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, previousContracts++);
      policies.set(index, { items: step.items, remainingCap: initialCap(step.items) });
      return { premium };
    }
    const policy = policies.get(step.policy)!;
    return settleClaim(policy, step.incident.damages);
  });
  return { results };
}
