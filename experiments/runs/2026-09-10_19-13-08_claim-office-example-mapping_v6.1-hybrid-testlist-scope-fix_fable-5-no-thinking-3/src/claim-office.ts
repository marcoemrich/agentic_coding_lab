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
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

// Spec: an item's base premium is 10 % of its insurance value.
// Dividing by 10 (rather than multiplying by 0.1) keeps gold amounts
// exact in floating point.
const VALUE_TO_PREMIUM_RATIO = 10;

const insuranceValueOf = (itemType: string): number => {
  const insuranceValue = INSURANCE_VALUES[itemType];
  if (insuranceValue === undefined) {
    throw new Error(`Unknown item type: ${itemType}`);
  }
  return insuranceValue;
};

const basePremiumOf = (itemType: string): number =>
  insuranceValueOf(itemType) / VALUE_TO_PREMIUM_RATIO;

const sumBy = <T>(values: T[], amountOf: (value: T) => number): number =>
  values.reduce((total, value) => total + amountOf(value), 0);

const countOf = <T>(values: T[], matches: (value: T) => boolean): number =>
  values.filter(matches).length;

const countOfType = (items: Item[], type: string): number =>
  countOf(items, (item) => item.type === type);

const BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const COMPONENT_TYPES = ["rune", "moonstone"];

const componentBlockAdjustment = (
  items: Item[],
  componentType: string,
): number => {
  const count = countOfType(items, componentType);
  return count === BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM - BLOCK_SIZE * basePremiumOf(componentType)
    : 0;
};

const totalBasePremium = (items: Item[]): number =>
  sumBy(items, (item) => basePremiumOf(item.type)) +
  sumBy(COMPONENT_TYPES, (componentType) =>
    componentBlockAdjustment(items, componentType),
  );

const surchargeFor = (
  items: Item[],
  rate: number,
  applies: (item: Item) => boolean,
): number =>
  sumBy(items, (item) =>
    applies(item) ? rate * basePremiumOf(item.type) : 0,
  );

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const quotePremium = (
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): number => {
  const basePremium = totalBasePremium(items);
  const itemSurcharges =
    surchargeFor(items, CURSE_SURCHARGE_RATE, isCursed) +
    surchargeFor(items, HIGH_ENCHANTMENT_SURCHARGE_RATE, isHighlyEnchanted);
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
      ? basePremium * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscount = isFollowUpContract
    ? basePremium * FOLLOW_UP_DISCOUNT_RATE
    : 0;
  return Math.ceil(
    basePremium +
      itemSurcharges +
      firstInsuranceSurcharge -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE,
  );
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const PAYOUT_CAP_MULTIPLIER = 2;
const REDUCED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

// Spec: damage to items enchanted at 8 or above is reimbursed at 50 %
// (deductible is applied afterwards, per damage entry).
// Callers guarantee the item is covered by the policy.
const reimbursementFor = (damage: Damage, damagedItem: Item): number =>
  (damagedItem.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD
    ? damage.amount * REDUCED_REIMBURSEMENT_RATE
    : damage.amount;

const initialCapFor = (policyItems: Item[]): number =>
  PAYOUT_CAP_MULTIPLIER *
  sumBy(policyItems, (item) => insuranceValueOf(item.type));

// Spec: the deductible applies once per damage entry, after any
// reimbursement clause.
const payoutForDamage = (damage: Damage, policyItems: Item[]): number => {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
  const damagedItem = policyItems.find(
    (item) => item.type === damage.itemType,
  );
  if (damagedItem === undefined) {
    throw new Error(`Damaged item not covered by policy: ${damage.itemType}`);
  }
  return reimbursementFor(damage, damagedItem) - DEDUCTIBLE_PER_DAMAGE;
};

const rejectExcessDamages = (damages: Damage[], policyItems: Item[]): void => {
  for (const damage of damages) {
    const damagedCount = countOf(
      damages,
      (entry) => entry.itemType === damage.itemType,
    );
    const insuredCount = countOfType(policyItems, damage.itemType);
    if (damagedCount > insuredCount) {
      throw new Error(
        `More damaged ${damage.itemType} entries (${damagedCount}) than insured (${insuredCount})`,
      );
    }
  }
};

const settleClaim = (
  claimStep: ClaimStep,
  policyItems: Item[],
  remainingCapBefore: number,
): ClaimResult => {
  rejectExcessDamages(claimStep.incident.damages, policyItems);
  const uncappedPayout = sumBy(claimStep.incident.damages, (damage) =>
    payoutForDamage(damage, policyItems),
  );
  const payout = Math.floor(Math.min(uncappedPayout, remainingCapBefore));
  return { payout, remainingCap: remainingCapBefore - payout };
};

export const runScenario = (scenario: Scenario): ScenarioOutput => {
  const remainingCaps = new Map<number, number>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === "claim") {
        // Spec: a claim's `policy` field is the index of the quote step
        // that created the policy, so that step is always a QuoteStep.
        const policyItems = (scenario.steps[step.policy] as QuoteStep).items;
        const capBefore =
          remainingCaps.get(step.policy) ?? initialCapFor(policyItems);
        const result = settleClaim(step, policyItems, capBefore);
        remainingCaps.set(step.policy, result.remainingCap);
        return result;
      }
      return {
        premium: quotePremium(step.items, scenario.customer, index > 0),
      };
    }),
  };
};
