// Quoting constants
const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSED_SURCHARGE = 0.50;
const HIGH_ENCHANTMENT_SURCHARGE = 0.30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE = 0.10;
const SUBSEQUENT_CONTRACT_DISCOUNT = 0.15;
const LOYALTY_DISCOUNT = 0.20;
const LOYALTY_THRESHOLD_YEARS = 2;
const PROCESSING_FEE = 5;

// Claims constants
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.50;
const DRAGON_MATERIAL = "dragon";

function isMainItem(type: string): boolean {
  return type in MAIN_ITEM_PREMIUMS;
}

function calculateItemPremiums(items: any[]): number {
  let premium = 0;

  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (isMainItem(item.type)) {
      let itemPremium = MAIN_ITEM_PREMIUMS[item.type];
      if (item.cursed) {
        itemPremium *= (1 + CURSED_SURCHARGE);
      }
      if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
        itemPremium *= (1 + HIGH_ENCHANTMENT_SURCHARGE);
      }
      premium += itemPremium;
    } else {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    }
  }

  for (const type in componentCounts) {
    const count = componentCounts[type];
    const blocks = Math.floor(count / COMPONENT_BLOCK_SIZE);
    const remainder = count % COMPONENT_BLOCK_SIZE;
    premium += blocks * COMPONENT_BLOCK_PREMIUM + remainder * COMPONENT_PREMIUM;
  }

  return premium;
}

function applyModifier(amount: number, rate: number): number {
  return Math.round(amount * rate);
}

export const processClaim = (item: any, damage: number): number => {
  if (item.material === DRAGON_MATERIAL) {
    return damage;
  }
  let payout = Math.max(0, damage - DEDUCTIBLE);
  if (item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    payout *= HIGH_ENCHANTMENT_CLAIM_RATE;
  }
  return payout;
};

export const quote = (customer: any, items: any[], options: any): number => {
  let premium = calculateItemPremiums(items);
  if (options.isFirstContract) {
    premium = applyModifier(premium, 1 + FIRST_INSURANCE_SURCHARGE);
  } else {
    premium = applyModifier(premium, 1 - SUBSEQUENT_CONTRACT_DISCOUNT);
  }
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    premium = applyModifier(premium, 1 - LOYALTY_DISCOUNT);
  }
  return premium + PROCESSING_FEE;
};
