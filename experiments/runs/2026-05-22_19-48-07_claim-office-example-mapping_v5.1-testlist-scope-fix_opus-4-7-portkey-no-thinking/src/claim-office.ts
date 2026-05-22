type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type QuoteStep = { op: "quote"; items: Item[] };

type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };

type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_RATE = 0.15;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const DAMAGE_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCH_PAYOUT_RATE = 0.5;
const DRAGON_MATERIAL = "dragon";

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function isHighEnchantment(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function itemBaseAndModifiers(item: Item, base: number): number {
  let total = base;
  if (item.cursed) total += base * CURSE_SURCHARGE_RATE;
  if (isHighEnchantment(item)) total += base * HIGH_ENCHANTMENT_RATE;
  total += base * FIRST_INSURANCE_RATE;
  return total;
}

function nonComponentContribution(items: Item[]): { base: number; itemTotal: number } {
  let base = 0;
  let itemTotal = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) continue;
    const itemBase = BASE_PREMIUM[item.type] ?? 0;
    base += itemBase;
    itemTotal += itemBaseAndModifiers(item, itemBase);
  }
  return { base, itemTotal };
}

function componentContribution(items: Item[]): { base: number; itemTotal: number } {
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (!COMPONENT_TYPES.has(item.type)) continue;
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  let base = 0;
  let itemTotal = 0;
  for (const [type, count] of Object.entries(counts)) {
    const groupBase = count === BLOCK_SIZE ? BLOCK_PREMIUM : count * BASE_PREMIUM[type];
    base += groupBase;
    itemTotal += groupBase + groupBase * FIRST_INSURANCE_RATE;
  }
  return { base, itemTotal };
}

function quotePremium(items: Item[], customer: Customer, quoteIndex: number): number {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) {
      throw new Error(`Unknown item type: "${item.type}"`);
    }
  }
  const nc = nonComponentContribution(items);
  const cp = componentContribution(items);
  const policyBase = nc.base + cp.base;
  const itemContribution = nc.itemTotal + cp.itemTotal;
  let policyAdjustments = 0;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    policyAdjustments -= policyBase * LOYALTY_RATE;
  }
  if (quoteIndex > 0) {
    policyAdjustments -= policyBase * FOLLOWUP_RATE;
  }
  return Math.ceil(itemContribution + policyAdjustments + PROCESSING_FEE);
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + (INSURANCE_VALUE[item.type] ?? 0), 0);
}

type Policy = { items: Item[]; remainingCap: number };

function damagePayout(item: Item, amount: number): number {
  const highEnch = (item.enchantment ?? 0) >= DAMAGE_ENCHANTMENT_THRESHOLD;
  const beforeDeductible = highEnch ? amount * HIGH_ENCH_PAYOUT_RATE : amount;
  return Math.max(0, beforeDeductible - DEDUCTIBLE);
}

function processClaim(policy: Policy, incident: Incident): ClaimResult {
  const policyCounts: Record<string, number> = {};
  for (const it of policy.items) {
    policyCounts[it.type] = (policyCounts[it.type] ?? 0) + 1;
  }
  const damageCounts: Record<string, number> = {};
  for (const dmg of incident.damages) {
    if (dmg.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${dmg.amount}`);
    }
    damageCounts[dmg.itemType] = (damageCounts[dmg.itemType] ?? 0) + 1;
    if ((damageCounts[dmg.itemType] ?? 0) > (policyCounts[dmg.itemType] ?? 0)) {
      throw new Error(`Claim has more "${dmg.itemType}" damages than policy covers`);
    }
  }
  let totalPayout = 0;
  for (const dmg of incident.damages) {
    const item = policy.items.find((i) => i.type === dmg.itemType);
    if (!item) {
      throw new Error(`Damage references item type "${dmg.itemType}" not in policy`);
    }
    totalPayout += damagePayout(item, dmg.amount);
  }
  const capped = Math.min(totalPayout, policy.remainingCap);
  policy.remainingCap -= capped;
  return { payout: Math.floor(capped), remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  let quoteCount = 0;
  const policies: Record<number, Policy> = {};
  const results: StepResult[] = scenario.steps.map((step, idx) => {
    if (step.op === "quote") {
      const stepIdx = quoteCount;
      quoteCount += 1;
      policies[idx] = {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
      };
      return { premium: quotePremium(step.items, scenario.customer, stepIdx) };
    }
    const policy = policies[step.policy];
    if (!policy) throw new Error(`No policy for index ${step.policy}`);
    return processClaim(policy, step.incident);
  });
  return { results };
}
