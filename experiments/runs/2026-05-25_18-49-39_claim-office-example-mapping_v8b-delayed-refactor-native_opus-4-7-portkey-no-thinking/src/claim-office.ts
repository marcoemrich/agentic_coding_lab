// MHPCO Claim Office implementation

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

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: DamageEntry[];
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

const PRICE_LIST: Record<string, { insurance: number; base: number; isComponent?: boolean }> = {
  sword:     { insurance: 1000, base: 100 },
  amulet:    { insurance:  600, base:  60 },
  staff:     { insurance:  800, base:  80 },
  potion:    { insurance:  400, base:  40 },
  rune:      { insurance:  250, base:  25, isComponent: true },
  moonstone: { insurance:  250, base:  25, isComponent: true },
};

const BLOCK_BASE = 60;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;

function priceOf(type: string): { insurance: number; base: number; isComponent?: boolean } {
  const entry = PRICE_LIST[type];
  if (!entry) throw new Error(`Unknown item type: ${type}`);
  return entry;
}

function isComponent(type: string): boolean {
  return PRICE_LIST[type]?.isComponent === true;
}

export function itemInsuranceValue(item: Item): number {
  return priceOf(item.type).insurance;
}

function itemBasePremium(item: Item): number {
  return priceOf(item.type).base;
}

function policyBasePremium(items: Item[]): number {
  // Components of the same type form a block discount when exactly 3 are present.
  const componentCounts: Record<string, number> = {};
  let total = 0;
  for (const it of items) {
    if (isComponent(it.type)) {
      componentCounts[it.type] = (componentCounts[it.type] ?? 0) + 1;
    } else {
      total += itemBasePremium(it);
    }
  }
  for (const type in componentCounts) {
    const n = componentCounts[type];
    total += n === 3 ? BLOCK_BASE : n * priceOf(type).base;
  }
  return total;
}

// Item-specific surcharges (cursed, high enchantment) apply to the item's
// individual base premium — for components, the per-item base (not the block price).
function itemSurcharge(item: Item): number {
  const base = itemBasePremium(item);
  const cursed = item.cursed ? base * 0.5 : 0;
  const highEnchant = (item.enchantment ?? 0) >= 5 ? base * 0.3 : 0;
  return cursed + highEnchant;
}

function sumItemSurcharges(items: Item[]): number {
  return items.reduce((sum, it) => sum + itemSurcharge(it), 0);
}

export interface QuoteContext {
  customer: Customer;
  isFirstContract: boolean; // true if this is the customer's first contract in scenario
}

export function computeQuote(items: Item[], ctx: QuoteContext): number {
  // priceOf throws on unknown types; iterate once to validate.
  for (const it of items) priceOf(it.type);

  const basePolicy = policyBasePremium(items);
  const itemSurcharges = sumItemSurcharges(items);

  // Policy-wide modifiers apply to the policy base premium.
  const firstInsurance = basePolicy * 0.10;
  const loyalty = ctx.customer.yearsWithMHPCO >= 2 ? basePolicy * 0.20 : 0;
  const followUp = ctx.isFirstContract ? 0 : basePolicy * 0.15;

  const total = basePolicy + itemSurcharges + firstInsurance - loyalty - followUp + PROCESSING_FEE;
  // Round in MHPCO's favor: premiums round up.
  return Math.ceil(total);
}

export interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

export function buildPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, it) => sum + itemInsuranceValue(it), 0);
  const cap = insuranceSum * 2;
  return { items, insuranceSum, cap, remainingCap: cap };
}

function reimbursedAmount(item: Item, damageAmount: number): number {
  // When both apply, the 50 % high-enchantment rule wins over dragon material.
  if ((item.enchantment ?? 0) >= 8) return damageAmount * 0.5;
  if (item.material === "dragon") return damageAmount;
  return damageAmount;
}

function groupItemsByType(items: Item[]): Map<string, Item[]> {
  const groups = new Map<string, Item[]>();
  for (const it of items) {
    const list = groups.get(it.type) ?? [];
    list.push(it);
    groups.set(it.type, list);
  }
  return groups;
}

export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  // Pool of insured items per type; each damage entry consumes one.
  const available = groupItemsByType(policy.items);

  let rawPayout = 0;
  for (const d of incident.damages) {
    if (d.amount < 0) throw new Error(`Negative damage amount: ${d.amount}`);
    priceOf(d.itemType); // throws on unknown type
    const pool = available.get(d.itemType);
    if (!pool || pool.length === 0) {
      throw new Error(`Damage references items not on policy: ${d.itemType}`);
    }
    const item = pool.shift()!;
    const afterDeductible = reimbursedAmount(item, d.amount) - DEDUCTIBLE;
    if (afterDeductible > 0) rawPayout += afterDeductible;
  }

  // Round in MHPCO's favor: payouts round down.
  const desired = Math.floor(rawPayout);
  const payout = Math.min(desired, policy.remainingCap);
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioOutput {
  const results: StepResult[] = [];
  const policiesByStep = new Map<number, Policy>();
  let quoteCount = 0;

  scenario.steps.forEach((step, i) => {
    if (step.op === "quote") {
      const ctx: QuoteContext = {
        customer: scenario.customer,
        isFirstContract: quoteCount === 0,
      };
      results.push({ premium: computeQuote(step.items, ctx) });
      policiesByStep.set(i, buildPolicy(step.items));
      quoteCount++;
    } else {
      const policy = policiesByStep.get(step.policy);
      if (!policy) throw new Error(`Claim references missing policy index ${step.policy}`);
      results.push(processClaim(policy, step.incident));
    }
  });

  return { results };
}
