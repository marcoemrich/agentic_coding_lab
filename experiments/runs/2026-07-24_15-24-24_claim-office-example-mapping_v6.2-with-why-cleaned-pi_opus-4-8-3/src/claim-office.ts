// MHPCO price list: base premium in gold per item type.
// Extend this table as new item types are covered by tests.
const basePremiumByType: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

// A "building block" of components earns a discounted flat base premium
// instead of the sum of its parts.
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

// Every per-item value is the item type's entry in a per-type price table.
const valueByType = (table: Record<string, number>) => (item: Item): number => {
  const value = table[item.type];
  if (value === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return value;
};

const basePremiumForItem = valueByType(basePremiumByType);

// Sum a per-item value across every item in the list.
const sumBy = (items: Item[], valueOf: (item: Item) => number): number =>
  items.reduce((sum, one) => sum + valueOf(one), 0);

const sumOfItemPremiums = (items: Item[]): number =>
  sumBy(items, basePremiumForItem);

// A block is exactly BLOCK_SIZE components that are all the same type.
const isBlockOfAlikeComponents = (items: Item[]): boolean =>
  items.length === BLOCK_SIZE &&
  items.every((one) => one.type === items[0].type);

const premiumForGroup = (items: Item[]): number =>
  isBlockOfAlikeComponents(items) ? BLOCK_BASE_PREMIUM : sumOfItemPremiums(items);

const groupByType = (items: Item[]): Item[][] => {
  const byType = new Map<string, Item[]>();
  for (const item of items) {
    const group = byType.get(item.type) ?? [];
    group.push(item);
    byType.set(item.type, group);
  }
  return [...byType.values()];
};

export const basePremium = (itemOrItems: Item | Item[]): number => {
  if (!Array.isArray(itemOrItems)) return basePremiumForItem(itemOrItems);
  return groupByType(itemOrItems).reduce(
    (total, group) => total + premiumForGroup(group),
    0,
  );
};

const PROCESSING_FEE = 5;

type QuoteInput = {
  items: Item[];
  yearsWithMHPCO: number;
  isFollowUpContract: boolean;
};

const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

// The total surcharge rate is the sum of every applicable per-item modifier.
// Add new item modifiers (e.g. high-enchantment) as further terms here.
const isHighEnchantment = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const surchargeRateForItem = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE : 0) +
  (isHighEnchantment(item) ? HIGH_ENCHANTMENT_SURCHARGE : 0);

const surchargeForItem = (item: Item): number =>
  basePremiumForItem(item) * surchargeRateForItem(item);

const sumOfItemSurcharges = (items: Item[]): number =>
  sumBy(items, surchargeForItem);

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT = 0.15;

// The net policy-wide rate is the sum of every applicable policy-level modifier
// (surcharges positive, discounts negative), applied to the policy base premium.
// Add new policy-wide modifiers (e.g. follow-up-contract discount) as further terms here.
const policyWideRate = ({ yearsWithMHPCO, isFollowUpContract }: QuoteInput): number =>
  FIRST_INSURANCE_SURCHARGE -
  (yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? LOYALTY_DISCOUNT : 0) -
  (isFollowUpContract ? FOLLOW_UP_DISCOUNT : 0);

export const quote = (input: QuoteInput): number => {
  const policyBase = basePremium(input.items);
  const perItemSurcharges = sumOfItemSurcharges(input.items);
  const policyWideAdjustment = policyBase * policyWideRate(input);
  return policyBase + perItemSurcharges + policyWideAdjustment + PROCESSING_FEE;
};

// MHPCO insured value in gold, per item type.
// Extend this table as new item types are covered by tests.
const insuranceValueByType: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const insuranceValueForItem = valueByType(insuranceValueByType);

export const insuranceSum = (items: Item[]): number =>
  sumBy(items, insuranceValueForItem);

const CAP_MULTIPLIER = 2;

export const capFor = (items: Item[]): number =>
  insuranceSum(items) * CAP_MULTIPLIER;

// Both roundings resolve fractional gold in MHPCO's favour:
// premiums (money coming in) round UP, payouts (money going out) round DOWN.
export const roundPremium = (amount: number): number => Math.ceil(amount);

export const roundPayout = (amount: number): number => Math.floor(amount);

const DEDUCTIBLE = 100;

type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimResult = { payout: number; remainingCap: number };

const FULL_REIMBURSEMENT_RATE = 1;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

// The fraction of a damage amount MHPCO reimburses, before the deductible.
// Special clauses override the default full rate; add new clauses (e.g. the
// dragon-material full reimbursement) as further cases here.
const reimbursementRateForItem = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
    ? HIGH_ENCHANTMENT_PAYOUT_RATE
    : FULL_REIMBURSEMENT_RATE;

// Each damaged item is reimbursed at its damage amount (adjusted for special
// clauses) less the deductible.
const payoutForDamage = (damage: Damage, item: Item): number =>
  damage.amount * reimbursementRateForItem(item) - DEDUCTIBLE;

// A damage paired with the specific covered item it is claimed against.
type MatchedDamage = { damage: Damage; item: Item };

// Matches each damage to a distinct covered item of the same type. Throws when a
// damage has no matching (unused) item, so over-claiming or unknown items are rejected.
const matchDamagesToItems = (damages: Damage[], items: Item[]): MatchedDamage[] => {
  const available = [...items];
  return damages.map((damage) => {
    const index = available.findIndex((one) => one.type === damage.itemType);
    if (index === -1)
      throw new Error(`Damage refers to item not covered by policy: ${damage.itemType}`);
    return { damage, item: available.splice(index, 1)[0] };
  });
};

// A damage amount is money lost; a negative amount is nonsensical and rejected
// up front so no claim is computed from invalid input.
const assertNonNegativeDamages = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0)
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
  }
};

const totalPayout = (damages: Damage[], items: Item[]): number =>
  matchDamagesToItems(damages, items).reduce(
    (sum, { damage, item }) => sum + payoutForDamage(damage, item),
    0,
  );

export const claim = (
  items: Item[],
  incident: Incident,
  remainingCap: number = capFor(items),
): ClaimResult => {
  assertNonNegativeDamages(incident.damages);
  const desiredPayout = totalPayout(incident.damages, items);
  const payout = Math.min(desiredPayout, remainingCap);
  return { payout, remainingCap: remainingCap - payout };
};

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
type StepResult = { premium: number } | ClaimResult;

// A quoted policy: the covered items and the cap still available for future claims.
type Policy = { items: Item[]; remainingCap: number };

export const processScenario = (input: Scenario): { results: StepResult[] } => {
  const { customer, steps } = input;
  const policies = new Map<number, Policy>();

  const results = steps.map((step, index): StepResult => {
    if (step.op === "quote") {
      // The first quote in a scenario is a new customer; any later quote is a
      // follow-up contract, so its follow-up discount depends on prior policies.
      const isFollowUpContract = policies.size > 0;
      policies.set(index, { items: step.items, remainingCap: capFor(step.items) });
      const premium = quote({
        items: step.items,
        yearsWithMHPCO: customer.yearsWithMHPCO,
        isFollowUpContract,
      });
      return { premium: roundPremium(premium) };
    }
    const policy = policies.get(step.policy)!;
    const result = claim(policy.items, step.incident, policy.remainingCap);
    policy.remainingCap = result.remainingCap;
    return { payout: roundPayout(result.payout), remainingCap: result.remainingCap };
  });

  return { results };
};
