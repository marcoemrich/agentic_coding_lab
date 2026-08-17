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

export interface ScenarioResults {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

function priceListEntryOf(type: string): PriceListEntry {
  const entry = PRICE_LIST[type];
  if (entry === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }

  return entry;
}

function basePremiumOf(type: string): number {
  return priceListEntryOf(type).basePremium;
}

function insuranceValueOf(type: string): number {
  return priceListEntryOf(type).insuranceValue;
}

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }

  return counts;
}

function componentGroupBasePremium(type: string, count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }

  return count * basePremiumOf(type);
}

function basePremium(items: Item[]): number {
  const mainItems = items.filter((item) => !COMPONENT_TYPES.has(item.type));
  const components = items.filter((item) => COMPONENT_TYPES.has(item.type));

  let total = mainItems.reduce((sum, item) => sum + basePremiumOf(item.type), 0);
  for (const [type, count] of countByType(components)) {
    total += componentGroupBasePremium(type, count);
  }

  return total;
}

function itemSurchargeRate(item: Item): number {
  let rate = 0;
  if (item.cursed === true) {
    rate += CURSE_SURCHARGE_RATE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    rate += HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }

  return rate;
}

function itemSurcharges(items: Item[]): number {
  return items.reduce(
    (sum, item) => sum + basePremiumOf(item.type) * itemSurchargeRate(item),
    0,
  );
}

function policyModifierRate(customer: Customer, previousContracts: number): number {
  let rate = FIRST_INSURANCE_SURCHARGE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    rate -= LOYALTY_DISCOUNT_RATE;
  }
  if (previousContracts > 0) {
    rate -= FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
  }

  return rate;
}

function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  const policyBasePremium = basePremium(items);
  const policyModifiers = policyBasePremium * policyModifierRate(customer, previousContracts);

  return Math.ceil(policyBasePremium + itemSurcharges(items) + policyModifiers + PROCESSING_FEE);
}

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const REDUCED_REIMBURSEMENT_ENCHANTMENT = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueOf(item.type), 0);
}

function reimbursementRate(item: Item): number {
  if ((item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT) {
    return REDUCED_REIMBURSEMENT_RATE;
  }

  return FULL_REIMBURSEMENT_RATE;
}

function damagePayout(damage: Damage, item: Item): number {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${String(damage.amount)}`);
  }

  return Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);
}

function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  const uninjured = [...policy.items];
  const desired = incident.damages.reduce((sum, damage) => {
    const index = uninjured.findIndex((candidate) => candidate.type === damage.itemType);
    if (index === -1) {
      throw new Error(`Item not covered by the policy: ${damage.itemType}`);
    }
    const [item] = uninjured.splice(index, 1);

    return sum + damagePayout(damage, item);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResults {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let contracts = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (policy === undefined) {
        throw new Error(`No policy created by step ${String(step.policy)}`);
      }
      results.push(settleClaim(policy, step.incident));

      return;
    }

    results.push({ premium: quotePremium(step.items, scenario.customer, contracts) });
    policies.set(index, {
      items: step.items,
      remainingCap: insuranceSum(step.items) * CAP_FACTOR,
    });
    contracts += 1;
  });

  return { results };
}
