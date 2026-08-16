export const ITEM_TYPES = ["sword", "amulet", "staff", "potion", "rune", "moonstone"] as const;
export type ItemType = (typeof ITEM_TYPES)[number];

export interface InsuredItem {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: unknown[];
}

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };

interface Policy {
  items: InsuredItem[];
  remainingCap: number;
}

const PRICES: Record<ItemType, { premium: number; value: number }> = {
  sword: { premium: 100, value: 1000 },
  amulet: { premium: 60, value: 600 },
  staff: { premium: 80, value: 800 },
  potion: { premium: 40, value: 400 },
  rune: { premium: 25, value: 250 },
  moonstone: { premium: 25, value: 250 },
};

function fail(message: string): never {
  throw new Error(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function itemType(value: unknown, context: string): ItemType {
  if (typeof value !== "string" || !ITEM_TYPES.includes(value as ItemType))
    fail(`${context}: unknown item type ${String(value)}`);
  return value as ItemType;
}

function parseItem(value: unknown): InsuredItem {
  if (!isRecord(value)) fail("quote item must be an object");
  const result: InsuredItem = { type: itemType(value.type, "quote") };
  if (value.material !== undefined) {
    if (typeof value.material !== "string") fail("item material must be a string");
    result.material = value.material;
  }
  if (value.enchantment !== undefined) {
    if (!Number.isInteger(value.enchantment)) fail("item enchantment must be an integer");
    result.enchantment = value.enchantment as number;
  }
  if (value.cursed !== undefined) {
    if (typeof value.cursed !== "boolean") fail("item cursed must be a boolean");
    result.cursed = value.cursed;
  }
  return result;
}

/** Returns each item's base premium. Exact triples of a component type share the 60 G block price. */
function itemPremiums(items: InsuredItem[]): number[] {
  const counts = new Map<ItemType, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return items.map((item) =>
    (item.type === "rune" || item.type === "moonstone") && counts.get(item.type) === 3
      ? 20
      : PRICES[item.type].premium,
  );
}

export function quotePremium(items: InsuredItem[], yearsWithMHPCO: number, previousContracts: number): number {
  const bases = itemPremiums(items);
  const base = bases.reduce((sum, amount) => sum + amount, 0);

  // Keep twentieths of a G so every specified percentage is exact.
  let twentieths = base * 20;
  items.forEach((item, index) => {
    if (item.cursed) twentieths += bases[index] * 10;
    if ((item.enchantment ?? 0) >= 5) twentieths += bases[index] * 6;
  });
  if (yearsWithMHPCO >= 2) twentieths -= base * 4;
  twentieths += base * 2; // Every newly quoted item is a first insurance.
  if (previousContracts > 0) twentieths -= base * 3;
  twentieths += 5 * 20;
  return Math.ceil(twentieths / 20);
}

export function processScenario(input: unknown): { results: Array<QuoteResult | ClaimResult> } {
  if (!isRecord(input) || !isRecord(input.customer) || !Array.isArray(input.steps))
    fail("scenario requires customer and steps");
  const years = input.customer.yearsWithMHPCO;
  if (!Number.isInteger(years)) fail("yearsWithMHPCO must be an integer");

  const policies = new Map<number, Policy>();
  const results: Array<QuoteResult | ClaimResult> = [];
  let contractCount = 0;

  input.steps.forEach((rawStep, stepIndex) => {
    if (!isRecord(rawStep)) fail(`step ${stepIndex} must be an object`);
    if (rawStep.op === "quote") {
      if (!Array.isArray(rawStep.items)) fail(`quote step ${stepIndex} requires items`);
      const items = rawStep.items.map(parseItem);
      const premium = quotePremium(items, years as number, contractCount);
      const insuranceSum = items.reduce((sum, item) => sum + PRICES[item.type].value, 0);
      policies.set(stepIndex, { items, remainingCap: insuranceSum * 2 });
      contractCount += 1;
      results.push({ premium });
      return;
    }

    if (rawStep.op === "claim") {
      if (!Number.isInteger(rawStep.policy)) fail(`claim step ${stepIndex} has invalid policy`);
      const policyIndex = rawStep.policy as number;
      const policy = policies.get(policyIndex);
      if (!policy || policyIndex >= stepIndex) fail(`claim step ${stepIndex} references no earlier quote policy`);
      if (!isRecord(rawStep.incident) || typeof rawStep.incident.cause !== "string" || !Array.isArray(rawStep.incident.damages))
        fail(`claim step ${stepIndex} has an invalid incident`);

      const usedByType = new Map<ItemType, number>();
      let reimbursementHalves = 0;
      for (const rawDamage of rawStep.incident.damages) {
        if (!isRecord(rawDamage)) fail("damage must be an object");
        const type = itemType(rawDamage.itemType, "claim damage");
        if (!Number.isInteger(rawDamage.amount) || (rawDamage.amount as number) < 0)
          fail("damage amount must be a non-negative integer");

        const matching = policy.items.filter((item) => item.type === type);
        const occurrence = usedByType.get(type) ?? 0;
        const insured = matching[occurrence];
        if (!insured) fail(`damage references an uninsured or excess ${type}`);
        usedByType.set(type, occurrence + 1);

        const amount = rawDamage.amount as number;
        // High enchantment limits even dragon-material items; otherwise reimbursement is full.
        const grossHalves = (insured.enchantment ?? 0) >= 8 ? amount : amount * 2;
        reimbursementHalves += Math.max(0, grossHalves - 200);
      }

      const desired = Math.floor(reimbursementHalves / 2);
      const payout = Math.min(desired, policy.remainingCap);
      policy.remainingCap -= payout;
      results.push({ payout, remainingCap: policy.remainingCap });
      return;
    }

    fail(`step ${stepIndex} has unknown operation`);
  });

  return { results };
}
