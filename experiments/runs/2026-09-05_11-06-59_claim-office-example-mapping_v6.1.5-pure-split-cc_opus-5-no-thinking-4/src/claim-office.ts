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

export type Result = { premium: number } | { payout: number; remainingCap: number };

const sumBy = <T>(values: T[], amountOf: (value: T) => number): number =>
  values.reduce((total, value) => total + amountOf(value), 0);

const PROCESSING_FEE = 5;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

/**
 * Gold amounts are exact to far fewer places than this; rounding here first
 * keeps binary floating-point noise (100 * 1.1 + 5 = 115.00000000000001) from
 * tipping a whole-gold amount into the next unit.
 */
const SIGNIFICANT_DECIMALS = 6;

const withoutFloatNoise = (amount: number): number =>
  Number(amount.toFixed(SIGNIFICANT_DECIMALS));

/** Rounds up in the MHPCO's favor. */
const roundPremium = (amount: number): number => Math.ceil(withoutFloatNoise(amount));

/**
 * The MHPCO's price list: the closed set of insurable item types, each with its
 * base premium and insurance value in gold. The two numbers live in one table
 * so a new item type cannot be given a premium but no insurance value.
 */
const PRICE_LIST = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
} as const satisfies Record<string, { basePremium: number; insuranceValue: number }>;

export type ItemType = keyof typeof PRICE_LIST;

const isInsurableType = (type: string): type is ItemType => type in PRICE_LIST;

/** The MHPCO does not insure what is not in its price list. */
const priceOf = (item: Item) => {
  if (!isInsurableType(item.type)) throw new Error(`Unknown item type: ${item.type}`);
  return PRICE_LIST[item.type];
};

const basePremiumOf = (item: Item): number => priceOf(item).basePremium;

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

/** Groups items by type; "alike" means same type, not same family. */
const groupByType = (items: Item[]): Item[][] => {
  const types = [...new Set(items.map((item) => item.type))];
  return types.map((type) => items.filter((item) => item.type === type));
};

const COMPONENT_TYPES = new Set<string>(["rune", "moonstone"]);

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

/** Three alike components form a block, priced at a special base premium. */
const basePremiumOfGroup = (group: Item[]): number =>
  group.length === BLOCK_SIZE && group.every(isComponent)
    ? BLOCK_BASE_PREMIUM
    : sumBy(group, basePremiumOf);

const totalBasePremium = (items: Item[]): number =>
  sumBy(groupByType(items), basePremiumOfGroup);

const CURSE_SURCHARGE_RATE = 0.5;

const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurchargeRate = (item: Item): number =>
  (isCursed(item) ? CURSE_SURCHARGE_RATE : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);

/**
 * Item-specific surcharges apply to the affected item's own base premium,
 * unlike policy-wide modifiers which apply to the policy's total base premium.
 *
 * NOTE: this uses each item's ungrouped base premium, so a cursed component
 * inside a 3-alike block is surcharged against its own 25 G rather than its
 * share of the block's 60 G. No test covers that combination yet; the choice
 * is unverified, not deliberate.
 */
const totalItemSurcharges = (items: Item[]): number =>
  sumBy(items, (item) => basePremiumOf(item) * itemSurchargeRate(item));

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

/**
 * Policy-wide modifiers apply to the policy's base premium, not to the item
 * surcharges. Returns a signed rate: the first-insurance surcharge less the
 * loyalty discount, so a loyal customer's rate can be negative.
 */
const policyModifierRate = (customer: Customer, isFollowUpContract: boolean): number =>
  FIRST_INSURANCE_SURCHARGE_RATE -
  (isLoyal(customer) ? LOYALTY_DISCOUNT_RATE : 0) -
  (isFollowUpContract ? FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0);

const quotePremium = (
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): number => {
  const basePremium = totalBasePremium(items);
  const premiumBeforeFee =
    basePremium +
    totalItemSurcharges(items) +
    basePremium * policyModifierRate(customer, isFollowUpContract);
  return roundPremium(premiumBeforeFee + PROCESSING_FEE);
};

const insuranceValueOf = (item: Item): number => priceOf(item).insuranceValue;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

/** Rounds down in the MHPCO's favor. */
const roundPayout = (amount: number): number => Math.floor(withoutFloatNoise(amount));

interface Policy {
  items: Item[];
  remainingCap: number;
}

const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: sumBy(items, insuranceValueOf) * CAP_MULTIPLIER,
});

const HALVED_REIMBURSEMENT_THRESHOLD = 8;
const HALVED_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

/** Damage to a heavily enchanted item is only half reimbursed. */
const reimbursementRate = (item: Item): number =>
  (item.enchantment ?? 0) >= HALVED_REIMBURSEMENT_THRESHOLD
    ? HALVED_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

/** A damage paired with the specific insured item it was matched against. */
interface MatchedDamage {
  damage: Damage;
  item: Item;
}

/**
 * A damage names only an item type, so the insured item it refers to — and
 * hence its enchantment and material — has to be looked up on the policy.
 * Each damage consumes a distinct insured item: two sword damages need two
 * insured swords, otherwise the whole claim is rejected.
 */
const matchDamagesToInsuredItems = (policy: Policy, damages: Damage[]): MatchedDamage[] => {
  const unclaimed = [...policy.items];
  return damages.map((damage) => {
    const index = unclaimed.findIndex((insured) => insured.type === damage.itemType);
    if (index === -1) throw new Error(`Item not insured: ${damage.itemType}`);
    return { damage, item: unclaimed.splice(index, 1)[0] };
  });
};

/** The deductible is withheld once per damaged item, not once per incident. */
const reimbursementAfterDeductible = ({ damage, item }: MatchedDamage): number =>
  damage.amount * reimbursementRate(item) - DEDUCTIBLE;

/**
 * The MHPCO does not pay out on damage that repaired the item. A single
 * negative entry rejects the whole claim, so this runs before any item is
 * matched and before the cap is drawn down — no partial settlement.
 */
const rejectNegativeDamages = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative !== undefined) {
    throw new Error(`Damage amount cannot be negative: ${negative.amount}`);
  }
};

/** Draws down the policy's remaining cap as a side effect. */
const settleClaim = (policy: Policy, incident: Incident): Result => {
  rejectNegativeDamages(incident.damages);
  const matched = matchDamagesToInsuredItems(policy, incident.damages);
  const claimedBeforeCap = sumBy(matched, reimbursementAfterDeductible);
  const payout = roundPayout(Math.min(claimedBeforeCap, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): { results: Result[] } => {
  const policies = new Map<number, Policy>();
  let quotesSoFar = 0;

  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer, quotesSoFar > 0);
      quotesSoFar += 1;
      policies.set(stepIndex, openPolicy(step.items));
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) throw new Error(`No policy at step ${step.policy}`);
    return settleClaim(policy, step.incident);
  });

  return { results };
};
