export type ItemType = "sword" | "amulet" | "staff" | "potion" | "rune" | "moonstone";

export interface Item {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface QuoteStep { op: "quote"; items: Item[] }
export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
export type Step = QuoteStep | ClaimStep;
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}
export type Result = { premium: number } | { payout: number; remainingCap: number };

const PRICE_LIST: Record<ItemType, { premium: number; value: number }> = {
  sword: { premium: 100, value: 1000 },
  amulet: { premium: 60, value: 600 },
  staff: { premium: 80, value: 800 },
  potion: { premium: 40, value: 400 },
  rune: { premium: 25, value: 250 },
  moonstone: { premium: 25, value: 250 },
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

function assertKnownType(type: string): asserts type is ItemType {
  if (!(type in PRICE_LIST)) throw new Error(`Unknown item type: ${type}`);
}

const componentBasePremium = (items: Item[]): number => {
  const componentTypes: ItemType[] = ["rune", "moonstone"];
  return componentTypes.reduce((total, type) => {
    const count = items.filter((item) => item.type === type).length;
    return total + (count === 3 ? 60 : count * 25);
  }, 0);
};

const quotePremium = (items: Item[], years: number, quoteNumber: number): number => {
  for (const item of items) assertKnownType(item.type);

  const mainItems = items.filter((item) => item.type !== "rune" && item.type !== "moonstone");
  const base = mainItems.reduce((sum, item) => sum + PRICE_LIST[item.type].premium, 0)
    + componentBasePremium(items);
  const itemSurcharges = items.reduce((sum, item) => {
    const itemBase = PRICE_LIST[item.type].premium;
    return sum + (item.cursed ? itemBase * 0.5 : 0) + ((item.enchantment ?? 0) >= 5 ? itemBase * 0.3 : 0);
  }, 0);
  const loyalty = years >= 2 ? base * 0.2 : 0;
  const initialAssessment = base * 0.1;
  const followUp = quoteNumber > 0 ? base * 0.15 : 0;
  return Math.ceil(base + itemSurcharges - loyalty + initialAssessment - followUp + 5);
};

const insuranceValue = (items: Item[]): number =>
  items.reduce((sum, item) => sum + PRICE_LIST[item.type].value, 0);

const processClaim = (policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } => {
  const availableByType = new Map<ItemType, Item[]>();
  for (const item of policy.items) {
    const matches = availableByType.get(item.type) ?? [];
    matches.push(item);
    availableByType.set(item.type, matches);
  }

  let desiredPayout = 0;
  for (const damage of damages) {
    assertKnownType(damage.itemType);
    if (damage.amount < 0) throw new Error("Damage amount must not be negative");
    const item = availableByType.get(damage.itemType)?.shift();
    if (!item) throw new Error(`Damage item is not covered: ${damage.itemType}`);
    const reimbursement = (item.enchantment ?? 0) >= 8 ? damage.amount * 0.5 : damage.amount;
    desiredPayout += Math.max(0, reimbursement - 100);
  }

  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const processScenario = (scenario: Scenario): { results: Result[] } => {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let quoteNumber = 0;

  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      for (const item of step.items) assertKnownType(item.type);
      const policy = { items: step.items, remainingCap: insuranceValue(step.items) * 2 };
      policies.set(stepIndex, policy);
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteNumber) });
      quoteNumber += 1;
      return;
    }

    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Unknown policy step: ${step.policy}`);
    results.push(processClaim(policy, step.incident.damages));
  });

  return { results };
};
