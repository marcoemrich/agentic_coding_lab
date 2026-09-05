const PROCESSING_FEE = 5;

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

// `op` is typed as a plain string because a scenario arrives as untrusted JSON;
// the discriminating narrowing happens in `runScenario`.
export type QuoteStep = {
  op: string;
  items: Item[];
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type ClaimStep = {
  op: string;
  policy: number;
  incident: Incident;
};

export type Step = QuoteStep | ClaimStep;

const isClaimStep = (step: Step): step is ClaimStep => step.op === "claim";

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

export type StepResult = QuoteResult | ClaimResult;

export type ScenarioResults = {
  results: StepResult[];
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// Percentages are applied as `amount * percent / 100` rather than
// `amount * 1.percent`, so that integer amounts stay exact: 100 * 1.1 is
// 110.00000000000001 in binary floating point, while 100 * 10 / 100 is 10.
// The 100 is the definition of "percent", not a domain constant, so it is left
// as a literal rather than named.
const percentOf = (amount: number, percent: number): number =>
  // eslint-disable-next-line no-magic-numbers
  (amount * percent) / 100;

const basePremium = (item: Item): number => BASE_PREMIUMS[item.type];

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

// Items of the same type are priced together, so a policy is partitioned into
// same-type groups before any group pricing rule is applied.
const groupByType = (items: Item[]): Item[][] => {
  const groupsByType = new Map<string, Item[]>();
  for (const item of items) {
    const alike = groupsByType.get(item.type) ?? [];
    alike.push(item);
    groupsByType.set(item.type, alike);
  }
  return [...groupsByType.values()];
};

const sumOf = <T>(values: T[], amount: (value: T) => number): number =>
  values.reduce((total, value) => total + amount(value), 0);

// A building block of exactly 3 alike components is offered at a flat rate.
const groupBasePremium = (alike: Item[]): number =>
  alike.length === BLOCK_SIZE
    ? BLOCK_BASE_PREMIUM
    : sumOf(alike, basePremium);

const itemsBasePremium = (items: Item[]): number =>
  sumOf(groupByType(items), groupBasePremium);

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;

const isCursed = (item: Item): boolean => item.cursed === true;

// Components such as runes carry no enchantment field; an absent level counts
// as 0, so they fall below every enchantment threshold.
const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_LEVEL;

// Each rule charges its percent of the affected item's own base premium.
type ItemSurchargeRule = {
  applies: (item: Item) => boolean;
  percent: number;
};

const ITEM_SURCHARGE_RULES: ItemSurchargeRule[] = [
  { applies: isCursed, percent: CURSE_SURCHARGE_PERCENT },
  { applies: isHighlyEnchanted, percent: HIGH_ENCHANTMENT_SURCHARGE_PERCENT },
];

// Item-specific surcharges apply to the base premium of the affected item.
// Several can apply to the same item, so every matching rule is summed.
const itemSurcharges = (item: Item): number => {
  const base = basePremium(item);
  return sumOf(
    ITEM_SURCHARGE_RULES.filter((rule) => rule.applies(item)),
    (rule) => percentOf(base, rule.percent),
  );
};

const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

const isLongStanding = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS;

// Who is buying, as opposed to what is being insured. Policy-wide modifiers
// depend only on this; item pricing depends only on the items.
type Customership = {
  customer: Customer;
  priorContracts: number;
};

// Policy-wide modifiers adjust the policy base; item-specific surcharges are
// computed against each item's own unmodified base. Both are ADDITIVE against
// the base rather than compounding, so they are summed side by side and never
// nested inside one another. Discounts are negative percentages.
//
// Each modifier is written as its own percent-of-the-policy-base summand, so
// adding one never changes how the others are computed.
const policyModifiers = (
  policyBase: number,
  { customer, priorContracts }: Customership,
): number => {
  const firstInsurance = percentOf(policyBase, FIRST_INSURANCE_SURCHARGE_PERCENT);
  const loyalty = isLongStanding(customer)
    ? -percentOf(policyBase, LOYALTY_DISCOUNT_PERCENT)
    : 0;
  const followUp =
    priorContracts > 0
      ? -percentOf(policyBase, FOLLOW_UP_DISCOUNT_PERCENT)
      : 0;
  return firstInsurance + loyalty + followUp;
};

const policyPremium = (items: Item[], customership: Customership): number => {
  const policyBase = itemsBasePremium(items);
  return (
    policyBase +
    policyModifiers(policyBase, customership) +
    sumOf(items, itemSurcharges)
  );
};

// Amounts are rounded in the MHPCO's favor, so the direction depends on which
// way the money flows: premiums (customer pays) round up. The payout
// counterpart rounds down; it is named for its direction for the same reason.
const roundUpPremium = (amount: number): number => Math.ceil(amount);
const roundDownPayout = (amount: number): number => Math.floor(amount);

const isOnPriceList = (item: Item): boolean => item.type in BASE_PREMIUMS;

// The office only insures what is on its price list. One uninsurable item
// rejects the whole policy, so the search stops at the first one found.
const rejectUnknownItemTypes = (items: Item[]): void => {
  const uninsurable = items.find((item) => !isOnPriceList(item));
  if (uninsurable) {
    throw new Error(
      `the MHPCO does not insure items of type ${uninsurable.type}`,
    );
  }
};

const quote = (step: QuoteStep, customership: Customership): QuoteResult => {
  rejectUnknownItemTypes(step.items);
  return {
    premium: roundUpPremium(
      PROCESSING_FEE + policyPremium(step.items, customership),
    ),
  };
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const insuranceValue = (item: Item): number => INSURANCE_VALUES[item.type];

const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;

// A policy, once quoted, carries the cap still available to future claims.
type Policy = {
  items: Item[];
  remainingCap: number;
};

const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: CAP_MULTIPLE * sumOf(items, insuranceValue),
});

// A separate, higher threshold than the premium surcharge's: enchantment >= 5
// makes an item dearer to insure, enchantment >= 8 makes it less reimbursable.
// The two rules move independently, so they keep independent constants.
const HALVED_REIMBURSEMENT_LEVEL = 8;
const HALVED_REIMBURSEMENT_PERCENT = 50;

const isHeavilyEnchanted = (item: Item): boolean =>
  enchantmentLevel(item) >= HALVED_REIMBURSEMENT_LEVEL;

// Damage to a heavily enchanted item is only half reimbursed. The clause
// reduces the damage amount; the deductible is taken afterwards.
const reimbursedDamage = (amount: number, item: Item): number =>
  isHeavilyEnchanted(item)
    ? percentOf(amount, HALVED_REIMBURSEMENT_PERCENT)
    : amount;

const damagePayout = (damage: Damage, items: Item[]): number => {
  const item = items.find((insured) => insured.type === damage.itemType)!;
  return reimbursedDamage(damage.amount, item) - DEDUCTIBLE;
};

// A tally of how often each type occurs. A type that never occurs is absent
// from the map rather than present with 0, so reads go through `countOf`.
type TypeCounts = Map<string, number>;

const countOf = (counts: TypeCounts, type: string): number =>
  counts.get(type) ?? 0;

const countByType = <T>(
  values: T[],
  typeOf: (value: T) => string,
): TypeCounts => {
  const counts: TypeCounts = new Map();
  for (const value of values) {
    const type = typeOf(value);
    counts.set(type, countOf(counts, type) + 1);
  }
  return counts;
};

// A damage is a loss, never a gain, so a negative amount is not a claim the
// office can process.
const rejectNegativeDamage = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(
        `damage to ${damage.itemType} has a negative amount ${damage.amount}`,
      );
    }
  }
};

