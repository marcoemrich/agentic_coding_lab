const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const COMPONENT_TYPES = ["rune", "moonstone"];

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

const calculateQuotePremium = (items: any[], customer: any, isFollowUp: boolean): { premium: number } => {
  let basePremium = 0;
  let itemSurcharges = 0;
  const componentCounts: Record<string, number> = {};

  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    if (COMPONENT_TYPES.includes(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      const itemBase = BASE_PREMIUMS[item.type];
      basePremium += itemBase;
      if (item.cursed) {
        itemSurcharges += itemBase * CURSED_SURCHARGE_RATE;
      }
      if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
        itemSurcharges += itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE;
      }
    }
  }

  for (const [type, count] of Object.entries(componentCounts)) {
    if (count === COMPONENT_BLOCK_SIZE) {
      basePremium += COMPONENT_BLOCK_PREMIUM;
    } else {
      basePremium += count * BASE_PREMIUMS[type];
    }
  }

  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUp ? FOLLOW_UP_DISCOUNT_RATE : 0;
  const policyModifiers = basePremium * (FIRST_INSURANCE_SURCHARGE_RATE - loyaltyDiscount - followUpDiscount);

  const premium = basePremium + itemSurcharges + policyModifiers + PROCESSING_FEE;
  return { premium: Math.ceil(premium) };
};

const calculateDamagePayout = (damage: any, policyItems: any[]): number => {
  const policyItem = policyItems.find((i: any) => i.type === damage.itemType);
  if (!policyItem) {
    throw new Error(`Damage references item type not in policy: ${damage.itemType}`);
  }
  const isHighEnchantment = policyItem.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
  const reimbursable = isHighEnchantment
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;
  return Math.max(reimbursable - DEDUCTIBLE, 0);
};

const validateDamagesAgainstPolicy = (damages: any[], policyItems: any[]): void => {
  const damageCounts: Record<string, number> = {};
  for (const damage of damages) {
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
  }
  for (const [type, count] of Object.entries(damageCounts)) {
    const policyCount = policyItems.filter((i: any) => i.type === type).length;
    if (count > policyCount) {
      throw new Error(`More damages of type ${type} than policy covers`);
    }
  }
};

const calculateClaimPayout = (
  damages: any[],
  policy: { items: any[]; remainingCap: number },
): { payout: number; remainingCap: number } => {
  validateDamagesAgainstPolicy(damages, policy.items);
  const rawTotal = damages.reduce(
    (sum, damage) => sum + calculateDamagePayout(damage, policy.items),
    0,
  );
  const totalPayout = Math.floor(Math.min(rawTotal, policy.remainingCap));
  policy.remainingCap -= totalPayout;
  return { payout: totalPayout, remainingCap: policy.remainingCap };
};

export function processScenario(scenario: any): any {
  let quoteCount = 0;
  const policies: { items: any[]; remainingCap: number }[] = [];
  const results = scenario.steps.map((step: any, index: number) => {
    if (step.op === "quote") {
      quoteCount++;
      const insuranceSum = step.items.reduce(
        (sum: number, item: any) => sum + (INSURANCE_VALUES[item.type] ?? 0),
        0,
      );
      policies[index] = { items: step.items, remainingCap: insuranceSum * 2 };
      return calculateQuotePremium(step.items, scenario.customer, quoteCount > 1);
    }
    if (step.op === "claim") {
      const policy = policies[step.policy];
      return calculateClaimPayout(step.incident.damages, policy);
    }
  });
  return { results };
}
