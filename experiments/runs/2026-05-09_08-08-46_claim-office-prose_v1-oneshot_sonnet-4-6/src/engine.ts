import { Customer, Item, Policy, QuoteStep, ClaimStep, Scenario, StepResult } from './types.js';

const MAIN_ITEM_DATA: Record<string, { insuredValue: number; basePremium: number }> = {
  sword: { insuredValue: 1000, basePremium: 100 },
  amulet: { insuredValue: 600, basePremium: 60 },
  staff: { insuredValue: 800, basePremium: 80 },
  potion: { insuredValue: 400, basePremium: 40 },
};

const COMPONENT_INSURED_VALUE = 250;
const COMPONENT_PREMIUM_SINGLE = 25;
const COMPONENT_BUNDLE_TOTAL = 60; // for 3 alike = 20 G each
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;

function isMainItem(type: string): boolean {
  return type in MAIN_ITEM_DATA;
}

function computeInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => {
    const data = MAIN_ITEM_DATA[item.type];
    return sum + (data ? data.insuredValue : COMPONENT_INSURED_VALUE);
  }, 0);
}

/**
 * Determines whether each component item is part of a bundle of 3 alike.
 * The first floor(N/3)*3 items of each type are "bundle" members (20 G each),
 * the remainder are individual (25 G each).
 */
function buildBundleStatus(items: Item[]): Map<Item, boolean> {
  const status = new Map<Item, boolean>();
  const groups: Record<string, Item[]> = {};

  for (const item of items) {
    if (!isMainItem(item.type)) {
      if (!groups[item.type]) groups[item.type] = [];
      groups[item.type].push(item);
    }
  }

  for (const groupItems of Object.values(groups)) {
    const bundleCount = Math.floor(groupItems.length / 3) * 3;
    for (let i = 0; i < groupItems.length; i++) {
      status.set(groupItems[i], i < bundleCount);
    }
  }

  return status;
}

function itemBasePremium(item: Item, inBundle: boolean): number {
  if (isMainItem(item.type)) return MAIN_ITEM_DATA[item.type].basePremium;
  return inBundle ? COMPONENT_BUNDLE_TOTAL / 3 : COMPONENT_PREMIUM_SINGLE;
}

export function computeQuote(
  step: QuoteStep,
  customer: Customer,
  quoteCount: number
): { premium: number; insuranceSum: number } {
  const bundleStatus = buildBundleStatus(step.items);

  // Sum item premiums with item-level surcharges
  let rawTotal = 0;
  for (const item of step.items) {
    let base = itemBasePremium(item, bundleStatus.get(item) ?? false);
    if (item.cursed) base *= 1.5;
    if (item.enchantment >= 5) base *= 1.3;
    rawTotal += base;
  }

  // Customer-level modifiers
  let factor = 1.0;
  if (customer.yearsWithMHPCO >= 2) factor *= 0.8; // loyalty discount

  const isFirstEver = quoteCount === 0 && customer.yearsWithMHPCO === 0;
  if (isFirstEver) {
    factor *= 1.1; // initial assessment surcharge
  } else {
    factor *= 0.85; // subsequent contract discount
  }

  // Round to 9 decimal places to eliminate floating-point noise before ceiling
  const raw = rawTotal * factor + PROCESSING_FEE;
  const premium = Math.ceil(Math.round(raw * 1e9) / 1e9);
  const insuranceSum = computeInsuranceSum(step.items);

  return { premium, insuranceSum };
}

function reimbursementRate(item: Item): number {
  if (item.material === 'dragon') return 1.0;
  if (item.enchantment >= 8) return 0.5;
  return 1.0;
}

export function computeClaim(
  step: ClaimStep,
  policy: Policy
): { payout: number; remainingCap: number } {
  // Build lookup: itemType → first matching item
  const itemByType = new Map<string, Item>();
  for (const item of policy.items) {
    if (!itemByType.has(item.type)) itemByType.set(item.type, item);
  }

  let totalReimbursement = 0;
  for (const damage of step.incident.damages) {
    const item = itemByType.get(damage.itemType);
    const rate = item ? reimbursementRate(item) : 1.0;
    totalReimbursement += damage.amount * rate;
  }

  let payout = Math.max(0, totalReimbursement - DEDUCTIBLE);
  payout = Math.min(payout, policy.remainingCap);
  payout = Math.floor(payout); // round in MHPCO's favor (pay less)

  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: StepResult[] } {
  const { customer, steps } = scenario;
  const results: StepResult[] = [];
  // policiesByStep[i] is the policy created at step i (null for claim steps)
  const policiesByStep: (Policy | null)[] = [];
  let quoteCount = 0;

  for (const step of steps) {
    if (step.op === 'quote') {
      const { premium, insuranceSum } = computeQuote(step, customer, quoteCount);
      quoteCount++;

      const policy: Policy = {
        insuranceSum,
        remainingCap: insuranceSum * 2,
        items: step.items,
      };
      policiesByStep.push(policy);
      results.push({ premium });
    } else {
      const policy = policiesByStep[step.policy]!;
      policiesByStep.push(null);
      const { payout, remainingCap } = computeClaim(step, policy);
      results.push({ payout, remainingCap });
    }
  }

  return { results };
}
