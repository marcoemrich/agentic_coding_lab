export const ITEM_PRICES = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
} as const;

export type ItemType = keyof typeof ITEM_PRICES;
export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}
export interface Damage { itemType: string; amount: number }
export interface QuoteStep { op: "quote"; items: Item[] }
export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}
export type StepResult = { premium: number } | { payout: number; remainingCap: number };

const isKnownType = (type: string): type is ItemType => type in ITEM_PRICES;

const assertKnownType = (type: string): ItemType => {
  if (!isKnownType(type)) throw new Error(`Unknown item type: ${type}`);
  return type;
};

export const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + ITEM_PRICES[assertKnownType(item.type)].insuranceValue, 0);

export const basePremium = (items: Item[]): number => {
  const componentCounts = new Map<ItemType, number>();
  let total = 0;
  for (const item of items) {
    const type = assertKnownType(item.type);
    if (type === "rune" || type === "moonstone") {
      componentCounts.set(type, (componentCounts.get(type) ?? 0) + 1);
    } else {
      total += ITEM_PRICES[type].basePremium;
    }
  }
  for (const [type, count] of componentCounts) {
    total += count === 3 ? 60 : count * ITEM_PRICES[type].basePremium;
  }
  return total;
};

export const quotePremium = (items: Item[], yearsWithMHPCO: number, previousContracts = 0): number => {
  const base = basePremium(items);
  const itemSurcharges = items.reduce((sum, item) => {
    const itemBase = ITEM_PRICES[assertKnownType(item.type)].basePremium;
    return sum + (item.cursed ? itemBase * 0.5 : 0) + ((item.enchantment ?? 0) >= 5 ? itemBase * 0.3 : 0);
  }, 0);
  const loyaltyDiscount = yearsWithMHPCO >= 2 ? base * 0.2 : 0;
  const firstInsuranceSurcharge = base * 0.1;
  const followUpDiscount = previousContracts > 0 ? base * 0.15 : 0;
  return Math.ceil(base + itemSurcharges - loyaltyDiscount + firstInsuranceSurcharge - followUpDiscount + 5);
};

interface PolicyState { items: Item[]; remainingCap: number }

const desiredPayout = (policyItems: Item[], damages: Damage[]): number => {
  const availableByType = new Map<string, Item[]>();
  for (const item of policyItems) {
    const items = availableByType.get(item.type) ?? [];
    items.push(item);
    availableByType.set(item.type, items);
  }

  let payout = 0;
  for (const damage of damages) {
    assertKnownType(damage.itemType);
    if (damage.amount < 0) throw new Error("Damage amount must not be negative");
    const insuredItem = availableByType.get(damage.itemType)?.shift();
    if (!insuredItem) throw new Error(`Damaged item is not covered by policy: ${damage.itemType}`);
    const reimbursable = (insuredItem.enchantment ?? 0) >= 8 ? damage.amount * 0.5 : damage.amount;
    payout += Math.max(0, reimbursable - 100);
  }
  return Math.floor(payout);
};

export const processScenario = (scenario: Scenario): { results: StepResult[] } => {
  const results: StepResult[] = [];
  const policies = new Map<number, PolicyState>();
  let contractCount = 0;

  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      const sum = insuranceSum(step.items);
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, contractCount) });
      policies.set(stepIndex, { items: step.items.map(item => ({ ...item })), remainingCap: sum * 2 });
      contractCount += 1;
      return;
    }

    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
    const wanted = desiredPayout(policy.items, step.incident.damages);
    const payout = Math.min(wanted, policy.remainingCap);
    policy.remainingCap -= payout;
    results.push({ payout, remainingCap: policy.remainingCap });
  });

  return { results };
};
