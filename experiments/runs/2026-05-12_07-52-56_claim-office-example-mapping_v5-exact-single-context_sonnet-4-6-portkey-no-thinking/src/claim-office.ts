const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  component: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  component: 250,
};

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

type Item = { type: string; subtype?: string; cursed?: boolean; enchantment?: number; material?: string };
type Policy = { premium: number; remainingCap: number };

export const quote = (customer: unknown, items: unknown[]): Policy => {
  const typedCustomer = customer as { yearsWithMHPCO: number; previousContracts: number };
  const typed = items as Item[];
  const policyBase =
    typed.length === COMPONENT_BLOCK_SIZE &&
    typed.every((i) => i.type === "component" && i.subtype === typed[0].subtype)
      ? COMPONENT_BLOCK_PREMIUM
      : typed.reduce((sum, item) => {
          const itemBase = BASE_PREMIUMS[item.type];
          const cursedSurcharge = item.cursed ? itemBase * CURSED_SURCHARGE_RATE : 0;
          const enchantmentSurcharge = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
          return sum + itemBase + cursedSurcharge + enchantmentSurcharge;
        }, 0);
  const loyaltyDiscount = typedCustomer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_SURCHARGE_RATE;
  const followUpDiscount = typedCustomer.previousContracts > 0 ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  const premium = Math.ceil(policyBase - loyaltyDiscount + firstInsuranceSurcharge - followUpDiscount + PROCESSING_FEE);
  const remainingCap = typed.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0) * 2;
  return { premium, remainingCap };
};

export const claim = (policy: unknown, incident: unknown): unknown => {
  const typedPolicy = policy as Policy;
  const typedIncident = incident as { damages: { itemType: string; amount: number; enchantment?: number; material?: string }[] };
  let payout = 0;
  for (const damage of typedIncident.damages) {
    const isHighEnchantment = (damage.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
    const isDragonMaterial = damage.material === "dragon";
    const reimbursable = isHighEnchantment && !isDragonMaterial
      ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
      : damage.amount;
    payout += reimbursable - DEDUCTIBLE;
  }
  const finalPayout = Math.min(Math.floor(payout), typedPolicy.remainingCap);
  const remainingCap = typedPolicy.remainingCap - finalPayout;
  return { payout: finalPayout, remainingCap };
};
