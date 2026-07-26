export type Item = {
  type: string;
  cursed?: boolean;
  enchantment?: number;
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type Step = {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: Incident;
};

export type Customer = {
  yearsWithMHPCO: number;
};

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteResult = {
  premium: number;
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

export type Result = QuoteResult | ClaimResult;

export type ScenarioOutcome = {
  results: Result[];
};

const PROCESSING_FEE = 5;

// The price list is the single source of the insurable item types: an item type
// is known exactly when it has a row here, and each row carries both the base
// premium a quote is built from and the insurance value a claim's cap is built
// from.
type PriceListRow = {
  basePremium: number;
  insuranceValue: number;
};

const PRICE_LIST: Record<string, PriceListRow> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

const basePremiumOfType = (type: string): number =>
  PRICE_LIST[type].basePremium;

const insuranceValueOfType = (type: string): number =>
  PRICE_LIST[type].insuranceValue;

// Percentages are applied as the exact fraction `amount * percent / 100`
// rather than via a float factor such as `amount * 0.1`, which drifts.
const PERCENT_BASE = 100;
const percentOf = (percent: number, amount: number): number =>
  (amount * percent) / PERCENT_BASE;

const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const firstInsuranceSurchargeOn = (policyBasePremium: number): number =>
  percentOf(FIRST_INSURANCE_SURCHARGE_PERCENT, policyBasePremium);

const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

// Discounts attached to the policy are percentages of the policy base premium,
// so they can be summed as percentages and applied in one go.
const policyDiscountsOn = (
  policyBasePremium: number,
  customer: Customer,
  contractsAlreadyIssued: number,
): number => {
  const loyaltyPercent =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
      ? LOYALTY_DISCOUNT_PERCENT
      : 0;
  const followUpPercent =
    contractsAlreadyIssued > 0 ? FOLLOW_UP_DISCOUNT_PERCENT : 0;
  return percentOf(loyaltyPercent + followUpPercent, policyBasePremium);
};

// Surcharges attached to a single item are a percentage of that item's own
// base premium from the price list (never of the policy base premium).
const surchargeForItem = (item: Item): number => {
  const cursePercent = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const highEnchantmentPercent =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT
      : 0;
  return percentOf(
    cursePercent + highEnchantmentPercent,
    basePremiumOfType(item.type),
  );
};

const itemSurchargesOf = (items: Item[]): number =>
  items.reduce((total, item) => total + surchargeForItem(item), 0);

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

// A group of exactly BLOCK_SIZE alike components forms a block and is charged
// a flat BLOCK_BASE_PREMIUM instead of the per-item price list rate. Main
// items never form a block.
const basePremiumForAlikeItems = (type: string, count: number): number =>
  COMPONENT_TYPES.has(type) && count === BLOCK_SIZE
    ? BLOCK_BASE_PREMIUM
    : count * basePremiumOfType(type);

// An item type that is not on the price list has neither a premium nor an
// insurance value, so neither a quote nor a claim can name one; rejecting it
// keeps a typo from silently becoming a NaN amount.
const rejectUnknownItemType = (type: string): void => {
  if (!(type in PRICE_LIST)) {
    throw new Error(`unknown item type: ${type}`);
  }
};

const rejectUnknownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    rejectUnknownItemType(item.type);
  }
};

const policyBasePremiumOf = (items: Item[]): number =>
  [...countByType(items)].reduce(
    (total, [type, count]) => total + basePremiumForAlikeItems(type, count),
    0,
  );

