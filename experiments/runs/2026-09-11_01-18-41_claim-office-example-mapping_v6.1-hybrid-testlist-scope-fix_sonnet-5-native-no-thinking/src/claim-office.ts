const ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const KNOWN_ITEM_TYPES = Object.keys(ITEM_BASE_PREMIUM);

function countByType<T>(entries: T[], typeOf: (entry: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const type = typeOf(entry);
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
}

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

function formsComponentBlock(type: string, count: number): boolean {
  return COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE;
}

function premiumForTypeGroup(type: string, count: number): number {
  return formsComponentBlock(type, count)
    ? COMPONENT_BLOCK_PREMIUM
    : ITEM_BASE_PREMIUM[type] * count;
}

export function basePremium(items: { type: string }[]): number {
  let total = 0;
  for (const [type, count] of countByType(items, (item) => item.type)) {
    total += premiumForTypeGroup(type, count);
  }
  return total;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

function isHighEnchantment(enchantment: number | undefined): boolean {
  return enchantment !== undefined && enchantment >= HIGH_ENCHANTMENT_THRESHOLD;
}

type InsuredItem = { type: string; material?: string; cursed?: boolean; enchantment?: number };

function itemSurchargeRate(item: InsuredItem): number {
  const curseRate = item.cursed ? CURSE_SURCHARGE : 0;
  const enchantmentRate = isHighEnchantment(item.enchantment) ? HIGH_ENCHANTMENT_SURCHARGE : 0;
  return curseRate + enchantmentRate;
}

function itemBasePremium(item: InsuredItem): number {
  return ITEM_BASE_PREMIUM[item.type];
}

function itemPolicyPremium(item: InsuredItem): number {
  return itemBasePremium(item) * (1 + itemSurchargeRate(item));
}

export function policyBasePremium(items: InsuredItem[]): number {
  return items.reduce((total, item) => total + itemPolicyPremium(item), 0);
}

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const PROCESSING_FEE = 5;

type Customer = { yearsWithMHPCO: number };

function assertKnownItemTypes(items: InsuredItem[]): void {
  const unknownItem = items.find((item) => !KNOWN_ITEM_TYPES.includes(item.type));
  if (unknownItem) {
    throw new Error(`Unknown item type: ${unknownItem.type}`);
  }
}

function isLoyalCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

const FOLLOWUP_DISCOUNT = 0.15;

function policyWideRate(customer: Customer, isFollowUpContract: boolean): number {
  const loyaltyRate = isLoyalCustomer(customer) ? LOYALTY_DISCOUNT : 0;
  const followupRate = isFollowUpContract ? FOLLOWUP_DISCOUNT : 0;
  return FIRST_INSURANCE_SURCHARGE - loyaltyRate - followupRate;
}

function itemQuotePremium(
  item: InsuredItem,
  customer: Customer,
  isFollowUpContract: boolean
): number {
  return (
    itemBasePremium(item) *
    (1 + itemSurchargeRate(item) + policyWideRate(customer, isFollowUpContract))
  );
}

export function quote(
  customer: Customer,
  items: InsuredItem[],
  isFollowUpContract: boolean = false
): number {
  assertKnownItemTypes(items);

  const premium =
    items.reduce((total, item) => total + itemQuotePremium(item, customer, isFollowUpContract), 0) +
    PROCESSING_FEE;
  return Math.ceil(premium);
}

const ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

type PolicyItem = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
type Damage = { itemType: string; amount: number };

function insuranceSum(policyItems: PolicyItem[]): number {
  return policyItems.reduce((sum, item) => sum + ITEM_INSURANCE_VALUE[item.type], 0);
}

const HIGH_ENCHANTMENT_DAMAGE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const STANDARD_REIMBURSEMENT_RATE = 1;

// Dragon-material items are reimbursed at the standard rate today; no test
// yet distinguishes them from other materials. Revisit when a dragon-only
// clause (e.g. full reimbursement bypassing another reduction) is specified.
function reimbursementRate(item: PolicyItem): number {
  if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_DAMAGE_THRESHOLD) {
    return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return STANDARD_REIMBURSEMENT_RATE;
}

function damagePayout(damage: Damage, policyItems: PolicyItem[]): number {
  const item = policyItems.find((policyItem) => policyItem.type === damage.itemType);
  const rate = item ? reimbursementRate(item) : STANDARD_REIMBURSEMENT_RATE;
  return damage.amount * rate - DEDUCTIBLE;
}

function assertNonNegativeDamages(damages: Damage[]): void {
  const negativeDamage = damages.find((damage) => damage.amount < 0);
  if (negativeDamage) {
    throw new Error(`Damage amount cannot be negative: ${negativeDamage.amount}`);
  }
}

function assertDamagesWithinPolicy(policyItems: PolicyItem[], damages: Damage[]): void {
  const insuredCounts = countByType(policyItems, (item) => item.type);
  const damageCounts = countByType(damages, (damage) => damage.itemType);
  for (const [itemType, damageCount] of damageCounts) {
    if (damageCount > (insuredCounts.get(itemType) ?? 0)) {
      throw new Error(`More damaged items of type ${itemType} than insured`);
    }
  }
}

export function claim(
  policyItems: PolicyItem[],
  damages: Damage[],
  priorPayout: number = 0
): { payout: number; remainingCap: number } {
  assertNonNegativeDamages(damages);
  assertDamagesWithinPolicy(policyItems, damages);

  const desiredPayout = Math.floor(
    damages.reduce((sum, damage) => sum + damagePayout(damage, policyItems), 0)
  );
  const availableCap = CAP_MULTIPLIER * insuranceSum(policyItems) - priorPayout;
  const payout = Math.min(desiredPayout, availableCap);
  const remainingCap = availableCap - payout;
  return { payout, remainingCap };
}
