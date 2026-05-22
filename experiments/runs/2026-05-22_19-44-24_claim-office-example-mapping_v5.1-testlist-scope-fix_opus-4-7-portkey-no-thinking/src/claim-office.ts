type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type Result = QuoteResult | ClaimResult;

const MAIN_BASE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const MAIN_INSURANCE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BASE = 25;
const COMPONENT_INSURANCE = 250;
const COMPONENT_BLOCK_OF_3 = 60;
const DEDUCTIBLE = 100;

function itemBase(item: Item): number {
  if (COMPONENT_TYPES.has(item.type)) return COMPONENT_BASE;
  return MAIN_BASE[item.type] ?? 0;
}

function itemInsuranceValue(item: Item): number {
  if (COMPONENT_TYPES.has(item.type)) return COMPONENT_INSURANCE;
  return MAIN_INSURANCE[item.type] ?? 0;
}

function policyBaseAndSurcharges(items: Item[]): { base: number; itemSurcharges: number } {
  let base = 0;
  let itemSurcharges = 0;
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      base += MAIN_BASE[item.type] ?? 0;
    }
    if (item.cursed) itemSurcharges += itemBase(item) * 0.5;
    if ((item.enchantment ?? 0) >= 5) itemSurcharges += itemBase(item) * 0.3;
  }
  for (const count of componentCounts.values()) {
    base += count === 3 ? COMPONENT_BLOCK_OF_3 : count * COMPONENT_BASE;
  }
  return { base, itemSurcharges };
}

function policyInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

type Policy = { items: Item[]; remainingCap: number };

export function runScenario(input: Scenario): { results: Result[] } {
  const isLoyal = input.customer.yearsWithMHPCO >= 2;
  let quoteCount = 0;
  const policies: Record<number, Policy> = {};
  const results: Result[] = input.steps.map((step, index) => {
    if (step.op === "quote") {
      for (const item of step.items) {
        if (!(item.type in MAIN_BASE) && !COMPONENT_TYPES.has(item.type)) {
          throw new Error(`unknown item type "${item.type}"`);
        }
      }
      const { base, itemSurcharges } = policyBaseAndSurcharges(step.items);
      const firstInsurance = base * 0.1;
      const loyalty = isLoyal ? base * 0.2 : 0;
      const followUp = quoteCount > 0 ? base * 0.15 : 0;
      quoteCount += 1;
      const premium = Math.ceil(base + itemSurcharges + firstInsurance - loyalty - followUp) + 5;
      const insuranceSum = policyInsuranceSum(step.items);
      policies[index] = { items: step.items, remainingCap: insuranceSum * 2 };
      return { premium };
    }
    const policy = policies[step.policy];
    const availableItems = [...policy.items];
    let totalPayout = 0;
    for (const damage of step.incident.damages) {
      if (damage.amount < 0) {
        throw new Error(`claim rejected: negative damage amount ${damage.amount}`);
      }
      const matchIndex = availableItems.findIndex((it) => it.type === damage.itemType);
      if (matchIndex === -1) {
        throw new Error(`claim rejected: damage references item type "${damage.itemType}" not in policy`);
      }
      const item = availableItems[matchIndex];
      availableItems.splice(matchIndex, 1);
      const reimbursed = (item.enchantment ?? 0) >= 8 ? damage.amount * 0.5 : damage.amount;
      totalPayout += reimbursed - DEDUCTIBLE;
    }
    const capped = Math.min(totalPayout, policy.remainingCap);
    policy.remainingCap -= capped;
    return { payout: Math.floor(capped), remainingCap: policy.remainingCap };
  });
  return { results };
}
