// MHPCO Claim Office - implementation (stubs; filled in during Green phases)

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const BASE_PREMIUMS: Record<string, number> = {
  // Main items
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  // Components
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function sumByType(items: Item[], values: Record<string, number>): number {
  return items.reduce((total, item) => total + values[item.type], 0);
}

function groupByType(items: Item[]): Map<string, Item[]> {
  const byType = new Map<string, Item[]>();
  for (const item of items) {
    const bucket = byType.get(item.type) ?? [];
    bucket.push(item);
    byType.set(item.type, bucket);
  }
  return byType;
}

function componentPremium(components: Item[]): number {
  let total = 0;
  for (const [type, bucket] of groupByType(components)) {
    const count = bucket.length;
    total += count === BLOCK_SIZE ? BLOCK_PREMIUM : count * BASE_PREMIUMS[type];
  }
  return total;
}

function partitionByComponent(items: Item[]): {
  components: Item[];
  mainItems: Item[];
} {
  const components: Item[] = [];
  const mainItems: Item[] = [];
  for (const item of items) {
    (COMPONENT_TYPES.has(item.type) ? components : mainItems).push(item);
  }
  return { components, mainItems };
}

export function basePremium(items: Item[]): number {
  const { components, mainItems } = partitionByComponent(items);
  return sumByType(mainItems, BASE_PREMIUMS) + componentPremium(components);
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const KNOWN_TYPES = new Set(Object.keys(BASE_PREMIUMS));

function validateItemTypes(items: Item[]): void {
  const unknown = items.find((item) => !KNOWN_TYPES.has(item.type));
  if (unknown) {
    throw new Error(`Unknown item type: ${unknown.type}`);
  }
}

export function insuranceSum(items: Item[]): number {
  return sumByType(items, INSURANCE_VALUES);
}

const PROCESSING_FEE = 5;
const CURSE_SURCHARGE_RATE = 0.5;
const FIRST_INSURANCE_RATE = 0.1;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function itemBasePremium(item: Item): number {
  return basePremium([item]);
}

// Sums `rate` of each qualifying item's base premium.
function perItemSurcharge(
  items: Item[],
  qualifies: (item: Item) => boolean,
  rate: number,
): number {
  return items.reduce(
    (total, item) =>
      qualifies(item) ? total + itemBasePremium(item) * rate : total,
    0,
  );
}

const isCursed = (item: Item): boolean => item.cursed === true;

const enchantmentAtLeast = (item: Item, threshold: number): boolean =>
  (item.enchantment ?? 0) >= threshold;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentAtLeast(item, HIGH_ENCHANTMENT_THRESHOLD);

function curseSurcharge(items: Item[]): number {
  return perItemSurcharge(items, isCursed, CURSE_SURCHARGE_RATE);
}

function highEnchantmentSurcharge(items: Item[]): number {
  return perItemSurcharge(items, isHighlyEnchanted, HIGH_ENCHANTMENT_RATE);
}

export function quotePremium(
  items: Item[],
  yearsWithMHPCO: number,
  isFollowUp: boolean,
): number {
  const policyBase = basePremium(items);
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_RATE;
  const loyaltyDiscount =
    yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
      ? policyBase * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscount = isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;

  return roundPremium(
    policyBase +
      curseSurcharge(items) +
      highEnchantmentSurcharge(items) +
      firstInsuranceSurcharge -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE,
  );
}

// Premiums always round up (in the MHPCO's favor).
export function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

// Payouts always round down (in the MHPCO's favor).
export function roundPayout(amount: number): number {
  return Math.floor(amount);
}

interface Customer {
  yearsWithMHPCO: number;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
}

type Step = QuoteStep | ClaimStep;

// Input arrives as untyped JSON; callers may pass loosely-typed step objects.
type ScenarioInput = {
  customer: Customer;
  steps: readonly ({ op: string } & Record<string, unknown>)[];
};

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

interface Policy {
  items: Item[];
  remainingCap: number;
}

function reimbursedAmount(item: Item, damageAmount: number): number {
  if (enchantmentAtLeast(item, HIGH_ENCHANTMENT_PAYOUT_THRESHOLD)) {
    return damageAmount * HIGH_ENCHANTMENT_PAYOUT_RATE;
  }
  return damageAmount;
}

function damagePayout(item: Item, damage: Damage): number {
  if (damage.amount < 0) {
    throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
  }
  const reimbursed = reimbursedAmount(item, damage.amount);
  return roundPayout(Math.max(0, reimbursed - DEDUCTIBLE));
}

function totalDamagePayout(policy: Policy, damages: Damage[]): number {
  const availableByType = groupByType(policy.items);

  return damages.reduce((total, damage) => {
    const item = availableByType.get(damage.itemType)?.pop();
    if (!item) {
      throw new Error(`Item not covered by policy: ${damage.itemType}`);
    }
    return total + damagePayout(item, damage);
  }, 0);
}

function processClaim(policy: Policy, step: ClaimStep): ClaimResult {
  const grossPayout = totalDamagePayout(policy, step.incident.damages);
  const payout = Math.min(grossPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: ScenarioInput): {
  results: (QuoteResult | ClaimResult)[];
} {
  const { customer, steps } = scenario;
  const policies: Policy[] = [];
  let quoteCount = 0;

  const results = (steps as unknown as Step[]).map((step) => {
    if (step.op === "quote") {
      validateItemTypes(step.items);
      const premium = quotePremium(
        step.items,
        customer.yearsWithMHPCO,
        quoteCount > 0,
      );
      quoteCount += 1;
      policies.push({
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
      });
      return { premium };
    }
    return processClaim(policies[step.policy], step);
  });

  return { results };
}