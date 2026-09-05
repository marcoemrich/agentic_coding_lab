export interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
export interface Damage { itemType: string; amount: number }
export type Step = { op: 'quote'; items: Item[] } | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
export interface Result { premium?: number; payout?: number; remainingCap?: number }
const componentBasePrice = 25;
const basePrices: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: componentBasePrice, moonstone: componentBasePrice };
const processingFee = 5;
const initialAssessmentRate = 0.1;
const blockSize = 3;
const blockItemPrice = 20;
function itemBasePrice(item: Item, items: Item[]): number {
  if (!Object.hasOwn(basePrices, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  return ['rune', 'moonstone'].includes(item.type) && items.filter(other => other.type === item.type).length === blockSize
    ? blockItemPrice : basePrices[item.type];
}
const curseRate = 0.5;
const loyaltyYears = 2;
const loyaltyRate = 0.2;
const highEnchantment = 5;
const enchantmentRate = 0.3;
const followUpRate = 0.15;
function premium(items: Item[], years: number, followUp: boolean): number {
  const base = items.reduce((sum, item) => sum + itemBasePrice(item, items), 0);
  const curseSurcharge = items.reduce((sum, item) => sum + (item.cursed ? itemBasePrice(item, items) * curseRate : 0), 0);
  const enchantmentSurcharge = items.reduce((sum, item) => sum + ((item.enchantment ?? 0) >= highEnchantment ? itemBasePrice(item, items) * enchantmentRate : 0), 0);
  const loyaltyDiscount = years >= loyaltyYears ? base * loyaltyRate : 0;
  return Math.ceil(base + curseSurcharge + enchantmentSurcharge + base * initialAssessmentRate - loyaltyDiscount - (followUp ? base * followUpRate : 0) + processingFee);
}
const insuranceValues: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const capMultiplier = 2;
const deductible = 100;
interface Policy { items: Item[]; remainingCap: number }
const reducedReimbursementLevel = 8;
const reducedReimbursementRate = 0.5;
function reimbursement(item: Item, damage: Damage): number {
  if (damage.amount < 0) throw new Error('Damage amount must be nonnegative');
  const rate = (item.enchantment ?? 0) >= reducedReimbursementLevel ? reducedReimbursementRate : 1;
  return Math.max(0, damage.amount * rate - deductible);
}
function settle(policy: Policy, damages: Damage[]): Result {
  const unmatchedItems = [...policy.items];
  const desiredPayout = damages.reduce((sum, damage) => {
    const index = unmatchedItems.findIndex(item => item.type === damage.itemType);
    if (index < 0) throw new Error(`Damage exceeds insured items: ${damage.itemType}`);
    const [item] = unmatchedItems.splice(index, 1);
    return sum + reimbursement(item, damage);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
export function runScenario(scenario: Scenario): { results: Result[] } {
  let priorQuoteCount = 0;
  const policies = new Map<number, Policy>();
  return { results: scenario.steps.map((step, index) => {
    if (step.op === 'claim') return settle(policies.get(step.policy)!, step.incident.damages);
    policies.set(index, { items: step.items, remainingCap: capMultiplier * step.items.reduce((sum, item) => sum + insuranceValues[item.type], 0) });
    const result = { premium: premium(step.items, scenario.customer.yearsWithMHPCO, priorQuoteCount > 0) };
    priorQuoteCount++;
    return result;
  }) };
}
