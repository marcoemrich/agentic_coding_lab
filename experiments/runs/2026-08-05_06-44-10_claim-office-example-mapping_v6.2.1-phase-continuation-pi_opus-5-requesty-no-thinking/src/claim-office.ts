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

const PROCESSING_FEE_IN_GOLD = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
// Components (runes, moonstones) are all priced alike, and are the only
// item types eligible for block pricing.
const COMPONENT_BASE_PREMIUM_IN_GOLD = 25;
const COMPONENT_BASE_PREMIUM_BY_TYPE_IN_GOLD = {
  rune: COMPONENT_BASE_PREMIUM_IN_GOLD,
  moonstone: COMPONENT_BASE_PREMIUM_IN_GOLD,
};

const BASE_PREMIUM_BY_ITEM_TYPE_IN_GOLD: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  ...COMPONENT_BASE_PREMIUM_BY_TYPE_IN_GOLD,
};

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const LOYALTY_THRESHOLD_IN_YEARS = 2;

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM_IN_GOLD = 60;

const isComponentType = (type: string): boolean =>
  type in COMPONENT_BASE_PREMIUM_BY_TYPE_IN_GOLD;

const formsComponentBlock = (type: string, count: number): boolean =>
  isComponentType(type) && count === COMPONENT_BLOCK_SIZE;

const sumInGold = <T>(values: T[], valueInGold: (value: T) => number): number =>
  values.reduce((total, value) => total + valueInGold(value), 0);

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

// Every gold amount MHPCO keeps per item type lives in a table keyed by type;
// a type missing from such a table is an item MHPCO does not deal in.
const goldAmountForItemType = (
  amountsByItemType: Record<string, number>,
  type: string,
): number => {
  const amountInGold = amountsByItemType[type];
  if (amountInGold === undefined) {
    throw new Error(`unknown item type: ${type}`);
  }
  return amountInGold;
};

const basePremiumPerItemOfTypeInGold = (type: string): number =>
  goldAmountForItemType(BASE_PREMIUM_BY_ITEM_TYPE_IN_GOLD, type);

// All items of one type are priced together: exactly 3 alike components form
// a discounted block, any other group is priced per item.
const basePremiumForItemGroupInGold = (type: string, count: number): number =>
  formsComponentBlock(type, count)
    ? COMPONENT_BLOCK_BASE_PREMIUM_IN_GOLD
    : count * basePremiumPerItemOfTypeInGold(type);

const totalBasePremiumInGold = (items: Item[]): number =>
  sumInGold([...countByType(items)], ([type, count]) =>
    basePremiumForItemGroupInGold(type, count),
  );

// Fractional premiums are always rounded up, in MHPCO's favour.
const roundPremiumInMHPCOsFavour = (amountInGold: number): number =>
  Math.ceil(amountInGold);

// Fractional payouts are always rounded down, in MHPCO's favour.
const roundPayoutInMHPCOsFavour = (amountInGold: number): number =>
  Math.floor(amountInGold);

const isCursed = (item: Item): boolean => item.cursed === true;

// An item without an enchantment field is simply unenchanted.
const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD;

// An item-level surcharge is charged on the surcharged items' own base
// premiums, ignoring any block pricing their type may enjoy.
const totalItemSurchargeInGold = (
  items: Item[],
  isSurcharged: (item: Item) => boolean,
  rate: number,
): number =>
  sumInGold(items.filter(isSurcharged), (item) =>
    basePremiumPerItemOfTypeInGold(item.type),
  ) * rate;

const totalItemSurchargesInGold = (items: Item[]): number =>
  totalItemSurchargeInGold(items, isCursed, CURSE_SURCHARGE_RATE) +
  totalItemSurchargeInGold(
    items,
    isHighlyEnchanted,
    HIGH_ENCHANTMENT_SURCHARGE_RATE,
  );

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_IN_YEARS;

// Everything about a quote beyond its items: who is buying, and whether this
// is their first contract in the scenario or a follow-up one.
interface QuoteContext {
  customer: Customer;
  isFollowUpContract: boolean;
}

// Policy-wide modifiers are all rates on the policy's base premium:
// positive rates are surcharges, negative rates are discounts.
const policyModifierRate = ({ customer, isFollowUpContract }: QuoteContext): number =>
  FIRST_INSURANCE_SURCHARGE_RATE -
  (isLoyal(customer) ? LOYALTY_DISCOUNT_RATE : 0) -
  (isFollowUpContract ? FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0);

