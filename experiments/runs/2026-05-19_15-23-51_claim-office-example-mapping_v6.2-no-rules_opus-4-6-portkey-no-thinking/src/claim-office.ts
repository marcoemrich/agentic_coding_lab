const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isComponent = (item: any): boolean => COMPONENT_TYPES.has(item.type);

const basePremium = (item: any): number =>
  BASE_PREMIUMS[item.type] ?? 0;

const countByType = (items: any[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return counts;
};

const componentGroupPremium = (type: string, count: number): number =>
  count === BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * (BASE_PREMIUMS[type] ?? 0);

const itemSurcharges = (item: any, base: number): number =>
  (item.cursed ? base * 0.5 : 0) + (item.enchantment >= 5 ? base * 0.3 : 0);

const policyWideModifiers = (policyBase: number, customer: any, quoteIndex: number): number => {
  const firstInsurance = policyBase * 0.1;
  const loyaltyDiscount = customer.yearsWithMHPCO >= 2 ? -policyBase * 0.2 : 0;
  const followUpDiscount = quoteIndex > 0 ? -policyBase * 0.15 : 0;
  return firstInsurance + loyaltyDiscount + followUpDiscount;
};

const quotePremium = (items: any[], customer: any, quoteIndex: number): number => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  const components = items.filter(isComponent);
  const nonComponents = items.filter((item: any) => !isComponent(item));
  const componentTotal = Object.entries(countByType(components)).reduce(
    (sum: number, [type, count]: [string, number]) => sum + componentGroupPremium(type, count),
    0,
  );
  const { nonComponentBase, surchargesTotal } = nonComponents.reduce(
    (acc, item: any) => {
      const base = basePremium(item);
      return {
        nonComponentBase: acc.nonComponentBase + base,
        surchargesTotal: acc.surchargesTotal + itemSurcharges(item, base),
      };
    },
    { nonComponentBase: 0, surchargesTotal: 0 },
  );
  const policyBasePremium = nonComponentBase + componentTotal;
  const adjustedPremium = policyBasePremium + surchargesTotal + policyWideModifiers(policyBasePremium, customer, quoteIndex);
  return Math.ceil(adjustedPremium + PROCESSING_FEE);
};

const insuranceSum = (items: any[]): number =>
  items.reduce((sum: number, item: any) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);

const damageReimbursement = (damage: any, policyItem: any): number => {
  const amount = policyItem && policyItem.enchantment >= 8 ? damage.amount * 0.5 : damage.amount;
  return Math.max(0, amount - DEDUCTIBLE);
};

const countDamagesByType = (damages: any[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const damage of damages) {
    counts[damage.itemType] = (counts[damage.itemType] ?? 0) + 1;
  }
  return counts;
};

const validateDamageCounts = (damages: any[], policyItems: any[]): void => {
  const damageCounts = countDamagesByType(damages);
  const policyCounts = countByType(policyItems);
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] ?? 0)) {
      throw new Error(`More damages of type ${type} than policy covers`);
    }
  }
};

const validateDamages = (damages: any[], policyItems: any[]): void => {
  for (const damage of damages) {
    if (!policyItems.some((item: any) => item.type === damage.itemType)) {
      throw new Error(`Item type not in policy: ${damage.itemType}`);
    }
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
};

const findPolicyItem = (policyItems: any[], itemType: string): any =>
  policyItems.find((item: any) => item.type === itemType);

const processClaim = (step: any, policy: any, remainingCap: number): any => {
  validateDamageCounts(step.incident.damages, policy.items);
  validateDamages(step.incident.damages, policy.items);
  const totalPayout = step.incident.damages.reduce(
    (sum: number, damage: any) =>
      sum + damageReimbursement(damage, findPolicyItem(policy.items, damage.itemType)),
    0,
  );
  const clampedPayout = Math.min(totalPayout, remainingCap);
  const payout = Math.floor(clampedPayout);
  return { payout, remainingCap: remainingCap - payout };
};

export const processScenario = (scenario: any): any => {
  const policies: Record<number, any> = {};
  const caps: Record<number, number> = {};
  let quoteIndex = 0;
  return {
    results: scenario.steps.map((step: any, index: number) => {
      if (step.op === "claim") {
        const policyIndex = step.policy;
        if (caps[policyIndex] === undefined) {
          caps[policyIndex] = insuranceSum(policies[policyIndex].items) * 2;
        }
        const result = processClaim(step, policies[policyIndex], caps[policyIndex]);
        caps[policyIndex] = result.remainingCap;
        return result;
      }
      policies[index] = step;
      const result = { premium: quotePremium(step.items, scenario.customer, quoteIndex) };
      quoteIndex++;
      return result;
    }),
  };
};
