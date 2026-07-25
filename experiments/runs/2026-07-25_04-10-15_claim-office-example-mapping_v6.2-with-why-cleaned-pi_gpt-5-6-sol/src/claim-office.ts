export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export interface ScenarioResult {
  results: Array<{ premium: number } | { payout: number; remainingCap: number }>;
}

const PROCESSING_FEE = 5;
const COMPONENT_TYPES = ["rune", "moonstone"];
const PREMIUMS: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const VALUES: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };

const matchDamagesToInsuredItems = (insuredItems: Item[], damages: Damage[]): Item[] => {
  const unmatchedItems = [...insuredItems];
  return damages.map(damage => {
    if (damage.amount < 0) throw new Error("Negative damage amount is invalid");
    const itemIndex = unmatchedItems.findIndex(item => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Item type ${damage.itemType} is not insured`);
    return unmatchedItems.splice(itemIndex, 1)[0];
  });
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policiesByQuoteStep = new Map<number, { cap: number; items: Item[] }>();
  const results: ScenarioResult["results"] = [];

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const unknownItem = step.items.find(item => PREMIUMS[item.type] === undefined);
      if (unknownItem) throw new Error(`Unknown item type: ${unknownItem.type}`);
      const componentPremium = COMPONENT_TYPES.reduce((sum, type) => {
        const count = step.items.filter(item => item.type === type).length;
        return sum + (count === 3 ? 60 : count * PREMIUMS[type]);
      }, 0);
      const basePremium = step.items
        .filter(item => !COMPONENT_TYPES.includes(item.type))
        .reduce((sum, item) => sum + (PREMIUMS[item.type] ?? 0), componentPremium);
      const itemSurcharges = step.items.reduce((sum, item) => {
        const itemPremium = PREMIUMS[item.type] ?? 0;
        return sum + (item.cursed ? itemPremium * 0.5 : 0) + ((item.enchantment ?? 0) >= 5 ? itemPremium * 0.3 : 0);
      }, 0);
      const totalInsuredValue = step.items.reduce((sum, item) => sum + (VALUES[item.type] ?? 0), 0);
      const loyaltyDiscount = scenario.customer.yearsWithMHPCO >= 2 ? basePremium * 0.2 : 0;
      const premium = Math.ceil(basePremium + itemSurcharges + basePremium * 0.1 - loyaltyDiscount - basePremium * (policiesByQuoteStep.size > 0 ? 0.15 : 0) + PROCESSING_FEE);
      policiesByQuoteStep.set(index, { cap: totalInsuredValue * 2, items: step.items });
      results.push({ premium });
    } else {
      const policy = policiesByQuoteStep.get(step.policy)!;
      const damagedItems = matchDamagesToInsuredItems(policy.items, step.incident.damages);
      const totalReimbursementAfterDeductibles = step.incident.damages.reduce((sum, damage, index) => {
        const item = damagedItems[index];
        const reimbursable = (item.enchantment ?? 0) >= 8 ? damage.amount * 0.5 : damage.amount;
        return sum + Math.max(reimbursable - 100, 0);
      }, 0);
      const payout = Math.floor(Math.min(totalReimbursementAfterDeductibles, policy.cap));
      policy.cap -= payout;
      results.push({ payout, remainingCap: policy.cap });
    }
  });

  return { results };
};
