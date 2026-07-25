type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Damage = { itemType: string; amount: number };
type Step = { op: "quote"; items: Item[] } | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
type Policy = { items: Item[]; remainingPayoutCap: number };

const mainItems: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
};
const componentTypes = new Set(["rune", "moonstone"]);

function isComponent(item: Item): boolean {
  return componentTypes.has(item.type);
}

function pricingForItem(item: Item): { value: number; premium: number } {
  if (isComponent(item)) return { value: 250, premium: 25 };
  const found = mainItems[item.type];
  if (!found) throw new Error(`Unknown item type: ${item.type}`);
  return found;
}

function countItemsByType(items: Item[]): Map<string, number> {
  const itemCounts = new Map<string, number>();
  for (const item of items) itemCounts.set(item.type, (itemCounts.get(item.type) ?? 0) + 1);
  return itemCounts;
}

function createQuote(items: Item[], years: number, hasPreviousQuote: boolean): { premium: number; policy: Policy } {
  const itemCounts = countItemsByType(items);
  let basePremium = 0;
  let itemPremiumModifiers = 0;
  let insuredValue = 0;
  for (const item of items) {
    const itemPrice = pricingForItem(item);
    insuredValue += itemPrice.value;
    const premiumForItem = isComponent(item) && itemCounts.get(item.type) === 3 ? 20 : itemPrice.premium;
    basePremium += premiumForItem;
    if (item.cursed) itemPremiumModifiers += itemPrice.premium * 0.5;
    if ((item.enchantment ?? 0) >= 5) itemPremiumModifiers += itemPrice.premium * 0.3;
  }
  let premium = basePremium + itemPremiumModifiers;
  if (years >= 2) premium -= basePremium * 0.2;
  premium += basePremium * 0.1;
  if (hasPreviousQuote) premium -= basePremium * 0.15;
  return { premium: Math.ceil(premium + 5), policy: { items, remainingPayoutCap: insuredValue * 2 } };
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const remainingItemCounts = countItemsByType(policy.items);
  let payoutAfterDeductibles = 0;
  for (const damage of damages) {
    if (!Number.isInteger(damage.amount) || damage.amount < 0) throw new Error("Damage amount must be a non-negative integer");
    pricingForItem({ type: damage.itemType });
    const remainingItemsOfType = remainingItemCounts.get(damage.itemType) ?? 0;
    if (remainingItemsOfType === 0) throw new Error(`Damaged item is not covered: ${damage.itemType}`);
    remainingItemCounts.set(damage.itemType, remainingItemsOfType - 1);
    const insuredItem = policy.items.find((item) => item.type === damage.itemType)!;
    const reimbursementBeforeDeductible = (insuredItem.enchantment ?? 0) >= 8 ? damage.amount * 0.5 : damage.amount;
    payoutAfterDeductibles += Math.max(0, reimbursementBeforeDeductible - 100);
  }
  const payout = Math.min(Math.floor(payoutAfterDeductibles), policy.remainingPayoutCap);
  policy.remainingPayoutCap -= payout;
  return { payout, remainingCap: policy.remainingPayoutCap };
}

export const runScenario = (scenario: Scenario): { results: Array<{ premium: number } | { payout: number; remainingCap: number }> } => {
  const policies = new Map<number, Policy>();
  const results: Array<{ premium: number } | { payout: number; remainingCap: number }> = [];
  let quoteCount = 0;
  for (let index = 0; index < scenario.steps.length; index += 1) {
    const step = scenario.steps[index];
    if (step.op === "quote") {
      const result = createQuote(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
      quoteCount += 1;
      policies.set(index, result.policy);
      results.push({ premium: result.premium });
    } else {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
      results.push(processClaim(policy, step.incident.damages));
    }
  }
  return { results };
};
