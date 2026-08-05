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

export interface ScenarioResult {
  results: StepResult[];
}

interface Price {
  basePremium: number;
  insuranceValue: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

// The price list: one entry per insurable item type.
const PRICE_LIST: Record<string, Price> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

// The MHPCO insures only the types on its price list, so looking a price up
// is also the one place where an uninsurable item is rejected.
const priceFor = (type: string): Price => {
  const price = PRICE_LIST[type];
  if (price === undefined) {
    throw new Error(`unknown item type: ${type}`);
  }
  return price;
};

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];
const CURSE_SURCHARGE_RATE = 0.5;
const LOYALTY_MINIMUM_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

// One tally per distinct key, e.g. how many items of each type a policy insures.
const countBy = <T>(
  values: T[],
  keyOf: (value: T) => string,
): Map<string, number> => {
  const countByKey = new Map<string, number>();
  for (const value of values) {
    const key = keyOf(value);
    countByKey.set(key, (countByKey.get(key) ?? 0) + 1);
  }
  return countByKey;
};

const countItemsByType = (items: Item[]): Map<string, number> =>
  countBy(items, ({ type }) => type);

const countDamagesByType = (damages: Damage[]): Map<string, number> =>
  countBy(damages, ({ itemType }) => itemType);

const formsBuildingBlock = (type: string, count: number): boolean =>
  count === BLOCK_SIZE && COMPONENT_TYPES.includes(type);

const basePremiumForSameTypeItems = (type: string, count: number): number =>
  formsBuildingBlock(type, count)
    ? BLOCK_BASE_PREMIUM
    : count * priceFor(type).basePremium;

const basePremiumFor = (items: Item[]): number =>
  [...countItemsByType(items)].reduce(
    (total, [type, count]) => total + basePremiumForSameTypeItems(type, count),
    0,
  );

// An item surcharge is priced against that item's own listed base premium,
// never against a discounted building-block price.
const surchargeForItemsWhere = (
  items: Item[],
  qualifies: (item: Item) => boolean,
  rate: number,
): number =>
  items
    .filter(qualifies)
    .reduce(
      (total, item) => total + priceFor(item.type).basePremium * rate,
      0,
    );

const isCursed = ({ cursed }: Item): boolean => cursed === true;

