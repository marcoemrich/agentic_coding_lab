type Quote = { premium: number };
type Item = {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
};
type QuoteInput = {
  customer?: { yearsWithMHPCO: number };
  firstInsurance?: boolean;
  followUp?: boolean;
  items: Item[];
};

const PROCESSING_FEE = 5;
const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  staff: 80,
  amulet: 60,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const ALIKE_BLOCK_SIZE = 3;
const ALIKE_BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const basePremiumFor = (item: Item): number => {
  const basePremium = BASE_PREMIUM_BY_TYPE[item.type];
  if (basePremium === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return basePremium;
};

const curseSurchargeRateFor = (item: Item): number =>
  item.cursed ? CURSE_SURCHARGE_RATE : 0;

const enchantmentSurchargeRateFor = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;

const totalSurchargeRateFor = (item: Item): number =>
  curseSurchargeRateFor(item) + enchantmentSurchargeRateFor(item);

const itemPremiumFor = (item: Item): number =>
  basePremiumFor(item) * (1 + totalSurchargeRateFor(item));

const sumBy = <T>(items: T[], valueFn: (item: T) => number): number =>
  items.reduce((sum, item) => sum + valueFn(item), 0);

const sumItemPremiums = (items: Item[]): number => sumBy(items, itemPremiumFor);

const isAlikeBlock = (items: Item[]): boolean =>
  items.length === ALIKE_BLOCK_SIZE &&
  items.every((item) => item.type === items[0].type);

const componentsPremium = (items: Item[]): number =>
  isAlikeBlock(items) ? ALIKE_BLOCK_PREMIUM : sumItemPremiums(items);

const loyaltyDiscountRateFor = (input: QuoteInput): number =>
  (input.customer?.yearsWithMHPCO ?? 0) >= LOYALTY_YEARS_THRESHOLD
    ? LOYALTY_DISCOUNT_RATE
    : 0;

const firstInsuranceSurchargeRateFor = (input: QuoteInput): number =>
  input.firstInsurance ? FIRST_INSURANCE_SURCHARGE_RATE : 0;

const followUpDiscountRateFor = (input: QuoteInput): number =>
  input.followUp ? FOLLOW_UP_DISCOUNT_RATE : 0;

const policyAdjustmentRateFor = (input: QuoteInput): number =>
  firstInsuranceSurchargeRateFor(input) -
  loyaltyDiscountRateFor(input) -
  followUpDiscountRateFor(input);

export const quote = (input: QuoteInput): Quote => {
  const componentsTotal = componentsPremium(input.items);
  const policyTotal = componentsTotal + componentsTotal * policyAdjustmentRateFor(input);
  return { premium: Math.ceil(policyTotal + PROCESSING_FEE) };
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const DEDUCTIBLE = 100;
const FULL_REIMBURSEMENT_RATE = 1;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

type Damage = { itemType: string; amount: number };
type ClaimInput = {
  policy: { items: Item[] };
  incident: { damages: Damage[] };
};
type ClaimResult = { payout: number; remainingCap: number };

const reimbursementRateFor = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

const insuranceValueFor = (item: Item): number =>
  INSURANCE_VALUE_BY_TYPE[item.type];

const policyCoverageCap = (items: Item[]): number =>
  CAP_MULTIPLIER * sumBy(items, insuranceValueFor);

const findInsuredItem = (items: Item[], itemType: string): Item =>
  items.find((item) => item.type === itemType)!;

const damagePayoutFor = (items: Item[], damage: Damage): number =>
  damage.amount * reimbursementRateFor(findInsuredItem(items, damage.itemType)) -
  DEDUCTIBLE;

const validateDamage = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
};

export const claim = (input: ClaimInput): ClaimResult => {
  input.incident.damages.forEach(validateDamage);
  const rawPayout = sumBy(input.incident.damages, (damage) =>
    damagePayoutFor(input.policy.items, damage),
  );
  const cap = policyCoverageCap(input.policy.items);
  const payout = Math.min(rawPayout, cap);
  return { payout, remainingCap: cap - payout };
};
