export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Customer = {
  yearsWithMHPCO: number;
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type QuoteStep = {
  op: 'quote';
  items: Item[];
};

export type ClaimStep = {
  op: 'claim';
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

type ItemSpec = { insuranceValue: number; basePremium: number };

const MAIN_ITEMS: Record<string, ItemSpec> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_SPEC: ItemSpec = { insuranceValue: 250, basePremium: 25 };
const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const DEDUCTIBLE = 100;
const PROCESSING_FEE = 5;

const HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const CURSED_SURCHARGE_RATE = 0.5;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const INSURANCE_CAP_MULTIPLIER = 2;

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function isKnownType(type: string): boolean {
  return type in MAIN_ITEMS || isComponent(type);
}

function specFor(type: string): ItemSpec {
  if (type in MAIN_ITEMS) return MAIN_ITEMS[type];
  if (isComponent(type)) return COMPONENT_SPEC;
  throw new Error(`Unknown item type: ${type}`);
}

function itemInsuranceValue(item: Item): number {
  return specFor(item.type).insuranceValue;
}

function itemBasePremium(item: Item): number {
  return specFor(item.type).basePremium;
}

function componentGroupPremium(count: number): number {
  // Block discount applies only when there are exactly 3 alike components.
  // For any other count, each component is priced at the regular base premium.
  if (count === COMPONENT_BLOCK_SIZE) return COMPONENT_BLOCK_PREMIUM;
  return count * COMPONENT_SPEC.basePremium;
}

function computePolicyBasePremium(items: Item[]): number {
  // Sum of item base premiums (with component block discount), no item modifiers
  const componentCounts = new Map<string, number>();
  let total = 0;

  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += itemBasePremium(item);
    }
  }

  for (const [, count] of componentCounts) {
    total += componentGroupPremium(count);
  }

  return total;
}

function computeItemSurcharges(items: Item[]): number {
  // Per-item modifiers: cursed (+50% of item base), high enchantment (+30% of item base).
  // Components in the spec examples are plain — they have no enchantment/cursed.
  let surcharges = 0;
  for (const item of items) {
    if (isComponent(item.type)) continue;
    const base = itemBasePremium(item);
    if (item.cursed) surcharges += base * CURSED_SURCHARGE_RATE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD) {
      surcharges += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
  }
  return surcharges;
}

export function quotePremium(
  items: Item[],
  customer: Customer,
  contractIndex: number,
): number {
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  const policyBase = computePolicyBasePremium(items);
  const itemSurcharges = computeItemSurcharges(items);

  let premium = policyBase + itemSurcharges;

  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    premium -= policyBase * LOYALTY_DISCOUNT_RATE;
  }
  // First insurance always applies (each item treated as first insurance)
  premium += policyBase * FIRST_INSURANCE_SURCHARGE_RATE;

  if (contractIndex >= 1) {
    premium -= policyBase * FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
  }

  premium += PROCESSING_FEE;

  return Math.ceil(premium);
}

export type Policy = {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
};

export function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
  const cap = insuranceSum * INSURANCE_CAP_MULTIPLIER;
  return { items: [...items], insuranceSum, cap, remainingCap: cap };
}

function findItemForDamage(policy: Policy, itemType: string, usedIndices: Set<number>): number {
  for (let i = 0; i < policy.items.length; i++) {
    if (usedIndices.has(i)) continue;
    if (policy.items[i].type === itemType) return i;
  }
  return -1;
}

function rawReimbursementForDamage(item: Item, damageAmount: number): number {
  // Spec: damage to items with enchantment >= 8 is reimbursed at 50% of the damage
  // amount; damage to dragon-material items is fully reimbursed (the default).
  // When both clauses apply, the 50% rule wins — so the high-enchantment check is
  // sufficient on its own.
  const isHighEnchant = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD;
  return isHighEnchant ? damageAmount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE : damageAmount;
}

export function processClaim(policy: Policy, incident: Incident): number {
  // Each damage entry consumes one matching policy item instance and contributes
  // (reimbursable - deductible, floored at 0) to the payout total.
  const usedIndices = new Set<number>();
  let totalPayout = 0;

  for (const dmg of incident.damages) {
    if (dmg.amount < 0) {
      throw new Error(`Negative damage amount: ${dmg.amount}`);
    }
    if (!isKnownType(dmg.itemType)) {
      throw new Error(`Unknown item type in claim: ${dmg.itemType}`);
    }
    const idx = findItemForDamage(policy, dmg.itemType, usedIndices);
    if (idx === -1) {
      throw new Error(`Damage references item not in policy: ${dmg.itemType}`);
    }
    usedIndices.add(idx);
    const reimbursable = rawReimbursementForDamage(policy.items[idx], dmg.amount);
    totalPayout += Math.max(0, reimbursable - DEDUCTIBLE);
  }

  const finalPayout = Math.min(Math.floor(totalPayout), policy.remainingCap);
  policy.remainingCap -= finalPayout;
  return finalPayout;
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, scenario.customer, quoteCount);
      const policy = createPolicy(step.items);
      policies.set(i, policy);
      results.push({ premium });
      quoteCount++;
    } else {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`Claim references unknown policy index: ${step.policy}`);
      }
      const payout = processClaim(policy, step.incident);
      results.push({ payout, remainingCap: policy.remainingCap });
    }
  }

  return { results };
}
