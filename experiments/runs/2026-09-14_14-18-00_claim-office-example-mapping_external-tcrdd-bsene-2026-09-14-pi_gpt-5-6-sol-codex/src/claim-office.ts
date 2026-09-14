/* eslint-disable no-magic-numbers -- MHPCO's published rates and price list */
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: 'quote'; items: Item[] } | ClaimStep>;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface StepResult {
  premium?: number;
  payout?: number;
  remainingCap?: number;
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};
const COMPONENT_TYPES = ['rune', 'moonstone'];

function basePremium(items: Item[]): number {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) throw new Error(`Unknown item type: ${item.type}`);
  }
  const regularPrice = items.reduce((total, item) => total + BASE_PREMIUMS[item.type]!, 0);
  const blockDiscount = COMPONENT_TYPES.reduce((discount, component) =>
    discount + (items.filter(item => item.type === component).length === 3 ? 15 : 0), 0);
  return regularPrice - blockDiscount;
}

function riskSurcharge(items: Item[]): number {
  return items.reduce((total, item) => {
    const rate = (item.cursed ? 50 : 0) + ((item.enchantment ?? 0) >= 5 ? 30 : 0);
    return total + BASE_PREMIUMS[item.type]! * rate;
  }, 0);
}

function quotePremium(items: Item[], yearsWithMHPCO: number, followUp: boolean): number {
  const base = basePremium(items);
  const policyRate = 110 - (yearsWithMHPCO >= 2 ? 20 : 0) - (followUp ? 15 : 0);
  return Math.ceil((base * policyRate + riskSurcharge(items)) / 100 + 5);
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((total, item) => total + INSURANCE_VALUES[item.type]!, 0);
  return { items, remainingCap: insuranceSum * 2 };
}

function desiredPayout(policy: Policy, damages: Damage[]): number {
  const availableItems = [...policy.items];
  return damages.reduce((total, damage) => {
    if (damage.amount < 0) throw new Error('Damage amount cannot be negative');
    const itemIndex = availableItems.findIndex(item => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Item ${damage.itemType} is not insured by this policy`);
    const [item] = availableItems.splice(itemIndex, 1);
    const reimbursementRate = (item?.enchantment ?? 0) >= 8 ? 0.5 : 1;
    return total + Math.max(0, damage.amount * reimbursementRate - 100);
  }, 0);
}

function processClaim(policy: Policy, damages: Damage[]): StepResult {
  const payout = Math.floor(Math.min(desiredPayout(policy, damages), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: StepResult[] } {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === 'quote') {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
      quoteCount += 1;
      policies.set(stepIndex, createPolicy(step.items));
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Policy ${step.policy} does not reference an earlier quote`);
    return processClaim(policy, step.incident.damages);
  });
  return { results };
}
