async function runCLI(input: string): Promise<any> {
  const data = JSON.parse(input);
  const steps = data.steps;
  const customer = data.customer;
  const basePremiums: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
  const insuranceValues: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
  
  const results: any[] = [];
  // Map from quote step index to policy
  const policyByQuoteStepIndex: Record<number, { insuranceSum: number; cap: number; remainingCap: number; items: any[] }> = {};
  let quoteCount = 0;
  
  for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
    const step = steps[stepIndex];
    
    if (step.op === "quote") {
      quoteCount++;
      const items = step.items;
      
      // Validate item types
      for (const item of items) {
        if (!basePremiums[item.type] && !insuranceValues[item.type]) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }
      
      // Group items by type to apply block discounts
      const itemCounts: Record<string, number> = {};
      for (const item of items) {
        itemCounts[item.type] = (itemCounts[item.type] || 0) + 1;
      }
      
      let policyBasePremium = 0;
      let itemSpecificModifiers = 0;
      
      for (const [type, count] of Object.entries(itemCounts)) {
        const base = basePremiums[type] || 0;
        // Apply block discount for components: exactly 3 alike = 60 G
        if ((type === "rune" || type === "moonstone") && count === 3) {
          policyBasePremium += 60;
        } else {
          policyBasePremium += count * base;
        }
      }
      
      // Apply item-specific modifiers
      for (const item of items) {
        const base = basePremiums[item.type] || 0;
        if (item.cursed) {
          itemSpecificModifiers += base * 0.5;
        }
        if (item.enchantment >= 5) {
          itemSpecificModifiers += base * 0.3;
        }
      }
      
      // Apply policy-wide modifiers
      let policyModifiers = 0;
      // First insurance surcharge (10% of policy base premium)
      policyModifiers += policyBasePremium * 0.1;
      // Loyalty discount (20% of policy base premium) for customers with >= 2 years
      if (customer.yearsWithMHPCO >= 2) {
        policyModifiers -= policyBasePremium * 0.2;
      }
      // Follow-up contract discount (15% of policy base premium) for second and subsequent quotes
      if (quoteCount > 1) {
        policyModifiers -= policyBasePremium * 0.15;
      }
      
      const totalBeforeFee = policyBasePremium + itemSpecificModifiers + policyModifiers;
      // Add fee, then round up for premiums (MHPCO's favor)
      const premium = items.length === 0 ? 5 : Math.ceil(totalBeforeFee + 5);
      
      // Calculate insurance sum for this policy
      let insuranceSum = 0;
      for (const item of items) {
        insuranceSum += insuranceValues[item.type] || 0;
      }
      const cap = insuranceSum * 2;
      
      // Store policy by quote step index
      policyByQuoteStepIndex[stepIndex] = { insuranceSum, cap, remainingCap: cap, items: [...items] };
      results.push({ premium });
    } else if (step.op === "claim") {
      const policy = policyByQuoteStepIndex[step.policy];
      if (!policy) {
        throw new Error(`Policy ${step.policy} not found`);
      }
      
      const damages = step.incident.damages;
      
      // Validate damage entries
      for (const damage of damages) {
        if (!insuranceValues[damage.itemType]) {
          throw new Error(`Unknown item type in damage: ${damage.itemType}`);
        }
      }
      
      // Count items in policy by type
      const policyItemCounts: Record<string, number> = {};
      for (const item of policy.items) {
        policyItemCounts[item.type] = (policyItemCounts[item.type] || 0) + 1;
      }
      
      // Count damage entries by type
      const damageItemCounts: Record<string, number> = {};
      for (const damage of damages) {
        damageItemCounts[damage.itemType] = (damageItemCounts[damage.itemType] || 0) + 1;
      }
      
      // Check if any damage entry has more occurrences than the policy covers
      for (const [type, count] of Object.entries(damageItemCounts)) {
        if ((policyItemCounts[type] || 0) < count) {
          throw new Error(`Damage contains ${count} entries of type ${type} but policy only covers ${policyItemCounts[type] || 0}`);
        }
      }
      
      // Check for negative damage amounts
      for (const damage of damages) {
        if (damage.amount < 0) {
          throw new Error(`Negative damage amount: ${damage.amount}`);
        }
      }
      
      // Calculate payout
      // Track which damage entry maps to which policy item
      const policyItemsByType: Record<string, any[]> = {};
      for (const item of policy.items) {
        if (!policyItemsByType[item.type]) {
          policyItemsByType[item.type] = [];
        }
        policyItemsByType[item.type].push(item);
      }
      
      let totalPayout = 0;
      for (const damage of damages) {
        const itemType = damage.itemType;
        const itemsOfType = policyItemsByType[itemType] || [];
        
        // Find the first available item of this type to match the damage
        const item = itemsOfType[0];
        if (!item) {
          throw new Error(`No item of type ${itemType} in policy`);
        }
        
        let reimbursement = damage.amount;
        
        // Apply special clauses
        // If both dragon material and enchantment >= 8, the 50% rule wins
        if (item.enchantment >= 8) {
          // 50% reimbursement (wins over dragon material)
          reimbursement = damage.amount * 0.5;
        } else if (item.material === "dragon") {
          // Full reimbursement
          reimbursement = damage.amount;
        }
        
        // Deductible applies per damage event
        reimbursement -= 100;
        
        if (reimbursement < 0) {
          reimbursement = 0;
        }
        
        totalPayout += reimbursement;
      }
      
      // Apply cap
      const payout = Math.min(totalPayout, policy.remainingCap);
      const remainingCap = policy.remainingCap - payout;
      
      // Update policy
      policy.remainingCap = remainingCap;
      
      // Round down for payouts (MHPCO's favor)
      results.push({ payout: Math.floor(payout), remainingCap: Math.floor(remainingCap) });
    }
  }
  
  return { results };
}

// CLI entry point
import { readFileSync } from 'fs';

async function main() {
  let input = '';
  process.stdin.on('data', (chunk) => {
    input += chunk;
  });
  
  process.stdin.on('end', async () => {
    try {
      const result = await runCLI(input);
      process.stdout.write(JSON.stringify(result));
      process.exit(0);
    } catch (error: any) {
      process.stderr.write(error.message + '\n');
      process.exit(1);
    }
  });
}

// Only run main if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runCLI };
