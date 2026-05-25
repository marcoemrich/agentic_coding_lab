// MHPCO Claim Office implementation

const PROCESSING_FEE = 5;

type Customer = {
  yearsWithMHPCO: number;
};

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

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

function calculateBasePremium(items: any[]): number {
  const mainItems = items.filter(i => i.type === "sword" || i.type === "amulet" || i.type === "staff" || i.type === "potion");
  const components = items.filter(i => i.type === "rune" || i.type === "moonstone");
  
  let base = mainItems.reduce((sum, item) => sum + (BASE_PREMIUMS[item.type] ?? 0), 0);
  
  // Group components by type and apply block discount for exactly 3 alike
  const componentGroups: Record<string, number> = {};
  for (const c of components) {
    componentGroups[c.type] = (componentGroups[c.type] || 0) + 1;
  }
  
  for (const [type, count] of Object.entries(componentGroups)) {
    if (count === COMPONENT_BLOCK_SIZE) {
      base += COMPONENT_BLOCK_PREMIUM;
    } else {
      base += count * (BASE_PREMIUMS[type] ?? 0);
    }
  }
  
  return base;
}

function precise(value: number): number {
  return Math.round(value * 100) / 100;
}

function isComponent(type: string): boolean {
  return type === "rune" || type === "moonstone";
}

export function quote(customer: Customer, items: any[], previousQuotes: number = 0): number {
  if (items.length === 0) return PROCESSING_FEE;
  
  // Validate item types
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  
  // Calculate policy base (sum of item base premiums, with block discounts)
  const policyBase = calculateBasePremium(items);
  
  // Calculate item-specific surcharges
  let itemSurcharges = 0;
  for (const item of items) {
    if (isComponent(item.type)) continue;
    const itemBase = BASE_PREMIUMS[item.type] ?? 0;
    if (item.cursed) {
      itemSurcharges = precise(itemSurcharges + itemBase * 0.5);
    }
    if (item.enchantment >= 5) {
      itemSurcharges = precise(itemSurcharges + itemBase * 0.3);
    }
  }
  
  // Apply policy-wide modifiers to the policy base only
  let modifiedPolicyBase = policyBase;
  
  if (customer.yearsWithMHPCO >= 2) {
    modifiedPolicyBase = precise(modifiedPolicyBase * 0.8);
  }
  
  // First insurance surcharge (applies to every quote)
  modifiedPolicyBase = precise(modifiedPolicyBase * 1.1);
  
  // Follow-up contract discount
  if (previousQuotes > 0) {
    modifiedPolicyBase = precise(modifiedPolicyBase * 0.85);
  }
  
  // Total = modified policy base + item surcharges + fee
  const totalPremium = Math.ceil(modifiedPolicyBase + itemSurcharges) + PROCESSING_FEE;
  return totalPremium;
}

function calculateInsuranceSum(items: any[]): number {
  const mainItems = items.filter(i => i.type === "sword" || i.type === "amulet" || i.type === "staff" || i.type === "potion");
  const components = items.filter(i => i.type === "rune" || i.type === "moonstone");
  
  let sum = mainItems.reduce((s, item) => s + (INSURANCE_VALUES[item.type] ?? 0), 0);
  
  const componentGroups: Record<string, number> = {};
  for (const c of components) {
    componentGroups[c.type] = (componentGroups[c.type] || 0) + 1;
  }
  
  for (const [type, count] of Object.entries(componentGroups)) {
    sum += count * (INSURANCE_VALUES[type] ?? 0);
  }
  
  return sum;
}

export function claim(policy: any, incident: any): { payout: number; remainingCap: number } {
  // Validate damages
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error("Damage amount cannot be negative");
    }
  }
  
  // Check that damage entries don't exceed insured items per type
  const damageCounts: Record<string, number> = {};
  for (const damage of incident.damages) {
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] || 0) + 1;
  }
  
  const policyItemCounts: Record<string, number> = {};
  for (const item of policy.items) {
    policyItemCounts[item.type] = (policyItemCounts[item.type] || 0) + 1;
  }
  
  for (const [itemType, count] of Object.entries(damageCounts)) {
    if ((policyItemCounts[itemType] || 0) < count) {
      throw new Error(`More damage entries for ${itemType} than insured items`);
    }
  }
  
  let payout = 0;
  
  for (const damage of incident.damages) {
    let damagePayout = damage.amount;
    
    // Find the policy item
    const policyItems = policy.items.filter((i: any) => i.type === damage.itemType);
    if (policyItems.length === 0) {
      throw new Error(`Item ${damage.itemType} not covered by policy`);
    }
    
    const item = policyItems[0];
    
    // Apply special clauses
    // Note: enchantment >= 8 (50% reimbursement) wins over dragon material (full reimbursement)
    if (item.material === "dragon") {
      damagePayout = damage.amount; // full reimbursement
    }
    if (item.enchantment >= 8) {
      damagePayout = damage.amount * 0.5; // 50% rule wins
    }
    
    // Apply deductible
    damagePayout -= 100;
    if (damagePayout < 0) damagePayout = 0;
    
    payout += damagePayout;
  }
  
  // Apply cap
  if (payout > policy.remainingCap) {
    payout = policy.remainingCap;
  }
  
  // Round down in MHPCO's favor
  payout = Math.floor(payout);
  
  const remainingCap = policy.remainingCap - payout;
  
  return { payout, remainingCap };
}

export function processScenario(scenario: any): { results: any[] } {
  const results: any[] = [];
  const policies: any[] = [];
  let quoteCount = 0;
  
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const premium = quote(scenario.customer, step.items, quoteCount);
      const insuranceSum = calculateInsuranceSum(step.items);
      const cap = insuranceSum * 2;
      
      policies.push({
        items: step.items,
        insuranceSum,
        cap,
        remainingCap: cap,
      });
      
      results.push({ premium });
      quoteCount++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      const result = claim(policy, step.incident);
      policy.remainingCap = result.remainingCap;
      results.push(result);
    }
  }
  
  return { results };
}
