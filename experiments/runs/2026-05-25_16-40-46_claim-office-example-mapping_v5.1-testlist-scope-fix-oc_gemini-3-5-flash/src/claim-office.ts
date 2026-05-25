const ALLOWED_ITEM_TYPES = ["sword", "amulet", "staff", "potion", "rune", "moonstone"];

function validateItemTypes(scenario: any): void {
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      for (const item of step.items) {
        if (!ALLOWED_ITEM_TYPES.includes(item.type)) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }
    }
  }
}

const ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25
};

const ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250
};

export function processScenario(scenario: any): any {
  validateItemTypes(scenario);

  let quoteCount = 0;
  const policies: any[] = [];
  const policyCaps: number[] = [];

  const results = scenario.steps.map((step: any, stepIndex: number) => {
    if (step.op === "quote") {
      return handleQuote(step, stepIndex);
    } else if (step.op === "claim") {
      return handleClaim(step);
    }
    return {};
  });

  return { results };

  function handleQuote(step: any, stepIndex: number) {
    quoteCount++;

    // We store the quote details in policies array matching the stepIndex
    policies[stepIndex] = step;

    // Calculate insurance sum and cap
    let insuranceSum = 0;
    for (const item of step.items) {
      insuranceSum += ITEM_INSURANCE_VALUES[item.type] || 0;
    }
    policyCaps[stepIndex] = insuranceSum * 2;

    if (step.items.length === 0) {
      return { premium: 5 };
    }
    
    // Calculate base premium
    let policyBasePremium = 0;
    
    // Count components
    const componentCounts: Record<string, number> = {
      rune: 0,
      moonstone: 0
    };

    for (const item of step.items) {
      if (item.type === "rune" || item.type === "moonstone") {
        componentCounts[item.type]++;
      } else {
        policyBasePremium += ITEM_BASE_PREMIUMS[item.type] || 0;
      }
    }

    // Add component premiums using building block rules
    for (const [type, count] of Object.entries(componentCounts)) {
      if (count === 0) continue;
      if (count % 3 === 0) {
        policyBasePremium += (count / 3) * 60;
      } else {
        policyBasePremium += count * 25;
      }
    }

    // Surcharges on specific items
    let itemSpecificSurcharges = 0;
    for (const item of step.items) {
      let basePremium = ITEM_BASE_PREMIUMS[item.type] || 0;
      
      let itemSurchargeRate = 0;
      if (item.cursed) {
        itemSurchargeRate += 0.5;
      }
      if (item.enchantment !== undefined && item.enchantment >= 5) {
        itemSurchargeRate += 0.3;
      }

      itemSpecificSurcharges += basePremium * itemSurchargeRate;
    }

    // Policy-wide modifiers (applied to policy base premium)
    // First insurance: 10%
    let policyWideModifiersRate = 0.1; // First insurance is always applied
    
    if (scenario.customer.yearsWithMHPCO >= 2) {
      policyWideModifiersRate -= 0.2; // Loyalty discount
    }

    if (quoteCount > 1) {
      policyWideModifiersRate -= 0.15; // Follow-up contract discount
    }
    
    let policyWideModifiers = policyBasePremium * policyWideModifiersRate;
    
    // we round up in MHPCO favor at the end of premium calculation
    let totalPremium = Math.ceil(policyBasePremium + itemSpecificSurcharges + policyWideModifiers + 5);

    return { premium: totalPremium };
  }

  function handleClaim(step: any) {
    const referencedPolicy = policies[step.policy];
    if (!referencedPolicy) {
      throw new Error(`Policy at index ${step.policy} does not exist`);
    }

    // Validate damages
    const policyItemCounts: Record<string, number> = {};
    for (const item of referencedPolicy.items) {
      policyItemCounts[item.type] = (policyItemCounts[item.type] || 0) + 1;
    }

    const claimItemCounts: Record<string, number> = {};
    for (const damage of step.incident.damages) {
      if (damage.amount < 0) {
        throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
      }
      if (!policyItemCounts[damage.itemType]) {
        throw new Error(`Item of type ${damage.itemType} is not covered by the policy`);
      }
      claimItemCounts[damage.itemType] = (claimItemCounts[damage.itemType] || 0) + 1;
    }

    for (const [itemType, count] of Object.entries(claimItemCounts)) {
      if (count > (policyItemCounts[itemType] || 0)) {
        throw new Error(`Claim contains more damages for ${itemType} than policy covers`);
      }
    }

    // Calculate payout
    let rawPayout = 0;
    
    // Copy of policy items to match against damages sequentially
    const availableItems = [...referencedPolicy.items];

    for (const damage of step.incident.damages) {
      // Find matching item in policy
      const itemIndex = availableItems.findIndex(item => item.type === damage.itemType);
      const policyItem = itemIndex !== -1 ? availableItems.splice(itemIndex, 1)[0] : null;

      let damageReimbursedAmount = damage.amount;
      if (policyItem) {
        // If enchantment >= 8, reimbursed at 50%
        if (policyItem.enchantment !== undefined && policyItem.enchantment >= 8) {
          damageReimbursedAmount = damage.amount * 0.5;
        } else if (policyItem.material && policyItem.material.includes("dragon")) {
          // dragon-material is fully reimbursed (no change)
          damageReimbursedAmount = damage.amount;
        }
      }

      let payoutForDamage = Math.max(0, damageReimbursedAmount - 100);
      rawPayout += payoutForDamage;
    }

    // Round down payout in MHPCO favor
    let payout = Math.floor(rawPayout);

    // Cap cap payout
    let currentCap = policyCaps[step.policy];
    if (payout > currentCap) {
      payout = currentCap;
    }

    // Deduct payout from cap
    policyCaps[step.policy] -= payout;

    return { payout, remainingCap: policyCaps[step.policy] };
  }
}
