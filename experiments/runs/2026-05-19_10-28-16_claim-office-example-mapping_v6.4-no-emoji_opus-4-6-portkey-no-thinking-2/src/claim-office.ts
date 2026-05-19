const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_PREMIUMS: Record<string, number> = {
  rune: 25,
  moonstone: 25,
};

const countByType = (entries: any[], typeKey: string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const entry of entries) {
    const typeName = entry[typeKey];
    counts[typeName] = (counts[typeName] || 0) + 1;
  }
  return counts;
};

function calculateBasePremium(items: any[]): number {
  let premium = 0;
  const components: any[] = [];
  for (const item of items) {
    if (item.type in COMPONENT_PREMIUMS) {
      components.push(item);
    } else if (item.type in MAIN_ITEM_PREMIUMS) {
      premium += MAIN_ITEM_PREMIUMS[item.type];
    } else {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  const componentCounts = countByType(components, "type");
  for (const [type, count] of Object.entries(componentCounts)) {
    premium += count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_PREMIUMS[type];
  }
  return premium;
}

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_QUOTE_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_QUOTE_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function calculateSingleItemSurcharge(item: any): number {
  const basePremium = MAIN_ITEM_PREMIUMS[item.type] || 0;
  const cursedSurcharge = item.cursed ? basePremium * CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = item.enchantment >= HIGH_ENCHANTMENT_QUOTE_THRESHOLD
    ? basePremium * HIGH_ENCHANTMENT_QUOTE_SURCHARGE_RATE : 0;
  return cursedSurcharge + enchantmentSurcharge;
}

function calculateItemSurcharges(items: any[]): number {
  return items.reduce((total, item) => total + calculateSingleItemSurcharge(item), 0);
}

function calculatePolicyModifiers(basePremium: number, yearsWithMHPCO: number, quoteIndex: number): number {
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = quoteIndex > 0 ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;
}

function calculateQuotePremium(items: any[], yearsWithMHPCO: number, quoteIndex: number): number {
  const basePremium = calculateBasePremium(items);
  const itemSurcharges = calculateItemSurcharges(items);
  const policyModifiers = calculatePolicyModifiers(basePremium, yearsWithMHPCO, quoteIndex);
  return Math.ceil(basePremium + itemSurcharges + policyModifiers + PROCESSING_FEE);
}

const MAIN_ITEM_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_VALUE = 250;
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

function calculateInsuranceSum(items: any[]): number {
  return items.reduce((sum: number, item: any) => {
    return sum + (MAIN_ITEM_VALUES[item.type] || COMPONENT_VALUE);
  }, 0);
}

function validateDamages(damages: any[], policyItems: any[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
  const damageCounts = countByType(damages, "itemType");
  const policyCounts = countByType(policyItems, "type");
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] || 0)) {
      throw new Error(`More damage entries for ${type} than insured items`);
    }
  }
}

function calculateRawClaimPayout(damages: any[], policyItems: any[]): number {
  validateDamages(damages, policyItems);
  return damages.reduce((total, damage) => {
    const item = policyItems.find((i: any) => i.type === damage.itemType);
    if (!item) {
      throw new Error(`Item type ${damage.itemType} not found in policy`);
    }
    const isHighEnchantment = item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
    const reimbursement = isHighEnchantment
      ? damage.amount * HIGH_ENCHANTMENT_CLAIM_RATE
      : damage.amount;
    return total + (reimbursement - DEDUCTIBLE);
  }, 0);
}

export function processScenario(scenario: any): any {
  const results: any[] = [];
  const policies: any[] = [];
  let quoteCount = 0;
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const premium = calculateQuotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount);
      results.push({ premium });
      const insuranceSum = calculateInsuranceSum(step.items);
      policies.push({ items: step.items, remainingCap: insuranceSum * CAP_MULTIPLIER });
      quoteCount++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      const rawPayout = calculateRawClaimPayout(step.incident.damages, policy.items);
      const payout = Math.floor(Math.min(rawPayout, policy.remainingCap));
      policy.remainingCap -= payout;
      results.push({ payout, remainingCap: policy.remainingCap });
    }
  }
  return { results };
}
