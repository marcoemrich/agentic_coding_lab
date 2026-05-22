const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const BLOCK_OF_3_PRICE = 60;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_RATE = 0.5;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

function processClaim(step: any, quoteStep: any): { payout: number; remainingCap: number } {
  let insuranceSum = 0;
  for (const item of quoteStep.items) {
    insuranceSum += INSURANCE_VALUE[item.type];
  }
  const cap = 2 * insuranceSum;
  let payout = 0;
  for (const damage of step.incident.damages) {
    const matchedItem = quoteStep.items.find((item: any) => item.type === damage.itemType);
    const isHighEnchantment = matchedItem && matchedItem.enchantment >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD;
    const reimbursement = isHighEnchantment
      ? damage.amount * CLAIM_HIGH_ENCHANTMENT_RATE
      : damage.amount;
    payout += reimbursement - DEDUCTIBLE;
  }
  payout = Math.floor(payout);
  const remainingCap = cap - payout;
  return { payout, remainingCap };
}

function processQuote(step: any, customer: any, quoteCount: number): { premium: number } {
  let basePremium = 0;
  let curseSurcharge = 0;
  let highEnchantmentSurcharge = 0;
  const typeCounts: Record<string, number> = {};
  for (const item of step.items) {
    typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    if (item.cursed) {
      curseSurcharge += BASE_PREMIUM[item.type] * CURSE_SURCHARGE_RATE;
    }
    if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
      highEnchantmentSurcharge += BASE_PREMIUM[item.type] * HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
  }
  for (const [type, count] of Object.entries(typeCounts)) {
    const isComponentType = COMPONENT_TYPES.has(type);
    const formsBlockOf3 = count === 3 && isComponentType;
    if (formsBlockOf3) {
      basePremium += BLOCK_OF_3_PRICE;
    } else {
      basePremium += count * BASE_PREMIUM[type];
    }
  }
  let loyaltyDiscount = 0;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    loyaltyDiscount = basePremium * LOYALTY_DISCOUNT_RATE;
  }
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_RATE;
  let followUpDiscount = 0;
  if (quoteCount > 0) {
    followUpDiscount = basePremium * FOLLOW_UP_DISCOUNT_RATE;
  }
  const totalSurcharges = curseSurcharge + highEnchantmentSurcharge + firstInsuranceSurcharge;
  const totalDiscounts = loyaltyDiscount + followUpDiscount;
  const premium = Math.ceil(basePremium + totalSurcharges - totalDiscounts + PROCESSING_FEE);
  return { premium };
}

export function processScenario(scenario: any): any {
  const results: any[] = [];
  let quoteCount = 0;
  for (const step of scenario.steps) {
    if (step.op === "claim") {
      results.push(processClaim(step, scenario.steps[step.policy]));
      continue;
    }
    results.push(processQuote(step, scenario.customer, quoteCount));
    quoteCount++;
  }
  return { results };
}
