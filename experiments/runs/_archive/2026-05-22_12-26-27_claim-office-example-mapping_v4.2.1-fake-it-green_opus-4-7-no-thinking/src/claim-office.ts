export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteInput {
  items: Item[];
  yearsWithMHPCO?: number;
  firstInsurance?: boolean;
  followUp?: boolean;
}

export interface QuoteResult {
  premium: number;
}

const PROCESSING_FEE = 5;
const DEFAULT_BASE_PREMIUM = 100;
const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

function unmodifiedBasePremiumFor(item: Item): number {
  return BASE_PREMIUM_BY_TYPE[item.type] ?? DEFAULT_BASE_PREMIUM;
}

function basePremiumFor(item: Item): number {
  const base = unmodifiedBasePremiumFor(item);
  const highEnchantmentSurcharge =
    item.enchantment !== undefined && item.enchantment >= 5
      ? HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  const curseSurcharge = item.cursed ? CURSE_SURCHARGE_RATE : 0;
  return base * (1 + highEnchantmentSurcharge + curseSurcharge);
}

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_MIN_YEARS = 2;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function rateOfBaseWhen(
  condition: boolean | undefined,
  basePremium: number,
  rate: number,
): number {
  return condition ? basePremium * rate : 0;
}

function groupByType(items: Item[]): Map<string, Item[]> {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return groups;
}

function basePremiumForGroup(group: Item[]): number {
  if (group.length === BLOCK_SIZE) {
    return BLOCK_PREMIUM;
  }
  return group.reduce((sum, item) => sum + basePremiumFor(item), 0);
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

function insuranceValueFor(item: Item): number {
  return INSURANCE_VALUE_BY_TYPE[item.type] ?? 0;
}

function capFor(items: Item[]): number {
  const insuranceSum = items.reduce(
    (sum, item) => sum + insuranceValueFor(item),
    0,
  );
  return CAP_MULTIPLIER * insuranceSum;
}

const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function reimbursableFor(item: Item | undefined, amount: number): number {
  if (
    item?.enchantment !== undefined &&
    item.enchantment >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD
  ) {
    return amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return amount;
}

function payoutForDamage(items: Item[], damage: Damage): number {
  const item = items.find((candidate) => candidate.type === damage.itemType);
  const reimbursable = reimbursableFor(item, damage.amount);
  return Math.max(0, reimbursable - DEDUCTIBLE);
}

function rawPayoutFor(items: Item[], incident: Incident): number {
  return incident.damages.reduce(
    (sum, damage) => sum + payoutForDamage(items, damage),
    0,
  );
}

export function claim(
  items: Item[],
  incident: Incident,
  currentCap: number = capFor(items),
): ClaimResult {
  const payout = Math.min(Math.floor(rawPayoutFor(items, incident)), currentCap);
  const remainingCap = currentCap - payout;
  return { payout, remainingCap };
}

export function quote(input: QuoteInput): QuoteResult {
  const groups = [...groupByType(input.items).values()];
  const basePremium = groups.reduce(
    (sum, group) => sum + basePremiumForGroup(group),
    0,
  );

  const unmodifiedBasePremium = input.items.reduce(
    (sum, item) => sum + unmodifiedBasePremiumFor(item),
    0,
  );

  const firstInsuranceSurcharge = rateOfBaseWhen(
    input.firstInsurance,
    unmodifiedBasePremium,
    FIRST_INSURANCE_SURCHARGE_RATE,
  );

  const followUpDiscount = rateOfBaseWhen(
    input.followUp,
    unmodifiedBasePremium,
    FOLLOW_UP_DISCOUNT_RATE,
  );

  const qualifiesForLoyalty =
    input.yearsWithMHPCO !== undefined &&
    input.yearsWithMHPCO >= LOYALTY_MIN_YEARS;
  const loyaltyDiscount = rateOfBaseWhen(
    qualifiesForLoyalty,
    unmodifiedBasePremium,
    LOYALTY_DISCOUNT_RATE,
  );

  const surcharges = firstInsuranceSurcharge;
  const discounts = loyaltyDiscount + followUpDiscount;

  const rawPremium = basePremium + surcharges - discounts + PROCESSING_FEE;

  return {
    premium: Math.ceil(rawPremium),
  };
}
