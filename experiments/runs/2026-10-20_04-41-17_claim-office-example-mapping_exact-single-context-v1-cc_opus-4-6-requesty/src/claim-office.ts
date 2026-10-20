interface ScenarioResult {
  results: Array<{ premium: number } | { payout: number; remainingCap: number }>;
}

const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const LOYALTY_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

function calculateItemPremiums(items: any[]): { basePremium: number; itemSurcharges: number } {
  let basePremium = 0;
  let itemSurcharges = 0;

  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      const itemBase = BASE_PREMIUMS[item.type] ?? 0;
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
      basePremium += count * (BASE_PREMIUMS[type] ?? 0);
    }
  }

  return { basePremium, itemSurcharges };
}

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;

const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;

export function processScenario(input: any): ScenarioResult {
  let quoteCount = 0;
  const policies: Array<{ items: any[]; insuranceSum: number; remainingCap: number }> = [];
  const results = input.steps.map((step: any, index: number) => {
    if (step.op === "quote") {
      for (const item of step.items) {
        if (!(item.type in BASE_PREMIUMS)) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }
      quoteCount++;
      const { basePremium, itemSurcharges } = calculateItemPremiums(step.items);
      let policyModifiers = 0;
      if (input.customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) {
        policyModifiers -= basePremium * LOYALTY_DISCOUNT_RATE;
      }
      policyModifiers += basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
      if (quoteCount > 1) {
        policyModifiers -= basePremium * FOLLOW_UP_DISCOUNT_RATE;
      }
      const insuranceSum = step.items.reduce(
        (sum: number, item: any) => sum + (INSURANCE_VALUES[item.type] ?? 0),
        0,
      );
      policies[index] = { items: step.items, insuranceSum, remainingCap: insuranceSum * 2 };
      return { premium: Math.ceil(basePremium + itemSurcharges + policyModifiers + PROCESSING_FEE) };
    }
    if (step.op === "claim") {
      const policy = policies[step.policy];
      const damageCounts: Record<string, number> = {};
      for (const damage of step.incident.damages) {
        damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
      }
      const insuredCounts: Record<string, number> = {};
      for (const item of policy.items) {
        insuredCounts[item.type] = (insuredCounts[item.type] ?? 0) + 1;
      }
      for (const [type, count] of Object.entries(damageCounts)) {
        if (count > (insuredCounts[type] ?? 0)) {
          throw new Error(`More damages of type "${type}" than insured items`);
        }
      }
      let totalPayout = 0;
      for (const damage of step.incident.damages) {
        const policyItem = policy.items.find((i: any) => i.type === damage.itemType);
        if (!policyItem) {
          throw new Error(`Item type "${damage.itemType}" is not covered by this policy`);
        }
        if (damage.amount < 0) {
          throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
        }
        let reimbursement = damage.amount;
        if (policyItem.enchantment >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD) {
          reimbursement = damage.amount * 0.5;
        }
        const payout = Math.max(0, reimbursement - DEDUCTIBLE);
        totalPayout += payout;
      }
      totalPayout = Math.floor(Math.min(totalPayout, policy.remainingCap));
      policy.remainingCap -= totalPayout;
      return { payout: totalPayout, remainingCap: policy.remainingCap };
    }
    return {};
  });
  return { results };
}
