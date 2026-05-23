// MHPCO Claim Office: premium quoting and claim processing.

// ---------- Public types (mirror the CLI JSON shape) ----------

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
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

// ---------- Price catalog ----------

interface ItemPrice {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEMS: Record<string, ItemPrice> = {
  sword:  { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600,  basePremium: 60  },
  staff:  { insuranceValue: 800,  basePremium: 80  },
  potion: { insuranceValue: 400,  basePremium: 40  },
};

const COMPONENT_PRICE: ItemPrice = { insuranceValue: 250, basePremium: 25 };
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;

function isComponentType(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function isMainType(type: string): boolean {
  return type in MAIN_ITEMS;
}

function priceOf(type: string): ItemPrice {
  if (isMainType(type)) return MAIN_ITEMS[type];
  if (isComponentType(type)) return COMPONENT_PRICE;
  throw new Error(`Unknown item type: ${type}`);
}

// ---------- Premium rules ----------

const RULES = {
  cursedSurcharge: 0.5,
  highEnchantmentSurcharge: 0.3,
  highEnchantmentThreshold: 5,
  loyaltyDiscount: 0.2,
  loyaltyYearsThreshold: 2,
  firstInsuranceSurcharge: 0.1,
  followUpDiscount: 0.15,
  processingFee: 5,
};

// Sum of unmodified base premiums for the items on a policy.
// Components are grouped by type; exactly 3 of the same type is a block (60 G);
// any other count is priced per component (25 G each).
function policyBasePremium(items: Item[]): number {
  const componentCounts: Record<string, number> = {};
  let total = 0;

  for (const item of items) {
    if (isMainType(item.type)) {
      total += MAIN_ITEMS[item.type].basePremium;
    } else if (isComponentType(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  for (const count of Object.values(componentCounts)) {
    total += count === COMPONENT_BLOCK_SIZE
      ? COMPONENT_BLOCK_PRICE
      : count * COMPONENT_PRICE.basePremium;
  }
  return total;
}

// Item-specific surcharges (curse, high enchantment) for a single main item.
// Components have no item-specific surcharges.
function itemSurcharge(item: Item): number {
  if (!isMainType(item.type)) return 0;
  const base = MAIN_ITEMS[item.type].basePremium;
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * RULES.cursedSurcharge;
  }
  if ((item.enchantment ?? 0) >= RULES.highEnchantmentThreshold) {
    surcharge += base * RULES.highEnchantmentSurcharge;
  }
  return surcharge;
}

export function computeQuote(
  customer: Customer,
  items: Item[],
  isFollowUpContract: boolean,
): number {
  const policyBase = policyBasePremium(items);
  const itemSurcharges = items.reduce((sum, item) => sum + itemSurcharge(item), 0);

  let premium = policyBase + itemSurcharges;
  premium += policyBase * RULES.firstInsuranceSurcharge;
  if (customer.yearsWithMHPCO >= RULES.loyaltyYearsThreshold) {
    premium -= policyBase * RULES.loyaltyDiscount;
  }
  if (isFollowUpContract) {
    premium -= policyBase * RULES.followUpDiscount;
  }
  premium += RULES.processingFee;

  // Round in MHPCO's favor (up for premiums).
  return Math.ceil(premium);
}

// ---------- Claim processing ----------

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_DAMAGE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_DAMAGE_FACTOR = 0.5;

export interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

export function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, i) => sum + priceOf(i.type).insuranceValue, 0);
  const cap = CAP_MULTIPLIER * insuranceSum;
  return { items, insuranceSum, cap, remainingCap: cap };
}

// Per-damage reimbursement. Standard items and dragon-material items are both
// fully reimbursable; the high-enchantment (≥8) clause halves the reimbursable
// amount and wins when both clauses would apply. Deductible is taken last.
function damageReimbursement(item: Item, amount: number): number {
  const reimbursable = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_DAMAGE_THRESHOLD
    ? amount * HIGH_ENCHANTMENT_DAMAGE_FACTOR
    : amount;
  return Math.max(0, reimbursable - DEDUCTIBLE);
}

// Match each damage to a specific insured item of that type, in order of appearance.
// Throws if a damage references more items of a type than the policy actually covers
// or if it references an unknown / not-insured type.
function matchDamagesToItems(items: Item[], damages: Damage[]): Item[] {
  const byType: Record<string, Item[]> = {};
  for (const item of items) {
    (byType[item.type] ??= []).push(item);
  }

  const consumed: Record<string, number> = {};
  const matched: Item[] = [];

  for (const damage of damages) {
    const pool = byType[damage.itemType] ?? [];
    const idx = consumed[damage.itemType] ?? 0;
    if (idx >= pool.length) {
      throw new Error(`Damage references item not covered by policy: ${damage.itemType}`);
    }
    matched.push(pool[idx]);
    consumed[damage.itemType] = idx + 1;
  }
  return matched;
}

function validateDamages(damages: Damage[]): void {
  for (const d of damages) {
    if (d.amount < 0) {
      throw new Error(`Negative damage amount: ${d.amount}`);
    }
    if (!isMainType(d.itemType) && !isComponentType(d.itemType)) {
      throw new Error(`Unknown item type in damage: ${d.itemType}`);
    }
  }
}

export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  validateDamages(incident.damages);
  const matchedItems = matchDamagesToItems(policy.items, incident.damages);

  let total = 0;
  for (let i = 0; i < incident.damages.length; i++) {
    total += damageReimbursement(matchedItems[i], incident.damages[i].amount);
  }

  // Round in MHPCO's favor (down for payouts), then clamp to remaining cap.
  const payout = Math.min(Math.floor(total), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

// ---------- Scenario runner ----------

export function runScenario(scenario: Scenario): ScenarioOutput {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const premium = computeQuote(scenario.customer, step.items, quoteCount > 0);
      results.push({ premium });
      policies.set(index, createPolicy(step.items));
      quoteCount++;
    } else if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`Claim references unknown policy at step ${step.policy}`);
      }
      results.push(processClaim(policy, step.incident));
    } else {
      throw new Error(`Unknown op: ${(step as { op: string }).op}`);
    }
  });

  return { results };
}
