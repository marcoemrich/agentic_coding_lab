const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const premiumForType = (type: string): number => {
  if (!(type in BASE_PREMIUMS)) throw new Error(`Unknown item type: ${type}`);
  return BASE_PREMIUMS[type];
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const isComponent = (item: any): boolean => COMPONENT_TYPES.includes(item.type);
const isMainItem = (item: any): boolean => !isComponent(item);

const countByKey = (items: any[], key: string): Record<string, number> =>
  items.reduce((counts: Record<string, number>, item: any) => {
    counts[item[key]] = (counts[item[key]] || 0) + 1;
    return counts;
  }, {});

const countByType = (items: any[]): Record<string, number> =>
  countByKey(items, "type");

const componentPremium = (components: any[]): number =>
  Object.entries(countByType(components)).reduce(
    (sum, [type, count]) =>
      sum + (count === BLOCK_SIZE ? BLOCK_PREMIUM : count * premiumForType(type)),
    0,
  );

const CURSED_SURCHARGE_RATE = 0.5;

const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const ENCHANTMENT_THRESHOLD = 5;

const surchargeRate = (item: any): number =>
  (item.cursed ? CURSED_SURCHARGE_RATE : 0) +
  (item.enchantment >= ENCHANTMENT_THRESHOLD ? ENCHANTMENT_SURCHARGE_RATE : 0);

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD = 2;

const loyaltyDiscountRate = (customer: any): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD ? LOYALTY_DISCOUNT_RATE : 0;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;

const FIRST_INSURANCE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const policyAdjustmentRate = (customer: any, isFollowUp: boolean): number =>
  FIRST_INSURANCE_RATE -
  loyaltyDiscountRate(customer) -
  (isFollowUp ? FOLLOW_UP_DISCOUNT_RATE : 0);

const mainItemTotals = (mainItems: any[]): { baseSum: number; surcharges: number } =>
  mainItems.reduce(
    (totals, item) => {
      const base = premiumForType(item.type);
      return {
        baseSum: totals.baseSum + base,
        surcharges: totals.surcharges + base * surchargeRate(item),
      };
    },
    { baseSum: 0, surcharges: 0 },
  );

const calculateQuotePremium = (items: any[], customer: any, isFollowUp: boolean): number => {
  const components = items.filter(isComponent);
  const mainItems = items.filter(isMainItem);

  const { baseSum, surcharges } = mainItemTotals(mainItems);
  const rawBaseSum = baseSum + componentPremium(components);

  const policyModifiers = rawBaseSum * policyAdjustmentRate(customer, isFollowUp);

  return Math.ceil(rawBaseSum + surcharges + policyModifiers + PROCESSING_FEE);
};

const insuranceSum = (items: any[]): number =>
  items.reduce(
    (sum: number, item: any) => sum + (INSURANCE_VALUES[item.type] ?? 0),
    0,
  );

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const reimbursementRate = (policyItem: any): number =>
  policyItem.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;

const reimbursementAmount = (damage: any, policyItem: any): number =>
  damage.amount * reimbursementRate(policyItem);

const validateDamageCounts = (damages: any[], policyItems: any[]): void => {
  const damageCounts = countByKey(damages, "itemType");
  const policyCounts = countByKey(policyItems, "type");
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] || 0)) {
      throw new Error(`More damages of type ${type} than insured`);
    }
  }
};

const validateDamageAmounts = (damages: any[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) throw new Error("Negative damage amount");
  }
};

const validateDamages = (damages: any[], policyItems: any[]): void => {
  validateDamageAmounts(damages);
  validateDamageCounts(damages, policyItems);
};

const calculateClaimPayout = (
  damages: any[],
  policyItems: any[],
  remainingCap: number,
): { payout: number; remainingCap: number } => {
  validateDamages(damages, policyItems);
  const totalPayout = damages.reduce(
    (sum: number, damage: any) => {
      const policyItem = policyItems.find((item: any) => item.type === damage.itemType);
      const reimbursed = reimbursementAmount(damage, policyItem);
      return sum + Math.max(0, reimbursed - DEDUCTIBLE);
    },
    0,
  );
  const cappedPayout = Math.floor(Math.min(totalPayout, remainingCap));
  const newRemainingCap = remainingCap - cappedPayout;
  return { payout: cappedPayout, remainingCap: newRemainingCap };
};

export function processScenario(scenario: any): any {
  let quoteCount = 0;
  const policies: Record<number, { items: any[]; remainingCap: number }> = {};
  const results = scenario.steps.map((step: any, index: number) => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount++;
      policies[index] = { items: step.items, remainingCap: insuranceSum(step.items) * 2 };
      return { premium: calculateQuotePremium(step.items, scenario.customer, isFollowUp) };
    }
    if (step.op === "claim") {
      const policy = policies[step.policy];
      const result = calculateClaimPayout(step.incident.damages, policy.items, policy.remainingCap);
      policy.remainingCap = result.remainingCap;
      return result;
    }
  });
  return { results };
}
