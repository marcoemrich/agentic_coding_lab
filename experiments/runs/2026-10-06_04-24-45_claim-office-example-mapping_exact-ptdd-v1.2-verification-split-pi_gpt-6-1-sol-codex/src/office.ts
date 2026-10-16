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
export interface Result { premium?: number; payout?: number; remainingCap?: number }
const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_SURCHARGE = 0.3;
const LOYAL_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_DISCOUNT = 0.15;
const COMPONENT_PREMIUM = 25;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40,
  rune: COMPONENT_PREMIUM, moonstone: COMPONENT_PREMIUM,
};
function finalPremium(amount: number): number {
  return Math.ceil(amount + PROCESSING_FEE);
}
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
function cataloguePremium(type: string): number {
  if (!Object.hasOwn(BASE_PREMIUMS, type)) throw new Error(`Unknown item type: ${type}`);
  return BASE_PREMIUMS[type];
}
function itemBasePremium(item: Item, items: Item[]): number {
  const catalogueBase = cataloguePremium(item.type);
  const alike = items.filter(other => other.type === item.type).length;
  const block = ['rune', 'moonstone'].includes(item.type) && alike === BLOCK_SIZE;
  return block ? BLOCK_PREMIUM / BLOCK_SIZE : catalogueBase;
}
function curseRiskRate(item: Item): number {
  return item.cursed ? CURSE_SURCHARGE : 0;
}
function enchantmentRiskRate(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? ENCHANTMENT_SURCHARGE : 0;
}
function loyaltyDiscountRate(years: number): number {
  return years >= LOYAL_YEARS ? LOYALTY_DISCOUNT : 0;
}
function followUpDiscountRate(previousContracts: number): number {
  return previousContracts > 0 ? FOLLOW_UP_DISCOUNT : 0;
}
function quotePremium(items: Item[], years: number, previousContracts: number): number {
  const base = items.reduce((sum, item) => sum + itemBasePremium(item, items), 0);
  const risk = items.reduce((sum, item) => sum + itemBasePremium(item, items) * (curseRiskRate(item) + enchantmentRiskRate(item)), 0);
  const loyalty = loyaltyDiscountRate(years);
  const followUp = followUpDiscountRate(previousContracts);
  return finalPremium(base + base * INITIAL_ASSESSMENT + risk - base * loyalty - base * followUp);
}
const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT_ENCHANTMENT = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;
const COMPONENT_VALUE = 250;
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000, rune: COMPONENT_VALUE, amulet: 600, staff: 800,
  potion: 400, moonstone: COMPONENT_VALUE,
};
interface Policy { items: Item[]; remainingCap: number }
function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}
function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT ? REDUCED_REIMBURSEMENT_RATE : 1;
}
function reportedDamageAmount(amount: number): number {
  if (amount < 0) throw new Error('Damage amount must not be negative');
  return amount;
}
function damageReimbursement(item: Item, amount: number): number {
  return Math.max(0, reportedDamageAmount(amount) * reimbursementRate(item) - DEDUCTIBLE);
}
function coveredDamages(items: Item[], damages: Damage[]): { item: Item; amount: number }[] {
  const available = [...items];
  return damages.map(damage => {
    const index = available.findIndex(item => item.type === damage.itemType);
    if (index < 0) throw new Error(`Damage exceeds coverage: ${damage.itemType}`);
    const [item] = available.splice(index, 1);
    return { item, amount: damage.amount };
  });
}
function settleClaim(policy: Policy, damages: Damage[]): Result {
  const desiredPayout = coveredDamages(policy.items, damages)
    .reduce((sum, damage) => sum + damageReimbursement(damage.item, damage.amount), 0);
  return payFromCap(policy, desiredPayout);
}
function finalPayout(desiredPayout: number, remainingCap: number): number {
  return Math.floor(Math.min(desiredPayout, remainingCap));
}
function payFromCap(policy: Policy, desiredPayout: number): Result {
  const payout = finalPayout(desiredPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
export function execute(scenario: Scenario): { results: Result[] } {
  let contracts = 0;
  const policies = new Map<number, Policy>();
  return { results: scenario.steps.map((step, index) => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, contracts);
      contracts++;
      policies.set(index, createPolicy(step.items));
      return { premium };
    }
    const policy = policies.get(step.policy)!;
    return settleClaim(policy, step.incident.damages);
  }) };
}
