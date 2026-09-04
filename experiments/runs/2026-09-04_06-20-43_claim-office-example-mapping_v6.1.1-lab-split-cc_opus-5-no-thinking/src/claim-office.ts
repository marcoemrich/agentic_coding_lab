export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type Step = QuoteStep | ClaimStep;

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;

const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;
const CAP_MULTIPLE = 2;
const ALIKE_ITEMS_PER_BLOCK = 3;
const BLOCK_BASE_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const SURCHARGE_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const raise = (message: string): never => {
  throw new Error(message);
};

const sum = (amounts: number[]): number =>
  amounts.reduce((total, amount) => total + amount, 0);

const groupByType = (items: Item[]): Item[][] => {
  const itemsByType = new Map<string, Item[]>();

  for (const item of items) {
    const alikeItems = itemsByType.get(item.type);
    if (alikeItems) alikeItems.push(item);
    else itemsByType.set(item.type, [item]);
  }

  return [...itemsByType.values()];
};

// Both catalogues are keyed by item type and must reject an unknown type the
// same way — a silent miss would turn into NaN further downstream.
const lookupByItemType = (catalogue: Record<string, number>, item: Item): number =>
  catalogue[item.type] ?? raise(`unknown item type: ${item.type}`);

const basePremiumOf = (item: Item): number =>
  lookupByItemType(BASE_PREMIUM_BY_ITEM_TYPE, item);

const basePremiumOfAlikeItems = (alikeItems: Item[]): number =>
  alikeItems.length === ALIKE_ITEMS_PER_BLOCK
    ? BLOCK_BASE_PREMIUM
    : sum(alikeItems.map(basePremiumOf));

const curseSurchargeOf = (item: Item): number =>
  item.cursed ? basePremiumOf(item) * CURSE_SURCHARGE_RATE : 0;

const highEnchantmentSurchargeOf = (item: Item): number =>
  (item.enchantment ?? 0) >= SURCHARGE_ENCHANTMENT_LEVEL
    ? basePremiumOf(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;

const itemSurchargesOf = (item: Item): number =>
  curseSurchargeOf(item) + highEnchantmentSurchargeOf(item);

// Policy-wide adjustments are rates on the base premium: surcharges are
// positive, discounts negative. Each applies only when its condition holds.
const policyAdjustmentRatesOf = (customer: Customer, isFollowUpQuote: boolean): number[] => [
  FIRST_INSURANCE_SURCHARGE_RATE,
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? -LOYALTY_DISCOUNT_RATE : 0,
  isFollowUpQuote ? -FOLLOW_UP_DISCOUNT_RATE : 0,
];

const quote = (
  { items }: QuoteStep,
  customer: Customer,
  isFollowUpQuote: boolean,
): StepResult => {
  const basePremium = sum(groupByType(items).map(basePremiumOfAlikeItems));
  const itemSurcharges = sum(items.map(itemSurchargesOf));
  const policyAdjustments =
    basePremium * sum(policyAdjustmentRatesOf(customer, isFollowUpQuote));

  return {
    premium: Math.ceil(basePremium + itemSurcharges + policyAdjustments + PROCESSING_FEE),
  };
};

const insuranceValueOf = (item: Item): number =>
  lookupByItemType(INSURANCE_VALUE_BY_ITEM_TYPE, item);

const insuranceSumOf = (items: Item[]): number => sum(items.map(insuranceValueOf));

const reimbursementRateOf = (item: Item): number =>
  (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL
    ? HALF_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

// Checked up front, before any item is consumed, so a later negative amount
// cannot leave a partially-processed incident behind.
const rejectNegativeAmounts = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);

  if (negative) raise(`negative damage amount: ${negative.amount}`);
};

// Per-damage reimbursement, before the policy cap is applied in `claim`.
const reimbursementForDamage = (damage: Damage, damagedItem: Item): number =>
  damage.amount * reimbursementRateOf(damagedItem) - DEDUCTIBLE_PER_DAMAGE;

interface Policy {
  items: Item[];
  remainingCap: number;
}

// A quote step opens a policy: it fixes the covered items and the cap, which
// is a multiple of the insurance sum and unaffected by premium modifiers.
const openPolicy = ({ items }: QuoteStep): Policy => ({
  items,
  remainingCap: insuranceSumOf(items) * CAP_MULTIPLE,
});

// Each damage entry consumes one insured item, so a policy covering a single
// sword cannot absorb two sword damages.
const takeDamagedItem = (unclaimedItems: Item[], damage: Damage): Item => {
  const index = unclaimedItems.findIndex((item) => item.type === damage.itemType);

  return index === -1
    ? raise(`item not covered by policy: ${damage.itemType}`)
    : unclaimedItems.splice(index, 1)[0];
};

const claim = ({ incident }: ClaimStep, policy: Policy): StepResult => {
  rejectNegativeAmounts(incident.damages);

  const unclaimedItems = [...policy.items];
  const desiredPayout = sum(
    incident.damages.map((damage) =>
      reimbursementForDamage(damage, takeDamagedItem(unclaimedItems, damage)),
    ),
  );
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
};

// A claim names the step index of the quote that opened its policy.
const policyClaimedBy = (policyByStep: Map<number, Policy>, { policy }: ClaimStep): Policy =>
  policyByStep.get(policy) ?? raise(`no policy opened at step ${policy}`);

export const runScenario = ({ customer, steps }: Scenario): ScenarioResult => {
  const policyByStep = new Map<number, Policy>();

  const results = steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      return claim(step, policyClaimedBy(policyByStep, step));
    }

    // Every quote but the customer's first is a follow-up. `policyByStep`
    // already records one entry per quote, so its size is that count.
    const isFollowUpQuote = policyByStep.size > 0;
    policyByStep.set(stepIndex, openPolicy(step));

    return quote(step, customer, isFollowUpQuote);
  });

  return { results };
};
