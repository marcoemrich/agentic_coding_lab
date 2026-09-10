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

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
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

// ---------------------------------------------------------------------------
// Price list
// ---------------------------------------------------------------------------

// The MHPCO price list: what each item type is insured for and what it costs to insure.
interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

// The single gate to the price list: any item type not listed here cannot be insured.
const priceListEntry = (type: string): PriceListEntry => {
  const entry = PRICE_LIST[type];
  if (entry === undefined) throw new Error(`Unknown item type: ${type}`);
  return entry;
};

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

// Whole-G rounding always goes in the MHPCO's favor: premiums up, payouts down.
const roundPremiumInFavorOfMHPCO = (amount: number): number => Math.ceil(amount);
const roundPayoutInFavorOfMHPCO = (amount: number): number => Math.floor(amount);

const countOccurrences = (keys: string[]): Map<string, number> =>
  keys.reduce(
    (counts, key) => counts.set(key, (counts.get(key) ?? 0) + 1),
    new Map<string, number>(),
  );

const countByType = (items: Item[]): Map<string, number> =>
  countOccurrences(items.map((item) => item.type));

// ---------------------------------------------------------------------------
// Quote: premium calculation
// ---------------------------------------------------------------------------

const PROCESSING_FEE = 5;
const ALIKE_BLOCK_SIZE = 3;
const ALIKE_BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

// Exactly three alike items form a discounted block; any other count is priced per item.
const alikeItemsPremium = (type: string, count: number): number =>
  count === ALIKE_BLOCK_SIZE
    ? ALIKE_BLOCK_PREMIUM
    : count * priceListEntry(type).basePremium;

const policyBasePremium = (items: Item[]): number =>
  [...countByType(items)].reduce(
    (sum, [type, count]) => sum + alikeItemsPremium(type, count),
    0,
  );

// Item-specific modifiers apply to the affected item's own base premium.
interface ItemRiskModifier {
  appliesTo: (item: Item) => boolean;
  rate: number;
}

const ITEM_RISK_MODIFIERS: ItemRiskModifier[] = [
  { appliesTo: (item) => item.cursed === true, rate: CURSE_SURCHARGE_RATE },
  {
    appliesTo: (item) =>
      (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD,
    rate: HIGH_ENCHANTMENT_SURCHARGE_RATE,
  },
];

const itemRiskSurchargeRate = (item: Item): number =>
  ITEM_RISK_MODIFIERS.filter((modifier) => modifier.appliesTo(item)).reduce(
    (rate, modifier) => rate + modifier.rate,
    0,
  );

const itemRiskSurcharges = (items: Item[]): number =>
  items.reduce(
    (sum, item) =>
      sum + priceListEntry(item.type).basePremium * itemRiskSurchargeRate(item),
    0,
  );

// Policy-wide modifiers apply to the policy base premium as a whole.
const loyaltyDiscountRate = (yearsWithMHPCO: number): number =>
  yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? LOYALTY_DISCOUNT_RATE : 0;

const policyWideAdjustments = (
  basePremium: number,
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number =>
  basePremium * FIRST_INSURANCE_SURCHARGE_RATE -
  basePremium * loyaltyDiscountRate(yearsWithMHPCO) -
  (isFollowUpContract ? basePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0);

const quotePremium = (
  items: Item[],
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number => {
  const basePremium = policyBasePremium(items);
  return roundPremiumInFavorOfMHPCO(
    basePremium +
      itemRiskSurcharges(items) +
      policyWideAdjustments(basePremium, yearsWithMHPCO, isFollowUpContract) +
      PROCESSING_FEE,
  );
};

// ---------------------------------------------------------------------------
// Claim: validation, payout and cap
// ---------------------------------------------------------------------------

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

const rejectNegativeDamages = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
};

// Each damage must be backed by its own insured item: an item type that is not on the
// policy at all is just the case of zero insured items of that type.
const rejectExcessDamages = (damages: Damage[], insuredItems: Item[]): void => {
  const insuredCounts = countByType(insuredItems);
  const damagedCounts = countOccurrences(damages.map((damage) => damage.itemType));
  for (const [type, damaged] of damagedCounts) {
    const insured = insuredCounts.get(type) ?? 0;
    if (damaged > insured) {
      throw new Error(`Claimed ${damaged} damaged ${type}(s) but only ${insured} insured`);
    }
  }
};

const validateDamages = (damages: Damage[], insuredItems: Item[]): void => {
  rejectNegativeDamages(damages);
  rejectExcessDamages(damages, insuredItems);
};

// Highly enchanted items are only partially reimbursed; everything else in full.
const reimbursementRate = (insuredItem: Item): number =>
  (insuredItem.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;

// Safe only after validateDamages has verified every damage has an insured item.
const insuredItemFor = (damage: Damage, insuredItems: Item[]): Item =>
  insuredItems.find((item) => item.type === damage.itemType) as Item;

// The deductible is charged once per damaged item, not once per claim.
const damagePayout = (damage: Damage, insuredItems: Item[]): number =>
  damage.amount * reimbursementRate(insuredItemFor(damage, insuredItems)) -
  DEDUCTIBLE;

const claimPayout = (damages: Damage[], insuredItems: Item[]): number => {
  validateDamages(damages, insuredItems);
  return damages.reduce(
    (sum, damage) => sum + damagePayout(damage, insuredItems),
    0,
  );
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + priceListEntry(item.type).insuranceValue, 0);

// An issued policy: the insured items plus how much of the payout cap is still available.
interface Policy {
  items: Item[];
  remainingCap: number;
}

const issuePolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: insuranceSum(items) * CAP_MULTIPLIER,
});

const settleClaim = (
  claim: ClaimStep,
  policy: Policy,
): { result: ClaimResult; updatedPolicy: Policy } => {
  const desiredPayout = roundPayoutInFavorOfMHPCO(
    claimPayout(claim.incident.damages, policy.items),
  );
  const payout = Math.min(desiredPayout, policy.remainingCap);
  const updatedPolicy = { ...policy, remainingCap: policy.remainingCap - payout };
  return {
    result: { payout, remainingCap: updatedPolicy.remainingCap },
    updatedPolicy,
  };
};

// ---------------------------------------------------------------------------
// Scenario runner
// ---------------------------------------------------------------------------

// Every contract after the customer's first one in the scenario is a follow-up.
const isFollowUpContract = (stepIndex: number): boolean => stepIndex > 0;

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const { yearsWithMHPCO } = scenario.customer;
  // Policies are keyed by the index of the quote step that issued them.
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "quote") {
      policies.set(index, issuePolicy(step.items));
      return {
        premium: quotePremium(step.items, yearsWithMHPCO, isFollowUpContract(index)),
      };
    }
    const { result, updatedPolicy } = settleClaim(step, policies.get(step.policy) as Policy);
    policies.set(step.policy, updatedPolicy);
    return result;
  });
  return { results };
};
