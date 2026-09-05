export interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
export interface Damage { itemType: string; amount: number }
export type Step = { op: 'quote'; items: Item[] } | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
export type Result = { premium: number } | { payout: number; remainingCap: number };
function calculateClaim(damages: Damage[], items: Item[], paid: number): { payout: number; remainingCap: number } {
  const deductible = 100;
  const componentInsuredValue = 250;
  const insuredValues: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: componentInsuredValue, moonstone: componentInsuredValue };
  const capMultiplier = 2;
  const availableCap = items.reduce((sum, item) => sum + insuredValues[item.type], 0) * capMultiplier - paid;
  const reducedEnchantment = 8;
  const reducedRate = 0.5;
  const unmatchedItems = [...items];
  const desiredPayout = damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error('Damage amount must not be negative');
    const index = unmatchedItems.findIndex(item => item.type === damage.itemType);
    if (index < 0) throw new Error(`Item not insured: ${damage.itemType}`);
    const [item] = unmatchedItems.splice(index, 1);
    const rate = (item.enchantment ?? 0) >= reducedEnchantment ? reducedRate : 1;
    return sum + Math.max(0, damage.amount * rate - deductible);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, availableCap));
  return { payout, remainingCap: availableCap - payout };
}

function calculatePremium(items: Item[], yearsWithMHPCO: number, priorQuoteCount: number): number {
  const processingFee = 5;
  const componentUnitPrice = 25;
  const prices: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: componentUnitPrice, moonstone: componentUnitPrice };
  for (const item of items) {
    if (!Object.hasOwn(prices, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  }
  const assessmentRate = 0.1;
  const curseRate = 0.5;
  const loyaltyYears = 2;
  const loyaltyRate = 0.2;
  const highEnchantment = 5;
  const enchantmentRate = 0.3;
  const blockSize = 3;
  const blockUnitPremium = 20;
  const followUpRate = 0.15;
  const itemBases = items.map(item => {
    const qualifiesForBlockPricing = ['rune', 'moonstone'].includes(item.type)
      && items.filter(other => other.type === item.type).length === blockSize;
    return qualifiesForBlockPricing ? blockUnitPremium : prices[item.type];
  });
  const base = itemBases.reduce((sum, itemBase) => sum + itemBase, 0);
  const curseSurcharge = items.reduce((sum, item, index) => sum + (item.cursed ? itemBases[index] * curseRate : 0), 0);
  const enchantmentSurcharge = items.reduce((sum, item, index) => sum + ((item.enchantment ?? 0) >= highEnchantment ? itemBases[index] * enchantmentRate : 0), 0);
  const loyaltyDiscount = yearsWithMHPCO >= loyaltyYears ? base * loyaltyRate : 0;
  const followUpDiscount = priorQuoteCount > 0 ? base * followUpRate : 0;
  return Math.ceil(processingFee + base + base * assessmentRate + curseSurcharge + enchantmentSurcharge - loyaltyDiscount - followUpDiscount);
}

export function run(scenario: Scenario): { results: Result[] } {
  let priorQuoteCount = 0;
  const paidByPolicyStepIndex = new Map<number, number>();
  return { results: scenario.steps.map(step => {
    if (step.op === 'claim') {
      const policy = scenario.steps[step.policy];
      const previouslyPaid = paidByPolicyStepIndex.get(step.policy) ?? 0;
      const result = calculateClaim(step.incident.damages, policy.op === 'quote' ? policy.items : [], previouslyPaid);
      paidByPolicyStepIndex.set(step.policy, previouslyPaid + result.payout);
      return result;
    }
    const premium = calculatePremium(step.items, scenario.customer.yearsWithMHPCO, priorQuoteCount);
    priorQuoteCount++;
    return { premium };
  }) };
}
