// MHPCO Claim Office - core domain logic

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

const MAIN_ITEM_PRICES: Record<string, { value: number; basePremium: number }> = {
  sword: { value: 1000, basePremium: 100 },
  amulet: { value: 600, basePremium: 60 },
  staff: { value: 800, basePremium: 80 },
  potion: { value: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_VALUE = 250;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

const DEDUCTIBLE = 100;
const PROCESSING_FEE = 5;

const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOWUP_DISCOUNT = 0.15;

const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_FACTOR = 0.5;

function isKnownType(type: string): boolean {
  return type in MAIN_ITEM_PRICES || COMPONENT_TYPES.has(type);
}

function itemInsuranceValue(item: Item): number {
  if (item.type in MAIN_ITEM_PRICES) {
    return MAIN_ITEM_PRICES[item.type].value;
  }
  if (COMPONENT_TYPES.has(item.type)) {
    return COMPONENT_VALUE;
  }
  throw new Error(`Unknown item type: ${item.type}`);
}

function itemBasePremium(item: Item): number {
  if (item.type in MAIN_ITEM_PRICES) {
    return MAIN_ITEM_PRICES[item.type].basePremium;
  }
  if (COMPONENT_TYPES.has(item.type)) {
    return COMPONENT_PREMIUM;
  }
  throw new Error(`Unknown item type: ${item.type}`);
}

// Compute the base premium for the list of items, applying the
// "block of 3 alike components" discount.
function computeItemsBasePremium(items: Item[]): number {
  let total = 0;
  const componentCounts: Record<string, number> = {};

  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    } else {
      total += itemBasePremium(item);
    }
  }

  for (const type in componentCounts) {
    const count = componentCounts[type];
    // Block applies only when the count is exactly 3
    if (count === COMPONENT_BLOCK_SIZE) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * COMPONENT_PREMIUM;
    }
  }

  return total;
}

// Item-specific modifier surcharge on a single item's base premium
function itemModifierAmount(item: Item): number {
  const base = itemBasePremium(item);
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * CURSED_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

// Total item-specific surcharges across all items, plus first-insurance
// surcharge applied per item.
function totalItemSurcharges(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    total += itemModifierAmount(item);
    total += itemBasePremium(item) * FIRST_INSURANCE_SURCHARGE;
  }
  return total;
}

// Policy-wide modifiers (loyalty, follow-up contract). Returns delta added to base.
function policyWideModifierAmount(
  itemsBase: number,
  customer: Customer,
  isFollowUp: boolean,
): number {
  let delta = 0;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) {
    delta -= itemsBase * LOYALTY_DISCOUNT;
  }
  if (isFollowUp) {
    delta -= itemsBase * FOLLOWUP_DISCOUNT;
  }
  return delta;
}

export interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

export function makePolicy(items: Item[]): Policy {
  // Validate all item types first
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  let insuranceSum = 0;
  for (const item of items) {
    insuranceSum += itemInsuranceValue(item);
  }
  const cap = insuranceSum * 2;
  return { items, insuranceSum, cap, remainingCap: cap };
}

export function computePremium(
  items: Item[],
  customer: Customer,
  isFollowUp: boolean,
): number {
  // Validate
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  const itemsBase = computeItemsBasePremium(items);
  const itemSurcharges = totalItemSurcharges(items);
  const policyWide = policyWideModifierAmount(itemsBase, customer, isFollowUp);

  const beforeFee = itemsBase + itemSurcharges + policyWide;
  const total = beforeFee + PROCESSING_FEE;

  // Round up (MHPCO's favor on premium)
  return Math.ceil(total);
}

// Payout for a single damage entry, before applying the policy cap.
// The 50% high-enchantment rule wins over the dragon-material rule when
// both apply; dragon material otherwise reimburses fully, which is also
// the default — so only the high-enchantment clause changes the amount.
function computeDamagePayout(item: Item, damage: number): number {
  const highEnchantment =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;
  const reimbursable = highEnchantment
    ? damage * HIGH_ENCHANTMENT_PAYOUT_FACTOR
    : damage;
  return Math.max(0, reimbursable - DEDUCTIBLE);
}

export interface ClaimComputation {
  payout: number;
  remainingCap: number;
}

export function processClaim(policy: Policy, incident: Incident): ClaimComputation {
  // Validate damage amounts
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }

  // Match each damage entry to an item in the policy
  // Each damage entry consumes one item of the matching type from the available
  // pool, so a policy with one sword and two sword damage entries is rejected.
  const availableItems: Item[] = [...policy.items];
  const matched: { item: Item; damage: number }[] = [];

  for (const damage of incident.damages) {
    if (!isKnownType(damage.itemType)) {
      throw new Error(`Unknown item type in damage: ${damage.itemType}`);
    }
    const idx = availableItems.findIndex((it) => it.type === damage.itemType);
    if (idx === -1) {
      throw new Error(
        `Damage references item type ${damage.itemType} not in policy`,
      );
    }
    matched.push({ item: availableItems[idx], damage: damage.amount });
    availableItems.splice(idx, 1);
  }

  // Compute total payout, applying remaining cap progressively
  let totalPayout = 0;
  let remainingCap = policy.remainingCap;

  for (const { item, damage } of matched) {
    let payout = computeDamagePayout(item, damage);
    if (payout > remainingCap) {
      payout = remainingCap;
    }
    totalPayout += payout;
    remainingCap -= payout;
  }

  // Round down (MHPCO's favor on payout)
  const finalPayout = Math.floor(totalPayout);
  policy.remainingCap = remainingCap;

  return { payout: finalPayout, remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioOutput {
  const results: StepResult[] = [];
  const policies: Record<number, Policy> = {};
  let quoteCount = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      const premium = computePremium(step.items, scenario.customer, isFollowUp);
      const policy = makePolicy(step.items);
      policies[i] = policy;
      quoteCount++;
      results.push({ premium });
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error(`Claim references unknown policy step ${step.policy}`);
      }
      const result = processClaim(policy, step.incident);
      results.push(result);
    } else {
      throw new Error(`Unknown op: ${(step as { op: string }).op}`);
    }
  }

  return { results };
}
