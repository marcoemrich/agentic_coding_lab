export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: Incident };

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

export interface ScenarioResult {
  results: StepResult[];
}

/**
 * MHPCO never rounds against itself: a premium it charges climbs to the next
 * whole gold piece, a payout it owes drops to the previous one.
 */
const roundPremiumInMHPCOsFavourG = Math.ceil;
const roundPayoutInMHPCOsFavourG = Math.floor;

const PROCESSING_FEE_G = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;

/** The MHPCO price list: one entry per insurable item type. */
interface PriceListEntry {
  insuranceValueG: number;
  basePremiumG: number;
}

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValueG: 1000, basePremiumG: 100 },
  amulet: { insuranceValueG: 600, basePremiumG: 60 },
  staff: { insuranceValueG: 800, basePremiumG: 80 },
  potion: { insuranceValueG: 400, basePremiumG: 40 },
  rune: { insuranceValueG: 250, basePremiumG: 25 },
  moonstone: { insuranceValueG: 250, basePremiumG: 25 },
};

const basePremiumPerItemG = (type: string): number => PRICE_LIST[type].basePremiumG;
const insuranceValuePerItemG = (type: string): number => PRICE_LIST[type].insuranceValueG;

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM_G = 60;

const COMPONENT_TYPES = ["rune", "moonstone"];

/** How many entries of each key a list holds, e.g. insured items or damages per item type. */
const countByKey = <T>(values: T[], keyOf: (value: T) => string): Map<string, number> =>
  values.reduce((counts, value) => {
    const key = keyOf(value);
    return counts.set(key, (counts.get(key) ?? 0) + 1);
  }, new Map<string, number>());

const itemType = (item: Item): string => item.type;
const damagedItemType = (damage: Damage): string => damage.itemType;

const isBlockOfAlikeComponents = (type: string, count: number): boolean =>
  count === COMPONENT_BLOCK_SIZE && COMPONENT_TYPES.includes(type);

const basePremiumForItemGroupG = (type: string, count: number): number =>
  isBlockOfAlikeComponents(type, count)
    ? COMPONENT_BLOCK_PREMIUM_G
    : count * basePremiumPerItemG(type);

const policyBasePremiumG = (items: Item[]): number =>
  [...countByKey(items, itemType)].reduce(
    (total, [type, count]) => total + basePremiumForItemGroupG(type, count),
    0,
  );

const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const isCursed = (item: Item): boolean => item.cursed === true;

/** An unenchanted item counts as level 0, as does an item we have no record of. */
const enchantmentLevel = (item: Item | undefined): number => item?.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD;

/** A rule contributing a share of some base amount, negative when it discounts. */
interface RateRule<Subject> {
  appliesTo: (subject: Subject) => boolean;
  rateOfBase: number;
}

const totalApplicableRate = <Subject>(rules: RateRule<Subject>[], subject: Subject): number =>
  rules.reduce(
    (rate, { appliesTo, rateOfBase }) => (appliesTo(subject) ? rate + rateOfBase : rate),
    0,
  );

const ITEM_SURCHARGES: RateRule<Item>[] = [
  { appliesTo: isCursed, rateOfBase: CURSE_SURCHARGE_RATE },
  { appliesTo: isHighlyEnchanted, rateOfBase: HIGH_ENCHANTMENT_SURCHARGE_RATE },
];

const surchargeRateForItem = (item: Item): number => totalApplicableRate(ITEM_SURCHARGES, item);

const itemSurchargesG = (items: Item[]): number =>
  items.reduce(
    (total, item) => total + basePremiumPerItemG(item.type) * surchargeRateForItem(item),
    0,
  );

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

interface QuoteContext {
  customer: Customer;
  isFollowUpContract: boolean;
}

const always = (): boolean => true;

const BASE_PREMIUM_ADJUSTMENTS: RateRule<QuoteContext>[] = [
  { appliesTo: always, rateOfBase: FIRST_INSURANCE_SURCHARGE_RATE },
  { appliesTo: ({ customer }) => isLoyalCustomer(customer), rateOfBase: -LOYALTY_DISCOUNT_RATE },
  {
    appliesTo: ({ isFollowUpContract }) => isFollowUpContract,
    rateOfBase: -FOLLOW_UP_CONTRACT_DISCOUNT_RATE,
  },
];

