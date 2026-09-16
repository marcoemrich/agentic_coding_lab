const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = ["rune", "moonstone"];

export interface Customer {
  yearsWithMHPCO: number;
  previousContracts: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

function basePremiumOf(item: Item): number {
  const basePremium = BASE_PREMIUMS[item.type];
  if (basePremium === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return basePremium;
}

export function insuranceValueOf(item: Item): number {
  const insuranceValue = INSURANCE_VALUES[item.type];
  if (insuranceValue === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return insuranceValue;
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function qualifiesAsBuildingBlock(type: string, count: number): boolean {
  return COMPONENT_TYPES.includes(type) && count === BLOCK_SIZE;
}

function policyBasePremiumOf(items: Item[]): number {
  let total = 0;
  for (const [type, count] of countByType(items)) {
    total += qualifiesAsBuildingBlock(type, count)
      ? BLOCK_BASE_PREMIUM
      : count * basePremiumOf({ type });
  }
  return total;
}

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function riskSurchargeOf(item: Item): number {
  const basePremium = basePremiumOf(item);
  const curseSurcharge = isCursed(item) ? basePremium * CURSE_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = isHighlyEnchanted(item)
    ? basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curseSurcharge + enchantmentSurcharge;
}

/** The MHPCO always rounds a premium it collects upwards. */
function roundPremiumInMHPCOsFavour(amount: number): number {
  return Math.ceil(amount);
}

const NEW_CUSTOMER: Customer = { yearsWithMHPCO: 0, previousContracts: 0 };

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

function isFollowUpContract(customer: Customer): boolean {
  return customer.previousContracts > 0;
}

function policyModifierOf(policyBasePremium: number, customer: Customer): number {
  const loyaltyDiscount = isLongStanding(customer) ? policyBasePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUpContract(customer)
    ? policyBasePremium * FOLLOW_UP_DISCOUNT_RATE
    : 0;
  const firstInsuranceSurcharge = policyBasePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  return firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;
}

export function quote(items: Item[], customer: Customer = NEW_CUSTOMER): number {
  const policyBasePremium = policyBasePremiumOf(items);
  const riskSurcharges = items.reduce((sum, item) => sum + riskSurchargeOf(item), 0);
  const policyModifier = policyModifierOf(policyBasePremium, customer);
  return roundPremiumInMHPCOsFavour(
    policyBasePremium + riskSurcharges + policyModifier + PROCESSING_FEE,
  );
}
