export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: (QuoteStep | ClaimStep)[];
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

interface Policy {
  items: Item[];
  remainingCap: number;
}

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5;

const MAIN_ITEMS: Record<string, { value: number; basePremium: number }> = {
  sword: { value: 1000, basePremium: 100 },
  amulet: { value: 600, basePremium: 60 },
  staff: { value: 800, basePremium: 80 },
  potion: { value: 400, basePremium: 40 },
};

const COMPONENT_TYPES = ['rune', 'moonstone'];
const COMPONENT_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function componentGroupPremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

function itemBasePremiums(items: Item[]): number[] {
  return items.map((item) => {
    if (COMPONENT_TYPES.includes(item.type)) {
      const count = items.filter((other) => other.type === item.type).length;
      return componentGroupPremium(count) / count;
    }
    if (!(item.type in MAIN_ITEMS)) throw new Error(`Unknown item type: ${item.type}`);
    return MAIN_ITEMS[item.type].basePremium;
  });
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const bases = itemBasePremiums(items);
  const policyBase = bases.reduce((sum, base) => sum + base, 0);
  const itemSurcharges = items.reduce((sum, item, i) => {
    let rate = 0;
    if (item.cursed) rate += CURSE_SURCHARGE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD) rate += HIGH_ENCHANTMENT_SURCHARGE;
    return sum + bases[i] * rate;
  }, 0);
  const firstInsurance = items.length > 0 ? policyBase * FIRST_INSURANCE_SURCHARGE : 0;
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? policyBase * LOYALTY_DISCOUNT : 0;
  const followUp = isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT : 0;
  return Math.ceil(policyBase + itemSurcharges + firstInsurance - loyalty - followUp + PROCESSING_FEE);
}

function insuranceSum(items: Item[]): number {
  return items.reduce(
    (sum, item) => sum + (COMPONENT_TYPES.includes(item.type) ? COMPONENT_VALUE : MAIN_ITEMS[item.type].value),
    0,
  );
}

function reimbursable(item: Item, amount: number): number {
  const rate = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD ? HIGH_ENCHANTMENT_REIMBURSEMENT : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}

function processClaim(policy: Policy, damages: Damage[]): Result {
  const unclaimed = [...policy.items];
  const desired = damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error(`Invalid damage amount: ${damage.amount}`);
    const index = unclaimed.findIndex((candidate) => candidate.type === damage.itemType);
    if (index < 0) throw new Error(`Damaged item not covered by policy: ${damage.itemType}`);
    const [item] = unclaimed.splice(index, 1);
    return sum + reimbursable(item, damage.amount);
  }, 0);
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const years = scenario.customer.yearsWithMHPCO;
  const policies = new Map<number, Policy>();
  let contracts = 0;
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === 'claim') {
        const policy = policies.get(step.policy);
        if (!policy) throw new Error(`Unknown policy ${step.policy}`);
        return processClaim(policy, step.incident.damages);
      }
      const premium = quotePremium(step.items, years, contracts++ > 0);
      policies.set(index, { items: step.items, remainingCap: insuranceSum(step.items) * CAP_FACTOR });
      return { premium };
    }),
  };
}