const netAdjustmentG = (basePremium: number, context: QuoteContext): number =>
  basePremium * totalApplicableRate(BASE_PREMIUM_ADJUSTMENTS, context);

const quotePremiumG = (items: Item[], context: QuoteContext): number => {
  const basePremium = policyBasePremiumG(items);
  return roundPremiumInMHPCOsFavourG(
    basePremium +
      netAdjustmentG(basePremium, context) +
      itemSurchargesG(items) +
      PROCESSING_FEE_G,
  );
};

const DEDUCTIBLE_G = 100;
const CAP_MULTIPLIER = 2;

const insuranceSumG = (items: Item[]): number =>
  items.reduce((total, item) => total + insuranceValuePerItemG(item.type), 0);

const policyCapG = (items: Item[]): number => CAP_MULTIPLIER * insuranceSumG(items);

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const insuredItemOfType = (insuredItems: Item[], itemType: string): Item | undefined =>
  insuredItems.find((insured) => insured.type === itemType);

/** Strongly enchanted items are only reimbursed at half their damage. */
const reimbursementRate = (item: Item | undefined): number =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

const payoutForDamageG = (damage: Damage, insuredItems: Item[]): number =>
  damage.amount * reimbursementRate(insuredItemOfType(insuredItems, damage.itemType)) -
  DEDUCTIBLE_G;

const claimPayoutG = (incident: Incident, insuredItems: Item[]): number =>
  incident.damages.reduce((total, damage) => total + payoutForDamageG(damage, insuredItems), 0);

const insuredItemsOfPolicy = (steps: Step[], policy: number): Item[] => {
  const policyStep = steps[policy];
  if (policyStep.op !== "quote") throw new Error(`Step ${policy} is not a policy`);
  return policyStep.items;
};

/** A policy pays out at most its cap, across all claims made against it. */
interface ClaimContext {
  steps: Step[];
  remainingCapByPolicy: Map<number, number>;
}

interface StepContext extends QuoteContext, ClaimContext {}

const assertDamageAmountsAreNotNegative = (damages: Damage[]): void => {
  damages.forEach(({ amount }) => {
    if (amount < 0) throw new Error(`Damage amount must not be negative: ${amount}`);
  });
};

/** A policy covers at most as many items of a type as it insures. */
const assertDamagesAreCoveredByPolicy = (damages: Damage[], insuredItems: Item[]): void => {
  const insuredCounts = countByKey(insuredItems, itemType);
  countByKey(damages, damagedItemType).forEach((count, type) => {
    if (count > (insuredCounts.get(type) ?? 0))
      throw new Error(`Policy does not cover ${count} damaged items of type ${type}`);
  });
};

const assertClaimIsValid = ({ damages }: Incident, insuredItems: Item[]): void => {
  assertDamageAmountsAreNotNegative(damages);
  assertDamagesAreCoveredByPolicy(damages, insuredItems);
};

const settleClaim = (
  policy: number,
  incident: Incident,
  { steps, remainingCapByPolicy }: ClaimContext,
): StepResult => {
  const insuredItems = insuredItemsOfPolicy(steps, policy);
  assertClaimIsValid(incident, insuredItems);
  const capBeforeClaim = remainingCapByPolicy.get(policy) ?? policyCapG(insuredItems);
  const claimedPayoutG = roundPayoutInMHPCOsFavourG(claimPayoutG(incident, insuredItems));
  const payout = Math.min(claimedPayoutG, capBeforeClaim);
  const remainingCap = capBeforeClaim - payout;
  remainingCapByPolicy.set(policy, remainingCap);
  return { payout, remainingCap };
};

const runStep = (step: Step, context: StepContext): StepResult =>
  step.op === "quote"
    ? { premium: quotePremiumG(step.items, context) }
    : settleClaim(step.policy, step.incident, context);

const isQuoteStep = (step: Step): boolean => step.op === "quote";

export const runScenario = ({ customer, steps }: Scenario): ScenarioResult => {
  const remainingCapByPolicy = new Map<number, number>();
  return {
    results: steps.map((step, index) =>
      runStep(step, {
        customer,
        isFollowUpContract: steps.slice(0, index).some(isQuoteStep),
        steps,
        remainingCapByPolicy,
      }),
    ),
  };
};
