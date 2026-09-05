export interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
export type Step = { op: 'quote'; items: Item[] } | { op: 'claim'; policy: number; incident: { cause: string; damages: { itemType: string; amount: number }[] } };
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
export interface Result { premium?: number; payout?: number; remainingCap?: number }
const prices: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
function base(item: Item, items: Item[]): number {
  if (!Object.hasOwn(prices, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  const blockSize = 3;
  const blockUnitPrice = 20;
  return ['rune', 'moonstone'].includes(item.type) && items.filter(other => other.type === item.type).length === blockSize
    ? blockUnitPrice : prices[item.type];
}
function riskPercent(item: Item): number {
  const cursePercent = 50;
  const enchantmentPercent = 30;
  const highEnchantment = 5;
  return (item.cursed ? cursePercent : 0) + ((item.enchantment ?? 0) >= highEnchantment ? enchantmentPercent : 0);
}
function premium(items: Item[], years: number, priorContracts: number): number {
  const processingFee = 5;
  const initialPercent = 110;
  const loyaltyYears = 2;
  const loyaltyPercent = 20;
  const followUpPercent = 15;
  const assessedPercent = initialPercent - (years >= loyaltyYears ? loyaltyPercent : 0) - (priorContracts > 0 ? followUpPercent : 0);
  const percent = 100;
  const total = items.reduce((sum, item) => sum + base(item, items) * (assessedPercent + riskPercent(item)), 0);
  return Math.ceil(processingFee + total / percent);
}
function takeInsuredItem(items: Item[], itemType: string): Item {
  const index = items.findIndex(item => item.type === itemType);
  if (index < 0) throw new Error(`Item not insured or too many damages: ${itemType}`);
  return items.splice(index, 1)[0];
}
function reimbursement(item: Item, amount: number): number {
  if (amount < 0) throw new Error('Damage amount must not be negative');
  const threshold = 8;
  const reducedRate = 0.5;
  const deductible = 100;
  return Math.max(0, amount * ((item.enchantment ?? 0) >= threshold ? reducedRate : 1) - deductible);
}
export function run(scenario: Scenario): { results: Result[] } {
  let priorContracts = 0;
  const remainingCaps = new Map<number, number>();
  return { results: scenario.steps.map(step => {
    if (step.op === 'quote') return { premium: premium(step.items, scenario.customer.yearsWithMHPCO, priorContracts++) };
    const insuredStep = scenario.steps[step.policy];
    if (insuredStep.op !== 'quote') throw new Error('Policy must reference a quote');
    const valueToBaseRatio = 10;
    const capMultiplier = 2;
    const cap = insuredStep.items.reduce((sum, item) => sum + prices[item.type] * valueToBaseRatio, 0) * capMultiplier;
    const available = remainingCaps.get(step.policy) ?? cap;
    const unmatchedItems = [...insuredStep.items];
    const desired = step.incident.damages.reduce((sum, damage) => sum + reimbursement(takeInsuredItem(unmatchedItems, damage.itemType), damage.amount), 0);
    const payout = Math.floor(Math.min(desired, available));
    remainingCaps.set(step.policy, available - payout);
    return { payout, remainingCap: available - payout };
  }) };
}
