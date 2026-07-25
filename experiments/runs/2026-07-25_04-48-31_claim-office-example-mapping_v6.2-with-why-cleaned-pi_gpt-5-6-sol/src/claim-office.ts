export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type QuoteStep = { op: "quote"; items: Item[] };
export type Damage = { itemType: string; amount: number };
export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
export type Step = QuoteStep | ClaimStep;
export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

const itemPricingByType: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};

const assertKnownItem = (type: string): void => {
  if (!(type in itemPricingByType)) throw new Error(`Unknown item type: ${type}`);
};

const componentTypes = new Set(["rune", "moonstone"]);

const calculateBasePremium = (items: Item[]): number => {
  const counts = new Map<string, number>();
  let total = 0;
  for (const item of items) {
    assertKnownItem(item.type);
    total += itemPricingByType[item.type].premium;
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  for (const [type, count] of counts) {
    if (componentTypes.has(type) && count === 3) total -= 15;
  }
  return total;
};

const quotePremium = (
  items: Item[],
  yearsWithMHPCO: number,
  previousQuotes: number,
): number => {
  const base = calculateBasePremium(items);
  const itemSurcharges = items.reduce((total, item) => {
    const itemBase = itemPricingByType[item.type].premium;
    return total + (item.cursed ? itemBase * 0.5 : 0)
      + ((item.enchantment ?? 0) >= 5 ? itemBase * 0.3 : 0);
  }, 0);
  const loyaltyDiscount = yearsWithMHPCO >= 2 ? base * 0.2 : 0;
  const initialAssessment = base * 0.1;
  const followUpDiscount = previousQuotes > 0 ? base * 0.15 : 0;
  return Math.ceil(base + itemSurcharges - loyaltyDiscount
    + initialAssessment - followUpDiscount + 5);
};

type Policy = { items: Item[]; remainingCap: number };

const processClaim = (policy: Policy, damages: Damage[]) => {
  const available = new Map<string, Item[]>();
  for (const item of policy.items) {
    const items = available.get(item.type) ?? [];
    items.push(item);
    available.set(item.type, items);
  }

  let desiredPayout = 0;
  for (const damage of damages) {
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
    assertKnownItem(damage.itemType);
    const matchingItems = available.get(damage.itemType);
    const item = matchingItems?.shift();
    if (!item) throw new Error(`Damage item is not covered: ${damage.itemType}`);

    const reimbursementRate = (item.enchantment ?? 0) >= 8 ? 0.5 : 1;
    desiredPayout += Math.max(0, damage.amount * reimbursementRate - 100);
  }

  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const processScenario = (scenario: Scenario) => {
  const policies = new Map<number, Policy>();
  let previousQuotes = 0;
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const insuranceSum = step.items.reduce((sum, item) => {
        assertKnownItem(item.type);
        return sum + itemPricingByType[item.type].value;
      }, 0);
      const premium = quotePremium(
        step.items,
        scenario.customer.yearsWithMHPCO,
        previousQuotes,
      );
      policies.set(stepIndex, { items: step.items, remainingCap: insuranceSum * 2 });
      previousQuotes += 1;
      return { premium };
    }

    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
    return processClaim(policy, step.incident.damages);
  });
  return { results };
};