// A policy cannot be claimed against more times per item type than it covers,
// so the whole claim is rejected before any of it is paid.
const rejectOverClaimed = (damages: Damage[], items: Item[]): void => {
  const insured = countByType(items, (item) => item.type);
  const claimed = countByType(damages, (damage) => damage.itemType);

  for (const [type, claims] of claimed) {
    const covered = countOf(insured, type);
    if (claims > covered) {
      throw new Error(
        `claim covers ${claims} ${type} damage(s) but the policy insures ${covered}`,
      );
    }
  }
};

// The total payout per policy is capped, so a claim pays out no more than the
// cap the policy has left. Only the damages are needed, not the whole step:
// the incident's cause does not affect what is paid.
const claim = (damages: Damage[], policy: Policy): ClaimResult => {
  rejectNegativeDamage(damages);
  rejectOverClaimed(damages, policy.items);

  // Only the final payout is rounded; the cap is then charged exactly what was
  // paid out, which also keeps the remaining cap a whole number.
  const uncappedPayout = roundDownPayout(
    sumOf(damages, (damage) => damagePayout(damage, policy.items)),
  );
  const payout = Math.min(uncappedPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = ({
  customer,
  steps,
}: Scenario): ScenarioResults => {
  // A claim's `policy` is the zero-based index of the STEP that quoted it, so
  // policies are keyed by step index. The customer's prior-contract count is a
  // different number — it counts only quote steps — so the two are tracked
  // separately.
  const policies = new Map<number, Policy>();
  let priorContracts = 0;

  const results = steps.map((step, index) => {
    if (isClaimStep(step)) {
      return claim(step.incident.damages, policies.get(step.policy)!);
    }
    policies.set(index, openPolicy(step.items));
    // Quoted against the contracts that came BEFORE this one, so this step is
    // counted only after it has been priced.
    const result = quote(step, { customer, priorContracts });
    priorContracts += 1;
    return result;
  });

  return { results };
};
