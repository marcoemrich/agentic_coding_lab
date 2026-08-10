export interface Customer {
  yearsWithMHPCO: number;
}

export interface InsuredItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface QuoteStep {
  op: "quote";
  items: InsuredItem[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: Customer;
  steps: Array<QuoteStep | ClaimStep>;
}

export type OperationResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export interface ScenarioResult {
  results: OperationResult[];
}

const PRICE_LIST: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};

interface Policy {
  items: InsuredItem[];
  remainingCap: number;
}

const priceFor = (type: string) => {
  const price = PRICE_LIST[type];
  if (!price) throw new Error(`Unknown item type: ${type}`);
  return price;
};

const calculateBasePremium = (items: InsuredItem[]): number => {
  const componentCounts = new Map<string, number>();
  let premium = 0;
  for (const insuredItem of items) {
    const price = priceFor(insuredItem.type);
    if (insuredItem.type === "rune" || insuredItem.type === "moonstone") {
      componentCounts.set(insuredItem.type, (componentCounts.get(insuredItem.type) ?? 0) + 1);
    } else {
      premium += price.premium;
    }
  }
  for (const count of componentCounts.values()) premium += count === 3 ? 60 : count * 25;
  return premium;
};

const calculatePremium = (
  items: InsuredItem[],
  customer: Customer,
  previousQuoteCount: number,
): number => {
  const basePremium = calculateBasePremium(items);
  let premium = basePremium;
  for (const insuredItem of items) {
    const itemBase = priceFor(insuredItem.type).premium;
    if (insuredItem.cursed) premium += itemBase * 0.5;
    if ((insuredItem.enchantment ?? 0) >= 5) premium += itemBase * 0.3;
  }
  if (customer.yearsWithMHPCO >= 2) premium -= basePremium * 0.2;
  premium += basePremium * 0.1;
  if (previousQuoteCount > 0) premium -= basePremium * 0.15;
  return Math.ceil(premium + 5);
};

const insuranceSum = (items: InsuredItem[]): number =>
  items.reduce((sum, insuredItem) => sum + priceFor(insuredItem.type).value, 0);

const processClaim = (step: ClaimStep, policy: Policy) => {
  const availableByType = new Map<string, InsuredItem[]>();
  for (const insuredItem of policy.items) {
    const entries = availableByType.get(insuredItem.type) ?? [];
    entries.push(insuredItem);
    availableByType.set(insuredItem.type, entries);
  }

  let desiredPayout = 0;
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
    if (!PRICE_LIST[damage.itemType]) throw new Error(`Unknown damaged item type: ${damage.itemType}`);
    const insuredItem = availableByType.get(damage.itemType)?.shift();
    if (!insuredItem) throw new Error(`Damage to uninsured item type: ${damage.itemType}`);
    const reimbursementRate = (insuredItem.enchantment ?? 0) >= 8 ? 0.5 : 1;
    desiredPayout += Math.max(0, damage.amount * reimbursementRate - 100);
  }

  const payout = Math.min(Math.floor(desiredPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const processScenario = (scenario: Scenario): ScenarioResult => {
  const results: OperationResult[] = [];
  const policies = new Map<number, Policy>();
  let previousQuoteCount = 0;

  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      for (const insuredItem of step.items) priceFor(insuredItem.type);
      results.push({ premium: calculatePremium(step.items, scenario.customer, previousQuoteCount) });
      policies.set(stepIndex, {
        items: step.items.map((insuredItem) => ({ ...insuredItem })),
        remainingCap: insuranceSum(step.items) * 2,
      });
      previousQuoteCount += 1;
      return;
    }

    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
    results.push(processClaim(step, policy));
  });

  return { results };
};
