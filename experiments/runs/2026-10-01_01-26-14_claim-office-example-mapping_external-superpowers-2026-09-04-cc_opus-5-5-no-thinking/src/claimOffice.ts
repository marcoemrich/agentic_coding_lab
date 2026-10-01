export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Customer = { yearsWithMHPCO: number };

export type Damage = { itemType: string; amount: number };

export type Step =
  | { op: 'quote'; items: Item[] }
  | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };

export type Scenario = { customer: Customer; steps: Step[] };

export type Result = { premium: number } | { payout: number; remainingCap: number };

type Policy = { items: Item[]; remainingCap: number };

// --- Price list ---------------------------------------------------------

const MAIN_ITEMS: Record<string, { value: number; basePremium: number }> = {
  sword: { value: 1000, basePremium: 100 },
  amulet: { value: 600, basePremium: 60 },
  staff: { value: 800, basePremium: 80 },
  potion: { value: 400, basePremium: 40 },
};

const COMPONENT_TYPES = ['rune', 'moonstone'];
const COMPONENT_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const isComponent = (item: Item) => COMPONENT_TYPES.includes(item.type);

function mainItem(type: string) {
  const entry = MAIN_ITEMS[type];
  if (!entry) throw new Error(`Unknown item type: ${type}`);
  return entry;
}

function insuranceValue(item: Item): number {
  return isComponent(item) ? COMPONENT_VALUE : mainItem(item.type).value;
}

// --- Quote --------------------------------------------------------------

const PROCESSING_FEE = 5;
// Amounts are tracked in hundredths of a G (G x percent) so intermediate fractions stay exact.
const HUNDREDTHS_PER_G = 100;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

function componentsBasePremium(components: Item[]): number {
  const counts = new Map<string, number>();
  for (const c of components) counts.set(c.type, (counts.get(c.type) ?? 0) + 1);
  let sum = 0;
  for (const count of counts.values()) {
    sum += count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_BASE_PREMIUM;
  }
  return sum;
}

function itemSurchargePercent(item: Item): number {
  let percent = 0;
  if (item.cursed) percent += CURSE_SURCHARGE_PERCENT;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) percent += HIGH_ENCHANTMENT_SURCHARGE_PERCENT;
  return percent;
}

function policySurchargePercent(customer: Customer, isFollowUp: boolean): number {
  let percent = FIRST_INSURANCE_SURCHARGE_PERCENT;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) percent -= LOYALTY_DISCOUNT_PERCENT;
  if (isFollowUp) percent -= FOLLOW_UP_DISCOUNT_PERCENT;
  return percent;
}

function quotePremium(items: Item[], customer: Customer, isFollowUp: boolean): number {
  const mainItems = items.filter((item) => !isComponent(item));
  const policyBase =
    mainItems.reduce((sum, item) => sum + mainItem(item.type).basePremium, 0) +
    componentsBasePremium(items.filter(isComponent));
  const itemSurcharges = mainItems.reduce(
    (sum, item) => sum + mainItem(item.type).basePremium * itemSurchargePercent(item),
    0,
  );
  const policySurcharge = policyBase * policySurchargePercent(customer, isFollowUp);
  const totalHundredths =
    (policyBase + PROCESSING_FEE) * HUNDREDTHS_PER_G + itemSurcharges + policySurcharge;
  return Math.ceil(totalHundredths / HUNDREDTHS_PER_G);
}

// --- Claim --------------------------------------------------------------

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const REDUCED_REIMBURSEMENT_ENCHANTMENT = 8;
const REDUCED_REIMBURSEMENT_FACTOR = 0.5;

function reimbursable(item: Item, amount: number): number {
  const reduced = (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT;
  return Math.max(0, (reduced ? amount * REDUCED_REIMBURSEMENT_FACTOR : amount) - DEDUCTIBLE);
}

function processClaim(policy: Policy, damages: Damage[]): Result {
  const unclaimed = [...policy.items];
  const desired = damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error(`Invalid damage amount: ${damage.amount}`);
    const index = unclaimed.findIndex((item) => item.type === damage.itemType);
    if (index === -1) throw new Error(`Damaged item is not (or not often enough) covered by the policy: ${damage.itemType}`);
    const [item] = unclaimed.splice(index, 1);
    return sum + reimbursable(item, damage.amount);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

// --- Scenario -----------------------------------------------------------

export function runScenario(scenario: Scenario): { results: Result[] } {
  let contracts = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`No policy was created by step ${step.policy}`);
      return processClaim(policy, step.incident.damages);
    }
    const premium = quotePremium(step.items, scenario.customer, contracts++ > 0);
    const insuranceSum = step.items.reduce((sum, item) => sum + insuranceValue(item), 0);
    policies.set(index, { items: step.items, remainingCap: CAP_FACTOR * insuranceSum });
    return { premium };
  });
  return { results };
}
