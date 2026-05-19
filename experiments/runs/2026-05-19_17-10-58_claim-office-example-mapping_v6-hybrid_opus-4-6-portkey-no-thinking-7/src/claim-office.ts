const PROCESSING_FEE = 5;
const COMPONENT_PREMIUM = 25;
const BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const BLOCK_SIZE = 3;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_QUOTE_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_MIN_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const isComponent = (item: any): boolean => COMPONENT_TYPES.has(item.type);

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
};

const basePremium = (item: any): number => {
  if (!isComponent(item) && !(item.type in BASE_PREMIUMS)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return BASE_PREMIUMS[item.type] ?? 0;
};

const itemSurcharges = (item: any): number => {
  const base = basePremium(item);
  const cursedSurcharge = item.cursed ? base * CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = item.enchantment >= HIGH_ENCHANTMENT_QUOTE_THRESHOLD ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return cursedSurcharge + enchantmentSurcharge;
};

const totalComponentPremium = (items: any[]): number => {
  const components = items.filter(isComponent);
  const counts: Record<string, number> = {};
  for (const c of components) {
    counts[c.type] = (counts[c.type] ?? 0) + 1;
  }
  return Object.values(counts).reduce(
    (total, count) => total + (count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM),
    0,
  );
};

const calculateQuotePremium = (items: any[], customer: any, isFollowUp: boolean): number => {
  const mainItems = items.filter((i: any) => !isComponent(i));
  const mainBaseTotal = mainItems.reduce(
    (sum: number, item: any) => sum + basePremium(item),
    0,
  );
  const mainSurchargesTotal = mainItems.reduce(
    (sum: number, item: any) => sum + itemSurcharges(item),
    0,
  );
  const compTotal = totalComponentPremium(items);
  const policyBase = mainBaseTotal + compTotal;
  const firstInsurance = policyBase * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(PROCESSING_FEE + policyBase + mainSurchargesTotal + firstInsurance - loyaltyDiscount - followUpDiscount);
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const insuranceValue = (item: any): number => {
  if (isComponent(item)) return 250;
  return INSURANCE_VALUES[item.type] ?? 0;
};

const reimbursementAmount = (item: any, damageAmount: number): number => {
  if (item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return damageAmount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return damageAmount;
};

const validateDamages = (policy: any, damages: any[]): void => {
  const damageCounts: Record<string, number> = {};
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
  }
  for (const [itemType, count] of Object.entries(damageCounts)) {
    const policyCount = policy.items.filter((i: any) => i.type === itemType).length;
    if (count > policyCount) {
      throw new Error(`More damages of type ${itemType} than items insured`);
    }
  }
};

const calculateClaimPayout = (policy: any, incident: any, currentCap: number): { payout: number; remainingCap: number } => {
  validateDamages(policy, incident.damages);
  const totalPayout = incident.damages.reduce((sum: number, damage: any) => {
    const item = policy.items.find((i: any) => i.type === damage.itemType);
    return sum + reimbursementAmount(item, damage.amount) - DEDUCTIBLE;
  }, 0);
  const cappedPayout = Math.floor(Math.min(totalPayout, currentCap));
  return { payout: cappedPayout, remainingCap: currentCap - cappedPayout };
};

export const processScenario = (scenario: any): any => {
  let quoteCount = 0;
  const policies: any[] = [];
  const results = scenario.steps.map((step: any) => {
    if (step.op === "claim") {
      const policy = policies[step.policy];
      const result = calculateClaimPayout(policy, step.incident, policy.remainingCap);
      policy.remainingCap = result.remainingCap;
      return result;
    }
    const insuranceSum = step.items.reduce(
      (sum: number, item: any) => sum + insuranceValue(item), 0
    );
    policies.push({ items: step.items, remainingCap: insuranceSum * 2 });
    const premium = calculateQuotePremium(step.items, scenario.customer, quoteCount > 0);
    quoteCount++;
    return { premium };
  });
  return { results };
};
