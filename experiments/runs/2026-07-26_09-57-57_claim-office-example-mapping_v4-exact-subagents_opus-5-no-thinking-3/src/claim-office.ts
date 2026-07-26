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

const PROCESSING_FEE = 5;

interface PriceListEntry {
  basePremium: number;
  insuranceValue: number;
}

// The single source of truth for which item types MHPCO insures, and at what
// price. Every insurable type carries both a base premium (what the customer
// pays) and an insurance value (what MHPCO undertakes to cover).
const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const isBlock = (sameTypeItems: Item[]): boolean =>
  sameTypeItems.length === BLOCK_SIZE;

const rejectUnknownItemType = (type: string): never => {
  throw new Error(`Unknown item type: ${type}`);
};

const priceListEntryOfItem = (item: Item): PriceListEntry =>
  PRICE_LIST[item.type] ?? rejectUnknownItemType(item.type);

const basePremiumOfItem = (item: Item): number =>
  priceListEntryOfItem(item).basePremium;

const sumOverItems = (items: Item[], valueOfItem: (item: Item) => number) =>
  items.reduce((sum, item) => sum + valueOfItem(item), 0);

const sumOfItemBasePremiums = (items: Item[]): number =>
  sumOverItems(items, basePremiumOfItem);

const groupByType = (items: Item[]): Item[][] =>
  Object.values(
    items.reduce<Record<string, Item[]>>(
      (groups, item) => ({
        ...groups,
        [item.type]: [...(groups[item.type] ?? []), item],
      }),
      {},
    ),
  );

const basePremiumOfGroup = (items: Item[]): number =>
  isBlock(items) ? BLOCK_PREMIUM : sumOfItemBasePremiums(items);

const policyBasePremium = (items: Item[]): number =>
  groupByType(items).reduce((sum, group) => sum + basePremiumOfGroup(group), 0);

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const HIGH_ENCHANTMENT_THRESHOLD = 5;

const isCursed = (item: Item): boolean => item.cursed === true;

const UNENCHANTED = 0;

const enchantmentOf = (item: Item): number => item.enchantment ?? UNENCHANTED;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentOf(item) >= HIGH_ENCHANTMENT_THRESHOLD;

const NO_SURCHARGE_RATE = 0;

const surchargeRateOfItem = (item: Item): number =>
  (isCursed(item) ? CURSED_SURCHARGE_RATE : NO_SURCHARGE_RATE) +
  (isHighlyEnchanted(item)
    ? HIGH_ENCHANTMENT_SURCHARGE_RATE
    : NO_SURCHARGE_RATE);

const surchargeOfItem = (item: Item): number =>
  basePremiumOfItem(item) * surchargeRateOfItem(item);

const sumOfItemSurcharges = (items: Item[]): number =>
  sumOverItems(items, surchargeOfItem);

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const firstInsuranceSurcharge = (basePremium: number): number =>
  basePremium * FIRST_INSURANCE_SURCHARGE_RATE;

const roundPremiumInMHPCOsFavour = (premium: number): number =>
  Math.ceil(premium);

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const NO_DISCOUNT = 0;

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const loyaltyDiscount = (customer: Customer, basePremium: number): number =>
  isLoyal(customer) ? basePremium * LOYALTY_DISCOUNT_RATE : NO_DISCOUNT;

const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

const isFollowUpContract = (previousQuoteCount: number): boolean =>
  previousQuoteCount > 0;

const followUpContractDiscount = (
  previousQuoteCount: number,
  basePremium: number,
): number =>
  isFollowUpContract(previousQuoteCount)
    ? basePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    : NO_DISCOUNT;

const quote = (
  items: Item[],
  customer: Customer,
  previousQuoteCount: number,
): QuoteResult => {
  const basePremium = policyBasePremium(items);
  const surcharges =
    sumOfItemSurcharges(items) + firstInsuranceSurcharge(basePremium);
  const discounts =
    loyaltyDiscount(customer, basePremium) +
    followUpContractDiscount(previousQuoteCount, basePremium);
  return {
    premium: roundPremiumInMHPCOsFavour(
      PROCESSING_FEE + basePremium + surcharges - discounts,
    ),
  };
};

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;

const HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const rejectItemNotInPolicy = (type: string): never => {
  throw new Error(`Item not insured by this policy: ${type}`);
};

const reserveItemForDamage = (damage: Damage, unclaimedItems: Item[]): Item =>
  unclaimedItems.find((item) => item.type === damage.itemType) ??
  rejectItemNotInPolicy(damage.itemType);

const isDeeplyEnchanted = (item: Item): boolean =>
  enchantmentOf(item) >= HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD;

const reimbursementRateOfItem = (item: Item): number =>
  isDeeplyEnchanted(item) ? HALF_REIMBURSEMENT_RATE : FULL_REIMBURSEMENT_RATE;

const rejectNegativeDamageAmount = (amount: number): never => {
  throw new Error(`Negative damage amount: ${amount}`);
};

const damagedAmount = (damage: Damage): number =>
  damage.amount >= 0 ? damage.amount : rejectNegativeDamageAmount(damage.amount);

const payoutOfDamage = (damage: Damage, item: Item): number =>
  damagedAmount(damage) * reimbursementRateOfItem(item) - DEDUCTIBLE;

const withoutItem = (items: Item[], item: Item): Item[] =>
  items.filter((candidate) => candidate !== item);

interface ClaimedDamage {
  damage: Damage;
  item: Item;
}

const assignDistinctItems = (
  damages: Damage[],
  policyItems: Item[],
): ClaimedDamage[] =>
  damages.reduce<{ claimed: ClaimedDamage[]; unclaimed: Item[] }>(
    ({ claimed, unclaimed }, damage) => {
      const item = reserveItemForDamage(damage, unclaimed);
      return {
        claimed: [...claimed, { damage, item }],
        unclaimed: withoutItem(unclaimed, item),
      };
    },
    { claimed: [], unclaimed: policyItems },
  ).claimed;

const payoutOfIncident = (incident: Incident, policyItems: Item[]): number =>
  assignDistinctItems(incident.damages, policyItems).reduce(
    (sum, { damage, item }) => sum + payoutOfDamage(damage, item),
    0,
  );

const declaredInsuranceValueOfItem = (item: Item): number =>
  priceListEntryOfItem(item).insuranceValue;

const insuranceSum = (items: Item[]): number =>
  sumOverItems(items, declaredInsuranceValueOfItem);

const capOfPolicy = (policyItems: Item[]): number =>
  CAP_FACTOR * insuranceSum(policyItems);

const roundPayoutInMHPCOsFavour = (payout: number): number =>
  Math.floor(payout);

const claim = (
  incident: Incident,
  policyItems: Item[],
  availableCap: number,
): ClaimResult => {
  const payout = roundPayoutInMHPCOsFavour(
    Math.min(payoutOfIncident(incident, policyItems), availableCap),
  );
  return {
    payout,
    remainingCap: availableCap - payout,
  };
};

const isQuoteStep = (step: Step): step is QuoteStep => step.op === "quote";

const insuredItemsOfPolicy = (steps: Step[], policy: number): Item[] => {
  const step = steps[policy];
  if (!isQuoteStep(step)) throw new Error(`Not a quote step: ${policy}`);
  return step.items;
};

const quoteCountBefore = (steps: Step[], stepIndex: number): number =>
  steps.slice(0, stepIndex).filter(isQuoteStep).length;

type RemainingCaps = Record<number, number>;

const availableCapOfPolicy = (
  remainingCaps: RemainingCaps,
  policyItems: Item[],
  policy: number,
): number => remainingCaps[policy] ?? capOfPolicy(policyItems);

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const remainingCaps: RemainingCaps = {};
  const results = scenario.steps.map((step, stepIndex) => {
    if (isQuoteStep(step)) {
      return quote(
        step.items,
        scenario.customer,
        quoteCountBefore(scenario.steps, stepIndex),
      );
    }
    const policyItems = insuredItemsOfPolicy(scenario.steps, step.policy);
    const result = claim(
      step.incident,
      policyItems,
      availableCapOfPolicy(remainingCaps, policyItems, step.policy),
    );
    remainingCaps[step.policy] = result.remainingCap;
    return result;
  });
  return { results };
};
