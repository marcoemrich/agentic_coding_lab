const PROCESSING_FEE = 5;
const COMPONENT_PREMIUM = 25;
const BLOCK_PREMIUM = 60;
const BLOCK_SIZE = 3;

const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

interface Item {
  type: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Customer {
  yearsWithMHPCO: number;
}

function itemBasePremium(item: Item): number {
  if (COMPONENT_TYPES.has(item.type)) return 0;
  return MAIN_ITEM_PREMIUMS[item.type] ?? 0;
}

function itemSurcharges(item: Item): number {
  const base = itemBasePremium(item);
  const cursedSurcharge = item.cursed ? base * CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return cursedSurcharge + enchantmentSurcharge;
}

function computeComponentPremium(items: Item[]): number {
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
  }
  let premium = 0;
  for (const [, count] of componentCounts) {
    premium += count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
  }
  return premium;
}

const DEDUCTIBLE = 100;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;

const LOYALTY_DISCOUNT = 0.2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const LOYALTY_THRESHOLD_YEARS = 2;

function policyModifierRate(customer: Customer, isFollowUp: boolean): number {
  let rate = FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) rate -= LOYALTY_DISCOUNT;
  if (isFollowUp) rate -= FOLLOW_UP_DISCOUNT;
  return rate;
}

function computeQuotePremium(items: Item[], customer: Customer, isFollowUp: boolean): number {
  const policyBasePremium = items.reduce((sum, item) => sum + itemBasePremium(item), 0)
    + computeComponentPremium(items);
  const totalItemSurcharges = items.reduce((sum, item) => sum + itemSurcharges(item), 0);
  const policyModifiers = policyBasePremium * policyModifierRate(customer, isFollowUp);

  return Math.ceil(policyBasePremium + totalItemSurcharges + policyModifiers + PROCESSING_FEE);
}

function insuranceValue(item: Item): number {
  if (COMPONENT_TYPES.has(item.type)) return COMPONENT_INSURANCE_VALUE;
  return INSURANCE_VALUES[item.type] ?? 0;
}

interface Policy {
  items: Item[];
  cap: number;
  remainingCap: number;
}

interface Incident {
  cause: string;
  damages: Array<{ itemType: string; amount: number }>;
}

interface Step {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: Incident;
}

function computePolicyCap(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValue(item), 0) * 2;
}

function processClaim(policy: Policy, incident: Incident): { payout: number; remainingCap: number } {
  let payout = 0;
  for (const damage of incident.damages) {
    payout += damage.amount - DEDUCTIBLE;
  }
  if (payout > policy.remainingCap) payout = policy.remainingCap;
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: { customer: Customer; steps: Step[] }): { results: unknown[] } {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const items = step.items ?? [];
      const isFollowUp = quoteCount > 0;
      quoteCount++;
      const cap = computePolicyCap(items);
      policies.set(index, { items, cap, remainingCap: cap });
      return { premium: computeQuotePremium(items, scenario.customer, isFollowUp) };
    }
    if (step.op === "claim") {
      const policy = policies.get(step.policy!)!;
      return processClaim(policy, step.incident!);
    }
    return {};
  });
  return { results };
}
