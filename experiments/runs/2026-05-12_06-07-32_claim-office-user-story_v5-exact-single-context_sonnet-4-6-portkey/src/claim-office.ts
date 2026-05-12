export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  component: 25,
};

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_SURCHARGE_PCT = 10;

const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_PREMIUM = 60;
const CURSED_SURCHARGE_PCT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const ENCHANTMENT_SURCHARGE_PCT = 30;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_PCT = 20;
const SUBSEQUENT_CONTRACT_DISCOUNT_PCT = 15;

export const quote = (
  customer: Customer,
  items: Item[],
  contractNumber: number
): number => {
  const isBuildingBlock =
    items.length === BUILDING_BLOCK_SIZE &&
    items.every((i) => i.type === "component" && i.material === items[0].material);
  const basePremium = isBuildingBlock
    ? BUILDING_BLOCK_PREMIUM
    : BASE_PREMIUMS[items[0].type] ?? 0;
  const riskAdjustedPremium = basePremium
    + (items[0].cursed ? basePremium * CURSED_SURCHARGE_PCT / 100 : 0)
    + (items[0].enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? basePremium * ENCHANTMENT_SURCHARGE_PCT / 100 : 0);
  const surcharge = contractNumber === 1
    ? Math.ceil(riskAdjustedPremium * INITIAL_ASSESSMENT_SURCHARGE_PCT / 100)
    : 0;
  const subtotal = riskAdjustedPremium + surcharge;
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? Math.floor(subtotal * LOYALTY_DISCOUNT_PCT / 100)
    : 0;
  const subsequentDiscount = contractNumber > 1
    ? Math.floor(subtotal * SUBSEQUENT_CONTRACT_DISCOUNT_PCT / 100)
    : 0;
  const discountedSubtotal = subtotal - loyaltyDiscount - subsequentDiscount;
  return discountedSubtotal + PROCESSING_FEE;
};

export interface Policy {
  insuranceSum: number;
}

export interface Incident {
  damages: { amount: number; enchantment?: number; material?: string }[];
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const DRAGON_MATERIAL = "dragon";

export const claim = (
  policy: Policy,
  incident: Incident,
  cap?: number
): { payout: number; remainingCap: number } => {
  const availableCap = cap ?? policy.insuranceSum * CAP_MULTIPLIER;
  const damage = incident.damages[0].amount;
  const enchantment = incident.damages[0].enchantment ?? 0;
  const material = incident.damages[0].material ?? "";
  const rawPayout = material === DRAGON_MATERIAL
    ? damage
    : enchantment >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD ? damage / 2 : damage - DEDUCTIBLE;
  const payout = Math.min(rawPayout, availableCap);
  const remainingCap = availableCap - payout;
  return { payout, remainingCap };
};
