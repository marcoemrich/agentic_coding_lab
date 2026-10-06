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
const FIRST_INSURANCE_RATE = 0.1;
interface CatalogueEntry { basePremium: number; insuranceValue: number }
const COMPONENT_PRICE: CatalogueEntry = { basePremium: 25, insuranceValue: 250 };
const PRICE_LIST: Record<string, CatalogueEntry> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: COMPONENT_PRICE, moonstone: COMPONENT_PRICE,
};
function catalogueEntry(type: string): CatalogueEntry {
  if (!Object.hasOwn(PRICE_LIST, type)) throw new Error(`Unknown item type: ${type}`);
  return PRICE_LIST[type];
}
function itemBasePremium(item: Item): number {
  return catalogueEntry(item.type).basePremium;
}
function finalPremium(amount: number): number {
  return Math.ceil(amount + PROCESSING_FEE);
}
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_RATE = 0.3;
const BLOCK_COUNT = 3;
const BLOCK_BASE = 60;
function insuredItemBase(item: Item, items: Item[]): number {
  const alikeCount = items.filter(other => other.type === item.type).length;
  const component = item.type === 'rune' || item.type === 'moonstone';
  return component && alikeCount === BLOCK_COUNT
    ? BLOCK_BASE / BLOCK_COUNT : itemBasePremium(item);
}
function curseSurcharge(item: Item, base: number): number {
  return item.cursed ? base * CURSE_RATE : 0;
}
function enchantmentSurcharge(item: Item, base: number): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
    ? base * ENCHANTMENT_RATE : 0;
}
function itemRiskSurcharge(item: Item, base: number): number {
  return curseSurcharge(item, base) + enchantmentSurcharge(item, base);
}
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
function loyaltyDiscount(base: number, years: number): number {
  return years >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
}
const FOLLOW_UP_RATE = 0.15;
function followUpDiscount(base: number, priorContracts: number): number {
  return priorContracts > 0 ? base * FOLLOW_UP_RATE : 0;
}
function quotePremium(items: Item[], years: number, priorContracts: number): number {
  const base = items.reduce((sum, item) => sum + insuredItemBase(item, items), 0);
  const risk = items.reduce((sum, item) =>
    sum + itemRiskSurcharge(item, insuredItemBase(item, items)), 0);
  const loyalty = loyaltyDiscount(base, years);
  const followUp = followUpDiscount(base, priorContracts);
  return finalPremium(base + base * FIRST_INSURANCE_RATE + risk - loyalty - followUp);
}
const CAP_FACTOR = 2;
const DEDUCTIBLE = 100;
interface Policy { items: Item[]; remainingCap: number }
function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) =>
    sum + catalogueEntry(item.type).insuranceValue, 0);
  return { items, remainingCap: insuranceSum * CAP_FACTOR };
}
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
function validateDamageAmount(amount: number): void {
  if (amount < 0) throw new Error('Damage amount must not be negative');
}
function damageReimbursement(item: Item, amount: number): number {
  const rate = (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL
    ? REDUCED_REIMBURSEMENT_RATE : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}
function settlePayout(policy: Policy, desired: number): Result {
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
function takeCoveredItem(items: Item[], itemType: string): Item {
  const index = items.findIndex(item => item.type === itemType);
  if (index < 0) throw new Error(`Item not insured or too many damages: ${itemType}`);
  return items.splice(index, 1)[0];
}
function processClaim(policy: Policy, damages: Damage[]): Result {
  const availableItems = [...policy.items];
  const desired = damages.reduce((sum, damage) => {
    validateDamageAmount(damage.amount);
    return sum + damageReimbursement(takeCoveredItem(availableItems, damage.itemType), damage.amount);
  }, 0);
  return settlePayout(policy, desired);
}
export function runScenario(scenario: Scenario): { results: Result[] } {
  let priorContracts = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === 'claim') {
      const policy = policies.get(step.policy)!;
      return processClaim(policy, step.incident.damages);
    }
    policies.set(index, createPolicy(step.items));
    return { premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, priorContracts++) };
  });
  return { results };
}
