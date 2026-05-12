// Item data
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  rune: 25,
};
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

// Premium modifiers
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const FIRST_INSURANCE_RATE = 0.1;
const PROCESSING_FEE = 5;

// Claim processing
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function calculatePolicyBase(items: any[]): number {
  let policyBase = 0;
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    } else {
      policyBase += BASE_PREMIUMS[item.type];
    }
  }
  for (const type in componentCounts) {
    const count = componentCounts[type];
    if (count === BLOCK_SIZE) {
      policyBase += BLOCK_PREMIUM;
    } else {
      policyBase += count * BASE_PREMIUMS[type];
    }
  }
  return policyBase;
}

function calculateItemSurcharges(items: any[]): number {
  let surcharges = 0;
  for (const item of items) {
    const itemBase = BASE_PREMIUMS[item.type];
    if (item.cursed) {
      surcharges += itemBase * CURSED_SURCHARGE_RATE;
    }
    if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
      surcharges += itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
  }
  return surcharges;
}

function validateItemsAndComputeInsuranceSum(items: any[]): number {
  let insuranceSum = 0;
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS) && !COMPONENT_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    insuranceSum += INSURANCE_VALUES[item.type];
  }
  return insuranceSum;
}

function processClaim(step: any, policy: any): { payout: number; remainingCap: number } {
  const damageCounts: Record<string, number> = {};
  for (const damage of step.incident.damages) {
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] || 0) + 1;
  }
  for (const itemType in damageCounts) {
    const insuredCount = policy.items.filter((p: any) => p.type === itemType).length;
    if (damageCounts[itemType] > insuredCount) {
      throw new Error(`Too many damage entries for ${itemType}: ${damageCounts[itemType]} damages but only ${insuredCount} insured`);
    }
  }
  let totalPayout = 0;
  for (const damage of step.incident.damages) {
    // insuredItem is guaranteed to exist by the damage count validation above
    const insuredItem = policy.items.find((p: any) => p.type === damage.itemType);
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    let reimbursement = damage.amount;
    if (insuredItem.enchantment >= CLAIM_ENCHANTMENT_THRESHOLD) {
      reimbursement = damage.amount * CLAIM_ENCHANTMENT_REIMBURSEMENT_RATE;
    }
    totalPayout += reimbursement - DEDUCTIBLE;
  }
  const payout = Math.min(Math.floor(totalPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(input: any): any {
  const results: any[] = [];
  const policies: Record<number, { items: any[]; insuranceSum: number; remainingCap: number }> = {};
  let quoteCount = 0;
  for (let i = 0; i < input.steps.length; i++) {
    const step = input.steps[i];
    if (step.op === "quote") {
      const insuranceSum = validateItemsAndComputeInsuranceSum(step.items);
      const policyBase = calculatePolicyBase(step.items);
      const itemSurcharges = calculateItemSurcharges(step.items);
      let policyModifiers = policyBase * FIRST_INSURANCE_RATE;
      if (input.customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) {
        policyModifiers -= policyBase * LOYALTY_DISCOUNT_RATE;
      }
      if (quoteCount > 0) {
        policyModifiers -= policyBase * FOLLOW_UP_DISCOUNT_RATE;
      }
      const premium = Math.ceil(policyBase + itemSurcharges + policyModifiers + PROCESSING_FEE);
      policies[i] = { items: step.items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
      results.push({ premium });
      quoteCount++;
    } else if (step.op === "claim") {
      results.push(processClaim(step, policies[step.policy]));
    }
  }
  return { results };
}
