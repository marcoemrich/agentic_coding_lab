export const ITEM_TYPES = ["sword", "amulet", "staff", "potion", "rune", "moonstone"] as const;
export type ItemType = typeof ITEM_TYPES[number];

export interface Item {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: unknown[];
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

const priceList: Record<ItemType, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};

function fail(message: string): never {
  throw new Error(message);
}

function object(value: unknown, name: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) fail(`${name} must be an object`);
  return value as Record<string, unknown>;
}

function itemType(value: unknown, name: string): ItemType {
  if (typeof value !== "string" || !ITEM_TYPES.includes(value as ItemType)) fail(`Unknown ${name}: ${String(value)}`);
  return value as ItemType;
}

function parseItem(value: unknown): Item {
  const source = object(value, "item");
  const type = itemType(source.type, "item type");
  if (source.enchantment !== undefined && !Number.isInteger(source.enchantment)) fail("enchantment must be an integer");
  if (source.cursed !== undefined && typeof source.cursed !== "boolean") fail("cursed must be boolean");
  if (source.material !== undefined && typeof source.material !== "string") fail("material must be a string");
  return { type, material: source.material as string | undefined, enchantment: source.enchantment as number | undefined, cursed: source.cursed as boolean | undefined };
}

function quote(items: Item[], years: number, previousContracts: number): number {
  const counts = new Map<ItemType, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);

  let base = 0;
  for (const item of items) base += priceList[item.type].premium;
  for (const component of ["rune", "moonstone"] as const) {
    if (counts.get(component) === 3) base -= 15;
  }

  let amount = base;
  for (const item of items) {
    const isBlockComponent = (item.type === "rune" || item.type === "moonstone") && counts.get(item.type) === 3;
    const itemBase = isBlockComponent ? 20 : priceList[item.type].premium;
    if (item.cursed) amount += itemBase * 0.5;
    if ((item.enchantment ?? -Infinity) >= 5) amount += itemBase * 0.3;
  }
  if (years >= 2) amount -= base * 0.2;
  // Every item in a quote is a first insurance; this is equivalent to 10% of
  // the policy's (possibly block-adjusted) base premium.
  amount += base * 0.1;
  if (previousContracts > 0) amount -= base * 0.15;
  return Math.ceil(amount + 5);
}

function processClaim(policy: Policy, rawIncident: unknown): { payout: number; remainingCap: number } {
  const incident = object(rawIncident, "incident");
  if (typeof incident.cause !== "string") fail("incident cause must be a string");
  if (!Array.isArray(incident.damages)) fail("incident damages must be an array");

  const available = new Map<ItemType, Item[]>();
  for (const insured of policy.items) {
    const list = available.get(insured.type) ?? [];
    list.push(insured);
    available.set(insured.type, list);
  }

  let desired = 0;
  for (const rawDamage of incident.damages) {
    const damage = object(rawDamage, "damage");
    const type = itemType(damage.itemType, "damaged item type");
    if (!Number.isInteger(damage.amount) || (damage.amount as number) < 0) fail("damage amount must be a non-negative integer");
    const insured = available.get(type)?.shift();
    if (!insured) fail(`Damage references an uninsured ${type}`);

    const amount = damage.amount as number;
    const reimbursed = (insured.enchantment ?? -Infinity) >= 8 ? amount * 0.5 : amount;
    desired += Math.max(0, reimbursed - 100);
  }

  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(input: unknown): { results: Array<Record<string, number>> } {
  const scenario = object(input, "scenario");
  const customer = object(scenario.customer, "customer");
  if (!Number.isInteger(customer.yearsWithMHPCO)) fail("yearsWithMHPCO must be an integer");
  if (!Array.isArray(scenario.steps)) fail("steps must be an array");

  const policies = new Map<number, Policy>();
  const results: Array<Record<string, number>> = [];
  let contracts = 0;

  scenario.steps.forEach((rawStep, index) => {
    const step = object(rawStep, `step ${index}`);
    if (step.op === "quote") {
      if (!Array.isArray(step.items)) fail("quote items must be an array");
      const items = step.items.map(parseItem);
      const premium = quote(items, customer.yearsWithMHPCO as number, contracts);
      const insuranceSum = items.reduce((sum, item) => sum + priceList[item.type].value, 0);
      policies.set(index, { items, remainingCap: insuranceSum * 2 });
      contracts += 1;
      results.push({ premium });
      return;
    }
    if (step.op === "claim") {
      if (!Number.isInteger(step.policy)) fail("claim policy must be an integer");
      const policy = policies.get(step.policy as number);
      if (!policy) fail("claim must reference an earlier quote policy");
      results.push(processClaim(policy, step.incident));
      return;
    }
    fail(`Unknown operation: ${String(step.op)}`);
  });

  return { results };
}
