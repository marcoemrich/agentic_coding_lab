export interface Scenario {
  customer: {
    yearsWithMHPCO: number;
  };
  steps: Array<{
    op: "quote" | "claim";
    items?: Array<{
      type: string;
      material: string;
      enchantment: number;
      cursed: boolean;
    }>;
    policy?: number;
    incident?: {
      cause: string;
      damages: Array<{
        itemType: string;
        amount: number;
      }>;
    };
  }>;
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  rune: 25,
};

const INITIAL_ASSESSMENT_SURCHARGE = 1.1; // 10% surcharge for first insurance
const PROCESSING_FEE = 5; // Fixed fee for all premiums
const SPECIAL_COMPONENT_PREMIUM = 60; // Premium for 3 alike components
const CURSED_SURCHARGE = 1.5; // 50% risk surcharge for cursed items
const ENCHANTMENT_SURCHARGE = 1.3; // 30% risk surcharge for highly enchanted items (level >= 5)
const REPEAT_INSURANCE_DISCOUNT = 0.85; // 15% discount for repeat insurance contracts
const LOYALTY_DISCOUNT = 0.80; // 20% discount for long-standing customers (>= 2 years)

const getBasePremium = (items: Array<any>): number => {
  // Check for 3 alike components
  if (items.length === 3 && items.every(item => item.type === items[0].type)) {
    return SPECIAL_COMPONENT_PREMIUM;
  }
  // Single item
  const itemType = items[0].type;
  return BASE_PREMIUMS[itemType] || 0;
};

const calculateQuotePremium = (items: Array<any>, yearsWithMHPCO: number): number => {
  let premium = getBasePremium(items);

  // Initial assessment surcharge for first insurance
  if (yearsWithMHPCO === 0) {
    premium = premium * INITIAL_ASSESSMENT_SURCHARGE;
  }

  // Processing fee
  premium += PROCESSING_FEE;

  // Cursed items add 50% risk surcharge
  if (items.some(item => item.cursed)) {
    premium = premium * CURSED_SURCHARGE;
  }

  // Highly enchanted items (level >= 5) add 30% risk surcharge
  if (items.some(item => item.enchantment >= 5)) {
    premium = premium * ENCHANTMENT_SURCHARGE;
  }

  // Apply discount based on customer tenure
  if (yearsWithMHPCO >= 2) {
    premium = premium * LOYALTY_DISCOUNT; // 20% loyalty discount
  } else if (yearsWithMHPCO > 0) {
    premium = premium * REPEAT_INSURANCE_DISCOUNT; // 15% repeat discount
  }

  // Round down in MHPCO's favor
  return Math.floor(premium);
};

const processClaim = (items: Array<any>, damages: Array<any>, insuranceSum: number): { payout: number; remainingCap: number } => {
  let totalDamage = 0;

  for (const damage of damages) {
    let payout = damage.amount;

    // Find the item for this damage
    const item = items.find(i => i.type === damage.itemType);

    // Damage to items made of dragon material is fully reimbursed
    if (item && item.material === "dragon") {
      // No reduction, fully reimburse
    } else if (item && item.enchantment >= 8) {
      // Damage to items with enchantment level >= 8 is reimbursed at 50%
      payout = payout * 0.5;
    }

    totalDamage += payout;
  }

  // Apply deductible of 100 G per damage event
  let finalPayout = totalDamage - 100;
  if (finalPayout < 0) {
    finalPayout = 0;
  }

  // Cap at 2x insurance sum
  const cap = insuranceSum * 2;
  if (finalPayout > cap) {
    finalPayout = cap;
  }

  const remainingCap = cap - finalPayout;

  return { payout: Math.floor(finalPayout), remainingCap: Math.floor(remainingCap) };
};

export const processScenario = (scenario: Scenario) => {
  const results = [];
  const policies: Array<{ premium: number; items: Array<any>; totalPayout: number }> = [];

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const premium = calculateQuotePremium(step.items, scenario.customer.yearsWithMHPCO);
      policies.push({ premium, items: step.items, totalPayout: 0 });
      results.push({ premium });
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      const claimResult = processClaim(policy.items, step.incident!.damages, policy.premium);

      // Track cumulative payouts
      policy.totalPayout += claimResult.payout;

      // Recalculate remaining cap based on total payouts so far
      const cap = policy.premium * 2;
      const remainingCap = cap - policy.totalPayout;

      results.push({ payout: claimResult.payout, remainingCap });
    }
  }

  return { results };
};
