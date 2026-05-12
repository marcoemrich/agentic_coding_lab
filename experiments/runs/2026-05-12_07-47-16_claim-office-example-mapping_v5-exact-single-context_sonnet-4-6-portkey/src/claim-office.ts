export interface Customer {
  yearsWithMHPCO: number;
}

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

export interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40 };
const INSURANCE_VALUES: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400 };
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

export const quote = (customer: Customer, items: Item[], contractNumber: number): number => {
  const { basePremiumTotal, cursedSurcharge } = items.reduce(
    (acc, item) => {
      const itemBasePremium = BASE_PREMIUMS[item.type];
      return {
        basePremiumTotal: acc.basePremiumTotal + itemBasePremium,
        cursedSurcharge: acc.cursedSurcharge + (item.cursed ? itemBasePremium * CURSED_SURCHARGE_RATE : 0),
      };
    },
    { basePremiumTotal: 0, cursedSurcharge: 0 }
  );
  const firstInsuranceSurcharge = basePremiumTotal * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = customer.yearsWithMHPCO >= 2 ? basePremiumTotal * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = contractNumber >= 2 ? basePremiumTotal * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(basePremiumTotal + cursedSurcharge + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount) + PROCESSING_FEE;
};

export const createPolicy = (items: Item[]): Policy => {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
};

export const claim = (policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } => {
  const uncappedPayout = Math.floor(
    damages.reduce((sum, damage) => sum + Math.max(0, damage.amount - DEDUCTIBLE), 0)
  );
  const payout = Math.min(uncappedPayout, policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
};
