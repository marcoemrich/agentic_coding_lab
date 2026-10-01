export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

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

export type Result = QuoteResult | ClaimResult;

const PROCESSING_FEE = 5;
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const BASE_PREMIUM_PERCENT_OF_VALUE = 10;
const CAP_MULTIPLIER = 2;
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

const percentOf = (percent: number, amount: number): number => (amount * percent) / 100;

const roundPremiumInMHPCOsFavour = (premium: number): number => Math.ceil(premium);

const roundPayoutInMHPCOsFavour = (payout: number): number => Math.floor(payout);

const loyaltyDiscountPercent = (yearsWithMHPCO: number): number =>
  yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_DISCOUNT_PERCENT : 0;

const followUpDiscountPercent = (isFollowUp: boolean): number => (isFollowUp ? FOLLOW_UP_DISCOUNT_PERCENT : 0);

const policyModifierPercent = (yearsWithMHPCO: number, isFollowUp: boolean): number =>
  FIRST_INSURANCE_SURCHARGE_PERCENT - loyaltyDiscountPercent(yearsWithMHPCO) - followUpDiscountPercent(isFollowUp);

const withPolicyModifiers = (basePremium: number, yearsWithMHPCO: number, isFollowUp: boolean): number =>
  basePremium + percentOf(policyModifierPercent(yearsWithMHPCO, isFollowUp), basePremium);

const insuranceValueOf = (item: Item): number => INSURANCE_VALUES[item.type];

const basePremiumOf = (item: Item): number => percentOf(BASE_PREMIUM_PERCENT_OF_VALUE, insuranceValueOf(item));

const sumOver = <T>(entries: T[], amountOf: (entry: T) => number): number =>
  entries.reduce((sum, entry) => sum + amountOf(entry), 0);

const countOfType = (items: Item[], type: string): number =>
  items.filter((item) => item.type === type).length;

const componentTypesPricedAsBlock = (items: Item[]): string[] =>
  COMPONENT_TYPES.filter((type) => countOfType(items, type) === COMPONENT_BLOCK_SIZE);

const totalBasePremium = (items: Item[]): number => {
  const blockedComponentTypes = componentTypesPricedAsBlock(items);
  const unblocked = items.filter((item) => !blockedComponentTypes.includes(item.type));
  return (
    blockedComponentTypes.length * COMPONENT_BLOCK_BASE_PREMIUM +
    sumOver(unblocked, basePremiumOf)
  );
};

const enchantmentOf = (item: Item | undefined): number => item?.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean => enchantmentOf(item) >= HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD;

const itemSurchargePercent = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_PERCENT : 0) + (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0);

const itemSurcharges = (items: Item[]): number =>
  sumOver(items, (item) => percentOf(itemSurchargePercent(item), basePremiumOf(item)));

const quotePremium = (items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number =>
  roundPremiumInMHPCOsFavour(
    withPolicyModifiers(totalBasePremium(items), yearsWithMHPCO, isFollowUp) + itemSurcharges(items) + PROCESSING_FEE,
  );

const damagedItem = (damage: Damage, policyItems: Item[]): Item | undefined =>
  policyItems.find((item) => item.type === damage.itemType);

const isOnlyPartiallyReimbursed = (item: Item | undefined): boolean =>
  enchantmentOf(item) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const reimbursedAmount = (damage: Damage, item: Item | undefined): number =>
  isOnlyPartiallyReimbursed(item)
    ? percentOf(HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT, damage.amount)
    : damage.amount;

const payoutPerDamagedItem = (damage: Damage, policyItems: Item[]): number =>
  reimbursedAmount(damage, damagedItem(damage, policyItems)) - DEDUCTIBLE;

const claimPayout = (damages: Damage[], policyItems: Item[]): number =>
  roundPayoutInMHPCOsFavour(sumOver(damages, (damage) => payoutPerDamagedItem(damage, policyItems)));

const payoutCap = (policyItems: Item[]): number =>
  CAP_MULTIPLIER * sumOver(policyItems, insuranceValueOf);

const damageCountOfType = (damages: Damage[], itemType: string): number =>
  damages.filter((damage) => damage.itemType === itemType).length;

const assertAllDamagedItemsInsured = (damages: Damage[], policyItems: Item[]): void => {
  const uninsured = damages.find((damage) => !damagedItem(damage, policyItems));
  if (uninsured) throw new Error(`Damaged item not covered by policy: ${uninsured.itemType}`);
  const overclaimed = damages.find(
    (damage) => damageCountOfType(damages, damage.itemType) > countOfType(policyItems, damage.itemType),
  );
  if (overclaimed) throw new Error(`More ${overclaimed.itemType} damages than insured items`);
};

const assertNoNegativeDamageAmounts = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) throw new Error(`Negative damage amount: ${negative.amount}`);
};

const settleClaim = (damages: Damage[], policyItems: Item[], capBefore: number): ClaimResult => {
  assertAllDamagedItemsInsured(damages, policyItems);
  assertNoNegativeDamageAmounts(damages);
  const payout = Math.min(claimPayout(damages, policyItems), capBefore);
  return { payout, remainingCap: capBefore - payout };
};

const isKnownItemType = (type: string): boolean => type in INSURANCE_VALUES;

const assertAllItemTypesKnown = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item.type));
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
};

const issueQuote = (items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): QuoteResult => {
  assertAllItemTypesKnown(items);
  return { premium: quotePremium(items, yearsWithMHPCO, isFollowUp) };
};

const insuredItemsOfPolicy = (steps: Step[], policy: number): Item[] =>
  (steps[policy] as Extract<Step, { op: "quote" }>).items;

export const runScenario = ({ customer, steps }: Scenario): { results: Result[] } => {
  const remainingCaps = new Map<number, number>();
  const results = steps.map((step, index): Result => {
    if (step.op === "claim") {
      const policyItems = insuredItemsOfPolicy(steps, step.policy);
      const capBefore = remainingCaps.get(step.policy) ?? payoutCap(policyItems);
      const result = settleClaim(step.incident.damages, policyItems, capBefore);
      remainingCaps.set(step.policy, result.remainingCap);
      return result;
    }
    const isFollowUp = index > 0;
    return issueQuote(step.items, customer.yearsWithMHPCO, isFollowUp);
  });
  return { results };
};
