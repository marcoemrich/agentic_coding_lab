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

const PROCESSING_FEE_G = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

// The MHPCO price list: every item type is listed with both of its prices,
// exactly as the price list states them.
interface PriceListEntry {
  insuranceValueG: number;
  basePremiumG: number;
}

// Components (runes, moonstones) share one row of the price list, so they
// share one entry here rather than repeating the same two prices.
const COMPONENT_PRICE_LIST_ENTRY: PriceListEntry = {
  insuranceValueG: 250,
  basePremiumG: 25,
};

const PRICE_LIST_BY_ITEM_TYPE: Record<string, PriceListEntry> = {
  sword: { insuranceValueG: 1000, basePremiumG: 100 },
  amulet: { insuranceValueG: 600, basePremiumG: 60 },
  staff: { insuranceValueG: 800, basePremiumG: 80 },
  potion: { insuranceValueG: 400, basePremiumG: 40 },
  rune: COMPONENT_PRICE_LIST_ENTRY,
  moonstone: COMPONENT_PRICE_LIST_ENTRY,
};

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM_G = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_MIN_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

// Premiums are rounded in MHPCO's favour, i.e. always up.
const roundPremiumInMHPCOFavor = (premium: number): number => Math.ceil(premium);

// Both pricing and claim matching ask the same question of a policy -- "which
// insured items share a type?" -- so they share one grouping.
const groupItemsByType = (items: Item[]): Map<string, Item[]> => {
  const byType = new Map<string, Item[]>();
  for (const item of items) {
    const alikeItems = byType.get(item.type) ?? [];
    alikeItems.push(item);
    byType.set(item.type, alikeItems);
  }
  return byType;
};

const priceListEntryFor = (type: string): PriceListEntry => {
  const entry = PRICE_LIST_BY_ITEM_TYPE[type];
  if (entry === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return entry;
};

const basePremiumOfItemType = (type: string): number =>
  priceListEntryFor(type).basePremiumG;

const insuranceValueOfItemType = (type: string): number =>
  priceListEntryFor(type).insuranceValueG;

const isPricedAsOneBlock = (type: string, count: number): boolean =>
  COMPONENT_TYPES.includes(type) && count === COMPONENT_BLOCK_SIZE;

const basePremiumForAlikeItems = (type: string, count: number): number =>
  isPricedAsOneBlock(type, count)
    ? COMPONENT_BLOCK_PREMIUM_G
    : count * basePremiumOfItemType(type);

const policyBasePremiumFor = (insuredItems: Item[]): number =>
  [...groupItemsByType(insuredItems)].reduce(
    (total, [type, alikeItems]) =>
      total + basePremiumForAlikeItems(type, alikeItems.length),
    0,
  );

// An unenchanted item is an item enchanted to level zero.
const enchantmentLevelOf = (item: Item): number => item.enchantment ?? 0;

// Item-specific modifiers apply to the base premium of the affected item,
// so each one is a rate on that item alone. Rates accumulate.
const surchargeRateFor = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_RATE : 0) +
  (enchantmentLevelOf(item) >= HIGH_ENCHANTMENT_LEVEL
    ? HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0);

const policyItemSurchargesFor = (insuredItems: Item[]): number =>
  insuredItems.reduce(
    (total, item) =>
      total + basePremiumOfItemType(item.type) * surchargeRateFor(item),
    0,
  );

// Customer-specific modifiers apply to the whole policy, so each one is a rate
// on the policy base premium. Rates accumulate; a discount is a negative rate.
const policyModifierRateFor = (
  yearsWithMHPCO: number,
  previousContractCount: number,
): number =>
  FIRST_INSURANCE_SURCHARGE_RATE -
  (yearsWithMHPCO >= LOYALTY_MIN_YEARS ? LOYALTY_DISCOUNT_RATE : 0) -
  (previousContractCount > 0 ? FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0);

