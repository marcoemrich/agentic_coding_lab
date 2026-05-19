const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;

const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
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
  rune: 250,
  moonstone: 250,
};

const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const isMainItem = (item: any): boolean => item.type in MAIN_ITEM_BASE_PREMIUMS;

const mainItemBasePremium = (item: any): number =>
  MAIN_ITEM_BASE_PREMIUMS[item.type];

const mainItemSurcharges = (item: any): number => {
  const base = mainItemBasePremium(item);
  const cursedSurcharge = item.cursed ? base * 0.5 : 0;
  const enchantmentSurcharge = item.enchantment >= 5 ? base * 0.3 : 0;
  return cursedSurcharge + enchantmentSurcharge;
};

const componentPremiumByGroup = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;

const countByKey = (items: any[], keyFn: (item: any) => string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
};

const countByType = (items: any[]): Record<string, number> =>
  countByKey(items, (item: any) => item.type);

const calculateComponentPremium = (components: any[]): number =>
  Object.values(countByType(components)).reduce(
    (sum, count) => sum + componentPremiumByGroup(count),
    0,
  );

const calculateQuotePremium = (items: any[], customer: any, quoteIndex: number): number => {
  const mainItems = items.filter(isMainItem);
  const components = items.filter((item: any) => !isMainItem(item));

  const mainBasePremium = mainItems.reduce((sum, item) => sum + mainItemBasePremium(item), 0);
  const mainSurcharges = mainItems.reduce((sum, item) => sum + mainItemSurcharges(item), 0);
  const componentTotal = calculateComponentPremium(components);

  const modifierBase = mainBasePremium + components.length * COMPONENT_PREMIUM;
  const firstInsuranceSurcharge = modifierBase * 0.1;
  const loyaltyDiscount = customer.yearsWithMHPCO >= 2 ? modifierBase * 0.2 : 0;
  const followUpDiscount = quoteIndex > 0 ? modifierBase * 0.15 : 0;

  const subtotal = mainBasePremium + mainSurcharges + componentTotal
    + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;

  return Math.ceil(subtotal + PROCESSING_FEE);
};

const validateDamages = (damages: any[], policyItems: any[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
  const damageCounts = countByKey(damages, (d: any) => d.itemType);
  const policyCounts = countByKey(policyItems, (i: any) => i.type);
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] ?? 0)) {
      throw new Error(`More damages of type ${type} than insured`);
    }
  }
};

const calculateClaimPayout = (
  damages: any[],
  policy: { items: any[]; remainingCap: number },
): { payout: number; remainingCap: number } => {
  validateDamages(damages, policy.items);

  let totalPayout = 0;
  for (const damage of damages) {
    const item = policy.items.find((i: any) => i.type === damage.itemType);
    if (!item) {
      throw new Error(`Item type ${damage.itemType} not in policy`);
    }
    const reimbursement = item.enchantment >= 8 ? damage.amount * 0.5 : damage.amount;
    totalPayout += Math.max(0, reimbursement - DEDUCTIBLE);
  }
  totalPayout = Math.min(totalPayout, policy.remainingCap);
  policy.remainingCap -= totalPayout;
  return { payout: Math.floor(totalPayout), remainingCap: policy.remainingCap };
};

const calculateInsuranceSum = (items: any[]): number =>
  items.reduce((sum: number, item: any) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);

export const processScenario = (scenario: any): unknown => {
  let quoteIndex = 0;
  const policies: Record<number, { items: any[]; remainingCap: number }> = {};
  const results: unknown[] = [];

  for (const [stepIndex, step] of scenario.steps.entries()) {
    if (step.op === "quote") {
      for (const item of step.items) {
        if (!(item.type in INSURANCE_VALUES)) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }
      const insuranceSum = calculateInsuranceSum(step.items);
      policies[stepIndex] = { items: step.items, remainingCap: insuranceSum * 2 };
      results.push({ premium: calculateQuotePremium(step.items, scenario.customer, quoteIndex) });
      quoteIndex++;
    } else if (step.op === "claim") {
      results.push(calculateClaimPayout(step.incident.damages, policies[step.policy]));
    }
  }

  return { results };
};
