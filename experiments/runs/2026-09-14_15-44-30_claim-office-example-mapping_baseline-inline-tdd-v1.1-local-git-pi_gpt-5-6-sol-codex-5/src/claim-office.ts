export const ITEM_PRICES = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
} as const;

type ItemType = keyof typeof ITEM_PRICES;
type InputItem = { type: ItemType; material?: string; enchantment?: number; cursed?: boolean };
type Damage = { itemType: ItemType; amount: number };
type QuoteStep = { op: "quote"; items: InputItem[] };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
type Result = { premium: number } | { payout: number; remainingCap: number };
type Policy = { items: InputItem[]; remainingCap: number };

const PROCESSING_FEE = 5;
const LOYALTY_YEARS = 2;
const HIGH_PREMIUM_ENCHANTMENT = 5;
const HIGH_CLAIM_ENCHANTMENT = 8;
const DEDUCTIBLE = 100;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSE_RATE = 0.5;
const ENCHANTMENT_PREMIUM_RATE = 0.3;
const LOYALTY_RATE = 0.2;
const INITIAL_ASSESSMENT_RATE = 0.1;
const FOLLOW_UP_RATE = 0.15;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const POLICY_CAP_MULTIPLIER = 2;

function fail(message: string): never {
  throw new Error(message);
}

function record(value: unknown, name: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) fail(`${name} must be an object`);
  return value as Record<string, unknown>;
}

function integer(value: unknown, name: string): number {
  if (!Number.isInteger(value)) fail(`${name} must be an integer`);
  return value as number;
}

function itemType(value: unknown, name: string): ItemType {
  if (typeof value !== "string" || !(value in ITEM_PRICES)) fail(`${name} has unknown item type: ${String(value)}`);
  return value as ItemType;
}

function optionalString(value: unknown, name: string): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string") fail(`${name} must be a string`);
  return value;
}

function optionalBoolean(value: unknown, name: string): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "boolean") fail(`${name} must be a boolean`);
  return value;
}

function parseItem(value: unknown, name: string): InputItem {
  const source = record(value, name);
  return {
    type: itemType(source.type, name),
    material: optionalString(source.material, `${name}.material`),
    enchantment: source.enchantment === undefined ? undefined : integer(source.enchantment, `${name}.enchantment`),
    cursed: optionalBoolean(source.cursed, `${name}.cursed`),
  };
}

function array(value: unknown, name: string): unknown[] {
  if (!Array.isArray(value)) fail(`${name} must be an array`);
  return value;
}

function parseDamage(value: unknown, name: string): Damage {
  const source = record(value, name);
  const amount = integer(source.amount, `${name}.amount`);
  if (amount < 0) fail(`${name}.amount must be non-negative`);
  return { itemType: itemType(source.itemType, name), amount };
}

function parseStep(value: unknown, index: number): Step {
  const source = record(value, `steps[${index}]`);
  if (source.op === "quote") {
    return { op: "quote", items: array(source.items, `steps[${index}].items`).map((item, i) => parseItem(item, `items[${i}]`)) };
  }
  if (source.op === "claim") {
    const incident = record(source.incident, `steps[${index}].incident`);
    if (typeof incident.cause !== "string") fail("incident.cause must be a string");
    return { op: "claim", policy: integer(source.policy, "policy"), incident: {
      cause: incident.cause,
      damages: array(incident.damages, "incident.damages").map((damage, i) => parseDamage(damage, `damages[${i}]`)),
    } };
  }
  return fail(`steps[${index}].op must be quote or claim`);
}

function parseScenario(value: unknown): Scenario {
  const source = record(value, "scenario");
  const customer = record(source.customer, "customer");
  const yearsWithMHPCO = integer(customer.yearsWithMHPCO, "customer.yearsWithMHPCO");
  if (yearsWithMHPCO < 0) fail("customer.yearsWithMHPCO must be non-negative");
  return {
    customer: { yearsWithMHPCO },
    steps: array(source.steps, "steps").map(parseStep),
  };
}

function componentCounts(items: InputItem[]): Map<ItemType, number> {
  const counts = new Map<ItemType, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
}

function basePremiums(items: InputItem[]): number[] {
  const counts = componentCounts(items);
  return items.map(({ type }) => {
    const isBlock = (type === "rune" || type === "moonstone") && counts.get(type) === COMPONENT_BLOCK_SIZE;
    return isBlock ? COMPONENT_BLOCK_PREMIUM / COMPONENT_BLOCK_SIZE : ITEM_PRICES[type].premium;
  });
}

function quotePremium(items: InputItem[], years: number, quoteIndex: number): number {
  const bases = basePremiums(items);
  const policyBase = bases.reduce((sum, premium) => sum + premium, 0);
  let premium = policyBase;
  items.forEach((item, index) => {
    if (item.cursed) premium += bases[index] * CURSE_RATE;
    if ((item.enchantment ?? 0) >= HIGH_PREMIUM_ENCHANTMENT) premium += bases[index] * ENCHANTMENT_PREMIUM_RATE;
  });
  if (years >= LOYALTY_YEARS) premium -= policyBase * LOYALTY_RATE;
  premium += policyBase * INITIAL_ASSESSMENT_RATE;
  if (quoteIndex > 0) premium -= policyBase * FOLLOW_UP_RATE;
  return Math.ceil(premium + PROCESSING_FEE);
}

function findDamagedItems(policy: Policy, damages: Damage[]): InputItem[] {
  const used = new Set<number>();
  return damages.map((damage) => {
    const index = policy.items.findIndex((item, i) => item.type === damage.itemType && !used.has(i));
    if (index < 0) fail(`damage item ${damage.itemType} is not covered by policy`);
    used.add(index);
    return policy.items[index];
  });
}

function desiredPayout(item: InputItem, amount: number): number {
  const reimbursement = (item.enchantment ?? 0) >= HIGH_CLAIM_ENCHANTMENT ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT : amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function claim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const items = findDamagedItems(policy, damages);
  const desired = damages.reduce((sum, damage, index) => sum + desiredPayout(items[index], damage.amount), 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(input: unknown): { results: Result[] } {
  const scenario = parseScenario(input);
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let quoteIndex = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      const insuranceSum = step.items.reduce((sum, item) => sum + ITEM_PRICES[item.type].value, 0);
      policies.set(stepIndex, { items: step.items, remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER });
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteIndex++) });
      return;
    }
    const policy = policies.get(step.policy);
    if (!policy) fail(`policy ${step.policy} does not refer to an earlier quote`);
    results.push(claim(policy, step.incident.damages));
  });
  return { results };
}
