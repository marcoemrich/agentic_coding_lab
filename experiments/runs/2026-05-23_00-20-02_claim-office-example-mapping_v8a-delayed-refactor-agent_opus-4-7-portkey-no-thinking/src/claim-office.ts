// Domain types

export type ItemType = "sword" | "amulet" | "staff" | "potion" | "rune" | "moonstone";

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioOutput {
  results: StepResult[];
}

// Price list

const MAIN_ITEMS: Record<string, { insuranceValue: number; basePremium: number }> = {
  sword:  { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600,  basePremium: 60 },
  staff:  { insuranceValue: 800,  basePremium: 80 },
  potion: { insuranceValue: 400,  basePremium: 40 },
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;

const DEDUCTIBLE = 100;
const PROCESSING_FEE = 5;

const CURSE_SURCHARGE_PCT = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_PCT = 0.3;
const LOYALTY_DISCOUNT_PCT = 0.2;
const FIRST_INSURANCE_SURCHARGE_PCT = 0.1;
const FOLLOWUP_CONTRACT_DISCOUNT_PCT = 0.15;

const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_YEARS_THRESHOLD = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function isKnownType(type: string): boolean {
  return type in MAIN_ITEMS || isComponent(type);
}

function assertKnownItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

export function itemInsuranceValue(item: Item): number {
  if (item.type in MAIN_ITEMS) return MAIN_ITEMS[item.type].insuranceValue;
  if (isComponent(item.type)) return COMPONENT_INSURANCE_VALUE;
  throw new Error(`Unknown item type: ${item.type}`);
}

// Compute base premium for a list of items considering component blocks
function itemsBasePremium(items: Item[]): number {
  let total = 0;
  // count components by type
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (item.type in MAIN_ITEMS) {
      total += MAIN_ITEMS[item.type].basePremium;
    } else if (isComponent(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    } else {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  for (const type of Object.keys(componentCounts)) {
    const count = componentCounts[type];
    if (count === 3) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * COMPONENT_BASE_PREMIUM;
    }
  }
  return total;
}

// Base premium for a single item, ignoring block discount (used for item-level modifier scope)
function singleItemBasePremium(item: Item): number {
  if (item.type in MAIN_ITEMS) return MAIN_ITEMS[item.type].basePremium;
  if (isComponent(item.type)) return COMPONENT_BASE_PREMIUM;
  throw new Error(`Unknown item type: ${item.type}`);
}

function itemSurcharge(item: Item): number {
  const base = singleItemBasePremium(item);
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE_PCT;
  if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE_PCT;
  }
  return surcharge;
}

export interface PolicyContext {
  customer: Customer;
  contractIndex: number; // 0 for first, 1 for second, etc.
}

export function computePremium(items: Item[], ctx: PolicyContext): number {
  assertKnownItemTypes(items);

  const policyBase = itemsBasePremium(items);
  const itemSurcharges = items.reduce((sum, item) => sum + itemSurcharge(item), 0);

  // Policy-wide modifiers apply to policy base
  let policyModifiers = 0;
  if (ctx.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    policyModifiers -= policyBase * LOYALTY_DISCOUNT_PCT;
  }
  // First insurance surcharge: each item in a quote treated as first insurance.
  // Per spec: applies to policy base premium overall (each quote is "a first insurance").
  policyModifiers += policyBase * FIRST_INSURANCE_SURCHARGE_PCT;
  if (ctx.contractIndex > 0) {
    policyModifiers -= policyBase * FOLLOWUP_CONTRACT_DISCOUNT_PCT;
  }

  const subtotal = policyBase + itemSurcharges + policyModifiers;
  const withFee = subtotal + PROCESSING_FEE;
  // Round up (in MHPCO's favor for premium)
  return Math.ceil(withFee);
}

export interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

export function createPolicy(items: Item[]): Policy {
  assertKnownItemTypes(items);
  const insuranceSum = items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
  const cap = insuranceSum * 2;
  return { items, insuranceSum, cap, remainingCap: cap };
}

function findItemForDamage(policy: Policy, damage: Damage, usedIndices: Set<number>): Item {
  if (!isKnownType(damage.itemType)) {
    throw new Error(`Unknown item type in damage: ${damage.itemType}`);
  }
  for (let i = 0; i < policy.items.length; i++) {
    if (usedIndices.has(i)) continue;
    if (policy.items[i].type === damage.itemType) {
      usedIndices.add(i);
      return policy.items[i];
    }
  }
  throw new Error(`Damage references item type "${damage.itemType}" not covered by policy (or more damages than items)`);
}

function damagePayout(item: Item, damage: Damage): number {
  // High-enchantment clause (≥8): 50% reimbursement. Per spec, this wins
  // over the dragon-material full-reimbursement clause when both apply.
  // Dragon alone reimburses fully (no change). Deductible applies last.
  const isHighEnchant =
    item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;
  const reimbursable = isHighEnchant ? damage.amount * 0.5 : damage.amount;
  return Math.max(0, reimbursable - DEDUCTIBLE);
}

export function processClaim(policy: Policy, incident: Incident): { payout: number; remainingCap: number } {
  // Validate all damages first
  for (const d of incident.damages) {
    if (d.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${d.amount}`);
    }
    if (!isKnownType(d.itemType)) {
      throw new Error(`Unknown item type in damage: ${d.itemType}`);
    }
  }

  const usedIndices = new Set<number>();
  let totalPayout = 0;
  for (const damage of incident.damages) {
    const item = findItemForDamage(policy, damage, usedIndices);
    totalPayout += damagePayout(item, damage);
  }

  // Apply cap
  const cappedPayout = Math.min(totalPayout, policy.remainingCap);
  // Round down (in MHPCO's favor for payout)
  const finalPayout = Math.floor(cappedPayout);
  policy.remainingCap -= finalPayout;
  return { payout: finalPayout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): ScenarioOutput {
  const results: StepResult[] = [];
  const policies: Record<number, Policy> = {};
  let quoteCount = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      const ctx: PolicyContext = {
        customer: scenario.customer,
        contractIndex: quoteCount,
      };
      const premium = computePremium(step.items, ctx);
      const policy = createPolicy(step.items);
      policies[i] = policy;
      results.push({ premium });
      quoteCount++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error(`Claim references unknown policy index: ${step.policy}`);
      }
      const result = processClaim(policy, step.incident);
      results.push(result);
    } else {
      throw new Error(`Unknown step op: ${(step as { op: string }).op}`);
    }
  }

  return { results };
}
