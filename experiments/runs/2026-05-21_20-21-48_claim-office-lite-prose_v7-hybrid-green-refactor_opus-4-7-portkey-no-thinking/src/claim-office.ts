const basePriceByItemType: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const THREE_ALIKE_BUNDLE_BASE = 60;
const FIRST_INSURANCE_PERCENT = 110;
const CURSED_PERCENT = 150;
const ENCHANTMENT_PERCENT = 130;
const ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS_THRESHOLD = 2;
const REPEAT_CONTRACT_DISCOUNT_PERCENT = 15;
const FIXED_FEE = 5;

const DEDUCTIBLE = 100;
const ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;
const DRAGON_REIMBURSEMENT_PERCENT = 100;

const applyPercent = (amount: number, percent: number): number =>
  Math.ceil((amount * percent) / 100);

const applyPercentIf = (condition: boolean, amount: number, percent: number): number =>
  condition ? applyPercent(amount, percent) : amount;

const applyDiscount = (amount: number, discountPercent: number): number =>
  Math.floor((amount * (100 - discountPercent)) / 100);

const applyDiscountIf = (condition: boolean, amount: number, discountPercent: number): number =>
  condition ? applyDiscount(amount, discountPercent) : amount;

const isThreeAlikeBundle = (items: any[]): boolean =>
  items.length === 3 && items.every((i) => i.type === items[0].type);

const anyCursed = (items: any[]): boolean => items.some((i) => i.cursed);

const anyHighlyEnchanted = (items: any[]): boolean =>
  items.some((i) => i.enchantment >= ENCHANTMENT_THRESHOLD);

const baseFor = (items: any[]): number =>
  isThreeAlikeBundle(items)
    ? THREE_ALIKE_BUNDLE_BASE
    : basePriceByItemType[items[0].type];

const isLoyalCustomer = (yearsWithMHPCO: number): boolean =>
  yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const applyContractAdjustment = (amount: number, isRepeatContract: boolean): number =>
  isRepeatContract
    ? applyDiscount(amount, REPEAT_CONTRACT_DISCOUNT_PERCENT)
    : applyPercent(amount, FIRST_INSURANCE_PERCENT);

const quotePremium = (items: any[], yearsWithMHPCO: number, isRepeatContract: boolean): number => {
  const base = baseFor(items);
  const afterCursed = applyPercentIf(anyCursed(items), base, CURSED_PERCENT);
  const afterEnchantment = applyPercentIf(
    anyHighlyEnchanted(items),
    afterCursed,
    ENCHANTMENT_PERCENT,
  );
  const afterLoyalty = applyDiscountIf(
    isLoyalCustomer(yearsWithMHPCO),
    afterEnchantment,
    LOYALTY_DISCOUNT_PERCENT,
  );
  const afterContract = applyContractAdjustment(afterLoyalty, isRepeatContract);
  return afterContract + FIXED_FEE;
};

const reimbursementPercentFor = (item: any): number =>
  Math.max(
    item.enchantment >= ENCHANTMENT_REIMBURSEMENT_THRESHOLD ? ENCHANTMENT_REIMBURSEMENT_PERCENT : 0,
    item.material === "dragon" ? DRAGON_REIMBURSEMENT_PERCENT : 0,
  );

const computePayout = (items: any[], damages: any[]): number => {
  const reimbursement = damages.reduce((sum: number, damage: any) => {
    const item = items.find((i) => i.type === damage.itemType);
    const percent = item ? reimbursementPercentFor(item) : 0;
    return sum + (damage.amount * percent) / 100;
  }, 0);
  return Math.max(0, reimbursement - DEDUCTIBLE);
};

const isClaim = (step: any): boolean => step.op === "claim";

export const runScenario = (scenario: any): unknown => {
  const yearsWithMHPCO = scenario.customer?.yearsWithMHPCO ?? 0;
  const insuredItemsByStepIndex: Record<number, any[]> = {};
  let hasQuotedBefore = false;
  const results = scenario.steps.map((step: any, index: number) => {
    if (isClaim(step)) {
      const items = insuredItemsByStepIndex[step.policy];
      return { payout: computePayout(items, step.incident.damages) };
    }
    insuredItemsByStepIndex[index] = step.items;
    const isRepeatContract = hasQuotedBefore;
    hasQuotedBefore = true;
    return { premium: quotePremium(step.items, yearsWithMHPCO, isRepeatContract) };
  });
  return { results };
};
