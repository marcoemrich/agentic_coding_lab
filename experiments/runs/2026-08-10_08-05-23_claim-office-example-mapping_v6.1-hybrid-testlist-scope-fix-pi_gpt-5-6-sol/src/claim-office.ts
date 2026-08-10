export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Damage { itemType: string; amount: number }
interface QuoteStep { op: "quote"; items: Item[] }
interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
type Step = QuoteStep | ClaimStep;
type Policy = { items: Item[]; remainingCap: number };
type ClaimResult = { payout: number; remainingCap: number };

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

const PROCESSING_FEE = 5;
const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };

function assertKnownItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM_BY_ITEM_TYPE)) throw new Error(`Unknown item type: ${item.type}`);
  }
}

function assertNonNegativeDamageAmounts(damages: Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) throw new Error("Negative damage amount is invalid");
}

function processClaim(policy: Policy, damages: Damage[]): ClaimResult {
  assertNonNegativeDamageAmounts(damages);
  const usedItemIndexes = new Set<number>();
  const payoutBeforePolicyCap = damages.reduce((sum, damage) => {
    const itemIndex = policy.items.findIndex((item, index) => item.type === damage.itemType && !usedItemIndexes.has(index));
    if (itemIndex < 0) throw new Error(`Damage item ${damage.itemType} is not insured by this policy`);
    usedItemIndexes.add(itemIndex);
    const item = policy.items[itemIndex];
    const reimbursableDamage = (item.enchantment ?? 0) >= 8 ? damage.amount / 2 : damage.amount;
    return sum + Math.max(0, reimbursableDamage - 100);
  }, 0);
  const payout = Math.floor(Math.min(payoutBeforePolicyCap, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: unknown[] } {
  let hasCompletedQuote = false;
  const policies = new Map<number, Policy>();
  const results: unknown[] = [];
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy)!;
      results.push(processClaim(policy, step.incident.damages));
      return;
    }
    const items = step.items;
    assertKnownItemTypes(items);
    const componentCounts = items.reduce<Record<string, number>>((counts, item) => {
      if (item.type === "rune" || item.type === "moonstone") counts[item.type] = (counts[item.type] ?? 0) + 1;
      return counts;
    }, {});
    const discountedBasePremium = items.reduce((sum, item) => sum + BASE_PREMIUM_BY_ITEM_TYPE[item.type], 0)
      - Object.values(componentCounts).filter((count) => count === 3).length * 15;
    const itemSurcharges = items.reduce((sum, item) => {
      const itemBase = BASE_PREMIUM_BY_ITEM_TYPE[item.type];
      return sum + (item.cursed ? itemBase / 2 : 0) + ((item.enchantment ?? 0) >= 5 ? itemBase * 3 / 10 : 0);
    }, 0);
    const loyaltyDiscount = scenario.customer.yearsWithMHPCO >= 2 ? discountedBasePremium / 5 : 0;
    const followUpDiscount = hasCompletedQuote ? discountedBasePremium * 15 / 100 : 0;
    hasCompletedQuote = true;
    const premium = Math.ceil(discountedBasePremium + itemSurcharges + discountedBasePremium / 10 - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
    const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUE_BY_ITEM_TYPE[item.type], 0);
    policies.set(stepIndex, { items, remainingCap: insuranceSum * 2 });
    results.push({ premium });
  });
  return { results };
}
