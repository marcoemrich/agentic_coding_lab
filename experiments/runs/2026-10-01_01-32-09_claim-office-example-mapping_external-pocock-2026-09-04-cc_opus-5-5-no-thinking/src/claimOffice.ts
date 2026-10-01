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

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

interface Policy {
  items: Item[];
  remainingCap: number;
}

const PROCESSING_FEE = 5;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;

const MAIN_ITEMS: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
};

const COMPONENTS = new Set(['rune', 'moonstone']);
const COMPONENT_VALUE = 250;
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function componentsPremium(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  let total = 0;
  for (const count of counts.values()) {
    total += count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
  }
  return total;
}

export class InvalidScenarioError extends Error {}

function isKnownType(type: string): boolean {
  return COMPONENTS.has(type) || type in MAIN_ITEMS;
}

function quote(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  for (const item of items) {
    if (!isKnownType(item.type)) throw new InvalidScenarioError(`Unknown item type: ${item.type}`);
  }
  if (items.length === 0) return PROCESSING_FEE;
  const components = items.filter((item) => COMPONENTS.has(item.type));
  let base = componentsPremium(components);
  let surcharges = 0;
  for (const item of items.filter((i) => !COMPONENTS.has(i.type))) {
    const itemBase = MAIN_ITEMS[item.type].premium;
    base += itemBase;
    if (item.cursed) surcharges += itemBase * CURSE_SURCHARGE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) surcharges += itemBase * HIGH_ENCHANTMENT_SURCHARGE;
  }
  let policyModifiers = base * FIRST_INSURANCE_SURCHARGE;
  if (yearsWithMHPCO >= LOYALTY_YEARS) policyModifiers -= base * LOYALTY_DISCOUNT;
  if (isFollowUp) policyModifiers -= base * FOLLOW_UP_DISCOUNT;
  return Math.ceil(base + surcharges + policyModifiers + PROCESSING_FEE);
}

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

function insuranceValue(item: Item): number {
  return COMPONENTS.has(item.type) ? COMPONENT_VALUE : MAIN_ITEMS[item.type].value;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValue(item), 0);
}

function reimbursable(item: Item, amount: number): number {
  if ((item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL) return amount * REDUCED_REIMBURSEMENT_RATE;
  return amount;
}

function claim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const used = new Map<string, number>();
  let desired = 0;
  for (const damage of damages) {
    if (damage.amount < 0) throw new InvalidScenarioError(`Negative damage amount: ${damage.amount}`);
    const nth = used.get(damage.itemType) ?? 0;
    used.set(damage.itemType, nth + 1);
    const item = policy.items.filter((i) => i.type === damage.itemType)[nth];
    if (!item) throw new InvalidScenarioError(`Damaged item not covered by policy: ${damage.itemType}`);
    desired += Math.max(0, reimbursable(item, damage.amount) - DEDUCTIBLE);
  }
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  let contracts = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new InvalidScenarioError(`No policy created at step ${step.policy}`);
      return claim(policy, step.incident.damages);
    }
    const premium = quote(step.items, scenario.customer.yearsWithMHPCO, contracts > 0);
    contracts++;
    policies.set(index, { items: step.items, remainingCap: CAP_FACTOR * insuranceSum(step.items) });
    return { premium };
  });
  return { results };
}
