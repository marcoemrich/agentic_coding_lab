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

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_MINIMUM_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;

// Integer multiply before divide keeps fractional percentages exact
// (e.g. 10% of 25 is exactly 2.5 — no float noise from multiplying by 1.1).
const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / 100;

const isComponent = (item: QuoteItem): boolean =>
  COMPONENT_TYPES.includes(item.type);

const basePremiumOf = (type: string): number => {
  const premium = BASE_PREMIUMS[type];
  if (premium === undefined) {
    throw new Error(`unknown item type: ${type}`);
  }
  return premium;
};

const sumBy = <T>(values: T[], amount: (value: T) => number): number =>
  values.reduce((sum, value) => sum + amount(value), 0);

const countWhere = <T>(values: T[], matches: (value: T) => boolean): number =>
  values.filter(matches).length;

const isCursed = (item: QuoteItem): boolean => item.cursed === true;

const isHighlyEnchanted = (item: QuoteItem): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

// Item surcharge: a fixed percent of each qualifying item's base premium.
const itemSurcharge = (
  items: QuoteItem[],
  applies: (item: QuoteItem) => boolean,
  percent: number
): number =>
  sumBy(items.filter(applies), (item) =>
    percentOf(basePremiumOf(item.type), percent)
  );

// Pricing rule: a block of exactly 3 alike components costs a flat block premium.
const componentTypePremium = (items: QuoteItem[], type: string): number => {
  const count = countWhere(items, (item) => item.type === type);
  return count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * basePremiumOf(type);
};

const quotePremium = (
  items: QuoteItem[],
  customer: Customer,
  isFollowUpContract: boolean
): number => {
  const componentsPremium = sumBy(COMPONENT_TYPES, (type) =>
    componentTypePremium(items, type)
  );
  const mainItemsPremium = sumBy(
    items.filter((item) => !isComponent(item)),
    (item) => basePremiumOf(item.type)
  );
  const policyBasePremium = componentsPremium + mainItemsPremium;
  const curseSurcharge = itemSurcharge(items, isCursed, CURSE_SURCHARGE_PERCENT);
  const enchantmentSurcharge = itemSurcharge(
    items,
    isHighlyEnchanted,
    HIGH_ENCHANTMENT_SURCHARGE_PERCENT
  );
  // Policy-wide modifiers are all computed on the unmodified policy base.
  const firstInsuranceSurcharge = percentOf(
    policyBasePremium,
    FIRST_INSURANCE_SURCHARGE_PERCENT
  );
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_MINIMUM_YEARS
      ? percentOf(policyBasePremium, LOYALTY_DISCOUNT_PERCENT)
      : 0;
  const followUpContractDiscount = isFollowUpContract
    ? percentOf(policyBasePremium, FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT)
    : 0;
  return Math.ceil(
    policyBasePremium +
      curseSurcharge +
      enchantmentSurcharge +
      firstInsuranceSurcharge -
      loyaltyDiscount -
      followUpContractDiscount +
      PROCESSING_FEE
  );
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2; // payout cap is twice the policy's insurance sum

const insuranceSumOf = (items: QuoteItem[]): number =>
  sumBy(items, (item) => INSURANCE_VALUES[item.type]);

// Claim clause: items enchanted at or above this level are only reimbursed
// at 50%. Distinct rule from the premium's HIGH_ENCHANTMENT_THRESHOLD (5).
const CLAIM_HALVING_ENCHANTMENT_THRESHOLD = 8;
const HALVED_REIMBURSEMENT_PERCENT = 50;

const reimbursementFor = (
  policyItems: QuoteItem[],
  damage: Damage
): number => {
  const insuredItem = policyItems.find(
    (item) => item.type === damage.itemType
  );
  if (insuredItem === undefined) {
    throw new Error(`damaged item not covered by policy: ${damage.itemType}`);
  }
  return (insuredItem.enchantment ?? 0) >= CLAIM_HALVING_ENCHANTMENT_THRESHOLD
    ? percentOf(damage.amount, HALVED_REIMBURSEMENT_PERCENT)
    : damage.amount;
};

// A policy is what a quote step creates: the insured items plus the payout
// cap that later claims against this policy draw down.
interface Policy {
  items: QuoteItem[];
  remainingCap: number;
}

const openPolicy = (items: QuoteItem[]): Policy => ({
  items,
  remainingCap: CAP_MULTIPLIER * insuranceSumOf(items),
});

// Claim rule: a damage entry may not report a negative amount.
const assertNoNegativeAmounts = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative !== undefined) {
    throw new Error(`negative damage amount: ${negative.amount}`);
  }
};

// Claim rule: per item type, an incident may not report more damaged
// entries than the policy insures — otherwise the whole claim is rejected.
// (An uninsured type fails too: its insured count is 0.)
const assertDamagesCovered = (policy: Policy, damages: Damage[]): void => {
  const damagedTypes = new Set(damages.map((damage) => damage.itemType));
  for (const itemType of damagedTypes) {
    const damagedCount = countWhere(
      damages,
      (damage) => damage.itemType === itemType
    );
    const insuredCount = countWhere(policy.items, (item) => item.type === itemType);
    if (damagedCount > insuredCount) {
      throw new Error(
        `more damaged ${itemType} entries than insured: ${damagedCount} > ${insuredCount}`
      );
    }
  }
};

// Settling draws the payout down from the policy's remaining cap.
const settleClaim = (policy: Policy, damages: Damage[]): ClaimResult => {
  assertNoNegativeAmounts(damages);
  assertDamagesCovered(policy, damages);
  // Payouts round down in MHPCO's favor — mirrors the Math.ceil on premiums.
  const uncappedPayout = Math.floor(
    sumBy(damages, (damage) => reimbursementFor(policy.items, damage) - DEDUCTIBLE)
  );
  const payout = Math.min(uncappedPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  // Indexed by step index — claim steps reference their policy that way.
  const policies: Policy[] = [];
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "quote") {
      policies[index] = openPolicy(step.items);
      return {
        premium: quotePremium(step.items, scenario.customer, index > 0),
      };
    }
    return settleClaim(policies[step.policy], step.incident.damages);
  });
  return { results };
};
