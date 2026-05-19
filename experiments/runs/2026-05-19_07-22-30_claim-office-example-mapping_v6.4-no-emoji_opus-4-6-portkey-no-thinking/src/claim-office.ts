const PROCESSING_FEE = 5;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isComponent = (item: any): boolean => COMPONENT_TYPES.has(item.type);

const isKnownItemType = (item: any): boolean =>
  item.type in MAIN_ITEM_PREMIUMS || COMPONENT_TYPES.has(item.type);

const mainItemBasePremium = (item: any): number =>
  MAIN_ITEM_PREMIUMS[item.type] ?? 0;

const componentGroupPremium = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * COMPONENT_PREMIUM;

const countByType = (items: any[], typeKey: string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const type = item[typeKey];
    counts[type] = (counts[type] ?? 0) + 1;
  }
  return counts;
};

const calculateMainItemBaseTotal = (mainItems: any[]): number =>
  mainItems.reduce(
    (sum, item) => sum + mainItemBasePremium(item),
    0,
  );

const calculateComponentTotal = (components: any[]): number => {
  const componentCounts = countByType(components, "type");
  return Object.values(componentCounts).reduce(
    (sum, count) => sum + componentGroupPremium(count),
    0,
  );
};

const calculateItemLevelSurcharges = (mainItems: any[]): number =>
  mainItems.reduce((sum, item) => {
    const base = mainItemBasePremium(item);
    const cursedSurcharge = item.cursed ? base * CURSED_SURCHARGE_RATE : 0;
    const enchantmentSurcharge = item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
    return sum + cursedSurcharge + enchantmentSurcharge;
  }, 0);

const validateItems = (items: any[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const calculateInsuranceSum = (items: any[]): number =>
  items.reduce(
    (sum: number, item: any) =>
      sum + (isComponent(item) ? COMPONENT_INSURANCE_VALUE : (INSURANCE_VALUES[item.type] ?? 0)),
    0,
  );

const calculatePremium = (items: any[], customer: any, quoteCount: number): number => {
  const mainItems = items.filter((item: any) => !isComponent(item));
  const components = items.filter(isComponent);
  const basePremiumSum = calculateMainItemBaseTotal(mainItems) + calculateComponentTotal(components);
  const itemSurcharges = calculateItemLevelSurcharges(mainItems);
  const firstInsurance = basePremiumSum * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? basePremiumSum * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = quoteCount > 0 ? basePremiumSum * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(basePremiumSum + itemSurcharges + firstInsurance - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
};

const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_ENCHANTMENT_RATE = 0.5;

const validateClaimDamages = (damages: any[], policyItems: any[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
  const policyItemCounts = countByType(policyItems, "type");
  const damageItemCounts = countByType(damages, "itemType");
  for (const [type, count] of Object.entries(damageItemCounts)) {
    if ((policyItemCounts[type] ?? 0) < count) {
      throw new Error(`Too many damage entries for item type ${type}`);
    }
  }
};

const calculateReimbursement = (damage: any, policyItem: any): number => {
  const hasHighEnchantment = policyItem && policyItem.enchantment >= CLAIM_ENCHANTMENT_THRESHOLD;
  const reimbursement = hasHighEnchantment
    ? damage.amount * CLAIM_ENCHANTMENT_RATE
    : damage.amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
};

const calculateClaimPayout = (damages: any[], policyItems: any[]): number =>
  damages.reduce((total: number, damage: any) => {
    const policyItem = policyItems.find((i: any) => i.type === damage.itemType);
    return total + calculateReimbursement(damage, policyItem);
  }, 0);

export const processScenario = (scenario: any): any => {
  const results: any[] = [];
  const policies: Record<number, { items: any[]; remainingCap: number }> = {};
  let quoteCount = 0;
  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      validateItems(step.items);
      const premium = calculatePremium(step.items, scenario.customer, quoteCount);
      const insuranceSum = calculateInsuranceSum(step.items);
      policies[i] = { items: step.items, remainingCap: insuranceSum * CAP_MULTIPLIER };
      results.push({ premium });
      quoteCount++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      validateClaimDamages(step.incident.damages, policy.items);
      const rawPayout = calculateClaimPayout(step.incident.damages, policy.items);
      const totalPayout = Math.min(rawPayout, policy.remainingCap);
      policy.remainingCap -= totalPayout;
      results.push({ payout: totalPayout, remainingCap: policy.remainingCap });
    }
  }
  return { results };
};
