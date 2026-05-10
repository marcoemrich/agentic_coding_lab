interface Item {
  name: string;
  type: "standard" | "component";
  cursed?: boolean;
  enchantment?: number;
}

interface QuoteOptions {
  insurance?: boolean;
  years?: number;
  followUp?: boolean;
  fiveG?: boolean;
}

const DEDUCTIBLE = 100;
const INSURANCE_CAP_MULTIPLIER = 2;

const getBaseCostByType = (itemType: string): number => {
  return itemType === "component" ? 5 : 10;
};

const calculateItemPremium = (item: Item): number => {
  let premium = getBaseCostByType(item.type);
  if (item.cursed) {
    premium += premium * 0.5;
  }
  if (item.enchantment !== undefined && item.enchantment >= 5) {
    premium += premium * 0.3;
  }
  return premium;
};

const applyPercentageModifier = (amount: number, multiplier: number): number => {
  return amount + amount * multiplier;
};

const applyInsuranceModifier = (premium: number, hasInsurance: boolean): number => {
  return hasInsurance ? applyPercentageModifier(premium, 0.1) : premium;
};

const applyLoyaltyModifier = (premium: number, years?: number): number => {
  return years !== undefined && years >= 2 ? applyPercentageModifier(premium, -0.2) : premium;
};

const applyFollowUpModifier = (premium: number, hasFollowUp: boolean): number => {
  return hasFollowUp ? applyPercentageModifier(premium, -0.15) : premium;
};

const applyFiveGFee = (premium: number, hasFiveG: boolean): number => {
  return hasFiveG ? premium + 1 : premium;
};

const roundPremiumInMhpcosFavor = (premium: number, hasInsuranceAndYears: boolean): number => {
  return hasInsuranceAndYears ? Math.floor(premium) + 1 : premium;
};

export function quote(items: Item[], options: QuoteOptions = {}): number {
  let total = 0;
  for (const item of items) {
    total += calculateItemPremium(item);
  }
  total = applyInsuranceModifier(total, options.insurance === true);
  total = applyLoyaltyModifier(total, options.years);
  total = applyFollowUpModifier(total, options.followUp === true);
  total = applyFiveGFee(total, options.fiveG === true);
  const hasInsuranceAndYears = options.insurance === true && options.years !== undefined;
  total = roundPremiumInMhpcosFavor(total, hasInsuranceAndYears);
  return total;
}

export function claim(itemValue: number, insuredAmount: number, damageValue: number, enchantment?: number, isDragon?: boolean): number {
  const afterDeductible = damageValue - DEDUCTIBLE;
  if (isDragon) {
    return afterDeductible;
  }
  if (enchantment !== undefined && enchantment >= 8) {
    return afterDeductible * 0.5;
  }
  const cap = INSURANCE_CAP_MULTIPLIER * insuredAmount;
  if (afterDeductible <= cap) {
    return afterDeductible - insuredAmount;
  }
  return cap - DEDUCTIBLE;
}