const quotePremium = (
  insuredItems: Item[],
  yearsWithMHPCO: number,
  previousContractCount: number,
): number => {
  const policyBasePremium = policyBasePremiumFor(insuredItems);
  const modifierRate = policyModifierRateFor(
    yearsWithMHPCO,
    previousContractCount,
  );
  // Kept as `base + base * rate` rather than `base * (1 + rate)`: the latter
  // is not float-equivalent (100 * 1.1 === 110.00000000000001) and would round up.
  return roundPremiumInMHPCOFavor(
    policyBasePremium +
      policyBasePremium * modifierRate +
      policyItemSurchargesFor(insuredItems) +
      PROCESSING_FEE_G,
  );
};

const DEDUCTIBLE_PER_DAMAGE_G = 100;
const CAP_FACTOR = 2;

// Payouts are rounded in MHPCO's favour, i.e. always down.
const roundPayoutInMHPCOFavor = (payout: number): number => Math.floor(payout);

const insuranceSumFor = (insuredItems: Item[]): number =>
  insuredItems.reduce(
    (total, item) => total + insuranceValueOfItemType(item.type),
    0,
  );

const HALF_REIMBURSEMENT_ENCHANTMENT = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

// Damage to highly enchanted items is only reimbursed at 50 %.
const reimbursementRateFor = (item: Item): number =>
  enchantmentLevelOf(item) >= HALF_REIMBURSEMENT_ENCHANTMENT
    ? HALF_REIMBURSEMENT_RATE
    : 1;

// Every damage entry carries its own deductible.
const payoutForDamage = (damage: Damage, item: Item): number =>
  Math.max(0, damage.amount * reimbursementRateFor(item) - DEDUCTIBLE_PER_DAMAGE_G);

// A damage entry names the *type* of the item that took the damage; how that
// damage is reimbursed depends on the insured item behind that type. Each entry
// is a separate damage to a separate insured item, so the entries of a claim are
// matched one-to-one: a policy cannot absorb more entries of a type than it
// insures items of that type.
const matchDamagesToInsuredItems = (
  damages: Damage[],
  insuredItems: Item[],
): { damage: Damage; item: Item }[] => {
  const unmatchedByType = groupItemsByType(insuredItems);
  return damages.map((damage) => {
    const item = unmatchedByType.get(damage.itemType)?.shift();
    if (item === undefined) {
      throw new Error(`No insured item left for damaged type: ${damage.itemType}`);
    }
    return { damage, item };
  });
};

// The payout the damages add up to before the policy's remaining cap limits it.
const uncappedPayoutFor = (damages: Damage[], insuredItems: Item[]): number =>
  matchDamagesToInsuredItems(damages, insuredItems).reduce(
    (total, { damage, item }) => total + payoutForDamage(damage, item),
    0,
  );

// A policy only has to remember what it can still pay out; the cap starts at a
// multiple of the insurance sum and shrinks with every settled claim.
interface Policy {
  insuredItems: Item[];
  remainingCap: number;
}

const openPolicyFor = (insuredItems: Item[]): Policy => ({
  insuredItems,
  remainingCap: insuranceSumFor(insuredItems) * CAP_FACTOR,
});

// A damage is a loss, never a gain.
const rejectNegativeDamages = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative: ${damage.amount}`);
    }
  }
};

const settleClaim = (policy: Policy, damages: Damage[]): ClaimResult => {
  rejectNegativeDamages(damages);
  const payout = roundPayoutInMHPCOFavor(
    Math.min(uncappedPayoutFor(damages, policy.insuredItems), policy.remainingCap),
  );
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

// A policy is identified by the index of the quote step that opened it.
export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policiesByQuoteStep = new Map<number, Policy>();

  const runStep = (step: Step, stepIndex: number): StepResult => {
    if (step.op === "claim") {
      const policy = policiesByQuoteStep.get(step.policy)!;
      return settleClaim(policy, step.incident.damages);
    }
    // Every policy opened so far in this scenario is a previous contract, so
    // the open policies are the only record of them we need to keep.
    const premium = quotePremium(
      step.items,
      scenario.customer.yearsWithMHPCO,
      policiesByQuoteStep.size,
    );
    policiesByQuoteStep.set(stepIndex, openPolicyFor(step.items));
    return { premium };
  };

  return { results: scenario.steps.map(runStep) };
};
