// An item type is any string: the scenario input is untrusted, and the
// specification requires unknown item types (e.g. "broomstick") to be
// reported as an error rather than rejected by the type checker.
export type ItemType = string;

export interface Item {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: ItemType;
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

export interface ScenarioResults {
  results: StepResult[];
}

// The single catalogue of item types MHPCO insures. Both the premium side and
// the claim side read from here, so "which item types exist" is stated once:
// an entry cannot be priced without also being claimable.
const INSURABLE_ITEMS: Record<ItemType, { basePremium: number; insuranceValue: number }> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

const basePremiumFor = (type: ItemType): number => INSURABLE_ITEMS[type].basePremium;

const insuranceValueFor = (type: ItemType): number => INSURABLE_ITEMS[type].insuranceValue;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const PROCESSING_FEE_IN_GOLD = 5;

const COMPONENT_TYPES = new Set<ItemType>(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

const countOccurrences = (types: ItemType[]): Map<ItemType, number> => {
  const counts = new Map<ItemType, number>();
  for (const type of types) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

const itemTypesIn = (items: Item[]): ItemType[] => items.map((item) => item.type);

const damagedItemTypesIn = (incident: Incident): ItemType[] =>
  incident.damages.map((damage) => damage.itemType);

// Exactly three alike components are priced as one block instead of item by item.
const formsComponentBlock = (type: ItemType, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE;

// Prices every item of one type together, because the block rule is about alike items.
const basePremiumForAlikeItems = (type: ItemType, count: number): number =>
  formsComponentBlock(type, count) ? COMPONENT_BLOCK_PREMIUM : count * basePremiumFor(type);

const basePremiumForPolicy = (items: Item[]): number =>
  [...countOccurrences(itemTypesIn(items))].reduce(
    (total, [type, count]) => total + basePremiumForAlikeItems(type, count),
    0,
  );

// Rounding always goes in MHPCO's favour, which means a *different direction*
// per quantity: premiums (money owed to MHPCO) round up, payouts (money owed by
// MHPCO) round down. Hence the `Premium` in the name -- this is not reusable for
// payouts.
const roundPremiumInMHPCOsFavour = (premium: number): number => Math.ceil(premium);

// Item-specific surcharges apply to the base premium of the affected item only,
// so they are summed item by item rather than applied to the policy base.
const perItemSurchargeForPolicy = (
  items: Item[],
  isAffected: (item: Item) => boolean,
  rate: number,
): number =>
  items
    .filter(isAffected)
    .reduce((total, item) => total + basePremiumFor(item.type) * rate, 0);

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const isCursed = (item: Item): boolean => item.cursed === true;

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

// Conditional policy-level discounts are a percentage of the policy base
// premium, charged only when their rule triggers.
const shareOfBasePremiumWhen = (
  policyBasePremium: number,
  rate: number,
  ruleApplies: boolean,
): number => (ruleApplies ? policyBasePremium * rate : 0);

// Kept as an explicit `base + surcharge` sum rather than `base * (1 + rate)`:
// the multiplicative form introduces floating-point error (60 * 1.1 = 66.000...01)
// and breaks the exact-premium tests.
const exactPolicyPremium = (
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): number => {
  const policyBasePremium = basePremiumForPolicy(items);
  const firstInsuranceSurcharge = policyBasePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = shareOfBasePremiumWhen(
    policyBasePremium,
    LOYALTY_DISCOUNT_RATE,
    isLoyal(customer),
  );
  const followUpDiscount = shareOfBasePremiumWhen(
    policyBasePremium,
    FOLLOW_UP_CONTRACT_DISCOUNT_RATE,
    isFollowUpContract,
  );
  return (
    policyBasePremium +
    perItemSurchargeForPolicy(items, isCursed, CURSE_SURCHARGE_RATE) +
    perItemSurchargeForPolicy(items, isHighlyEnchanted, HIGH_ENCHANTMENT_SURCHARGE_RATE) +
    firstInsuranceSurcharge -
    loyaltyDiscount -
    followUpDiscount +
    PROCESSING_FEE_IN_GOLD
  );
};

const quotePolicyPremium = (
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): number =>
  roundPremiumInMHPCOsFavour(exactPolicyPremium(items, customer, isFollowUpContract));

const DEDUCTIBLE_PER_DAMAGE_IN_GOLD = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

const insuranceSumForPolicy = (items: Item[]): number =>
  items.reduce((total, item) => total + insuranceValueFor(item.type), 0);

// Payouts are rounded down: rounding always goes in MHPCO's favour.
const roundPayoutInMHPCOsFavour = (payout: number): number => Math.floor(payout);

const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

// Damage to strongly enchanted items is only half reimbursed; the deductible
// is applied afterwards, so this is the amount *before* the deductible.
const coveredDamageBeforeDeductible = (damage: Damage, item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATE
    : damage.amount;

const payoutForDamage = (damage: Damage, item: Item): number =>
  Math.max(coveredDamageBeforeDeductible(damage, item) - DEDUCTIBLE_PER_DAMAGE_IN_GOLD, 0);

interface Policy {
  items: Item[];
  remainingCap: number;
}

// The cap is derived from insurance values only: premium modifiers (curse,
// enchantment, block discounts) never move it.
const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: CAP_MULTIPLE_OF_INSURANCE_SUM * insuranceSumForPolicy(items),
});

// A damage entry names the item type it refers to; the clauses that shape the
// payout (currently the enchantment clause) live on the insured item itself.
const insuredItemDamagedBy = (policy: Policy, damage: Damage): Item =>
  policy.items.find((item) => item.type === damage.itemType)!;

const claimedPayoutBeforeCap = (policy: Policy, incident: Incident): number =>
  incident.damages.reduce(
    (total, damage) => total + payoutForDamage(damage, insuredItemDamagedBy(policy, damage)),
    0,
  );

// Every damage entry is settled against its own insured item (and carries its
// own deductible), so a claim may not name more damaged items of a type than
// the policy insures.
const assertEveryDamageHasItsOwnInsuredItem = (policy: Policy, incident: Incident): void => {
  const insuredCounts = countOccurrences(itemTypesIn(policy.items));
  const damagedCounts = countOccurrences(damagedItemTypesIn(incident));
  for (const [type, damagedCount] of damagedCounts) {
    if (damagedCount > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`claim damages more items of type "${type}" than the policy covers`);
    }
  }
};

// Zero-damage entries are accepted (they simply pay nothing); only a negative
// amount is nonsense the office refuses to settle.
const assertDamageAmountsAreNotNegative = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount ${damage.amount} is negative`);
    }
  }
};

const settleClaim = (policy: Policy, incident: Incident): ClaimResult => {
  assertDamageAmountsAreNotNegative(incident);
  assertEveryDamageHasItsOwnInsuredItem(policy, incident);
  const payout = roundPayoutInMHPCOsFavour(
    Math.min(claimedPayoutBeforeCap(policy, incident), policy.remainingCap),
  );
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

// MHPCO can only quote and settle item types it lists in its catalogue; an
// unlisted type ("broomstick") is reported rather than silently priced as NaN.
const assertEveryItemTypeIsInsurable = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in INSURABLE_ITEMS)) {
      throw new Error(`unknown item type "${item.type}"`);
    }
  }
};

export const runScenario = (scenario: Scenario): ScenarioResults => {
  // Claims address a policy by the index of the quote step that opened it.
  const policiesByStepIndex = new Map<number, Policy>();
  const results = scenario.steps.map((step, stepIndex): StepResult => {
    if (step.op === "quote") {
      assertEveryItemTypeIsInsurable(step.items);
      // Every contract after the customer's first is a follow-up contract.
      const isFollowUpContract = policiesByStepIndex.size > 0;
      policiesByStepIndex.set(stepIndex, openPolicy(step.items));
      return {
        premium: quotePolicyPremium(step.items, scenario.customer, isFollowUpContract),
      };
    }
    return settleClaim(policiesByStepIndex.get(step.policy)!, step.incident);
  });
  return { results };
};
