export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

export type QuoteStep = { op: "quote"; items: Item[] };

export type Damage = { itemType: string; amount: number };

export type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: (QuoteStep | ClaimStep)[];
};

export type ClaimResult = { payout: number; remainingCap: number };

export type Result = { premium: number } | ClaimResult;

export type ScenarioOutcome = { results: Result[] };

type CatalogueEntry = {
  basePremium: number; // per piece
  insuredValue: number; // per piece
  isComponent: boolean;
};

const ITEM_CATALOGUE: Record<string, CatalogueEntry> = {
  sword: { basePremium: 100, insuredValue: 1000, isComponent: false },
  amulet: { basePremium: 60, insuredValue: 600, isComponent: false },
  staff: { basePremium: 80, insuredValue: 800, isComponent: false },
  potion: { basePremium: 40, insuredValue: 400, isComponent: false },
  rune: { basePremium: 25, insuredValue: 250, isComponent: true },
  moonstone: { basePremium: 25, insuredValue: 250, isComponent: true },
};

// All percentages are expressed relative to a whole of 100 percent.
const WHOLE_PERCENT = 100;

// --- Quoting ---
// A full block of one component type is priced as a unit instead of per piece.
const COMPONENTS_PER_BLOCK = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSED_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

// --- Claims ---
// Deducted from every damaged item's claimed amount.
const DEDUCTIBLE = 100;
const FULL_REIMBURSEMENT_PERCENT = WHOLE_PERCENT;
// Damage to highly enchanted items is only partially reimbursed.
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;
const CAP_MULTIPLIER = 2;

// Integer-percent arithmetic avoids floating-point drift (e.g. 115.00000000000001).
const percentOf = (amount: number, percent: number): number => (amount * percent) / WHOLE_PERCENT;

const basePremiumForType = (type: string, count: number): number => {
  const { basePremium, isComponent } = ITEM_CATALOGUE[type];
  if (isComponent && count === COMPONENTS_PER_BLOCK) return COMPONENT_BLOCK_PREMIUM;
  return count * basePremium;
};

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
};

const sumBasePremiums = (items: Item[]): number =>
  [...countByType(items)].reduce((sum, [type, count]) => sum + basePremiumForType(type, count), 0);

const isHighlyEnchanted = (item: Item): boolean => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD;

// Item surcharges add up and apply to the item's per-piece base premium.
const itemSurchargePercent = (item: Item): number =>
  (item.cursed ? CURSED_SURCHARGE_PERCENT : 0) + (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0);

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + percentOf(ITEM_CATALOGUE[item.type].basePremium, itemSurchargePercent(item)), 0);

// Final amounts are rounded in MHPCO's favor: premiums up, payouts down. Intermediate values stay unrounded.
const roundUpInMHPCOsFavor = (amount: number): number => Math.ceil(amount);
const roundDownInMHPCOsFavor = (amount: number): number => Math.floor(amount);

const isLoyalCustomer = (yearsWithMHPCO: number): boolean => yearsWithMHPCO >= LOYALTY_YEARS;

// Policy-wide modifiers (surcharges positive, discounts negative) add up and apply to the policy base premium.
const policyModifierPercent = (yearsWithMHPCO: number, isFollowUpContract: boolean): number =>
  FIRST_INSURANCE_SURCHARGE_PERCENT -
  (isLoyalCustomer(yearsWithMHPCO) ? LOYALTY_DISCOUNT_PERCENT : 0) -
  (isFollowUpContract ? FOLLOW_UP_DISCOUNT_PERCENT : 0);

const isKnownItemType = (type: string): boolean => type in ITEM_CATALOGUE;

const assertKnownItemTypes = (items: Item[]): void => {
  const unknownItem = items.find((item) => !isKnownItemType(item.type));
  if (unknownItem) throw new Error(`Unknown item type: ${unknownItem.type}`);
};

const quotePremium = (items: Item[], yearsWithMHPCO: number, isFollowUpContract: boolean): number => {
  assertKnownItemTypes(items);
  const basePremium = sumBasePremiums(items);
  const policyModifier = percentOf(basePremium, policyModifierPercent(yearsWithMHPCO, isFollowUpContract));
  return roundUpInMHPCOsFavor(basePremium + sumItemSurcharges(items) + policyModifier + PROCESSING_FEE);
};

// Every contract after the customer's first one in the scenario is a follow-up contract.
const isFollowUpStep = (stepIndex: number): boolean => stepIndex > 0;

const reimbursementPercent = (item: Item | undefined): number =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD ? HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT : FULL_REIMBURSEMENT_PERCENT;

const insuredItemFor = (policyItems: Item[], damage: Damage): Item | undefined =>
  policyItems.find((item) => item.type === damage.itemType);

// Each damage entry must be backed by its own insured item of that type.
const assertDamagesCovered = (policyItems: Item[], damages: Damage[]): void => {
  const insuredCounts = countByType(policyItems);
  const damagedCounts = countByType(damages.map((damage) => ({ type: damage.itemType })));
  for (const [type, count] of damagedCounts) {
    if (count > (insuredCounts.get(type) ?? 0)) throw new Error(`Damaged item not covered by policy: ${type}`);
  }
};

const assertNonNegativeDamages = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) throw new Error(`Damage amount must not be negative: ${negative.amount}`);
};

const reimbursementFor = (policyItems: Item[], damage: Damage): number =>
  percentOf(damage.amount, reimbursementPercent(insuredItemFor(policyItems, damage))) - DEDUCTIBLE;

// Before rounding and before applying the policy cap.
const uncappedPayout = (policyItems: Item[], damages: Damage[]): number =>
  damages.reduce((sum, damage) => sum + reimbursementFor(policyItems, damage), 0);

const totalInsuredValue = (items: Item[]): number =>
  items.reduce((sum, item) => sum + ITEM_CATALOGUE[item.type].insuredValue, 0);

// A policy pays out at most CAP_MULTIPLIER times the insured items' total value.
const payoutCap = (items: Item[]): number => CAP_MULTIPLIER * totalInsuredValue(items);

const settleClaim = (policyItems: Item[], damages: Damage[], alreadyPaid: number): ClaimResult => {
  assertDamagesCovered(policyItems, damages);
  assertNonNegativeDamages(damages);
  const capLeft = payoutCap(policyItems) - alreadyPaid;
  const payout = Math.min(roundDownInMHPCOsFavor(uncappedPayout(policyItems, damages)), capLeft);
  return { payout, remainingCap: capLeft - payout };
};

// A claim's `policy` is the index of the quote step that created the policy.
const insuredItemsOf = (steps: Scenario["steps"], policy: number): Item[] => (steps[policy] as QuoteStep).items;

export const runScenario = (scenario: Scenario): ScenarioOutcome => {
  const paidPerPolicy = new Map<number, number>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === "claim") {
        const alreadyPaid = paidPerPolicy.get(step.policy) ?? 0;
        const result = settleClaim(insuredItemsOf(scenario.steps, step.policy), step.incident.damages, alreadyPaid);
        paidPerPolicy.set(step.policy, alreadyPaid + result.payout);
        return result;
      }
      return { premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, isFollowUpStep(index)) };
    }),
  };
};
