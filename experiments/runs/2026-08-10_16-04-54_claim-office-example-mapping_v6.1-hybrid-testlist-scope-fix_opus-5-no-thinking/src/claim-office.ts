export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export type Customer = { yearsWithMHPCO: number };

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;

const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// Item types are looked up in several tables; an unknown type is always an error
// rather than a silent 0, whichever table asked.
const lookUpByItemType = (
  table: Record<string, number>,
  itemType: string,
): number => {
  const value = table[itemType];
  if (value === undefined) {
    throw new Error(`Unknown item type: ${itemType}`);
  }
  return value;
};

const basePremiumPerItemOf = (itemType: string): number =>
  lookUpByItemType(BASE_PREMIUM_BY_ITEM_TYPE, itemType);

// Percentages are always taken as `amount * percent / 100`, never `amount * 1.15`:
// exact fractional intermediates, a single rounding at the very end.
const PERCENT = 100;

const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / PERCENT;

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

const countByItemType = (items: Item[]): Map<string, number> =>
  items.reduce(
    (counts, item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1),
    new Map<string, number>(),
  );

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isComponent = (itemType: string): boolean =>
  COMPONENT_TYPES.has(itemType);

const basePremiumForCountOf = (itemType: string, count: number): number =>
  isComponent(itemType) && count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_BASE_PREMIUM
    : count * basePremiumPerItemOf(itemType);

const sum = (amounts: number[]): number =>
  amounts.reduce((total, amount) => total + amount, 0);

const policyBasePremiumOf = (items: Item[]): number =>
  sum(
    [...countByItemType(items)].map(([itemType, count]) =>
      basePremiumForCountOf(itemType, count),
    ),
  );

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;

const itemSurchargePercentOf = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_PERCENT : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0);

// Item-level modifiers apply to the affected ITEM's own base premium.
const itemSurchargesOf = (items: Item[]): number =>
  sum(
    items.map((item) =>
      percentOf(basePremiumPerItemOf(item.type), itemSurchargePercentOf(item)),
    ),
  );

const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

const isLongStanding = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS;

// Policy-wide modifiers are signed percentages OF THE POLICY BASE PREMIUM (the sum
// of item base premiums) — never of the running total, so item surcharges stay
// outside their scope. Positive is a surcharge, negative a discount. Adding a
// policy-wide modifier means adding one entry here.
const policyModifierPercentsOf = (
  customer: Customer,
  isFollowUpContract: boolean,
): number[] => [
  FIRST_INSURANCE_SURCHARGE_PERCENT,
  ...(isLongStanding(customer) ? [-LOYALTY_DISCOUNT_PERCENT] : []),
  ...(isFollowUpContract ? [-FOLLOW_UP_DISCOUNT_PERCENT] : []),
];

const quotePremium = (
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): number => {
  const policyBasePremium = policyBasePremiumOf(items);
  const policyModifiers = sum(
    policyModifierPercentsOf(customer, isFollowUpContract).map((percent) =>
      percentOf(policyBasePremium, percent),
    ),
  );

  // The processing fee is added last, after every modifier.
  return Math.ceil(
    policyBasePremium +
      itemSurchargesOf(items) +
      policyModifiers +
      PROCESSING_FEE,
  );
};

const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;

const insuranceValuePerItemOf = (itemType: string): number =>
  lookUpByItemType(INSURANCE_VALUE_BY_ITEM_TYPE, itemType);

const insuranceSumOf = (items: Item[]): number =>
  sum(items.map((item) => insuranceValuePerItemOf(item.type)));

// The claim-side enchantment threshold (8) is deliberately distinct from the
// premium-side one (HIGH_ENCHANTMENT_LEVEL, 5) — different rules, different numbers.
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_PERCENT = 50;

const isReducedReimbursement = (item: Item): boolean =>
  (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL;

// How much of the damage the policy covers, BEFORE the deductible. Heavily
// enchanted items are reimbursed at half; everything else in full. (The spec's
// "dragon material is fully reimbursed" clause is not expressed separately: full
// reimbursement is already the default here, and every dragon example agrees.)
const coveredAmountOf = (damage: Damage, item: Item): number =>
  isReducedReimbursement(item)
    ? percentOf(damage.amount, REDUCED_REIMBURSEMENT_PERCENT)
    : damage.amount;

const payoutForDamage = (damage: Damage, item: Item): number =>
  coveredAmountOf(damage, item) - DEDUCTIBLE_PER_DAMAGE;

// A policy is what a quote step leaves behind for later claim steps to draw on:
// the insured items and the cap those items entitle the holder to. `remainingCap`
// is the only thing a claim consumes, so it is the one mutable field.
type Policy = {
  insuredItems: Item[];
  remainingCap: number;
};

const issuePolicy = (insuredItems: Item[]): Policy => ({
  insuredItems,
  remainingCap: CAP_MULTIPLIER * insuranceSumOf(insuredItems),
});

// Each damage entry is a separate damaged item, so entries consume the insured
// items one for one: two sword damages need two insured swords.
const damagedItemsOf = (policy: Policy, damages: Damage[]): Item[] => {
  const unclaimedItems = [...policy.insuredItems];

  return damages.map((damage) => {
    if (damage.amount < 0) {
      throw new Error(
        `Damage amount must not be negative: ${damage.amount} for ${damage.itemType}`,
      );
    }

    const index = unclaimedItems.findIndex(
      (item) => item.type === damage.itemType,
    );
    if (index === -1) {
      throw new Error(
        `Damage entry not covered by the policy: ${damage.itemType}`,
      );
    }

    return unclaimedItems.splice(index, 1)[0];
  });
};

const settleClaim = (policy: Policy, damages: Damage[]): StepResult => {
  const damagedItems = damagedItemsOf(policy, damages);
  const desiredPayout = Math.floor(
    sum(
      damages.map((damage, index) =>
        payoutForDamage(damage, damagedItems[index]),
      ),
    ),
  );

  // The cap is a per-policy budget: what a claim pays out, it consumes.
  const payout = Math.min(desiredPayout, policy.remainingCap);
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): StepResult[] => {
  // A claim's `policy` is the index of the QUOTE STEP that issued it, so policies
  // are keyed by step index rather than by order of issue — the two differ as soon
  // as quotes and claims interleave.
  const policiesByStep = new Map<number, Policy>();

  const hasExistingPolicy = (): boolean => policiesByStep.size > 0;

  return scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      const policy = policiesByStep.get(step.policy);
      if (policy === undefined) {
        throw new Error(`Claim references no policy at step ${step.policy}`);
      }
      return settleClaim(policy, step.incident.damages);
    }

    const premium = quotePremium(
      step.items,
      scenario.customer,
      hasExistingPolicy(),
    );
    policiesByStep.set(stepIndex, issuePolicy(step.items));

    return { premium };
  });
};
