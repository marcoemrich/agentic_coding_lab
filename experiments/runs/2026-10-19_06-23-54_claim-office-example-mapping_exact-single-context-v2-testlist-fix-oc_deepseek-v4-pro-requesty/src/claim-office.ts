export type Customer = { yearsWithMHPCO: number };

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type QuoteStep = { op: "quote"; items: Item[] };
export type DamageEntry = { itemType: string; amount: number };
export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: DamageEntry[] };
};
export type Step = QuoteStep | ClaimStep;

export type Scenario = { customer: Customer; steps: Step[] };

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type Result = QuoteResult | ClaimResult;

type InsuredItem = {
  type: string;
  value: number;
  material?: string;
  enchantment?: number;
};

type Policy = {
  items: InsuredItem[];
  insuranceSum: number;
  remainingCap: number;
};

const MAIN_ITEMS = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
} as const;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_RATE = 0.5;
const HIGH_ENCHANT_RATE = 0.3;
const HIGH_ENCHANT_THRESHOLD = 5;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FIRST_INSURANCE_RATE = 0.1;
const FOLLOW_UP_RATE = 0.15;
const PREMIUM_FEE = 5;
const HIGH_ENCHANT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANT_CLAIM_RATE = 0.5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

type ItemType = keyof typeof MAIN_ITEMS;

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function isKnownType(type: string): type is ItemType {
  return type in MAIN_ITEMS;
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const policies: (Policy | undefined)[] = [];
  const results: Result[] = [];
  let quoteCount = 0;

  for (const [stepIndex, step] of scenario.steps.entries()) {
    if (step.op === "quote") {
      results.push(quoteStep(scenario.customer, step.items, quoteCount));
      policies[stepIndex] = buildPolicy(step.items);
      quoteCount += 1;
    } else {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error(`Policy not found at step ${step.policy}`);
      }
      results.push(claimStep(policy, step.incident.damages));
    }
  }

  return { results };
}

function quoteStep(customer: Customer, items: Item[], quoteCount: number): QuoteResult {
  validateQuoteItems(items);
  const base = policyBasePremium(items);
  const surcharges = itemSurcharges(items);
  const policyWide = policyWideModifiers(customer, base, quoteCount);
  const premium = Math.ceil(base + surcharges + policyWide + PREMIUM_FEE);
  return { premium };
}

function validateQuoteItems(items: Item[]): void {
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function policyBasePremium(items: Item[]): number {
  const [components, mainItems] = splitItems(items);
  let base = componentBasePremium(components);
  for (const item of mainItems) {
    base += MAIN_ITEMS[item.type as ItemType].premium;
  }
  return base;
}

function splitItems(items: Item[]): [Record<string, number>, Item[]] {
  const counts: Record<string, number> = {};
  const mainItems: Item[] = [];
  for (const item of items) {
    if (isComponent(item.type)) {
      counts[item.type] = (counts[item.type] ?? 0) + 1;
    } else {
      mainItems.push(item);
    }
  }
  return [counts, mainItems];
}

function componentBasePremium(counts: Record<string, number>): number {
  let total = 0;
  for (const type of Object.keys(counts)) {
    total += componentTypePremium(counts[type], MAIN_ITEMS[type as ItemType].premium);
  }
  return total;
}

function componentTypePremium(count: number, unitPremium: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_PREMIUM;
  }
  return count * unitPremium;
}

function itemSurcharges(items: Item[]): number {
  let surcharges = 0;
  for (const item of items) {
    if (isComponent(item.type)) {
      continue;
    }
    const base = MAIN_ITEMS[item.type as ItemType].premium;
    if (item.cursed) {
      surcharges += base * CURSE_RATE;
    }
    if ((item.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD) {
      surcharges += base * HIGH_ENCHANT_RATE;
    }
  }
  return surcharges;
}

function policyWideModifiers(customer: Customer, base: number, quoteCount: number): number {
  let total = 0;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    total -= base * LOYALTY_RATE;
  }
  total += base * FIRST_INSURANCE_RATE;
  if (quoteCount > 0) {
    total -= base * FOLLOW_UP_RATE;
  }
  return total;
}

function buildPolicy(items: Item[]): Policy {
  const insuredItems: InsuredItem[] = [];
  let insuranceSum = 0;
  for (const item of items) {
    const value = MAIN_ITEMS[item.type as ItemType].value;
    insuranceSum += value;
    insuredItems.push({ type: item.type, value, material: item.material, enchantment: item.enchantment });
  }
  const remainingCap = insuranceSum * CAP_MULTIPLIER;
  return { items: insuredItems, insuranceSum, remainingCap };
}

function claimStep(policy: Policy, damages: DamageEntry[]): ClaimResult {
  validateClaim(policy, damages);

  const remaining = [...policy.items];
  let payout = 0;
  for (const damage of damages) {
    const idx = remaining.findIndex((i) => i.type === damage.itemType);
    const item = remaining[idx];
    remaining.splice(idx, 1);
    payout += reimbursement(item, damage.amount);
  }

  payout = Math.min(payout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function validateClaim(policy: Policy, damages: DamageEntry[]): void {
  const damageCounts = countDamages(damages);
  for (const type of Object.keys(damageCounts)) {
    const insured = policy.items.filter((i) => i.type === type).length;
    if (insured === 0) {
      throw new Error(`Item not part of policy: ${type}`);
    }
    if (damageCounts[type] > insured) {
      throw new Error(`More damage entries for ${type} than insured`);
    }
  }
}

function countDamages(damages: DamageEntry[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const damage of damages) {
    if (!isKnownType(damage.itemType)) {
      throw new Error(`Unknown item type: ${damage.itemType}`);
    }
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    counts[damage.itemType] = (counts[damage.itemType] ?? 0) + 1;
  }
  return counts;
}

function reimbursement(item: InsuredItem, amount: number): number {
  const rate = reimbursementRate(item);
  return Math.max(0, amount * rate - DEDUCTIBLE);
}

function reimbursementRate(item: InsuredItem): number {
  if (!isComponent(item.type) && (item.enchantment ?? 0) >= HIGH_ENCHANT_CLAIM_THRESHOLD) {
    return HIGH_ENCHANT_CLAIM_RATE;
  }
  return 1;
}