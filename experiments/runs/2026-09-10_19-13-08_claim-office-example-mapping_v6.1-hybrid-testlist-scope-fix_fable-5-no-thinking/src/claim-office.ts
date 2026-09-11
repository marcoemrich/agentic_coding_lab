export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
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

export interface ScenarioOutput {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

// Spec price list: each item type has an insurance value and a base premium.
const PRICE_LIST: Record<
  string,
  { insuranceValue: number; basePremium: number }
> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

const sumOf = <T>(items: T[], valueOf: (item: T) => number): number =>
  items.reduce((sum, item) => sum + valueOf(item), 0);

const countWhere = <T>(items: T[], matches: (item: T) => boolean): number =>
  items.filter(matches).length;

const basePremiumOf = (type: string): number => PRICE_LIST[type].basePremium;

const insuranceValueOf = (type: string): number =>
  PRICE_LIST[type].insuranceValue;

// "A building block of 3 alike components is offered at a special base premium of 60 G."
const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const componentBlockDiscount = (items: QuoteItem[]): number =>
  sumOf(COMPONENT_TYPES, (type) => {
    const count = countWhere(items, (item) => item.type === type);
    return count === BLOCK_SIZE
      ? BLOCK_SIZE * basePremiumOf(type) - COMPONENT_BLOCK_PREMIUM
      : 0;
  });

const isCursed = (item: QuoteItem): boolean => item.cursed === true;

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const isHighlyEnchanted = (item: QuoteItem): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

// Surcharges apply per item, as a percentage of that item's base premium.
const surchargeOn = (
  items: QuoteItem[],
  applies: (item: QuoteItem) => boolean,
  rate: number,
): number =>
  sumOf(items, (item) =>
    applies(item) ? basePremiumOf(item.type) * rate : 0,
  );

const quotePremium = (
  items: QuoteItem[],
  customer: Customer,
  isFollowUpContract: boolean,
): number => {
  const itemBase = sumOf(items, (item) => basePremiumOf(item.type));
  const policyBase = itemBase - componentBlockDiscount(items);
  const curseSurcharge = surchargeOn(items, isCursed, CURSE_SURCHARGE_RATE);
  const highEnchantmentSurcharge = surchargeOn(
    items,
    isHighlyEnchanted,
    HIGH_ENCHANTMENT_SURCHARGE_RATE,
  );
  const firstInsurance = policyBase * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = isLoyalCustomer(customer)
    ? policyBase * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = isFollowUpContract
    ? policyBase * FOLLOW_UP_DISCOUNT_RATE
    : 0;
  return Math.ceil(
    policyBase +
      curseSurcharge +
      highEnchantmentSurcharge +
      firstInsurance -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE,
  );
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
// "Items with an enchantment level of 8 or higher are reimbursed at 50%."
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const reimbursementFor = (damage: Damage, insuredItem: QuoteItem): number =>
  (insuredItem.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;

const insuranceSum = (policy: QuoteStep): number =>
  sumOf(policy.items, (item) => insuranceValueOf(item.type));

// "The payout cap is twice the insurance sum" — unmodified by premium surcharges/discounts.
const policyCap = (policy: QuoteStep): number =>
  CAP_MULTIPLIER * insuranceSum(policy);

const insuredItemFor = (policy: QuoteStep, itemType: string): QuoteItem => {
  const insuredItem = policy.items.find((item) => item.type === itemType);
  if (insuredItem === undefined) {
    throw new Error(
      `Claim rejected: no insured item of type "${itemType}" in the policy`,
    );
  }
  return insuredItem;
};

// "You can only claim as many items of a type as the policy insures."
const rejectIfMoreDamagesThanInsured = (
  damages: Damage[],
  policy: QuoteStep,
): void => {
  for (const itemType of new Set(damages.map((damage) => damage.itemType))) {
    const damagedCount = countWhere(
      damages,
      (damage) => damage.itemType === itemType,
    );
    const insuredCount = countWhere(policy.items, (item) => item.type === itemType);
    if (damagedCount > insuredCount) {
      throw new Error(
        `Claim rejected: ${damagedCount} damage entries for "${itemType}" but only ${insuredCount} insured`,
      );
    }
  }
};

const rejectNegativeDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(
        `Claim rejected: negative damage amount ${damage.amount} for "${damage.itemType}"`,
      );
    }
  }
};

const settleClaim = (
  claim: ClaimStep,
  policy: QuoteStep,
  remainingCapBefore: number,
): ClaimResult => {
  rejectNegativeDamageAmounts(claim.incident.damages);
  rejectIfMoreDamagesThanInsured(claim.incident.damages, policy);
  const rawPayout = sumOf(
    claim.incident.damages,
    (damage) =>
      reimbursementFor(damage, insuredItemFor(policy, damage.itemType)) -
      DEDUCTIBLE,
  );
  const payout = Math.min(Math.floor(rawPayout), remainingCapBefore);
  return { payout, remainingCap: remainingCapBefore - payout };
};

export const runScenario = (scenario: Scenario): ScenarioOutput => {
  const remainingCaps = new Map<number, number>();
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "claim") {
      const policy = scenario.steps[step.policy] as QuoteStep;
      const remainingCapBefore =
        remainingCaps.get(step.policy) ?? policyCap(policy);
      const result = settleClaim(step, policy, remainingCapBefore);
      remainingCaps.set(step.policy, result.remainingCap);
      return result;
    }
    const isFollowUpContract = index > 0;
    return {
      premium: quotePremium(step.items, scenario.customer, isFollowUpContract),
    };
  });
  return { results };
};
