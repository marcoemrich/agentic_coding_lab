// Core domain types and logic for the MHPCO claim office.

export type ItemType = 'sword' | 'amulet' | 'staff' | 'potion' | 'rune' | 'moonstone';

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export type Step =
  | { op: 'quote'; items: Item[] }
  | { op: 'claim'; policy: number; incident: Incident };

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export interface ScenarioResult {
  results: StepResult[];
}

interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
  isComponent: boolean;
}

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword:     { insuranceValue: 1000, basePremium: 100, isComponent: false },
  amulet:    { insuranceValue: 600,  basePremium: 60,  isComponent: false },
  staff:     { insuranceValue: 800,  basePremium: 80,  isComponent: false },
  potion:    { insuranceValue: 400,  basePremium: 40,  isComponent: false },
  rune:      { insuranceValue: 250,  basePremium: 25,  isComponent: true  },
  moonstone: { insuranceValue: 250,  basePremium: 25,  isComponent: true  },
};

const COMPONENT_BLOCK_BASE_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;

function priceFor(type: string): PriceListEntry {
  const entry = PRICE_LIST[type];
  if (!entry) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return entry;
}

function isComponent(type: string): boolean {
  return priceFor(type).isComponent;
}

function itemInsuranceValue(item: Item): number {
  return priceFor(item.type).insuranceValue;
}

function policyInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

function itemBasePremium(item: Item): number {
  return priceFor(item.type).basePremium;
}

// Compute total base premium for items, applying the block discount for
// components: each group of exactly 3 alike components is one block at 60 G;
// remaining components are billed at 25 G each.
function itemsBasePremium(items: Item[]): number {
  const componentCounts: Record<string, number> = {};
  let total = 0;

  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      total += itemBasePremium(item);
    }
  }

  for (const type in componentCounts) {
    const count = componentCounts[type];
    if (count === COMPONENT_BLOCK_SIZE) {
      total += COMPONENT_BLOCK_BASE_PREMIUM;
    } else {
      total += count * priceFor(type).basePremium;
    }
  }

  return total;
}

function itemSurcharge(item: Item): number {
  const base = itemBasePremium(item);
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * 0.5;
  }
  if ((item.enchantment ?? 0) >= 5) {
    surcharge += base * 0.3;
  }
  return surcharge;
}

function itemsSurcharge(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemSurcharge(item), 0);
}

// First-insurance is applied per item against the item's own base premium
// (the un-blocked price), per the integration note in the spec: each item
// in a quote is treated as a first insurance regardless of customer history.
function firstInsuranceSurcharge(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemBasePremium(item) * 0.1, 0);
}

export function computePremium(
  customer: Customer,
  items: Item[],
  isFollowUp: boolean,
): number {
  // priceFor (called transitively below) throws on unknown types.
  const policyBase = itemsBasePremium(items);
  const itemSurcharges = itemsSurcharge(items);

  // Item base + item-specific surcharges form the per-item subtotal.
  // Loyalty and follow-up discounts are policy-wide on policyBase.
  let total = policyBase + itemSurcharges + firstInsuranceSurcharge(items);

  if (customer.yearsWithMHPCO >= 2) {
    total -= policyBase * 0.2;
  }
  if (isFollowUp) {
    total -= policyBase * 0.15;
  }

  total += PROCESSING_FEE;
  return Math.ceil(total);
}

function makePolicy(items: Item[]): Policy {
  const insuranceSum = policyInsuranceSum(items);
  return {
    items: [...items],
    insuranceSum,
    remainingCap: insuranceSum * 2,
  };
}

function damageReimbursement(item: Item, amount: number): number {
  const highEnchant = (item.enchantment ?? 0) >= 8;
  if (highEnchant) {
    return amount * 0.5;
  }
  return amount;
}

// Match each damage entry to a covered item, consuming items in order so
// that N damages of the same type require at least N items of that type.
function matchDamagesToItems(
  policyItems: Item[],
  damages: Damage[],
): { item: Item; amount: number }[] {
  const available: Record<string, Item[]> = {};
  for (const item of policyItems) {
    (available[item.type] ??= []).push(item);
  }

  const consumed: Record<string, number> = {};
  return damages.map((dmg) => {
    priceFor(dmg.itemType); // validate type
    const pool = available[dmg.itemType] ?? [];
    const used = consumed[dmg.itemType] ?? 0;
    if (used >= pool.length) {
      throw new Error(`Damage references item not in policy: ${dmg.itemType}`);
    }
    consumed[dmg.itemType] = used + 1;
    return { item: pool[used], amount: dmg.amount };
  });
}

export function computeClaim(
  policy: Policy,
  incident: Incident,
): { payout: number; remainingCap: number } {
  if (incident.damages.some((d) => d.amount < 0)) {
    throw new Error('Negative damage amount');
  }

  const matched = matchDamagesToItems(policy.items, incident.damages);

  const totalPayout = matched.reduce((sum, { item, amount }) => {
    const reimbursed = damageReimbursement(item, amount);
    return sum + Math.max(0, reimbursed - DEDUCTIBLE);
  }, 0);

  const payout = Math.min(Math.floor(totalPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  // Policies are keyed by the step index of the quote that created them,
  // so later claim steps can look them up via their `policy` field.
  const policiesByStepIndex = new Map<number, Policy>();
  let quoteCount = 0;

  return {
    results: scenario.steps.map((step, stepIndex) => {
      if (step.op === 'quote') {
        const isFollowUp = quoteCount > 0;
        quoteCount += 1;
        policiesByStepIndex.set(stepIndex, makePolicy(step.items));
        return { premium: computePremium(scenario.customer, step.items, isFollowUp) };
      }
      if (step.op === 'claim') {
        const policy = policiesByStepIndex.get(step.policy);
        if (!policy) {
          throw new Error(`Claim references nonexistent policy: ${step.policy}`);
        }
        return computeClaim(policy, step.incident);
      }
      throw new Error(`Unknown op`);
    }),
  };
}
