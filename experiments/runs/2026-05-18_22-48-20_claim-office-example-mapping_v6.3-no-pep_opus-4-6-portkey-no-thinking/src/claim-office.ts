const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const isComponent = (item: any): boolean => COMPONENT_TYPES.has(item.type);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const COMPONENT_PREMIUM = 25;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_QUOTE_THRESHOLD = 5;
const HIGH_ENCHANTMENT_QUOTE_SURCHARGE_RATE = 0.3;

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_MIN_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const calculateItemSurcharges = (item: any, base: number): number => {
  const curseSurcharge = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const enchantmentSurcharge =
    item.enchantment >= HIGH_ENCHANTMENT_QUOTE_THRESHOLD
      ? base * HIGH_ENCHANTMENT_QUOTE_SURCHARGE_RATE
      : 0;
  return curseSurcharge + enchantmentSurcharge;
};

const countComponentsByType = (items: any[]): Record<string, number> =>
  items.reduce((counts: Record<string, number>, item) => {
    if (isComponent(item)) {
      counts[item.type] = (counts[item.type] || 0) + 1;
    }
    return counts;
  }, {});

const calculateComponentsCost = (items: any[]): number =>
  Object.values(countComponentsByType(items)).reduce(
    (total, count) => total + (count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM),
    0
  );

const calculatePolicyModifiers = (basePremium: number, customer: any, quoteIndex: number): number => {
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const followUpDiscount = quoteIndex > 0
    ? basePremium * FOLLOW_UP_DISCOUNT_RATE
    : 0;
  return firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;
};

const calculateQuotePremium = (items: any[], customer: any, quoteIndex: number): { premium: number } => {
  for (const item of items) {
    if (!BASE_PREMIUMS[item.type] && !isComponent(item)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  const equipmentItems = items.filter((item) => !isComponent(item));

  const equipmentBasePremiums = equipmentItems.map((item) => BASE_PREMIUMS[item.type] || 0);
  const equipmentBasePremium = equipmentBasePremiums.reduce((sum, bp) => sum + bp, 0);
  const itemSurcharges = equipmentItems.reduce(
    (sum, item, i) => sum + calculateItemSurcharges(item, equipmentBasePremiums[i]),
    0
  );
  const componentsCost = calculateComponentsCost(items);

  const policyBasePremium = equipmentBasePremium + componentsCost;
  const policyModifiers = calculatePolicyModifiers(policyBasePremium, customer, quoteIndex);

  return { premium: Math.ceil(policyBasePremium + itemSurcharges + policyModifiers + PROCESSING_FEE) };
};

const COMPONENT_INSURANCE_VALUE = 250;

const calculateInsuranceSum = (items: any[]): number => {
  return items.reduce((sum, item) => {
    if (isComponent(item)) {
      return sum + COMPONENT_INSURANCE_VALUE;
    }
    return sum + (INSURANCE_VALUES[item.type] || 0);
  }, 0);
};

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

const validateClaimDamages = (damages: any[], policyItems: any[]): void => {
  const damageCounts: Record<string, number> = {};
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    const policyItem = policyItems.find((item: any) => item.type === damage.itemType);
    if (!policyItem) {
      throw new Error(`Item type ${damage.itemType} not in policy`);
    }
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] || 0) + 1;
  }
  for (const [itemType, count] of Object.entries(damageCounts)) {
    const policyCount = policyItems.filter((item: any) => item.type === itemType).length;
    if (count > policyCount) {
      throw new Error(`More damages of type ${itemType} than policy covers`);
    }
  }
};

const calculateDamagePayout = (damages: any[], policyItems: any[]): number =>
  damages.reduce((sum: number, damage: any) => {
    const policyItem = policyItems.find((item: any) => item.type === damage.itemType);
    const reimbursement = policyItem.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
      ? damage.amount * HIGH_ENCHANTMENT_CLAIM_RATE
      : damage.amount;
    return sum + Math.max(0, reimbursement - DEDUCTIBLE);
  }, 0);

const processClaim = (step: any, policies: any[]): { payout: number; remainingCap: number } => {
  const policy = policies[step.policy];
  validateClaimDamages(step.incident.damages, policy.items);
  const totalPayout = calculateDamagePayout(step.incident.damages, policy.items);
  const cappedPayout = Math.floor(Math.min(totalPayout, policy.remainingCap));
  policy.remainingCap -= cappedPayout;
  return { payout: cappedPayout, remainingCap: policy.remainingCap };
};

export const processScenario = (scenario: any): any => {
  const policies: any[] = [];
  const results = scenario.steps.map((step: any) => {
    if (step.op === "claim") {
      return processClaim(step, policies);
    }
    const result = calculateQuotePremium(step.items, scenario.customer, policies.length);
    const insuranceSum = calculateInsuranceSum(step.items);
    policies.push({
      items: step.items,
      insuranceSum,
      remainingCap: insuranceSum * 2,
    });
    return result;
  });
  return { results };
};
