export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Damage = { itemType: string; amount: number };

export type QuoteStep = { op: "quote"; items: Item[] };
export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
export type Step = QuoteStep | ClaimStep;

export type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type Result = QuoteResult | ClaimResult;

type PriceListEntry = { insuranceValue: number; basePremium: number };

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

const priceListEntryOf = (item: Item): PriceListEntry => {
  const entry = PRICE_LIST[item.type];
  if (entry === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return entry;
};

const basePremiumOf = (item: Item): number => priceListEntryOf(item).basePremium;

const insuranceValueOf = (item: Item): number =>
  priceListEntryOf(item).insuranceValue;

const ALIKE_BLOCK_SIZE = 3;
const ALIKE_BLOCK_PREMIUM = 60;

const groupByType = (items: Item[]): Item[][] => [
  ...items
    .reduce(
      (groups, item) =>
        groups.set(item.type, [...(groups.get(item.type) ?? []), item]),
      new Map<string, Item[]>(),
    )
    .values(),
];

const groupPremiumOf = (group: Item[]): number =>
  group.length === ALIKE_BLOCK_SIZE
    ? ALIKE_BLOCK_PREMIUM
    : group.reduce((sum, item) => sum + basePremiumOf(item), 0);

const totalBasePremiumOf = (items: Item[]): number =>
  groupByType(items).reduce((sum, group) => sum + groupPremiumOf(group), 0);

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const curseSurchargeOf = (item: Item): number =>
  item.cursed ? basePremiumOf(item) * CURSE_SURCHARGE_RATE : 0;

const enchantmentSurchargeOf = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? basePremiumOf(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;

const itemSurchargeOf = (item: Item): number =>
  curseSurchargeOf(item) + enchantmentSurchargeOf(item);

const totalItemSurchargeOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurchargeOf(item), 0);

const LOYALTY_MIN_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

const loyaltyDiscountOf = (basePremium: number, yearsWithMHPCO: number): number =>
  yearsWithMHPCO >= LOYALTY_MIN_YEARS ? basePremium * LOYALTY_DISCOUNT_RATE : 0;

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const followUpDiscountOf = (basePremium: number, isFollowUpContract: boolean): number =>
  isFollowUpContract ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;

type PolicyContext = { yearsWithMHPCO: number; isFollowUpContract: boolean };

// Fractions are always rounded in MHPCO's favor.
const roundPremiumUp = Math.ceil;
const roundPayoutDown = Math.floor;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const quotePremiumOf = (items: Item[], context: PolicyContext): number => {
  const basePremium = totalBasePremiumOf(items);
  const itemSurcharge = totalItemSurchargeOf(items);
  const loyaltyDiscount = loyaltyDiscountOf(basePremium, context.yearsWithMHPCO);
  const followUpDiscount = followUpDiscountOf(basePremium, context.isFollowUpContract);
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  return roundPremiumUp(
    basePremium +
      itemSurcharge -
      loyaltyDiscount -
      followUpDiscount +
      firstInsuranceSurcharge +
      PROCESSING_FEE,
  );
};

const DEDUCTIBLE = 100;
const PAYOUT_CAP_MULTIPLIER = 2;

const insuranceSumOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueOf(item), 0);

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const insuredItemOf = (damage: Damage, policyItems: Item[]): Item | undefined =>
  policyItems.find((candidate) => candidate.type === damage.itemType);

const reimbursementOf = (damage: Damage, item: Item | undefined): number =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;

const payoutOf = (damage: Damage, policyItems: Item[]): number =>
  reimbursementOf(damage, insuredItemOf(damage, policyItems)) - DEDUCTIBLE;

const countWhere = <T>(list: T[], matches: (entry: T) => boolean): number =>
  list.filter(matches).length;

const damagedCountOfType = (type: string, damages: Damage[]): number =>
  countWhere(damages, (damage) => damage.itemType === type);

const insuredCountOfType = (type: string, policyItems: Item[]): number =>
  countWhere(policyItems, (item) => item.type === type);

const assertNoNegativeDamages = (damages: Damage[]): void => {
  for (const { amount } of damages) {
    if (amount < 0) {
      throw new Error(`Claim rejected: negative damage amount ${amount}`);
    }
  }
};

const assertDamagesCovered = (damages: Damage[], policyItems: Item[]): void => {
  for (const { itemType } of damages) {
    if (damagedCountOfType(itemType, damages) > insuredCountOfType(itemType, policyItems)) {
      throw new Error(`Claim rejected: more damaged ${itemType} entries than insured`);
    }
  }
};

const assertValidClaim = (damages: Damage[], policyItems: Item[]): void => {
  assertNoNegativeDamages(damages);
  assertDamagesCovered(damages, policyItems);
};

const totalPayoutOf = (damages: Damage[], policyItems: Item[]): number =>
  damages.reduce((sum, damage) => sum + payoutOf(damage, policyItems), 0);

type Policy = { items: Item[]; remainingCap: number };

const policyOf = (items: Item[]): Policy => ({
  items,
  remainingCap: PAYOUT_CAP_MULTIPLIER * insuranceSumOf(items),
});

const settleClaim = (step: ClaimStep, policy: Policy): ClaimResult => {
  assertValidClaim(step.incident.damages, policy.items);
  const desiredPayout = totalPayoutOf(step.incident.damages, policy.items);
  const payout = roundPayoutDown(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): { results: Result[] } => {
  const policiesByStepIndex = new Map<number, Policy>();

  const quote = (step: QuoteStep, index: number): QuoteResult => {
    policiesByStepIndex.set(index, policyOf(step.items));
    return {
      premium: quotePremiumOf(step.items, {
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        isFollowUpContract: index > 0,
      }),
    };
  };

  const claim = (step: ClaimStep): ClaimResult =>
    settleClaim(step, policiesByStepIndex.get(step.policy) as Policy);

  const results = scenario.steps.map((step, index): Result =>
    step.op === "quote" ? quote(step, index) : claim(step),
  );
  return { results };
};
