export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const DEDUCTIBLE = 100;
const REIMBURSE_LEVEL = 8;
const REIMBURSE_RATIO = 0.5;
const CAP_MULTIPLIER = 2;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

interface Policy {
  items: Item[];
  counts: Map<string, number>;
  remainingCap: number;
}

export interface ScenarioResult {
  results: Array<{ premium: number } | { payout: number; remainingCap: number }>;
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  const results: ScenarioResult["results"] = [];
  let quoteIndex = 0;

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      validateItems(step.items);
      const policy = createPolicy(step.items);
      policies.set(results.length, policy);
      const premium = computePremium(step.items, scenario.customer, quoteIndex > 0);
      results.push({ premium });
      quoteIndex += 1;
    } else {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`No policy at step ${step.policy}`);
      const { payout, remainingCap } = processClaim(policy, step.incident.damages);
      results.push({ payout, remainingCap });
    }
  }

  return { results };
}

function createPolicy(items: Item[]): Policy {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  const insuranceSum = sumValues(items, INSURANCE_VALUES);
  return { items, counts, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function computePremium(items: Item[], customer: Customer, isFollowUp: boolean): number {
  const base = computeBasePremium(items);
  const itemSurcharges = sumItems(items, (item) => itemSurcharge(item));
  const policyModifiers =
    (customer.yearsWithMHPCO >= LOYALTY_YEARS ? -LOYALTY_DISCOUNT : 0) +
    FIRST_INSURANCE_SURCHARGE +
    (isFollowUp ? -FOLLOW_UP_DISCOUNT : 0);
  const total = base + itemSurcharges + policyModifiers * base + PROCESSING_FEE;
  return Math.ceil(total);
}

function itemSurcharge(item: Item): number {
  const own = BASE_PREMIUMS[item.type] ?? 0;
  let surcharge = 0;
  if (item.cursed) surcharge += own * CURSED_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) surcharge += own * HIGH_ENCHANTMENT_SURCHARGE;
  return surcharge;
}

function computeBasePremium(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  let total = 0;
  for (const [type, count] of counts) {
    if (COMPONENT_TYPES.has(type) && count === BLOCK_SIZE) {
      total += BLOCK_BASE_PREMIUM;
    } else {
      total += (BASE_PREMIUMS[type] ?? 0) * count;
    }
  }
  return total;
}

function sumValues(items: Item[], values: Record<string, number>): number {
  return items.reduce((sum, item) => sum + (values[item.type] ?? 0), 0);
}

function sumItems(items: Item[], mapper: (item: Item) => number): number {
  return items.reduce((sum, item) => sum + mapper(item), 0);
}

function validateItems(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) throw new Error(`Unknown item type: ${item.type}`);
  }
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  validateDamages(policy.counts, damages);
  const desired = sumIncome(damages, policy);
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function sumIncome(damages: Damage[], policy: Policy): number {
  let total = 0;
  for (const damage of damages) {
    const item = policy.items.find((i) => i.type === damage.itemType);
    const ratio = (item?.enchantment ?? 0) >= REIMBURSE_LEVEL ? REIMBURSE_RATIO : 1;
    total += damage.amount * ratio - DEDUCTIBLE;
  }
  return total;
}

function validateDamages(counts: Map<string, number>, damages: Damage[]): void {
  const damageCounts = new Map<string, number>();
  for (const damage of damages) {
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
    if (!counts.has(damage.itemType)) throw new Error(`Item type not in policy: ${damage.itemType}`);
    damageCounts.set(damage.itemType, (damageCounts.get(damage.itemType) ?? 0) + 1);
  }
  for (const [type, count] of damageCounts) {
    if ((counts.get(type) ?? 0) < count) throw new Error(`More damages of ${type} than insured`);
  }
}