const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const MAIN_ITEM_TYPES = ["sword", "amulet", "staff", "potion"];
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const isMainItem = (item: any): boolean =>
  MAIN_ITEM_TYPES.includes(item.type);

const premiumForType = (type: string): number =>
  BASE_PREMIUMS[type] ?? 0;

const countByType = (items: any[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return counts;
};

const calculateComponentPremium = (components: any[]): number => {
  const countsByType = countByType(components);
  return Object.entries(countsByType).reduce(
    (total, [type, count]) =>
      total +
      (count === COMPONENT_BLOCK_SIZE
        ? COMPONENT_BLOCK_PREMIUM
        : count * premiumForType(type)),
    0,
  );
};

const calculateItemSurcharges = (item: any): number => {
  const base = premiumForType(item.type);
  return (item.cursed ? base * 0.5 : 0) + (item.enchantment >= 5 ? base * 0.3 : 0);
};

const calculateQuotePremium = (
  step: any,
  customer: any,
  quoteIndex: number,
): number => {
  const mainItems = step.items.filter(isMainItem);
  const components = step.items.filter((item: any) => !isMainItem(item));

  const mainBasePremium = mainItems.reduce(
    (sum: number, item: any) => sum + premiumForType(item.type),
    0,
  );

  const itemSurcharges = mainItems.reduce(
    (sum: number, item: any) => sum + calculateItemSurcharges(item),
    0,
  );

  const componentTotal = calculateComponentPremium(components);
  const policyBasePremium = mainBasePremium + componentTotal;

  const firstInsurance = policyBasePremium * 0.1;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= 2 ? policyBasePremium * 0.2 : 0;
  const followUpDiscount =
    quoteIndex > 0 ? policyBasePremium * 0.15 : 0;

  return Math.ceil(
    policyBasePremium +
      itemSurcharges +
      firstInsurance -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE,
  );
};

const calculateInsuranceCap = (items: any[]): number =>
  items.reduce((sum: number, item: any) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0) * 2;

const validateClaimDamages = (damages: any[], policyItems: any[]): void => {
  const policyCounts = countByType(policyItems);
  const damageCounts: Record<string, number> = {};
  for (const d of damages) {
    if (d.amount < 0) {
      throw new Error(`Negative damage amount: ${d.amount}`);
    }
    if (!(d.itemType in policyCounts)) {
      throw new Error(`Item type ${d.itemType} not in policy`);
    }
    damageCounts[d.itemType] = (damageCounts[d.itemType] ?? 0) + 1;
  }
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] ?? 0)) {
      throw new Error(`More damage entries for ${type} than policy covers`);
    }
  }
};

const calculateDamagePayout = (damage: any, policyItem: any): number => {
  const reimbursement = policyItem.enchantment >= 8 ? damage.amount * 0.5 : damage.amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
};

const calculateClaimResult = (step: any, policy: any, currentCap: number): any => {
  validateClaimDamages(step.incident.damages, policy.items);
  const totalPayout = step.incident.damages.reduce(
    (sum: number, d: any) => {
      const policyItem = policy.items.find((i: any) => i.type === d.itemType);
      return sum + calculateDamagePayout(d, policyItem!);
    },
    0,
  );
  const payout = Math.floor(Math.min(totalPayout, currentCap));
  return { payout, remainingCap: currentCap - payout };
};

const validateQuoteItems = (items: any[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

export const processScenario = (scenario: any): any => {
  const policies: any[] = [];
  const caps: Record<number, number> = {};
  let quoteIndex = 0;
  const results = scenario.steps.map((step: any, index: number) => {
    if (step.op === "claim") {
      const result = calculateClaimResult(step, policies[step.policy], caps[step.policy]);
      caps[step.policy] = result.remainingCap;
      return result;
    }
    validateQuoteItems(step.items);
    const premium = calculateQuotePremium(step, scenario.customer, quoteIndex);
    policies[index] = step;
    caps[index] = calculateInsuranceCap(step.items);
    quoteIndex++;
    return { premium };
  });
  return { results };
};
