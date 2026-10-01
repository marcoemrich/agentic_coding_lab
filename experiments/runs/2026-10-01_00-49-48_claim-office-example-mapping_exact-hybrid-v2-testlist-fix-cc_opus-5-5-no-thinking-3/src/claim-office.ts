type Customer = { yearsWithMHPCO: number };
type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = { premium: number } | ClaimResult;
type ScenarioOutcome = { results: StepResult[] };

type CatalogEntry = { insuranceValue: number; basePremium: number };

// The MHPCO price list.
const ITEM_CATALOG: Record<string, CatalogEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;
const FULL_REIMBURSEMENT_PERCENT = 100;
const FIRST_INSURANCE_PERCENT = 10;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const CURSED_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;
const PROCESSING_FEE = 5;
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

// Integer percent math (amount * percent / 100) avoids float drift like 60 * 0.1.
const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / 100;

// Only final amounts are rounded, always in MHPCO's favor:
// premiums round up, payouts round down.
const roundPremiumInMHPCOsFavor = (premium: number): number =>
  Math.ceil(premium);
const roundPayoutInMHPCOsFavor = (payout: number): number =>
  Math.floor(payout);

// A building block requires exactly COMPONENT_BLOCK_SIZE alike components.
const premiumForAlikeItems = (type: string, count: number): number =>
  COMPONENT_TYPES.includes(type) && count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * ITEM_CATALOG[type].basePremium;

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const basePremium = (items: Item[]): number =>
  [...countByType(items)].reduce(
    (sum, [type, count]) => sum + premiumForAlikeItems(type, count),
    0,
  );

const isHighlyEnchantedForPremium = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;

const itemSurchargePercent = (item: Item): number =>
  (item.cursed ? CURSED_SURCHARGE_PERCENT : 0) +
  (isHighlyEnchantedForPremium(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0);

const itemSurcharges = (items: Item[]): number =>
  items.reduce(
    (sum, item) =>
      sum +
      percentOf(
        ITEM_CATALOG[item.type].basePremium,
        itemSurchargePercent(item),
      ),
    0,
  );

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS;

// Policy-wide modifiers apply to the policy base, not to item surcharges.
const policyModifierPercent = (
  customer: Customer,
  isFollowUp: boolean,
): number =>
  FIRST_INSURANCE_PERCENT -
  (isLoyalCustomer(customer) ? LOYALTY_DISCOUNT_PERCENT : 0) -
  (isFollowUp ? FOLLOW_UP_DISCOUNT_PERCENT : 0);

const isKnownItemType = (type: string): boolean => type in ITEM_CATALOG;

const assertKnownItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item.type));
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
};

const quotePremium = (
  items: Item[],
  customer: Customer,
  isFollowUp: boolean,
): number => {
  assertKnownItemTypes(items);
  const policyBase = basePremium(items);
  return roundPremiumInMHPCOsFavor(
    policyBase +
      itemSurcharges(items) +
      percentOf(policyBase, policyModifierPercent(customer, isFollowUp)) +
      PROCESSING_FEE,
  );
};

// Every contract after the customer's first one in a scenario is a follow-up.
const isFollowUpContract = (stepIndex: number): boolean => stepIndex > 0;

// The cap is based on the policy's unmodified insurance values.
const coverageCap = (policyItems: Item[]): number =>
  CAP_MULTIPLIER *
  policyItems.reduce(
    (sum, item) => sum + ITEM_CATALOG[item.type].insuranceValue,
    0,
  );

const isHighlyEnchantedForClaims = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL;

const reimbursementPercent = (item: Item): number =>
  isHighlyEnchantedForClaims(item)
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT
    : FULL_REIMBURSEMENT_PERCENT;

// Each damaged item carries its own deductible.
const reimbursementFor = (damage: Damage, item: Item): number =>
  percentOf(damage.amount, reimbursementPercent(item)) - DEDUCTIBLE;

const insuredItemFor = (policyItems: Item[], damage: Damage): Item =>
  policyItems.find((item) => item.type === damage.itemType) as Item;

const totalReimbursement = (policyItems: Item[], damages: Damage[]): number =>
  damages.reduce(
    (sum, damage) =>
      sum + reimbursementFor(damage, insuredItemFor(policyItems, damage)),
    0,
  );

const damagedItems = (damages: Damage[]): Item[] =>
  damages.map((damage) => ({ type: damage.itemType }));

// A claim may not cover more items of a type than the policy insures.
const assertDamagesWithinInsuredItems = (
  policyItems: Item[],
  damages: Damage[],
): void => {
  const insuredCounts = countByType(policyItems);
  for (const [type, count] of countByType(damagedItems(damages))) {
    if (count > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`Claim exceeds insured items of type: ${type}`);
    }
  }
};

const assertNonNegativeDamages = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) throw new Error(`Negative damage amount: ${negative.amount}`);
};

const processClaim = (
  policyItems: Item[],
  damages: Damage[],
  remainingCap: number,
): ClaimResult => {
  assertNonNegativeDamages(damages);
  assertDamagesWithinInsuredItems(policyItems, damages);
  const reimbursement = roundPayoutInMHPCOsFavor(
    totalReimbursement(policyItems, damages),
  );
  // MHPCO never pays out more than the policy's remaining coverage cap.
  const payout = Math.min(remainingCap, reimbursement);
  return { payout, remainingCap: remainingCap - payout };
};

// A claim refers to its policy by the index of the quote step that created it.
const policyItemsOf = (steps: Step[], policy: number): Item[] =>
  (steps[policy] as QuoteStep).items;

// Remaining coverage caps are tracked per policy across the scenario's claims.
type RemainingCaps = Map<number, number>;

const fileClaim = (
  steps: Step[],
  claim: ClaimStep,
  remainingCaps: RemainingCaps,
): ClaimResult => {
  const policyItems = policyItemsOf(steps, claim.policy);
  const result = processClaim(
    policyItems,
    claim.incident.damages,
    remainingCaps.get(claim.policy) ?? coverageCap(policyItems),
  );
  remainingCaps.set(claim.policy, result.remainingCap);
  return result;
};

export const runScenario = (scenario: Scenario): ScenarioOutcome => {
  const remainingCaps: RemainingCaps = new Map();
  return {
    results: scenario.steps.map((step, stepIndex) =>
      step.op === "claim"
        ? fileClaim(scenario.steps, step, remainingCaps)
        : {
            premium: quotePremium(
              step.items,
              scenario.customer,
              isFollowUpContract(stepIndex),
            ),
          },
    ),
  };
};
