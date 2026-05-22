export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteOptions {
  followUp?: boolean;
}

export interface QuoteResult {
  basePremium: number;
  premium: number;
  items: Item[];
  remainingCap?: number;
}

const basePremiumByType: Record<string, number> = {
  amulet: 60,
  sword: 100,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const PROCESSING_FEE = 5;
const BLOCK_OF_THREE_PREMIUM = 60;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

function countBy<T>(elements: T[], keyOf: (element: T) => string): Record<string, number> {
  return elements.reduce<Record<string, number>>((counts, element) => {
    const key = keyOf(element);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function enchantmentLevel(item: Item): number {
  return item.enchantment ?? 0;
}

function surchargeRateFor(item: Item): number {
  let rate = 0;
  if (item.cursed) rate += CURSE_SURCHARGE_RATE;
  if (enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD) rate += HIGH_ENCHANTMENT_SURCHARGE_RATE;
  return rate;
}

function surchargeFor(item: Item): number {
  return basePremiumByType[item.type] * surchargeRateFor(item);
}

function premiumForTypeBlock(type: string, count: number): number {
  if (count === 3) return BLOCK_OF_THREE_PREMIUM;
  return count * basePremiumByType[type];
}

function validateInsurableTypes(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in basePremiumByType)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

export function quote(
  customer: Customer,
  items: Item[],
  options: QuoteOptions = {},
): QuoteResult {
  validateInsurableTypes(items);
  const countByType = countBy(items, (item) => item.type);
  const baseWithoutSurcharges = Object.entries(countByType).reduce(
    (sum, [type, count]) => sum + premiumForTypeBlock(type, count),
    0,
  );
  const surcharges = items.reduce((sum, item) => sum + surchargeFor(item), 0);
  const basePremium = baseWithoutSurcharges + surcharges;

  let premium = basePremium;
  if (customer.yearsWithMHPCO >= 2) premium -= baseWithoutSurcharges * LOYALTY_DISCOUNT_RATE;
  premium += baseWithoutSurcharges * FIRST_INSURANCE_RATE;
  if (options.followUp) premium -= baseWithoutSurcharges * FOLLOW_UP_DISCOUNT_RATE;
  premium = Math.ceil(premium + PROCESSING_FEE);

  return { basePremium, premium, items };
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

const insuranceValueByType: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

function totalInsuranceValue(policy: QuoteResult): number {
  return policy.items.reduce((sum, item) => sum + insuranceValueByType[item.type], 0);
}

function remainingCapFor(policy: QuoteResult): number {
  return policy.remainingCap ?? CAP_MULTIPLIER * totalInsuranceValue(policy);
}

function assertNonNegativeDamage(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
}

function reimbursedAmount(damage: Damage, policy: QuoteResult): number {
  assertNonNegativeDamage(damage);
  const damagedItem = policy.items.find((item) => item.type === damage.itemType);
  if (damagedItem === undefined) {
    throw new Error(`Claimed item not in policy: ${damage.itemType}`);
  }
  const halfReimbursementApplies =
    enchantmentLevel(damagedItem) >= HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD;
  return halfReimbursementApplies
    ? damage.amount * HALF_REIMBURSEMENT_RATE
    : damage.amount;
}

function payoutForDamage(damage: Damage, policy: QuoteResult): number {
  return reimbursedAmount(damage, policy) - DEDUCTIBLE;
}

function assertDamagesWithinInsuredCounts(policy: QuoteResult, incident: Incident): void {
  const insuredCountByType = countBy(policy.items, (item) => item.type);
  const damageCountByType = countBy(incident.damages, (damage) => damage.itemType);
  for (const [type, damageCount] of Object.entries(damageCountByType)) {
    if (damageCount > (insuredCountByType[type] ?? 0)) {
      throw new Error(`More ${type} damages than insured`);
    }
  }
}

export function claim(policy: QuoteResult, incident: Incident): ClaimResult {
  assertDamagesWithinInsuredCounts(policy, incident);
  const totalPayout = incident.damages.reduce(
    (total, damage) => total + payoutForDamage(damage, policy),
    0,
  );
  const desiredPayout = Math.floor(totalPayout);
  const remainingCapBefore = remainingCapFor(policy);
  const payout = Math.min(desiredPayout, remainingCapBefore);
  const remainingCap = remainingCapBefore - payout;
  policy.remainingCap = remainingCap;
  return { payout, remainingCap };
}
