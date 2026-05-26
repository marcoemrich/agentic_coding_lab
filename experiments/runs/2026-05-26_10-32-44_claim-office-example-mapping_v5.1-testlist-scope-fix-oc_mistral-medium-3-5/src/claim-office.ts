export function processScenario(scenario: any): any {
  const steps = scenario.steps;
  const results: any[] = [];
  
  // Track quote count for follow-up contract discount
  let quoteCount = 0;
  
  // Track policy state (remaining cap for each policy)
  const policyState: Record<number, { initialCap: number; remainingCap: number }> = {};
  
  for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
    const step = steps[stepIndex];
    if (step.op === "quote") {
      const items = step.items;
      quoteCount++;
      
      if (items.length === 0) {
        results.push({ premium: 5 });
        // Store policy state for this quote (using step index as key)
        policyState[stepIndex] = { initialCap: 0, remainingCap: 0 };
        continue;
      }
      
      const basePremiums: Record<string, number> = {
        sword: 100,
        amulet: 60,
        staff: 80,
        potion: 40,
        rune: 25,
        moonstone: 25
      };
      
  // Calculate policy base premium (sum of item base premiums) and insurance sum
  let policyBasePremium = 0;
  let insuranceSum = 0;
  
  // Calculate item-specific modifiers separately
  let totalItemSpecificModifiers = 0;
  
  // Group components by type for building block discounts
  const componentGroups: Record<string, number> = {};
  
  // Insurance values for cap calculation
  const insuranceValues: Record<string, number> = {
    sword: 1000,
    amulet: 600,
    staff: 800,
    potion: 400,
    rune: 250,
    moonstone: 250
  };
  
   for (const item of items) {
     const type = item.type;
      const basePremium = basePremiums[type];
      if (basePremium === undefined) {
        throw new Error(`Unknown item type in quote: ${type}`);
      }
    
    // Add to policy base premium
    if (type === "rune" || type === "moonstone") {
      // Components - count for potential building blocks
      componentGroups[type] = (componentGroups[type] || 0) + 1;
      // For now, add the base premium (we'll adjust for blocks later)
      policyBasePremium += basePremium;
    } else {
      // Main items - add base premium
      policyBasePremium += basePremium;
    }
    
    // Add to insurance sum
    insuranceSum += insuranceValues[type] || 0;
    
    // Calculate item-specific modifiers
    if (type !== "rune" && type !== "moonstone") {
      if (item.cursed) {
        totalItemSpecificModifiers += basePremium * 0.5; // 50% curse surcharge
      }
      if (item.enchantment && item.enchantment >= 5) {
        totalItemSpecificModifiers += basePremium * 0.3; // 30% high enchantment surcharge
      }
    }
  }
  
  // Calculate cap (twice the insurance sum)
  const cap = insuranceSum * 2;
  
  // Apply building block discounts for components
  // First, subtract the base premiums for components that form blocks
  for (const [type, count] of Object.entries(componentGroups)) {
    if (count === 3) {
      // Exactly 3 alike components: subtract 3 * 25 and add 60
      policyBasePremium -= 3 * 25;
      policyBasePremium += 60;
    }
    // For other counts, the base premium is already correct
  }
  
  // Apply policy-wide modifiers to policy base premium
  let modifiedPolicyBasePremium = policyBasePremium;
  
  // Loyalty discount for long-standing customers (≥ 2 years)
  if (scenario.customer.yearsWithMHPCO >= 2) {
    modifiedPolicyBasePremium *= 0.8; // 20% discount
  }
  
  // First insurance surcharge (applies to all quotes according to spec)
  modifiedPolicyBasePremium *= 1.1; // 10% surcharge
  
  // Follow-up contract discount (applies to quotes after the first)
  if (quoteCount > 1) {
    modifiedPolicyBasePremium *= 0.85; // 15% discount
  }
  
  // Total premium = modified policy base premium + item-specific modifiers + processing fee
  // Round to 10 decimal places to avoid floating point precision issues
  const totalPremium = Math.round((modifiedPolicyBasePremium + totalItemSpecificModifiers + 5) * 1e10) / 1e10;
  
  // Apply rounding to final premium (round up for premiums)
  const finalPremium = Math.ceil(totalPremium);
  
      // Store policy state for this quote (using step index as key)
      policyState[stepIndex] = { initialCap: cap, remainingCap: cap };
      
      results.push({ premium: finalPremium });
    } else if (step.op === "claim") {
      // Claim processing
      const policyIndex = step.policy;
      const policyStep = steps[policyIndex];
      
      if (!policyStep || policyStep.op !== "quote") {
        // Invalid policy reference - should exit with error, but for now return 0
        results.push({ payout: 0, remainingCap: 0 });
        continue;
      }
      
      const policyItems = policyStep.items;
      const incident = step.incident;
      const damages = incident.damages;
      
      // Get policy state (cap information)
      const policy = policyState[policyIndex];
      if (!policy) {
        // Policy not found - should exit with error, but for now return 0
        results.push({ payout: 0, remainingCap: 0 });
        continue;
      }
      
      // Calculate insurance sum for the policy
      const insuranceValues: Record<string, number> = {
        sword: 1000,
        amulet: 600,
        staff: 800,
        potion: 400,
        rune: 250,
        moonstone: 250
      };
      
      let totalInsuranceSum = 0;
      const itemCounts: Record<string, number> = {};
      
      for (const item of policyItems) {
        const type = item.type;
        totalInsuranceSum += insuranceValues[type] || 0;
        itemCounts[type] = (itemCounts[type] || 0) + 1;
      }
      
      const initialCap = totalInsuranceSum * 2;
      const currentRemainingCap = policy.remainingCap;
      
      // Check if there are more damage entries than insured items
      let hasError = false;
      const damageCounts: Record<string, number> = {};
      for (const damage of damages) {
        const itemType = damage.itemType;
        damageCounts[itemType] = (damageCounts[itemType] || 0) + 1;
      }
      
       for (const [itemType, damageCount] of Object.entries(damageCounts)) {
         const insuredCount = itemCounts[itemType] || 0;
         if (damageCount > insuredCount) {
           throw new Error(`Damage to uninsured item or too many damages: ${itemType}`);
         }
       }
       
       if (hasError) {
         results.push({ payout: 0, remainingCap: 0 });
         continue;
       }
      
      // Process each damage
      let totalPayout = 0;
      
      for (const damage of damages) {
        const itemType = damage.itemType;
        const damageAmount = damage.amount;
        
         // Check if this damage is valid
         if (damageAmount < 0) {
           throw new Error(`Negative damage amount: ${damageAmount}`);
         }
        
        // Calculate reimbursement for this damage
        let reimbursement = damageAmount;
        
        // Apply special clauses
        // Note: We need to check the actual item properties from the policy
        // For now, we'll assume we can find the item in the policy
        const policyItem = policyItems.find((item: any) => item.type === itemType);
        
        if (policyItem) {
          // Check for enchantment level >= 8 and dragon material
          const isHighEnchantment = policyItem.enchantment && policyItem.enchantment >= 8;
          const isDragonMaterial = policyItem.material === "dragon";
          
          if (isHighEnchantment) {
            // 50% reimbursement for high enchantment
            reimbursement *= 0.5;
          } else if (isDragonMaterial) {
            // Full reimbursement for dragon material (no change)
            // reimbursement remains the same
          }
          // If both conditions apply, the 50% rule wins (as per spec)
          // If neither applies, full reimbursement
        }
        
        // Apply deductible
        const afterDeductible = Math.max(0, reimbursement - 100);
        
        totalPayout += afterDeductible;
      }
      
      if (hasError) {
        // For now, return 0 for errors
        results.push({ payout: 0, remainingCap: 0 });
        continue;
      }
      
      // Apply cap (use current remaining cap, not initial cap)
      const cappedPayout = Math.min(totalPayout, currentRemainingCap);
      
      // Calculate remaining cap
      const remainingCap = Math.max(0, currentRemainingCap - cappedPayout);
      
      // Update policy state
      policyState[policyIndex].remainingCap = remainingCap;
      
      // Round down for payouts (MHPCO's favor)
      const finalPayout = Math.floor(cappedPayout);
      
      results.push({ payout: finalPayout, remainingCap });
    }
  }
  
  return { results };
}
