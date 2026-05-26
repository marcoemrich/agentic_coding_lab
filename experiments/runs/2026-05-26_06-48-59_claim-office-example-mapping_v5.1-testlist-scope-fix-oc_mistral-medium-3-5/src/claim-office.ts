// MHPCO Claim Office Implementation

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

interface Incident {
  cause: string;
  damages: Damage[];
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

interface Step {
  op: "quote" | "claim";
  items?: Item[];
  policy?: number;
  incident?: Incident;
}

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

interface Result {
  premium?: number;
  payout?: number;
  remainingCap?: number;
}

interface ScenarioResult {
  results: Result[];
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

export function processScenario(scenario: Scenario): ScenarioResult {
  const steps = scenario.steps;
  const customer = scenario.customer;
  
  const results: Result[] = [];
  const policies: Policy[] = [];
  let quoteIndex = 0;
  
  for (const step of steps) {
    if (step.op === "quote") {
      const items = step.items || [];
      
      // Count items by type for building block detection
      const counts: Record<string, number> = {};
      items.forEach((item) => {
        counts[item.type] = (counts[item.type] || 0) + 1;
      });
      
      // Calculate total base premium with building blocks
      let totalBasePremium = 0;
      for (const type of Object.keys(counts)) {
        const count = counts[type];
        const base = BASE_PREMIUMS[type] || 0;
        
        // Apply building block for components: exactly 3 alike = 60 G
        if (COMPONENT_TYPES.has(type) && count === 3) {
          totalBasePremium += 60;
        } else {
          totalBasePremium += count * base;
        }
      }
      
      // Apply item-specific modifiers (cursed adds 50%, high enchantment adds 30%)
      let itemModifiers = 0;
      items.forEach((item) => {
        const base = BASE_PREMIUMS[item.type] || 0;
        let itemBase = base;
        
        // For components with building blocks, adjust item base
        if (COMPONENT_TYPES.has(item.type) && counts[item.type] === 3) {
          // The block premium is 60 for 3, so each item's share is 20
          itemBase = 20;
        }
        
        // First insurance surcharge: 10% of item's base premium
        itemModifiers += itemBase * 0.1;
        
        if (item.cursed) {
          itemModifiers += itemBase * 0.5;
        }
        if (item.enchantment >= 5) {
          itemModifiers += itemBase * 0.3;
        }
      });
      
      // Apply policy-wide modifiers
      let policyModifiers = 0;
      if (customer.yearsWithMHPCO >= 2) {
        // 20% loyalty discount on policy base premium
        policyModifiers -= totalBasePremium * 0.2;
      }
      
      // Follow-up contract discount: 15% discount on each contract after the first
      if (quoteIndex >= 1) {
        policyModifiers -= totalBasePremium * 0.15;
      }
      
      quoteIndex++;
      
      const totalPremium = totalBasePremium + itemModifiers + policyModifiers + 5;
      
      // Calculate insurance sum and cap for this policy
      let insuranceSum = 0;
      items.forEach((item) => {
        insuranceSum += INSURANCE_VALUES[item.type] || 0;
      });
      const cap = insuranceSum * 2;
      
      policies.push({
        items,
        insuranceSum,
        cap,
        remainingCap: cap
      });
      
      results.push({ premium: Math.ceil(totalPremium) });
    } else if (step.op === "claim") {
      const policyIndex = step.policy || 0;
      const policy = policies[policyIndex];
      
      if (!policy) {
        // Invalid policy reference - should exit with error
        // For now, just push an error result
        results.push({ payout: 0, remainingCap: 0 });
        continue;
      }
      
      const damages = step.incident?.damages || [];
      
      // Validate damages
      const damageCounts: Record<string, number> = {};
      damages.forEach((damage) => {
        damageCounts[damage.itemType] = (damageCounts[damage.itemType] || 0) + 1;
      });
      
      const policyItemCounts: Record<string, number> = {};
      policy.items.forEach((item) => {
        policyItemCounts[item.type] = (policyItemCounts[item.type] || 0) + 1;
      });
      
      // Check if any damage item count exceeds policy item count
      let hasInvalidDamage = false;
      for (const itemType of Object.keys(damageCounts)) {
        if ((damageCounts[itemType] || 0) > (policyItemCounts[itemType] || 0)) {
          hasInvalidDamage = true;
          break;
        }
      }
      
      // Check for negative damage amounts
      const hasNegativeDamage = damages.some((d) => d.amount < 0);
      
      if (hasInvalidDamage || hasNegativeDamage) {
        // Should exit with error
        results.push({ payout: 0, remainingCap: 0 });
        continue;
      }
      
      // Calculate payout for each damage
      let totalPayout = 0;
      for (const damage of damages) {
        // Find the item in the policy
        const item = policy.items.find((i) => i.type === damage.itemType);
        if (!item) {
          // Damage references item not in policy - should exit with error
          hasInvalidDamage = true;
          break;
        }
        
        // Apply special clauses first, then deductible
        let reimbursement = damage.amount;
        
        // Enchantment >= 8: 50% reimbursement (wins over dragon material)
        if (item.enchantment >= 8) {
          reimbursement = damage.amount * 0.5;
        } else if (item.material === "dragon") {
          // Dragon material: full reimbursement
          reimbursement = damage.amount;
        }
        
        // Apply deductible per damage event
        reimbursement -= 100;
        
        // Ensure reimbursement is not negative
        if (reimbursement < 0) reimbursement = 0;
        
        totalPayout += reimbursement;
      }
      
      if (hasInvalidDamage) {
        results.push({ payout: 0, remainingCap: 0 });
        continue;
      }
      
      // Apply cap
      const payout = Math.min(totalPayout, policy.remainingCap);
      const remainingCap = policy.remainingCap - payout;
      
      // Update policy's remaining cap
      policy.remainingCap = remainingCap;
      
      results.push({ payout: Math.floor(payout), remainingCap });
    }
  }
  
  return { results };
}
