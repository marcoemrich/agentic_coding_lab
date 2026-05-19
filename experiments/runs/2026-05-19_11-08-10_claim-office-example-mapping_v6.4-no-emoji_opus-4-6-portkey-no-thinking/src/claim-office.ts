const PROCESSING_FEE = 5;
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const VALID_TYPES = new Set([...Object.keys(MAIN_ITEM_PREMIUMS), "rune", "moonstone"]);

const isComponent = (item: any): boolean => !(item.type in MAIN_ITEM_PREMIUMS);

const countComponentsByType = (items: any[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (isComponent(item)) {
      counts[item.type] = (counts[item.type] ?? 0) + 1;
    }
  }
  return counts;
};

const calculateComponentPremium = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;

const calculateMainItemPremium = (item: any): number => {
  const base = MAIN_ITEM_PREMIUMS[item.type] ?? 0;
  const curseSurcharge = item.cursed ? base * 0.5 : 0;
  const enchantmentSurcharge = item.enchantment >= 5 ? base * 0.3 : 0;
  return base + curseSurcharge + enchantmentSurcharge;
};

const calculateQuotePremium = (items: any[], customer: any, isFollowUp: boolean): number => {
  const mainItems = items.filter((item: any) => !isComponent(item));

  const policyBasePremium = mainItems
    .reduce((sum: number, item: any) => sum + (MAIN_ITEM_PREMIUMS[item.type] ?? 0), 0);

  const mainItemPremium = mainItems
    .reduce((sum: number, item: any) => sum + calculateMainItemPremium(item), 0);

  const componentCounts = countComponentsByType(items);
  const componentPremium = Object.values(componentCounts)
    .reduce((sum: number, count: number) => sum + calculateComponentPremium(count), 0);

  const firstInsuranceSurcharge = policyBasePremium * 0.1;
  const loyaltyDiscount = customer.yearsWithMHPCO >= 2 ? policyBasePremium * 0.2 : 0;
  const followUpDiscount = isFollowUp ? policyBasePremium * 0.15 : 0;

  return mainItemPremium + componentPremium + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount + PROCESSING_FEE;
};

const calculateInsuranceSum = (items: any[]): number => {
  return items.reduce((sum: number, item: any) => {
    if (isComponent(item)) {
      return sum + COMPONENT_INSURANCE_VALUE;
    }
    return sum + (INSURANCE_VALUES[item.type] ?? 0);
  }, 0);
};

const applyHighEnchantmentReduction = (damage: any, item: any): number => {
  const isHighEnchantment = item && item.enchantment >= 8;
  return isHighEnchantment ? damage.amount * 0.5 : damage.amount;
};

const calculateClaimPayout = (damages: any[], policyItems: any[]): number =>
  damages.reduce((total: number, damage: any) => {
    const item = policyItems.find((i: any) => i.type === damage.itemType);
    const adjustedDamage = applyHighEnchantmentReduction(damage, item);
    return total + Math.max(0, adjustedDamage - DEDUCTIBLE);
  }, 0);

const validateClaimDamages = (damages: any[], policyItems: any[]): void => {
  const damageCounts: Record<string, number> = {};
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
  }
  for (const [itemType, count] of Object.entries(damageCounts)) {
    const insuredCount = policyItems.filter((i: any) => i.type === itemType).length;
    if (count > insuredCount) {
      throw new Error(`Too many damages for ${itemType}: ${count} damages but only ${insuredCount} insured`);
    }
  }
};

const validateQuoteItems = (items: any[]): void => {
  for (const item of items) {
    if (!VALID_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

export function processScenario(scenario: any): unknown {
  let quoteCount = 0;
  const policies: Record<number, { items: any[]; remainingCap: number }> = {};

  const results = scenario.steps.map((step: any, index: number) => {
    if (step.op === "quote") {
      validateQuoteItems(step.items);
      const isFollowUp = quoteCount > 0;
      quoteCount++;
      const insuranceSum = calculateInsuranceSum(step.items);
      policies[index] = { items: step.items, remainingCap: insuranceSum * 2 };
      return { premium: calculateQuotePremium(step.items, scenario.customer, isFollowUp) };
    }
    if (step.op === "claim") {
      const policy = policies[step.policy];
      validateClaimDamages(step.incident.damages, policy.items);
      const rawPayout = calculateClaimPayout(step.incident.damages, policy.items);
      const payout = Math.floor(Math.min(rawPayout, policy.remainingCap));
      policy.remainingCap -= payout;
      return { payout, remainingCap: policy.remainingCap };
    }
  });
  return { results };
}
