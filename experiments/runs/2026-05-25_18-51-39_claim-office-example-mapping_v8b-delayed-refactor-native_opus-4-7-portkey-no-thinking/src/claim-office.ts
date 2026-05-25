// MHPCO Claim Office implementation

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Customer = {
  yearsWithMHPCO: number;
};

export type QuoteStep = {
  op: "quote";
  items: Item[];
};

export type DamageEntry = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: DamageEntry[];
};

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: Incident;
};

export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;

export type ScenarioResult = {
  results: StepResult[];
};

const MAIN_ITEM_VALUES: Record<string, { value: number; basePremium: number }> = {
  sword: { value: 1000, basePremium: 100 },
  amulet: { value: 600, basePremium: 60 },
  staff: { value: 800, basePremium: 80 },
  potion: { value: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_VALUE = 250;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const PROCESSING_FEE = 5;

function isMainItem(type: string): boolean {
  return type in MAIN_ITEM_VALUES;
}

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function isKnownType(type: string): boolean {
  return isMainItem(type) || isComponent(type);
}

function itemInsuranceValue(item: Item): number {
  if (isMainItem(item.type)) return MAIN_ITEM_VALUES[item.type].value;
  if (isComponent(item.type)) return COMPONENT_VALUE;
  throw new Error(`Unknown item type: ${item.type}`);
}

export function insuranceSum(items: Item[]): number {
  let sum = 0;
  for (const item of items) {
    sum += itemInsuranceValue(item);
  }
  return sum;
}

function mainItemBasePremium(item: Item): number {
  return MAIN_ITEM_VALUES[item.type].basePremium;
}

// Block premium applies only when count is exactly 3 (per spec: 4 runes → 100 G, no block).
function componentsPremium(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (isComponent(item.type)) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
  }
  let total = 0;
  for (const [, count] of counts) {
    if (count === 3) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * COMPONENT_PREMIUM;
    }
  }
  return total;
}

export type QuoteContext = {
  yearsWithMHPCO: number;
  isFirstContract: boolean;
};

export function computePremium(items: Item[], context: QuoteContext): number {
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  if (items.length === 0) {
    return PROCESSING_FEE;
  }

  // Policy base premium: sum of main item base premiums + components premium (with block discount)
  let policyBase = 0;
  for (const item of items) {
    if (isMainItem(item.type)) {
      policyBase += mainItemBasePremium(item);
    }
  }
  policyBase += componentsPremium(items);

  let premium = policyBase;

  // Item-specific surcharges (cursed, high enchantment) on the item's own base premium
  for (const item of items) {
    if (isMainItem(item.type)) {
      const base = mainItemBasePremium(item);
      if (item.cursed) premium += base * 0.5;
      if (item.enchantment !== undefined && item.enchantment >= 5) {
        premium += base * 0.3;
      }
    }
  }

  // Policy-wide modifiers on the policy base premium
  if (context.yearsWithMHPCO >= 2) {
    premium -= policyBase * 0.2;
  }
  // First insurance surcharge: 10% — each item in a quote is treated as a first insurance,
  // so always applies (× policy base, which equals sum of 10%×item_base).
  premium += policyBase * 0.1;
  // Follow-up contract discount: 15% if not the customer's first contract
  if (!context.isFirstContract) {
    premium -= policyBase * 0.15;
  }

  premium += PROCESSING_FEE;

  return Math.ceil(premium);
}

// ---------- Claims ----------

export type Policy = {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
};

export function createPolicy(items: Item[]): Policy {
  const sum = insuranceSum(items);
  return {
    items,
    insuranceSum: sum,
    remainingCap: sum * 2,
  };
}

function findItemForDamage(
  policy: Policy,
  damage: DamageEntry,
  consumed: Map<string, number>
): Item {
  const available = policy.items.filter((it) => it.type === damage.itemType);
  if (available.length === 0) {
    throw new Error(
      `Damage references item type "${damage.itemType}" not in policy`
    );
  }
  const used = consumed.get(damage.itemType) ?? 0;
  if (used >= available.length) {
    throw new Error(
      `Damage list has more "${damage.itemType}" entries than policy covers`
    );
  }
  consumed.set(damage.itemType, used + 1);
  return available[used];
}

function damagePayout(item: Item, damageAmount: number): number {
  const isHighEnch =
    item.enchantment !== undefined && item.enchantment >= 8;
  const reimbursed = isHighEnch ? damageAmount * 0.5 : damageAmount;
  return Math.max(0, reimbursed - DEDUCTIBLE);
}

export function processClaim(
  policy: Policy,
  incident: Incident
): { payout: number; remainingCap: number } {
  // Validate damages first
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
    if (!isKnownType(damage.itemType)) {
      throw new Error(`Unknown damage item type: ${damage.itemType}`);
    }
  }

  const consumed = new Map<string, number>();
  let totalPayout = 0;
  for (const damage of incident.damages) {
    const item = findItemForDamage(policy, damage, consumed);
    totalPayout += damagePayout(item, damage.amount);
  }

  const payout = Math.floor(Math.min(totalPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

// ---------- Scenario runner ----------

export function runScenario(scenario: Scenario): ScenarioResult {
  const results: StepResult[] = [];
  const policies: Map<number, Policy> = new Map();
  let quoteCount = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      const ctx: QuoteContext = {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        isFirstContract: quoteCount === 0,
      };
      const premium = computePremium(step.items, ctx);
      policies.set(i, createPolicy(step.items));
      results.push({ premium });
      quoteCount++;
    } else if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`Claim references unknown policy index ${step.policy}`);
      }
      const r = processClaim(policy, step.incident);
      results.push(r);
    } else {
      throw new Error(`Unknown step op`);
    }
  }
  return { results };
}
