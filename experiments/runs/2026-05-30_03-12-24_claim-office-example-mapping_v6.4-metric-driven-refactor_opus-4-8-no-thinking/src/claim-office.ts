interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Incident {
  cause: string;
  damages: Damage[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

type Step = QuoteStep | ClaimStep;

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const MAIN_ITEM_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;
const ROUNDING_PRECISION = 6;

const roundTo = (value: number, direction: "up" | "down"): number => {
  const fixed = Number(value.toFixed(ROUNDING_PRECISION));
  return direction === "up" ? Math.ceil(fixed) : Math.floor(fixed);
};

const componentBasePremium = (count: number): number => {
  if (count === BLOCK_SIZE) return BLOCK_PREMIUM;
  return count * COMPONENT_PREMIUM;
};

const COMPONENT_TYPES = ["rune", "moonstone"];

const KNOWN_TYPES = [...Object.keys(MAIN_ITEM_PREMIUM), ...COMPONENT_TYPES];

const validateKnownTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!KNOWN_TYPES.includes(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
};

const tally = (types: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const type of types) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

const countComponentsByType = (items: Item[]): Map<string, number> =>
  tally(
    items.map((item) => item.type).filter((type) => COMPONENT_TYPES.includes(type)),
  );

const componentsBasePremium = (items: Item[]): number => {
  const counts = [...countComponentsByType(items).values()];
  return counts.reduce((total, count) => total + componentBasePremium(count), 0);
};

const itemBasePremium = (item: Item): number => MAIN_ITEM_PREMIUM[item.type] ?? 0;

const mainItemsBasePremium = (items: Item[]): number =>
  items.reduce((total, item) => total + itemBasePremium(item), 0);

const policyBasePremium = (items: Item[]): number =>
  mainItemsBasePremium(items) + componentsBasePremium(items);

const isHighEnchantment = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const surchargeWhen = (applies: boolean, rate: number, base: number): number =>
  applies ? rate * base : 0;

const itemSurcharge = (item: Item): number => {
  const base = itemBasePremium(item);
  return (
    surchargeWhen(item.cursed === true, CURSE_SURCHARGE_RATE, base) +
    surchargeWhen(isHighEnchantment(item), HIGH_ENCHANTMENT_SURCHARGE_RATE, base)
  );
};

const itemSurcharges = (items: Item[]): number =>
  items.reduce((total, item) => total + itemSurcharge(item), 0);

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const loyaltyDiscount = (base: number, customer: Customer): number =>
  isLoyalCustomer(customer) ? base * LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscount = (base: number, isFollowUp: boolean): number =>
  isFollowUp ? base * FOLLOWUP_DISCOUNT_RATE : 0;

const quotePremium = (
  items: Item[],
  customer: Customer,
  isFollowUp: boolean,
): number => {
  validateKnownTypes(items);
  const base = policyBasePremium(items);
  const firstInsurance = base * FIRST_INSURANCE_SURCHARGE_RATE;
  const total =
    base +
    itemSurcharges(items) +
    firstInsurance -
    loyaltyDiscount(base, customer) -
    followUpDiscount(base, isFollowUp) +
    PROCESSING_FEE;
  return roundTo(total, "up");
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((total, item) => total + (INSURANCE_VALUE[item.type] ?? 0), 0);

const reimbursement = (amount: number, insuredItem: Item): number =>
  (insuredItem.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
    ? HIGH_ENCHANTMENT_PAYOUT_RATE * amount
    : amount;

const damagePayout = (damage: Damage, insuredItem: Item): number =>
  reimbursement(damage.amount, insuredItem) - DEDUCTIBLE;

const payoutForDamage = (damage: Damage, items: Item[]): number => {
  const insuredItem = items.find((item) => item.type === damage.itemType) as Item;
  return damagePayout(damage, insuredItem);
};

const incidentPayout = (incident: Incident, items: Item[]): number =>
  incident.damages.reduce(
    (total, damage) => total + payoutForDamage(damage, items),
    0,
  );

const initialCap = (items: Item[]): number =>
  CAP_MULTIPLIER * insuranceSum(items);

const validateDamageAmounts = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error("damage amount must not be negative");
    }
  }
};

const validateDamageCounts = (incident: Incident, items: Item[]): void => {
  const insured = tally(items.map((item) => item.type));
  const damaged = tally(incident.damages.map((damage) => damage.itemType));
  for (const [type, count] of damaged) {
    if (count > (insured.get(type) ?? 0)) {
      throw new Error(`claim references more ${type} than insured`);
    }
  }
};

const validateClaim = (incident: Incident, items: Item[]): void => {
  validateDamageAmounts(incident);
  validateDamageCounts(incident, items);
};

const claimResult = (
  step: ClaimStep,
  scenario: Scenario,
  remainingCapByPolicy: Map<number, number>,
): { payout: number; remainingCap: number } => {
  const policy = scenario.steps[step.policy] as QuoteStep;
  validateClaim(step.incident, policy.items);
  const remainingCap =
    remainingCapByPolicy.get(step.policy) ?? initialCap(policy.items);
  const rawPayout = incidentPayout(step.incident, policy.items);
  const payout = roundTo(Math.min(rawPayout, remainingCap), "down");
  const newRemainingCap = remainingCap - payout;
  remainingCapByPolicy.set(step.policy, newRemainingCap);
  return { payout, remainingCap: newRemainingCap };
};

export const runScenario = (scenario: Scenario): { results: unknown[] } => {
  let quoteCount = 0;
  const remainingCapByPolicy = new Map<number, number>();
  const results = scenario.steps.map((step) => {
    if (step.op === "claim") {
      return claimResult(step, scenario, remainingCapByPolicy);
    }
    const isFollowUp = quoteCount > 0;
    quoteCount += 1;
    return { premium: quotePremium(step.items, scenario.customer, isFollowUp) };
  });
  return { results };
};