// The processing fee is added after every percentage modifier, so it is never
// itself discounted. Only the final premium is rounded, and always up.
const premiumFor = (
  items: Item[],
  customer: Customer,
  contractsAlreadyIssued: number,
): number => {
  rejectUnknownItemTypes(items);
  const policyBasePremium = policyBasePremiumOf(items);
  const surcharges =
    itemSurchargesOf(items) + firstInsuranceSurchargeOn(policyBasePremium);
  const discounts = policyDiscountsOn(
    policyBasePremium,
    customer,
    contractsAlreadyIssued,
  );
  return Math.ceil(
    policyBasePremium + surcharges - discounts + PROCESSING_FEE,
  );
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

// The cap is twice the insurance sum of the policy's items, taken from the
// unmodified insurance values in the price list.
const insuranceSumOf = (items: Item[]): number =>
  items.reduce((total, item) => total + insuranceValueOfType(item.type), 0);

const HALF_REIMBURSEMENT_PERCENT = 50;
const HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;

// The reimbursement rate of a damage depends on the damaged item itself, so
// the damage entry is matched against the insured items of its policy.
const reimbursableAmountFor = (damage: Damage, item: Item): number =>
  (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD
    ? percentOf(HALF_REIMBURSEMENT_PERCENT, damage.amount)
    : damage.amount;

// A damage can only be settled against an item the policy actually insures.
const insuredItemFor = (damage: Damage, insuredItems: Item[]): Item => {
  const item = insuredItems.find(({ type }) => type === damage.itemType);
  if (item === undefined) {
    throw new Error(`item type not covered by the policy: ${damage.itemType}`);
  }
  return item;
};

const payoutForDamage = (damage: Damage, insuredItems: Item[]): number =>
  reimbursableAmountFor(damage, insuredItemFor(damage, insuredItems)) -
  DEDUCTIBLE;

// A damage entry stands for one damaged item, so a policy insuring one sword
// cannot back two sword damages.
const rejectMoreDamagesThanInsuredItems = (
  damages: Damage[],
  insuredItems: Item[],
): void => {
  const insuredCounts = countByType(insuredItems);
  const damageCounts = countByType(
    damages.map(({ itemType }) => ({ type: itemType })),
  );
  for (const [type, count] of damageCounts) {
    if (count > (insuredCounts.get(type) ?? 0)) {
      throw new Error(
        `more damage entries than insured items for item type: ${type}`,
      );
    }
  }
};

// A single unsettleable damage rejects the whole claim, so every damage is
// checked before any of them is paid out. The checks are listed in the order
// they are reported: the most specific complaint about a damage entry wins.
const rejectUnsettleableDamages = (
  damages: Damage[],
  insuredItems: Item[],
): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
    rejectUnknownItemType(damage.itemType);
    insuredItemFor(damage, insuredItems); // throws if the policy does not cover it
  }
  rejectMoreDamagesThanInsuredItems(damages, insuredItems);
};

// The cap belongs to the policy, not to the single claim, so successive claims
// on the same policy share it and each payout is clamped to what is left.
const claimResultFor = (
  damages: Damage[],
  insuredItems: Item[],
  capAlreadyConsumed: number,
): ClaimResult => {
  rejectUnsettleableDamages(damages, insuredItems);
  const remainingCapBefore =
    CAP_MULTIPLIER * insuranceSumOf(insuredItems) - capAlreadyConsumed;
  const reimbursable = damages.reduce(
    (total, damage) => total + payoutForDamage(damage, insuredItems),
    0,
  );
  const payout = Math.floor(Math.min(reimbursable, remainingCapBefore));
  return { payout, remainingCap: remainingCapBefore - payout };
};

// Only a quote issues a contract; a claim step is not a contract and must not
// advance the count the follow-up discount is based on.
const issuesContract = (step: Step): boolean => step.op !== "claim";

// A scenario is a sequence of steps against one customer, and the steps are not
// independent: a quote sees how many contracts came before it, and a claim sees
// how much of its policy's cap earlier claims already consumed.
export const runScenario = (scenario: Scenario): ScenarioOutcome => {
  const capConsumedByPolicy = new Map<number, number>();
  let contractsAlreadyIssued = 0;

  const quoteFor = (step: Step): QuoteResult => {
    const premium = premiumFor(
      step.items ?? [],
      scenario.customer,
      contractsAlreadyIssued,
    );
    contractsAlreadyIssued += 1;
    return { premium };
  };

  const settlementFor = (step: Step): ClaimResult => {
    const policyIndex = step.policy ?? 0;
    const capAlreadyConsumed = capConsumedByPolicy.get(policyIndex) ?? 0;
    const result = claimResultFor(
      step.incident?.damages ?? [],
      scenario.steps[policyIndex].items ?? [],
      capAlreadyConsumed,
    );
    capConsumedByPolicy.set(policyIndex, capAlreadyConsumed + result.payout);
    return result;
  };

  const results = scenario.steps.map((step) =>
    issuesContract(step) ? quoteFor(step) : settlementFor(step),
  );
  return { results };
};
