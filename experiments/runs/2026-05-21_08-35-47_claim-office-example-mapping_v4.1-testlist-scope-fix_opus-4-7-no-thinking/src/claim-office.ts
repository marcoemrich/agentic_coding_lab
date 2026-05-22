export interface ItemSpec {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
  previousContracts?: number;
}

export interface QuoteInput {
  customer: Customer;
  items: ItemSpec[];
}

export interface QuoteResult {
  premium: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const KNOWN_ITEM_TYPES = new Set(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

function basePremiumFor(item: ItemSpec): number {
  return BASE_PREMIUMS[item.type] ?? 0;
}

function sumBasePremiums(items: ItemSpec[]): number {
  return items.reduce((sum, item) => sum + basePremiumFor(item), 0);
}

function countItemsOfType(items: ItemSpec[], type: string): number {
  return items.filter((item) => item.type === type).length;
}

function blockAdjustmentFor(items: ItemSpec[], componentType: string): number {
  const count = countItemsOfType(items, componentType);
  if (count !== BLOCK_SIZE) return 0;
  return BLOCK_PRICE - BLOCK_SIZE * BASE_PREMIUMS[componentType];
}

function blockAdjustment(items: ItemSpec[]): number {
  return COMPONENT_TYPES.reduce(
    (sum, componentType) => sum + blockAdjustmentFor(items, componentType),
    0
  );
}

function isHighlyEnchanted(item: ItemSpec): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function itemSurchargeFor(item: ItemSpec): number {
  let surcharge = 0;
  if (item.cursed) surcharge += basePremiumFor(item) * CURSE_SURCHARGE_RATE;
  if (isHighlyEnchanted(item)) surcharge += basePremiumFor(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  return surcharge;
}

function sumItemSurcharges(items: ItemSpec[]): number {
  return items.reduce((sum, item) => sum + itemSurchargeFor(item), 0);
}

function qualifiesForLoyaltyDiscount(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

function loyaltyDiscountFor(customer: Customer, policyBasePremium: number): number {
  if (!qualifiesForLoyaltyDiscount(customer)) return 0;
  return policyBasePremium * LOYALTY_DISCOUNT_RATE;
}

function followUpDiscountFor(customer: Customer, policyBasePremium: number): number {
  if ((customer.previousContracts ?? 0) <= 0) return 0;
  return policyBasePremium * FOLLOW_UP_DISCOUNT_RATE;
}

function totalPolicyDiscount(customer: Customer, policyBasePremium: number): number {
  return (
    loyaltyDiscountFor(customer, policyBasePremium) +
    followUpDiscountFor(customer, policyBasePremium)
  );
}

export function quote(input: QuoteInput): QuoteResult {
  const items = input.items;
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  const policyBasePremium = sumBasePremiums(items) + blockAdjustment(items);
  const itemSurcharges = sumItemSurcharges(items);
  const firstInsuranceSurcharge = policyBasePremium * FIRST_INSURANCE_RATE;
  const policyDiscount = totalPolicyDiscount(input.customer, policyBasePremium);
  return {
    premium: Math.ceil(
      policyBasePremium + itemSurcharges + firstInsuranceSurcharge - policyDiscount + PROCESSING_FEE
    ),
  };
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface ClaimInput {
  items: ItemSpec[];
  damages: DamageEntry[];
  remainingCap?: number;
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function insuranceValueFor(item: ItemSpec): number {
  return INSURANCE_VALUES[item.type] ?? 0;
}

function sumInsuranceValues(items: ItemSpec[]): number {
  return items.reduce((sum, item) => sum + insuranceValueFor(item), 0);
}

function findMatchingItem(items: ItemSpec[], itemType: string): ItemSpec | undefined {
  return items.find((item) => item.type === itemType);
}

function triggersHighEnchantmentRule(item: ItemSpec | undefined): boolean {
  const enchantment = item?.enchantment ?? 0;
  return enchantment >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD;
}

function reimbursementFor(damage: DamageEntry, item: ItemSpec | undefined): number {
  const reimbursableAmount = triggersHighEnchantmentRule(item)
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;
  return Math.max(0, reimbursableAmount - DEDUCTIBLE);
}

function sumReimbursements(damages: DamageEntry[], items: ItemSpec[]): number {
  return damages.reduce(
    (sum, damage) => sum + reimbursementFor(damage, findMatchingItem(items, damage.itemType)),
    0
  );
}

function defaultCapFor(items: ItemSpec[]): number {
  return CAP_MULTIPLIER * sumInsuranceValues(items);
}

function countDamagesByType(damages: DamageEntry[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const damage of damages) {
    counts.set(damage.itemType, (counts.get(damage.itemType) ?? 0) + 1);
  }
  return counts;
}

function validateDamageCountsAgainstInsuredItems(
  damages: DamageEntry[],
  items: ItemSpec[]
): void {
  for (const [itemType, damageCount] of countDamagesByType(damages)) {
    const insuredCount = countItemsOfType(items, itemType);
    if (damageCount > insuredCount) {
      throw new Error(
        `Too many damage entries for ${itemType}: ${damageCount} damages but only ${insuredCount} insured`
      );
    }
  }
}

function validateDamageEntries(damages: DamageEntry[], items: ItemSpec[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative: ${damage.amount}`);
    }
    if (findMatchingItem(items, damage.itemType) === undefined) {
      throw new Error(`Damage references item not in policy: ${damage.itemType}`);
    }
  }
}

export function claim(input: ClaimInput): ClaimResult {
  validateDamageCountsAgainstInsuredItems(input.damages, input.items);
  validateDamageEntries(input.damages, input.items);
  const remainingCap = input.remainingCap ?? defaultCapFor(input.items);
  const totalReimbursement = sumReimbursements(input.damages, input.items);
  const payout = Math.floor(Math.min(totalReimbursement, remainingCap));
  return { payout, remainingCap: remainingCap - payout };
}
