export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 1.1;
const RETURNING_CUSTOMER_DISCOUNT = 0.85;

function contractMultiplierFor(previousContracts: number | undefined): number {
  return (previousContracts ?? 0) >= 1 ? RETURNING_CUSTOMER_DISCOUNT : FIRST_INSURANCE_SURCHARGE;
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_BUNDLE_BASE = 60;
const COMPONENT_BUNDLE_SIZE = 3;
const BUNDLEABLE_COMPONENTS = new Set(["rune", "moonstone"]);

function roundUpToWholeG(amount: number): number {
  // Round to cents first to avoid float-precision artifacts like 100*1.10 = 110.00000000000001
  return Math.ceil(Math.round(amount * 100) / 100);
}

const CURSED_SURCHARGE = 1.5;
const HIGH_ENCHANTMENT_SURCHARGE = 1.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const LOYALTY_DISCOUNT = 0.8;
const LOYALTY_YEARS_THRESHOLD = 2;

function loyaltyDiscountFor(customer: { yearsWithMHPCO: number }): number {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? LOYALTY_DISCOUNT : 1;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function riskMultiplier(item: Item): number {
  const cursedMultiplier = item.cursed ? CURSED_SURCHARGE : 1;
  const enchantmentMultiplier = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE : 1;
  return cursedMultiplier * enchantmentMultiplier;
}

function premiumFor(item: Item, loyaltyDiscount: number, contractMultiplier: number): number {
  const basePremium = BASE_PREMIUMS[item.type];
  return roundUpToWholeG(basePremium * riskMultiplier(item) * loyaltyDiscount * contractMultiplier);
}

function isThreeAlikeBundle(items: Item[]): boolean {
  if (items.length !== COMPONENT_BUNDLE_SIZE) return false;
  const firstType = items[0].type;
  return (
    BUNDLEABLE_COMPONENTS.has(firstType) &&
    items.every((item) => item.type === firstType)
  );
}

function bundlePremium(contractMultiplier: number): number {
  return roundUpToWholeG(COMPONENT_BUNDLE_BASE * contractMultiplier);
}

export function quote(
  customer: { yearsWithMHPCO: number },
  items: Item[],
  previousContracts?: number,
): number {
  const loyaltyDiscount = loyaltyDiscountFor(customer);
  const contractMultiplier = contractMultiplierFor(previousContracts);
  const itemsTotal = isThreeAlikeBundle(items)
    ? bundlePremium(contractMultiplier)
    : items.reduce((sum, item) => sum + premiumFor(item, loyaltyDiscount, contractMultiplier), 0);
  return itemsTotal + PROCESSING_FEE;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

const CLAIM_DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;

function qualifiesForHighEnchantmentClaim(item: Item | undefined): boolean {
  return item !== undefined && (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

function isDragonMaterial(item: Item | undefined): boolean {
  return item?.material === "dragon";
}

function reimbursementFor(damage: Damage, policyItems: Item[]): number {
  const item = policyItems.find((i) => i.type === damage.itemType);
  if (isDragonMaterial(item)) return damage.amount;
  return qualifiesForHighEnchantmentClaim(item)
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 0;
}

export function claim(
  policyItems: Item[],
  incident: Incident,
): number {
  const reimbursement = incident.damages.reduce(
    (sum, damage) => sum + reimbursementFor(damage, policyItems),
    0,
  );
  return Math.max(0, reimbursement - CLAIM_DEDUCTIBLE);
}
