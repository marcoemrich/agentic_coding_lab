// Item types and their insurance values / base premiums
const MAIN_ITEMS: Record<string, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface QuoteStep {
  op: 'quote';
  items: Item[];
}

interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function isKnownType(type: string): boolean {
  return type in MAIN_ITEMS || isComponent(type);
}

function computeComponentBasePremium(items: Item[]): number {
  // Group components by type
  const groups: Record<string, number> = {};
  for (const item of items) {
    if (isComponent(item.type)) {
      groups[item.type] = (groups[item.type] || 0) + 1;
    }
  }

  let total = 0;
  for (const count of Object.values(groups)) {
    if (count === COMPONENT_BLOCK_SIZE) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * COMPONENT_BASE_PREMIUM;
    }
  }
  return total;
}

function computeInsuranceSum(items: Item[]): number {
  let sum = 0;
  for (const item of items) {
    if (isComponent(item.type)) {
      sum += COMPONENT_INSURANCE_VALUE;
    } else {
      sum += MAIN_ITEMS[item.type].insuranceValue;
    }
  }
  return sum;
}

function computeQuote(
  items: Item[],
  customer: { yearsWithMHPCO: number },
  quoteIndex: number,
): { premium: number; policy: Policy } {
  // Validate items
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  // Compute per-item base premiums and item-specific surcharges
  let policyBasePremium = 0;
  let itemSurcharges = 0;

  // Main items
  for (const item of items) {
    if (isComponent(item.type)) continue;

    const base = MAIN_ITEMS[item.type].basePremium;
    policyBasePremium += base;

    // Cursed surcharge: 50% of item base
    if (item.cursed) {
      itemSurcharges += base * 0.5;
    }
    // High enchantment surcharge: 30% of item base
    if ((item.enchantment ?? 0) >= 5) {
      itemSurcharges += base * 0.3;
    }
  }

  // Components
  policyBasePremium += computeComponentBasePremium(items);

  // Policy-wide modifiers (applied to policyBasePremium)
  let policyModifiers = 0;

  // First insurance surcharge: 10% of policy base premium
  // "each item in a quote is treated as a first insurance" — this always applies
  policyModifiers += policyBasePremium * 0.1;

  // Loyalty discount: 20% of policy base premium (>= 2 years)
  if (customer.yearsWithMHPCO >= 2) {
    policyModifiers -= policyBasePremium * 0.2;
  }

  // Follow-up contract discount: 15% of policy base premium (after first quote)
  if (quoteIndex > 0) {
    policyModifiers -= policyBasePremium * 0.15;
  }

  // Total before fee (keep as fraction)
  const totalBeforeFee = policyBasePremium + itemSurcharges + policyModifiers;

  // Round up (in MHPCO's favor for premiums), then add fee
  const premium = Math.ceil(totalBeforeFee) + PROCESSING_FEE;

  // Compute insurance sum and cap
  const insuranceSum = computeInsuranceSum(items);
  const cap = insuranceSum * 2;

  return {
    premium,
    policy: { items, insuranceSum, cap, remainingCap: cap },
  };
}

function processClaim(
  policy: Policy,
  damages: Damage[],
  items: Item[],
): { payout: number; remainingCap: number } {
  // Validate damages
  // Count how many of each type are in the policy
  const policyTypeCounts: Record<string, number> = {};
  for (const item of items) {
    policyTypeCounts[item.type] = (policyTypeCounts[item.type] || 0) + 1;
  }

  // Count how many of each type are in damages
  const damageTypeCounts: Record<string, number> = {};
  for (const damage of damages) {
    if (!isKnownType(damage.itemType)) {
      throw new Error(`Unknown item type in damage: ${damage.itemType}`);
    }
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    damageTypeCounts[damage.itemType] = (damageTypeCounts[damage.itemType] || 0) + 1;
  }

  // Verify damage counts don't exceed policy counts
  for (const [type, count] of Object.entries(damageTypeCounts)) {
    if (!policyTypeCounts[type] || count > policyTypeCounts[type]) {
      throw new Error(`Damage for ${type} exceeds insured count`);
    }
  }

  // Match each damage to the corresponding insured item
  // We need to find the item details for each damage entry to check enchantment/material
  // Build a pool of available items per type
  const itemPool: Record<string, Item[]> = {};
  for (const item of items) {
    if (!itemPool[item.type]) itemPool[item.type] = [];
    itemPool[item.type].push({ ...item });
  }

  let totalPayout = 0;

  for (const damage of damages) {
    const availableItems = itemPool[damage.itemType];
    // Pick the first available item of this type
    const item = availableItems!.shift()!;

    let reimbursement = damage.amount;

    // Check enchantment level >= 8: 50% reimbursement
    const enchantment = item.enchantment ?? 0;
    if (enchantment >= 8) {
      reimbursement = damage.amount * 0.5;
    }
    // dragon material: full reimbursement (but if enchantment >= 8, 50% wins)
    // If both apply, 50% rule wins (already handled above)
    // If only dragon, full reimbursement (already the default)

    // Apply deductible
    reimbursement = reimbursement - DEDUCTIBLE;
    if (reimbursement < 0) reimbursement = 0;

    totalPayout += reimbursement;
  }

  // Round payout down (in MHPCO's favor)
  totalPayout = Math.floor(totalPayout);

  // Apply cap
  if (totalPayout > policy.remainingCap) {
    totalPayout = policy.remainingCap;
  }

  policy.remainingCap -= totalPayout;

  return { payout: totalPayout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: any[] } {
  const results: any[] = [];
  const policies: Policy[] = [];
  let quoteCount = 0;

  for (const step of scenario.steps) {
    if (step.op === 'quote') {
      const { premium, policy } = computeQuote(
        step.items,
        scenario.customer,
        quoteCount,
      );
      policies.push(policy);
      results.push({ premium });
      quoteCount++;
    } else if (step.op === 'claim') {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error(`Invalid policy reference: ${step.policy}`);
      }

      // Validate damages
      for (const damage of step.incident.damages) {
        if (damage.amount < 0) {
          throw new Error(`Negative damage amount: ${damage.amount}`);
        }
      }

      const { payout, remainingCap } = processClaim(
        policy,
        step.incident.damages,
        policy.items,
      );
      results.push({ payout, remainingCap });
    }
  }

  return { results };
}
