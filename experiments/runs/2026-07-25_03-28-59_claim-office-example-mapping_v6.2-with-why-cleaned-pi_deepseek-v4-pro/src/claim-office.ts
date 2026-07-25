interface QuoteStep {
  op: "quote";
  items: { type: string; cursed?: boolean; enchantment?: number }[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: { itemType: string; amount: number }[] };
}

type ScenarioStep = QuoteStep | ClaimStep;

interface ScenarioInput {
  customer: { yearsWithMHPCO: number };
  steps: ScenarioStep[];
}

interface ScenarioResult {
  results: ({ premium: number } | { payout: number; remainingCap: number })[];
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

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
const ALL_ITEM_TYPES = new Set(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

const COMPONENT_BASE = 25;
const BLOCK_PRICE = 60;

interface PolicyData {
  items: { type: string; material?: string; enchantment?: number }[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

function calculateQuotePremium(
  items: { type: string; cursed?: boolean; enchantment?: number }[],
  customerYears: number,
  quoteIndex: number
): number {
  // Validate all item types
  for (const item of items) {
    if (!ALL_ITEM_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  let totalBase = 0;  // sum of raw base premiums (for policy modifiers)
  let totalWithSurcharges = 0;  // sum including item-level surcharges
  
  // Group components for block pricing
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      const itemBase = BASE_PREMIUMS[item.type] ?? 0;
      let itemTotal = itemBase;
      // Cursed surcharge: 50% of item base premium
      if (item.cursed) {
        itemTotal += itemBase * 0.5;
      }
      // High enchantment surcharge: 30% for enchantment level ≥ 5
      if (item.enchantment !== undefined && item.enchantment >= 5) {
        itemTotal += itemBase * 0.3;
      }
      totalBase += itemBase;
      totalWithSurcharges += itemTotal;
    }
  }
  
  // Apply component block pricing: block of exactly 3 alike = 60 G
  for (const count of Object.values(componentCounts)) {
    const componentTotal = count === 3 ? BLOCK_PRICE : count * COMPONENT_BASE;
    totalBase += componentTotal;
    totalWithSurcharges += componentTotal;
  }
  
  // Policy-wide modifiers (additive, based on totalBase, not surcharged amounts)
  let policyAdjustment = 0;
  
  // Loyalty discount: 20% for customers ≥ 2 years
  if (customerYears >= 2) {
    policyAdjustment -= totalBase * 0.2;
  }
  
  // First insurance surcharge: 10%
  policyAdjustment += totalBase * 0.1;
  
  // Follow-up contract discount: 15% for subsequent contracts
  if (quoteIndex > 0) {
    policyAdjustment -= totalBase * 0.15;
  }

  // Avoid floating-point rounding errors
  const premium = Math.ceil(totalWithSurcharges + policyAdjustment + PROCESSING_FEE - 1e-10);
  return premium;
}

function calculateItemInsuranceValue(itemType: string): number {
  return INSURANCE_VALUES[itemType] ?? 0;
}

function computePayout(
  damage: { itemType: string; amount: number },
  policyItems: { type: string; material?: string; enchantment?: number }[]
): number {
  const policyItem = policyItems.find(i => i.type === damage.itemType);
  if (!policyItem) {
    throw new Error(`Item type not in policy: ${damage.itemType}`);
  }
  
  const enchantment = policyItem.enchantment ?? 0;
  const material = policyItem.material ?? "";
  
  let reimbursable = damage.amount;
  
  // Enchantment ≥ 8: 50% reimbursement
  if (enchantment >= 8) {
    reimbursable = Math.floor(reimbursable * 0.5);
  } else if (material === "dragon") {
    // Dragon material: full reimbursement
    // (already at 100%)
  }
  // else: standard full reimbursement
  
  // Deductible: 100 G per damage event
  reimbursable = reimbursable - 100;
  
  return Math.max(0, Math.floor(reimbursable));
}

export function processScenario(input: ScenarioInput): ScenarioResult {
  const results: ({ premium: number } | { payout: number; remainingCap: number })[] = [];
  const policies: PolicyData[] = [];
  let quoteIndex = 0;
  
  for (const step of input.steps) {
    if (step.op === "quote") {
      const premium = calculateQuotePremium(step.items, input.customer.yearsWithMHPCO, quoteIndex);
      
      // Compute insurance sum and store policy
      let insuranceSum = 0;
      for (const item of step.items) {
        insuranceSum += calculateItemInsuranceValue(item.type);
      }
      const cap = insuranceSum * 2;
      policies.push({
        items: step.items.map(i => ({ type: i.type, material: (i as any).material, enchantment: i.enchantment })),
        insuranceSum,
        cap,
        remainingCap: cap,
      });
      
      results.push({ premium });
      quoteIndex++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error(`Policy not found: ${step.policy}`);
      }
      
      // Validate damages
      for (const damage of step.incident.damages) {
        if (damage.amount < 0) {
          throw new Error(`Negative damage amount: ${damage.amount}`);
        }
        if (!ALL_ITEM_TYPES.has(damage.itemType)) {
          throw new Error(`Unknown item type in claim: ${damage.itemType}`);
        }
        // Check count of damages per type vs policy coverage
        const policyCount = policy.items.filter(i => i.type === damage.itemType).length;
        const damageCount = step.incident.damages.filter(d => d.itemType === damage.itemType).length;
        if (damageCount > policyCount) {
          throw new Error(`More damage entries for "${damage.itemType}" than insured`);
        }
      }
      
      let totalPayout = 0;
      for (const damage of step.incident.damages) {
        totalPayout += computePayout(damage, policy.items);
      }
      
      // Cap the payout
      if (totalPayout > policy.remainingCap) {
        totalPayout = policy.remainingCap;
      }
      
      policy.remainingCap -= totalPayout;
      results.push({ payout: totalPayout, remainingCap: policy.remainingCap });
    }
  }
  
  return { results };
}