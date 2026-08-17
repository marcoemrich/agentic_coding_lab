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

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
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

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE_PER_DAMAGE = 100;
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function basePremiumFor(type: string): number {
  const basePremium = BASE_PREMIUMS[type];
  if (basePremium === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return basePremium;
}

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function componentsBasePremium(components: Item[]): number {
  let total = 0;
  for (const [type, count] of countByType(components)) {
    total += count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * basePremiumFor(type);
  }
  return total;
}

function basePremiumOf(items: Item[]): number {
  const mainItems = items.filter((item) => !isComponent(item));
  const mainTotal = mainItems.reduce((total, item) => total + basePremiumFor(item.type), 0);
  return mainTotal + componentsBasePremium(items.filter(isComponent));
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function surchargeRateFor(item: Item): number {
  const curseRate = item.cursed === true ? CURSE_SURCHARGE_RATE : 0;
  const enchantmentRate = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return curseRate + enchantmentRate;
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((total, item) => total + basePremiumFor(item.type) * surchargeRateFor(item), 0);
}

function roundPremiumInFavourOfMHPCO(amount: number): number {
  return Math.ceil(amount);
}

function roundPayoutInFavourOfMHPCO(amount: number): number {
  return Math.floor(amount);
}

function policyModifierRate(customer: Customer, previousContracts: number): number {
  const loyaltyRate =
    customer.yearsWithMHPCO >= LOYALTY_YEARS ? -LOYALTY_DISCOUNT_RATE : 0;
  const followUpRate = previousContracts > 0 ? -FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0;
  return FIRST_INSURANCE_SURCHARGE_RATE + loyaltyRate + followUpRate;
}

function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  const basePremium = basePremiumOf(items);
  return roundPremiumInFavourOfMHPCO(
    basePremium +
      itemSurcharges(items) +
      basePremium * policyModifierRate(customer, previousContracts) +
      PROCESSING_FEE,
  );
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceSumOf(items: Item[]): number {
  return items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0);
}

function reimbursementFor(item: Item, amount: number): number {
  const covered =
    (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL
      ? amount * REDUCED_REIMBURSEMENT_RATE
      : amount;
  return Math.max(0, covered - DEDUCTIBLE_PER_DAMAGE);
}

function damagedItemsOf(policy: Policy, damages: Damage[]): Item[] {
  const available = [...policy.items];
  return damages.map((damage) => {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative: ${String(damage.amount)}`);
    }
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`Damaged item is not covered by the policy: ${damage.itemType}`);
    }
    return available.splice(index, 1)[0];
  });
}

function settleClaim(policy: Policy, incident: ClaimStep["incident"]): ClaimResult {
  const damagedItems = damagedItemsOf(policy, incident.damages);
  const desiredPayout = incident.damages.reduce(
    (total, damage, index) => total + reimbursementFor(damagedItems[index], damage.amount),
    0,
  );
  const payout = roundPayoutInFavourOfMHPCO(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  let contractCount = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      return settleClaim(policies.get(step.policy) as Policy, step.incident);
    }
    const premium = quotePremium(step.items, scenario.customer, contractCount);
    contractCount += 1;
    policies.set(index, {
      items: step.items,
      remainingCap: insuranceSumOf(step.items) * CAP_MULTIPLIER,
    });
    return { premium };
  });
}
