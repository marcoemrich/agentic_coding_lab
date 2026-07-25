const PROCESSING_FEE = 5;
const SCALING = 20;
const PROCESSING_FEE_SCALED = PROCESSING_FEE * SCALING;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const CURSE_RATE = 10; // 50% == 10/20
const HIGH_ENCHANT_RATE = 6; // 30% == 6/20
const FIRST_INSURANCE_RATE = 2; // 10% == 2/20
const FOLLOW_UP_RATE = -3; // -15% == -3/20
const LOYALTY_RATE = -4; // -20% == -4/20

const DEDUCTIBLE = 100;

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type Step = {
  op?: string;
  items?: Array<Item>;
  policy?: number;
  incident?: {
    cause: string;
    damages: Array<{ itemType: string; amount: number }>;
  };
};

type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Array<Step>;
};

type Policy = {
  items: Array<Item>;
  remainingCap: number;
};

function roundUpGold(scaledAmount: number): number {
  return Math.floor((scaledAmount + SCALING - 1) / SCALING);
}

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function itemSurchargeRate(item: Item): number {
  return (
    (item.cursed ? CURSE_RATE : 0) +
    ((item.enchantment ?? 0) >= 5 ? HIGH_ENCHANT_RATE : 0)
  );
}

function calculateBaseAndSurcharges(items: Array<Item>): { policyBase: number; surchargeScaled: number } {
  let policyBase = 0;
  let surchargeScaled = 0;
  const componentCounts: Record<string, number> = {};

  for (const item of items) {
    if (isComponent(item)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
      continue;
    }

    const itemBase = BASE_PREMIUMS[item.type];
    if (itemBase === undefined) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    policyBase += itemBase;
    surchargeScaled += itemBase * itemSurchargeRate(item);
  }

  for (const count of Object.values(componentCounts)) {
    policyBase += count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
  }

  return { policyBase, surchargeScaled };
}

function quotePremium(items: Array<Item>, customerYears: number, isFollowUp: boolean): number {
  const { policyBase, surchargeScaled } = calculateBaseAndSurcharges(items);
  const policyRate =
    FIRST_INSURANCE_RATE +
    (isFollowUp ? FOLLOW_UP_RATE : 0) +
    (customerYears >= 2 ? LOYALTY_RATE : 0);

  const totalScaled = policyBase * (SCALING + policyRate) + surchargeScaled + PROCESSING_FEE_SCALED;
  return roundUpGold(totalScaled);
}

function insuranceSum(items: Array<Item>): number {
  let sum = 0;
  for (const item of items) {
    const value = INSURANCE_VALUES[item.type];
    if (value === undefined) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    sum += value;
  }
  return sum;
}

function processClaim(policy: Policy, incident: Step["incident"]): { payout: number; remainingCap: number } {
  if (incident === undefined) {
    throw new Error("Claim step missing incident");
  }

  const available = policy.items.map((item) => ({ item, used: false }));
  let rawPayout = 0;

  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error("Damage amount cannot be negative");
    }

    const match = available.find((entry) => !entry.used && entry.item.type === damage.itemType);
    if (match === undefined) {
      throw new Error(`Damage references item not covered by policy: ${damage.itemType}`);
    }
    match.used = true;

    const item = match.item;
    let amount = damage.amount;
    if ((item.enchantment ?? 0) >= 8) {
      amount = amount / 2;
    }
    rawPayout += Math.max(0, amount - DEDUCTIBLE);
  }

  const cappedPayout = Math.min(Math.floor(rawPayout), policy.remainingCap);
  return { payout: cappedPayout, remainingCap: policy.remainingCap - cappedPayout };
}

export function processScenario(scenario: unknown): { results: Array<{ premium?: number; payout?: number; remainingCap?: number }> } {
  const typed = scenario as Scenario;
  const customerYears = typed.customer.yearsWithMHPCO;
  const results: Array<{ premium?: number; payout?: number; remainingCap?: number }> = [];
  const policies: Array<Policy> = [];

  for (let i = 0; i < typed.steps.length; i++) {
    const step = typed.steps[i];
    if (step.op === "quote") {
      const items = step.items ?? [];
      const quoteResult = { premium: quotePremium(items, customerYears, i >= 1) };
      policies.push({ items, remainingCap: insuranceSum(items) * 2 });
      results.push(quoteResult);
    } else if (step.op === "claim") {
      const policy = policies[step.policy ?? -1];
      if (policy === undefined) {
        throw new Error("Invalid policy reference");
      }
      const claimResult = processClaim(policy, step.incident);
      policy.remainingCap = claimResult.remainingCap;
      results.push(claimResult);
    }
  }

  return { results };
}
