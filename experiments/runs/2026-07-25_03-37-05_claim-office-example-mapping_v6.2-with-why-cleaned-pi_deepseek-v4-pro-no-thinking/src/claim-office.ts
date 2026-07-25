// Claim Office - MHPCO policy management system

const PROCESSING_FEE = 5;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = ["rune", "moonstone"];

type StepResult = { premium: number } | { payout: number; remainingCap: number };

interface Policy {
  insuranceSum: number;
  cap: number;
  remainingCap: number;
  items: any[];
}

// Compute a single quote's premium (used internally by processScenario)
function computeQuotePremium(items: any[], customer: any, isFollowUp: boolean): number {
  if (!items || items.length === 0) {
    return PROCESSING_FEE;
  }

  const componentCounts: Record<string, number> = {};
  let baseTotal = 0;
  let itemSurcharges = 0;

  for (const item of items) {
    if (!BASE_PREMIUM[item.type] && !COMPONENT_TYPES.includes(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    if (COMPONENT_TYPES.includes(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    } else {
      const base = BASE_PREMIUM[item.type];
      baseTotal += base;
      if (item.cursed) {
        itemSurcharges += base * 0.5;
      }
      if (item.enchantment !== undefined && item.enchantment >= 5) {
        itemSurcharges += base * 0.3;
      }
    }
  }

  // Process component building blocks: exactly 3 alike = 60 G block, else 25 G each
  for (const type of COMPONENT_TYPES) {
    const count = componentCounts[type] || 0;
    baseTotal += count === 3 ? 60 : count * 25;
  }

  // Policy-wide adjustments
  let policyAdjustments = 0;
  if (customer.yearsWithMHPCO >= 2) {
    policyAdjustments -= baseTotal * 0.2;
  }
  // First-insurance surcharge always applies (10% of baseTotal)
  policyAdjustments += baseTotal * 0.1;
  // Follow-up contract discount
  if (isFollowUp) {
    policyAdjustments -= baseTotal * 0.15;
  }

  const rawPremium = PROCESSING_FEE + baseTotal + itemSurcharges + policyAdjustments;
  return Math.ceil(rawPremium);
}

function computeInsuranceSum(items: any[]): number {
  let sum = 0;
  for (const item of items) {
    const val = INSURANCE_VALUE[item.type];
    if (val === undefined) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    sum += val;
  }
  return sum;
}

export function processScenario(scenario: any): { results: StepResult[] } {
  const steps = scenario.steps as any[];
  const customer = scenario.customer;
  const results: StepResult[] = [];
  const policies: (Policy | null)[] = [];

  let quoteCount = 0;

  for (const step of steps) {
    if (step.op === "quote") {
      const items = step.items as any[];
      const isFollowUp = quoteCount > 0;

      const insuranceSum = computeInsuranceSum(items);
      const cap = insuranceSum * 2;
      const premium = computeQuotePremium(items, customer, isFollowUp);

      results.push({ premium });
      policies.push({ insuranceSum, cap, remainingCap: cap, items });
      quoteCount++;
    } else if (step.op === "claim") {
      const policyIndex = step.policy as number;
      const policy = policies[policyIndex];
      if (!policy) {
        throw new Error(`Invalid policy index: ${policyIndex}`);
      }

      const incident = step.incident;
      const damages = incident.damages as any[];

      // Validate damages
      for (const damage of damages) {
        if (damage.amount < 0) {
          throw new Error(`Negative damage amount: ${damage.amount}`);
        }
        if (!INSURANCE_VALUE[damage.itemType]) {
          throw new Error(`Unknown item type in damage: ${damage.itemType}`);
        }
      }

      // Check item counts: each damage entry type must not exceed insured count
      for (const damage of damages) {
        const insuredCount = policy.items.filter((i: any) => i.type === damage.itemType).length;
        const claimCount = damages.filter((d: any) => d.itemType === damage.itemType).length;
        if (claimCount > insuredCount) {
          throw new Error(`More ${damage.itemType} damages claimed than insured`);
        }
      }

      const deductible = 100;
      let totalPayout = 0;

      for (const damage of damages) {
        // Find matching insured item for enchantment/material modifiers
        const insuredItem = policy.items.find((i: any) => i.type === damage.itemType);
        if (!insuredItem) {
          throw new Error(`Item type not found in policy: ${damage.itemType}`);
        }

        let reimbursement = damage.amount;

        // High enchantment (>= 8) overrides all other clauses: 50% reimbursement
        if (insuredItem.enchantment !== undefined && insuredItem.enchantment >= 8) {
          reimbursement = Math.floor(reimbursement * 0.5);
        }
        // Otherwise, dragon material gets full reimbursement (the default), 
        // while other materials also get full reimbursement by default.
        // No explicit material check needed.

        // Apply deductible (minimum 0)
        reimbursement = Math.max(0, reimbursement - deductible);
        totalPayout += reimbursement;
      }

      // Cap enforcement
      if (totalPayout > policy.remainingCap) {
        totalPayout = Math.floor(policy.remainingCap);
      }
      totalPayout = Math.floor(totalPayout);

      policy.remainingCap -= totalPayout;
      const remainingCap = Math.floor(policy.remainingCap);

      results.push({ payout: totalPayout, remainingCap });
    }
  }

  return { results };
}

// Export computeQuotePremium for unit testing (renamed for backward compat)
export function computeQuote(scenario: any): { results: { premium: number }[] } {
  const items = scenario.steps[0].items as any[] | undefined;
  const isFollowUp = false; // unit tests use fresh scenario
  const premium = computeQuotePremium(items || [], scenario.customer, isFollowUp);
  return { results: [{ premium }] };
}