const quotePremiumInGold = (items: Item[], context: QuoteContext): number => {
  const basePremiumInGold = totalBasePremiumInGold(items);
  return roundPremiumInMHPCOsFavour(
    basePremiumInGold +
      basePremiumInGold * policyModifierRate(context) +
      totalItemSurchargesInGold(items) +
      PROCESSING_FEE_IN_GOLD,
  );
};

const DEDUCTIBLE_PER_DAMAGE_IN_GOLD = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;
const INSURANCE_VALUE_BY_ITEM_TYPE_IN_GOLD: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};

const insuranceSumInGold = (items: Item[]): number =>
  sumInGold(items, (item) =>
    goldAmountForItemType(INSURANCE_VALUE_BY_ITEM_TYPE_IN_GOLD, item.type),
  );

// A policy never pays out more than a fixed multiple of what it insures.
const insuranceCapInGold = (items: Item[]): number =>
  insuranceSumInGold(items) * CAP_MULTIPLE_OF_INSURANCE_SUM;

const REDUCED_REIMBURSEMENT_RATE = 0.5;
const REDUCED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;

// Damage to a heavily enchanted item is only partly reimbursed.
const reimbursementRate = (item: Item): number =>
  enchantmentLevel(item) >= REDUCED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD
    ? REDUCED_REIMBURSEMENT_RATE
    : 1;

// A policy only answers for the items it insures, and each damage entry
// consumes one insured item: two damages need two insured items. The taken
// item is removed from the unclaimed ones, so a later damage cannot reuse it.
const takeInsuredItemForDamage = (unclaimedItems: Item[], damage: Damage): Item => {
  const damagedItemIndex = unclaimedItems.findIndex(
    (item) => item.type === damage.itemType,
  );
  if (damagedItemIndex === -1) {
    throw new Error(`damaged item is not insured: ${damage.itemType}`);
  }
  const [damagedItem] = unclaimedItems.splice(damagedItemIndex, 1);
  return damagedItem;
};

// MHPCO reimburses losses only: a damage reporting a negative amount is not a
// loss and so is no claim at all.
const reportedLossInGold = (damage: Damage): number => {
  if (damage.amount < 0) {
    throw new Error(`negative damage amount: ${damage.amount}`);
  }
  return damage.amount;
};

// Each damaged item is reimbursed at the rate its own properties earn it, and
// carries its own deductible.
const payoutForDamageInGold = (damagedItem: Item, damage: Damage): number =>
  reportedLossInGold(damage) * reimbursementRate(damagedItem) -
  DEDUCTIBLE_PER_DAMAGE_IN_GOLD;

const payoutForIncidentInGold = (insuredItems: Item[], incident: Incident): number => {
  const unclaimedItems = [...insuredItems];
  return sumInGold(incident.damages, (damage) =>
    payoutForDamageInGold(takeInsuredItemForDamage(unclaimedItems, damage), damage),
  );
};

// A claim refers to the policy it is made against by the index of the quote
// step that created it.
const insuredItemsOfClaim = (scenario: Scenario, claim: ClaimStep): Item[] =>
  (scenario.steps[claim.policy] as QuoteStep).items;

// The first contract a customer takes out in a scenario is their first
// insurance; every later quote is a follow-up contract.
const issueQuote = (
  scenario: Scenario,
  quote: QuoteStep,
  stepIndex: number,
): QuoteResult => ({
  premium: quotePremiumInGold(quote.items, {
    customer: scenario.customer,
    isFollowUpContract: stepIndex > 0,
  }),
});

// Successive claims against one policy share a single cap: each draws it down,
// and a policy not yet claimed against still has its full insurance cap.
const settleClaim = (
  scenario: Scenario,
  claim: ClaimStep,
  capRemainingByPolicy: Map<number, number>,
): ClaimResult => {
  const insuredItems = insuredItemsOfClaim(scenario, claim);
  const capBeforeClaimInGold =
    capRemainingByPolicy.get(claim.policy) ?? insuranceCapInGold(insuredItems);
  const payoutInGold = roundPayoutInMHPCOsFavour(
    Math.min(
      payoutForIncidentInGold(insuredItems, claim.incident),
      capBeforeClaimInGold,
    ),
  );
  const capAfterClaimInGold = capBeforeClaimInGold - payoutInGold;
  capRemainingByPolicy.set(claim.policy, capAfterClaimInGold);
  return { payout: payoutInGold, remainingCap: capAfterClaimInGold };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const capRemainingByPolicy = new Map<number, number>();
  return {
    results: scenario.steps.map((step, stepIndex): StepResult =>
      step.op === "quote"
        ? issueQuote(scenario, step, stepIndex)
        : settleClaim(scenario, step, capRemainingByPolicy),
    ),
  };
};
