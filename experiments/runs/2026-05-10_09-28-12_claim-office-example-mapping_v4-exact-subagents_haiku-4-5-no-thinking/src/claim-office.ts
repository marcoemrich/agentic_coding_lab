// MHPCO Claim Office - Policy quoting and claim processing system

const ITEM_TYPE_PREMIUMS: Record<string, number> = {
  Sword: 50,
  Amulet: 100,
  Staff: 75,
  Potion: 60,
};

const FIRST_INSURANCE_SURCHARGE = 1.1;
const LOYALTY_DISCOUNT = 0.8; // -20% discount for 2+ years
const CURSED_ITEM_SURCHARGE = 1.5;
const HIGH_ENCHANTMENT_SURCHARGE = 1.3; // +30% for enchantmentLevel >= 5

export interface Item {
  type: string;
  insuranceModifier?: string;
  yearsInsured?: number;
  cursed?: boolean;
  enchantmentLevel?: number;
}

const applyModifier = (value: number, multiplier: number, shouldApply: boolean): number => {
  return shouldApply ? value * multiplier : value;
};

const applyModifiers = (premium: number, item: Item): number => {
  const modifiers = [
    { multiplier: FIRST_INSURANCE_SURCHARGE, condition: item.insuranceModifier === "first" },
    { multiplier: LOYALTY_DISCOUNT, condition: item.yearsInsured !== undefined && item.yearsInsured >= 2 },
    { multiplier: CURSED_ITEM_SURCHARGE, condition: item.cursed === true },
    { multiplier: HIGH_ENCHANTMENT_SURCHARGE, condition: item.enchantmentLevel !== undefined && item.enchantmentLevel >= 5 },
  ];

  return modifiers.reduce((adjusted, mod) => applyModifier(adjusted, mod.multiplier, mod.condition), premium);
};

const roundUpInMHPCOsFavor = (value: number): number => {
  const standardRound = Math.round(value);
  return value > standardRound ? standardRound + 1 : standardRound;
};

export function quotePolicy(items: Item[]): number {
  const total = items.reduce((sum, item) => {
    if (!(item.type in ITEM_TYPE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    const basePremium = ITEM_TYPE_PREMIUMS[item.type];
    const adjustedPremium = applyModifiers(basePremium, item);
    return sum + Math.round(adjustedPremium * 100) / 100;
  }, 0);
  return roundUpInMHPCOsFavor(total);
}

const INDIVIDUAL_COMPONENT_PRICE = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;

const CLAIM_DEDUCTIBLE = 100;
const INSURANCE_CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

export function quoteComponent(items: Item[]): number {
  const basePrice = items.length === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PRICE : INDIVIDUAL_COMPONENT_PRICE;
  return items.length === 1 ? applyModifiers(basePrice, items[0]) : basePrice;
}

const applyInsuranceCap = (amount: number, insuranceSum: number, dragonMaterial: boolean): number => {
  if (dragonMaterial) {
    return amount;
  }
  const cap = insuranceSum * INSURANCE_CAP_MULTIPLIER;
  return Math.min(amount, cap);
};

const applyEnchantmentReduction = (reimbursement: number, enchantmentLevel?: number): number => {
  if (enchantmentLevel !== undefined && enchantmentLevel >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD) {
    return reimbursement * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return reimbursement;
};

const validateItemInPolicy = (itemType?: string): void => {
  if (itemType !== undefined && !(itemType in ITEM_TYPE_PREMIUMS)) {
    throw new Error(`Item not in policy: ${itemType}`);
  }
};

const validateQuantityMismatch = (damagedQuantity?: number, insuredQuantity?: number): void => {
  if (damagedQuantity !== undefined && insuredQuantity !== undefined && damagedQuantity > insuredQuantity) {
    throw new Error("Damaged quantity exceeds insured quantity");
  }
};

const processMultipleDamageEvents = (damageEvents: number[]): number => {
  let total = 0;
  let deductibleApplied = false;
  for (const event of damageEvents) {
    if (!deductibleApplied) {
      total += Math.max(0, event - CLAIM_DEDUCTIBLE);
      deductibleApplied = true;
    } else {
      total += event;
    }
  }
  return total;
};

export function processClaim(damage: number, insuranceSum?: number, enchantmentLevel?: number, dragonMaterial?: boolean, itemType?: string, damageEvents?: number[], damagedQuantity?: number, insuredQuantity?: number): number {
  if (damage < 0) {
    throw new Error("Damage amount cannot be negative");
  }
  validateItemInPolicy(itemType);
  validateQuantityMismatch(damagedQuantity, insuredQuantity);
  if (damage === 0) {
    return 0;
  }

  // Handle multiple damage events
  if (damageEvents !== undefined && damageEvents.length > 0) {
    return processMultipleDamageEvents(damageEvents);
  }

  const afterDeductible = damage - CLAIM_DEDUCTIBLE;
  if (insuranceSum !== undefined) {
    const cappedAmount = applyInsuranceCap(afterDeductible, insuranceSum, dragonMaterial ?? false);
    return applyEnchantmentReduction(cappedAmount, enchantmentLevel);
  }
  return afterDeductible;
}