const isHighlyEnchanted = ({ enchantment }: Item): boolean =>
  (enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;

const itemSurchargesFor = (items: Item[]): number =>
  surchargeForItemsWhere(items, isCursed, CURSE_SURCHARGE_RATE) +
  surchargeForItemsWhere(
    items,
    isHighlyEnchanted,
    HIGH_ENCHANTMENT_SURCHARGE_RATE,
  );

const loyaltyDiscountRateFor = ({ yearsWithMHPCO }: Customer): number =>
  yearsWithMHPCO >= LOYALTY_MINIMUM_YEARS ? LOYALTY_DISCOUNT_RATE : 0;

const followUpContractDiscountRateFor = (isFollowUpContract: boolean): number =>
  isFollowUpContract ? FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0;

// Policy-wide modifiers are signed rates on the policy base premium:
// surcharges add, discounts subtract.
const policyWideModifierRateFor = (
  customer: Customer,
  isFollowUpContract: boolean,
): number =>
  FIRST_INSURANCE_SURCHARGE_RATE -
  loyaltyDiscountRateFor(customer) -
  followUpContractDiscountRateFor(isFollowUpContract);

const quote = (
  { items }: QuoteStep,
  customer: Customer,
  isFollowUpContract: boolean,
): QuoteResult => {
  const basePremium = basePremiumFor(items);
  return {
    premium: Math.ceil(
      basePremium +
        itemSurchargesFor(items) +
        basePremium * policyWideModifierRateFor(customer, isFollowUpContract) +
        PROCESSING_FEE,
    ),
  };
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

// The insurance sum is the undiscounted total value of the insured items;
// the cap limits everything ever paid out under one policy.
const insuranceSumFor = (items: Item[]): number =>
  items.reduce(
    (total, item) => total + priceFor(item.type).insuranceValue,
    0,
  );

const capFor = (policy: QuoteStep): number =>
  CAP_MULTIPLIER * insuranceSumFor(policy.items);

// Safe once assertDamagesAreCovered has run: every damaged type is insured.
const insuredItemFor = ({ itemType }: Damage, policy: QuoteStep): Item =>
  policy.items.find(({ type }) => type === itemType) as Item;

const qualifiesForReducedReimbursement = ({ enchantment }: Item): boolean =>
  (enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL;

// Items enchanted at or above the threshold are reimbursed at half their damage.
const reimbursementFor = (amount: number, insuredItem: Item): number =>
  qualifiesForReducedReimbursement(insuredItem)
    ? amount * REDUCED_REIMBURSEMENT_RATE
    : amount;

// The deductible is borne by the customer once per damage entry.
const payoutForDamage = (damage: Damage, policy: QuoteStep): number =>
  reimbursementFor(damage.amount, insuredItemFor(damage, policy)) - DEDUCTIBLE;

// A payout is settled in whole gold, rounded down; the same whole amount is
// what the policy's remaining cap is reduced by.
const uncappedPayoutForIncident = (
  { damages }: Incident,
  policy: QuoteStep,
): number =>
  Math.floor(
    damages.reduce(
      (total, damage) => total + payoutForDamage(damage, policy),
      0,
    ),
  );

const isQuoteStep = (step: Step): step is QuoteStep => step.op === "quote";

const policyOf = ({ policy }: ClaimStep, steps: Step[]): QuoteStep =>
  steps[policy] as QuoteStep;

// Every damage entry must be matched by a distinct insured item of that type.
const assertDamagesAreCovered = (
  { damages }: Incident,
  policy: QuoteStep,
): void => {
  const insuredCounts = countItemsByType(policy.items);
  for (const [itemType, damageCount] of countDamagesByType(damages)) {
    const insuredCount = insuredCounts.get(itemType) ?? 0;
    if (damageCount > insuredCount) {
      throw new Error(
        `claim covers ${damageCount} ${itemType} damages but the policy insures ${insuredCount}`,
      );
    }
  }
};

// A damage event cannot restore value to an item, so amounts may be zero but
// never negative.
const assertDamageAmountsAreNotNegative = ({ damages }: Incident): void => {
  for (const { amount } of damages) {
    if (amount < 0) {
      throw new Error(`damage amount must not be negative: ${amount}`);
    }
  }
};

// Guards run coverage-first: the reimbursement code below relies on every
// damaged type having a matching insured item.
const assertIncidentIsClaimable = (incident: Incident, policy: QuoteStep): void => {
  assertDamagesAreCovered(incident, policy);
  assertDamageAmountsAreNotNegative(incident);
};

const claim = (
  step: ClaimStep,
  steps: Step[],
  remainingCaps: Map<number, number>,
): ClaimResult => {
  const policy = policyOf(step, steps);
  assertIncidentIsClaimable(step.incident, policy);
  const availableCap = remainingCaps.get(step.policy) ?? capFor(policy);
  const payout = Math.min(
    uncappedPayoutForIncident(step.incident, policy),
    availableCap,
  );
  const remainingCap = availableCap - payout;
  remainingCaps.set(step.policy, remainingCap);
  return { payout, remainingCap };
};

// The follow-up discount is owed once the customer already holds a policy,
// which is a fact about the earlier steps rather than about this step's position.
const holdsPolicyBefore = (steps: Step[], stepIndex: number): boolean =>
  steps.slice(0, stepIndex).some(isQuoteStep);

export const runScenario = ({ customer, steps }: Scenario): ScenarioResult => {
  const remainingCaps = new Map<number, number>();
  return {
    results: steps.map((step, stepIndex) =>
      isQuoteStep(step)
        ? quote(step, customer, holdsPolicyBefore(steps, stepIndex))
        : claim(step, steps, remainingCaps),
    ),
  };
};
