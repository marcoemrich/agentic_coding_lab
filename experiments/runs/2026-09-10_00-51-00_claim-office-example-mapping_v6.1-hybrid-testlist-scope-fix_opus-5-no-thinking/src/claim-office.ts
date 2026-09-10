const PROCESSING_FEE = 5;

type ItemType = "sword" | "amulet" | "staff" | "potion" | "rune" | "moonstone";

const BASE_PREMIUM_BY_TYPE: Record<ItemType, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE_BY_TYPE: Record<ItemType, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

type Item = {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type QuoteStep = { op: "quote"; items: Item[] };

type Damage = { itemType: ItemType; amount: number };

type Incident = { cause: string; damages: Damage[] };

type ClaimStep = { op: "claim"; policy: number; incident: Incident };

type Step = QuoteStep | ClaimStep;

type Customer = { yearsWithMHPCO: number };

type Scenario = { customer: Customer; steps: Step[] };

type QuoteResult = { premium: number };

type ClaimResult = { payout: number; remainingCap: number };

type Result = QuoteResult | ClaimResult;

// A policy created by a quote step, tracked so later claims can draw on its cap.
type Policy = { items: Item[]; remainingCap: number };

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

const COMPONENT_TYPES: ReadonlySet<ItemType> = new Set(["rune", "moonstone"]);

// A group holds every item of one type, so the group's type identifies all of them.
type SameTypeGroup = { type: ItemType; items: Item[] };

const groupByType = (items: Item[]): SameTypeGroup[] => {
  const itemsByType = new Map<ItemType, Item[]>();
  for (const item of items) {
    itemsByType.set(item.type, [...(itemsByType.get(item.type) ?? []), item]);
  }
  return [...itemsByType].map(([type, grouped]) => ({ type, items: grouped }));
};

const isComponentBlock = (group: SameTypeGroup): boolean =>
  COMPONENT_TYPES.has(group.type) && group.items.length === COMPONENT_BLOCK_SIZE;

// A guard states what every element must satisfy and how to describe an
// offender, so each rule reads as a rule rather than as a loop.
const rejectAny = <T>(
  values: T[],
  isAllowed: (value: T) => boolean,
  describeOffender: (value: T) => string,
): void => {
  const offender = values.find((value) => !isAllowed(value));
  if (offender !== undefined) {
    throw new Error(describeOffender(offender));
  }
};

const isInsurable = (item: Item): boolean => item.type in BASE_PREMIUM_BY_TYPE;

const rejectUninsurableItems = (items: Item[]): void =>
  rejectAny(
    items,
    isInsurable,
    (item) => `The MHPCO does not insure items of type "${item.type}"`,
  );

const basePremiumFor = (item: Item): number => BASE_PREMIUM_BY_TYPE[item.type];

const sumOf = <T>(values: T[], amountFor: (value: T) => number): number =>
  values.reduce((sum, value) => sum + amountFor(value), 0);

const basePremiumForGroup = (group: SameTypeGroup): number =>
  isComponentBlock(group)
    ? COMPONENT_BLOCK_BASE_PREMIUM
    : sumOf(group.items, basePremiumFor);

const basePremiumForItems = (items: Item[]): number =>
  sumOf(groupByType(items), basePremiumForGroup);

// A modifier is a signed rate applied to some base premium: a surcharge is
// positive, a discount negative. It only counts when its condition holds.
type Modifier = { rate: number; applies: boolean };

const surcharge = (rate: number, applies: boolean): Modifier => ({
  rate,
  applies,
});

const discount = (rate: number, applies: boolean): Modifier => ({
  rate: -rate,
  applies,
});

const modifierAmount = (basePremium: number, modifier: Modifier): number =>
  modifier.applies ? basePremium * modifier.rate : 0;

const modifierTotalFor = (basePremium: number, modifiers: Modifier[]): number =>
  sumOf(modifiers, (modifier) => modifierAmount(basePremium, modifier));

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

// An item without an enchantment counts as enchantment level 0.
const enchantmentLevelOf = (item: Item): number => item.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentLevelOf(item) >= HIGH_ENCHANTMENT_LEVEL;

// Item modifiers are rates on the item's own base premium.
const itemModifiersFor = (item: Item): Modifier[] => [
  surcharge(CURSE_SURCHARGE_RATE, item.cursed === true),
  surcharge(HIGH_ENCHANTMENT_SURCHARGE_RATE, isHighlyEnchanted(item)),
];

const itemModifierTotalFor = (item: Item): number =>
  modifierTotalFor(basePremiumFor(item), itemModifiersFor(item));

const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS;

// Policy modifiers are rates on the whole policy's base premium. Every quote's
// items count as a first insurance, whatever the customer's history.
const ALWAYS = true;

const policyModifiersFor = (
  customer: Customer,
  isFollowUpContract: boolean,
): Modifier[] => [
  discount(LOYALTY_DISCOUNT_RATE, isLoyal(customer)),
  surcharge(FIRST_INSURANCE_SURCHARGE_RATE, ALWAYS),
  discount(FOLLOW_UP_DISCOUNT_RATE, isFollowUpContract),
];

// The MHPCO rounds in its own favour: premiums up, payouts down.
const roundPremiumUpInMHPCOsFavour = (premium: number): number =>
  Math.ceil(premium);

const quote = (
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): QuoteResult => {
  rejectUninsurableItems(items);
  const basePremium = basePremiumForItems(items);
  const itemModifiers = sumOf(items, itemModifierTotalFor);
  const policyModifiers = modifierTotalFor(
    basePremium,
    policyModifiersFor(customer, isFollowUpContract),
  );
  return {
    premium: roundPremiumUpInMHPCOsFavour(
      basePremium + itemModifiers + policyModifiers + PROCESSING_FEE,
    ),
  };
};

const DEDUCTIBLE_PER_DAMAGE = 100;

const insuranceValueFor = (item: Item): number =>
  INSURANCE_VALUE_BY_TYPE[item.type];

const CAP_MULTIPLE = 2;

const capFor = (items: Item[]): number =>
  CAP_MULTIPLE * sumOf(items, insuranceValueFor);

const HALF_REIMBURSED_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

// Damage to a very highly enchanted item is only half reimbursed.
const reimbursementRateFor = (item: Item): number =>
  enchantmentLevelOf(item) >= HALF_REIMBURSED_ENCHANTMENT_LEVEL
    ? HALF_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

const payoutForDamage = (damage: Damage, item: Item): number =>
  damage.amount * reimbursementRateFor(item) - DEDUCTIBLE_PER_DAMAGE;

const roundPayoutDownInMHPCOsFavour = (payout: number): number =>
  Math.floor(payout);

// A damage entry paired with the insured item it was suffered by.
type DamagedItem = { damage: Damage; item: Item };

const NOT_FOUND = -1;

// Removes and returns the first item of that type, or reports that the policy
// has none left to claim against.
const takeInsuredItem = (unclaimed: Item[], itemType: ItemType): Item => {
  const index = unclaimed.findIndex(({ type }) => type === itemType);
  if (index === NOT_FOUND) {
    throw new Error(
      `The policy does not cover that many items of type "${itemType}"`,
    );
  }
  const [item] = unclaimed.splice(index, 1);
  return item;
};

// Each damage entry is a separate damage to a separate insured item, so every
// entry consumes one of the policy's items of that type.
const matchDamagesToInsuredItems = (
  policy: Policy,
  damages: Damage[],
): DamagedItem[] => {
  const unclaimed = [...policy.items];
  return damages.map((damage) => ({
    damage,
    item: takeInsuredItem(unclaimed, damage.itemType),
  }));
};

// A policy never pays out more than it has left of its cap.
const limitedToRemainingCap = (desiredPayout: number, policy: Policy): number =>
  Math.min(desiredPayout, policy.remainingCap);

const desiredPayoutFor = (policy: Policy, incident: Incident): number =>
  roundPayoutDownInMHPCOsFavour(
    sumOf(
      matchDamagesToInsuredItems(policy, incident.damages),
      ({ damage, item }) => payoutForDamage(damage, item),
    ),
  );

// Paying a claim draws the payout off the policy's cap for good.
const drawFromCap = (policy: Policy, payout: number): number => {
  policy.remainingCap -= payout;
  return policy.remainingCap;
};

const isNonNegativeDamage = ({ amount }: Damage): boolean => amount >= 0;

const rejectNegativeDamages = (damages: Damage[]): void =>
  rejectAny(
    damages,
    isNonNegativeDamage,
    ({ amount }) => `A damage cannot be negative, but was ${amount} G`,
  );

const claim = (policy: Policy, incident: Incident): ClaimResult => {
  rejectNegativeDamages(incident.damages);
  const payout = limitedToRemainingCap(
    desiredPayoutFor(policy, incident),
    policy,
  );
  return { payout, remainingCap: drawFromCap(policy, payout) };
};

const isQuoteStep = (step: Step): step is QuoteStep => step.op === "quote";

// A claim names its policy by the index of the quote step that created it, so
// only a step that was a quote can be claimed against.
const policyCreatedByStep = (
  policies: Map<number, Policy>,
  stepIndex: number,
): Policy => {
  const policy = policies.get(stepIndex);
  if (policy === undefined) {
    throw new Error(`No policy was created by step ${stepIndex}`);
  }
  return policy;
};

// A step is a follow-up contract when the customer already holds one from an
// earlier step of this scenario, so every quote but the first.
export const runScenario = (scenario: Scenario): { results: Result[] } => {
  const policies = new Map<number, Policy>();

  const resultOf = (step: Step, index: number): Result => {
    if (isQuoteStep(step)) {
      const premium = quote(step.items, scenario.customer, policies.size > 0);
      policies.set(index, {
        items: step.items,
        remainingCap: capFor(step.items),
      });
      return premium;
    }
    return claim(policyCreatedByStep(policies, step.policy), step.incident);
  };

  return { results: scenario.steps.map(resultOf) };
};
