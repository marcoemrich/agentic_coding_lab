const countBy = <T>(items: T[], keyFn: (item: T) => string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
};

const PROCESSING_FEE = 5;

const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

const KNOWN_COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isMainItem = (type: string): boolean => MAIN_ITEM_PREMIUMS.hasOwnProperty(type);

const isComponent = (type: string): boolean => !isMainItem(type);

const isKnownType = (type: string): boolean =>
  isMainItem(type) || KNOWN_COMPONENT_TYPES.has(type);

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const calculateItemSurcharges = (item: { type: string; cursed?: boolean; enchantment?: number }): number => {
  const base = MAIN_ITEM_PREMIUMS[item.type] ?? 0;
  const curseSurcharge = item.cursed ? base * CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curseSurcharge + enchantmentSurcharge;
};

const calculateComponentGroupPremium = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_PREMIUM;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;

const getInsuranceValue = (type: string): number =>
  INSURANCE_VALUES[type] ?? COMPONENT_INSURANCE_VALUE;

const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_RATE = 0.5;

const calculateClaimPayout = (
  damages: { itemType: string; amount: number }[],
  remainingCap: number,
  policyItems: any[],
): { payout: number; remainingCap: number } => {
  let totalPayout = 0;
  for (const damage of damages) {
    const policyItem = policyItems.find((item: any) => item.type === damage.itemType);
    const enchantment = policyItem?.enchantment ?? 0;
    const reimbursement = enchantment >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD
      ? damage.amount * CLAIM_HIGH_ENCHANTMENT_RATE
      : damage.amount;
    totalPayout += Math.max(0, reimbursement - DEDUCTIBLE);
  }
  if (totalPayout > remainingCap) {
    totalPayout = remainingCap;
  }
  return { payout: Math.floor(totalPayout), remainingCap: remainingCap - totalPayout };
};

const validateDamagesAgainstPolicy = (
  damages: { itemType: string }[],
  policyItems: { type: string }[],
): void => {
  const damageCounts = countBy(damages, (d) => d.itemType);
  const policyCounts = countBy(policyItems, (item) => item.type);
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] ?? 0)) {
      throw new Error(`More damages of type ${type} than policy covers`);
    }
  }
};

const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const calculatePremium = (items: { type: string; cursed?: boolean; enchantment?: number }[], yearsWithMHPCO: number, isFollowUp: boolean): number => {
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  let policyBasePremium = 0;
  let itemSurcharges = 0;

  for (const item of items) {
    if (isMainItem(item.type)) {
      policyBasePremium += MAIN_ITEM_PREMIUMS[item.type] ?? 0;
      itemSurcharges += calculateItemSurcharges(item);
    }
  }

  const componentCounts = countBy(items.filter((item) => isComponent(item.type)), (item) => item.type);
  for (const count of Object.values(componentCounts)) {
    policyBasePremium += calculateComponentGroupPremium(count);
  }

  const policyModifierRate = FIRST_INSURANCE_RATE
    - (yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? LOYALTY_DISCOUNT_RATE : 0)
    - (isFollowUp ? FOLLOW_UP_DISCOUNT_RATE : 0);
  const policyModifiers = policyBasePremium * policyModifierRate;

  return Math.ceil(policyBasePremium + itemSurcharges + policyModifiers + PROCESSING_FEE);
};

export function processScenario(scenario: { customer: { yearsWithMHPCO: number }; steps: any[] }): { results: unknown[] } {
  let quoteCount = 0;
  const policies: Map<number, { items: any[]; remainingCap: number }> = new Map();

  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount++;
      const items = step.items ?? [];
      const premium = calculatePremium(items, scenario.customer.yearsWithMHPCO, isFollowUp);
      const insuranceSum = items.reduce((sum: number, item: any) => sum + getInsuranceValue(item.type), 0);
      policies.set(index, { items, remainingCap: insuranceSum * 2 });
      return { premium };
    } else {
      const policy = policies.get(step.policy)!;
      for (const damage of step.incident.damages) {
        if (damage.amount < 0) {
          throw new Error(`Negative damage amount: ${damage.amount}`);
        }
      }
      validateDamagesAgainstPolicy(step.incident.damages, policy.items);
      const claimResult = calculateClaimPayout(step.incident.damages, policy.remainingCap, policy.items);
      policy.remainingCap = claimResult.remainingCap;
      return claimResult;
    }
  });
  return { results };
}
