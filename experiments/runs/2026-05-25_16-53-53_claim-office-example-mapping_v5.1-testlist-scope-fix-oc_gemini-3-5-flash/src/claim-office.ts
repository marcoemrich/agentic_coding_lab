export function runScenario(scenario: any): any {
  const basePremiums: Record<string, number> = {
    sword: 100,
    amulet: 60,
    staff: 80,
    potion: 40,
    rune: 25,
    moonstone: 25,
  };

  const insuranceSums: Record<string, number> = {
    sword: 1000,
    amulet: 600,
    staff: 800,
    potion: 400,
    rune: 250,
    moonstone: 250,
  };

  let quoteCount = 0;
  
  // Track quotes to retrieve their policies for later claim steps
  const policies: any[] = [];
  
  // Track remaining caps for each policy index
  const policyRemainingCaps: Record<number, number> = {};

  const results = scenario.steps.map((step: any, index: number) => {
    if (step.op === "quote") {
      policies.push(step);
      
      for (const item of step.items) {
        if (!basePremiums[item.type] && item.type !== "rune" && item.type !== "moonstone") {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }
      
      if (step.items.length === 0) {
        quoteCount++;
        return { premium: 5 };
      }
      
      const counts: Record<string, number> = {};
      const nonComponents: any[] = [];
      
      for (const item of step.items) {
        if (item.type === "rune" || item.type === "moonstone") {
          counts[item.type] = (counts[item.type] || 0) + 1;
        } else {
          nonComponents.push(item);
        }
      }

      let policyBasePremium = 0;

      // Calculate component base premium
      for (const [type, count] of Object.entries(counts)) {
        if (count === 3) {
          policyBasePremium += 60; // 3-alike block
        } else {
          policyBasePremium += count * 25;
        }
      }

      // Calculate non-component base premium
      for (const item of nonComponents) {
        policyBasePremium += basePremiums[item.type] || 0;
      }

      // Calculate item-specific modifiers on base premiums of affected items
      let totalItemModifiers = 0;
      for (const item of step.items) {
        const itemBase = basePremiums[item.type] || 25; // runes/moonstones are 25
        let itemSurcharges = 0;
        if (item.cursed) {
          itemSurcharges += itemBase * 0.50;
        }
        if (item.enchantment >= 5) {
          itemSurcharges += itemBase * 0.30;
        }
        totalItemModifiers += itemSurcharges;
      }

      // Calculate first insurance: 10% assessment surcharge on each item's unmodified base premium
      // For components that group into a block, each individual component item's base is 25 G.
      // Wait, let's look at 3 runes -> base premium 60 G. Unmodified base premium is 3 * 25 = 75 G if no block applies, but with block it's 60 G.
      // If we calculate 10% of 60 G, first insurance is 6 G.
      // If we calculate 10% of 3 individual runes (3 * 2.5 = 7.5 G), first insurance is 7.5 G.
      // In the spec under "3 alike components: 3 runes should result in 71 G (60 base + 6 first insurance + 5 fee)":
      // "60 base + 6 first insurance + 5 fee" = 71 G.
      // So first insurance surcharge is 10% of the POLICY base premium (60 G)!
      // Therefore, first insurance surcharge is simply policyBasePremium * 0.10.
      let firstInsuranceSurcharge = policyBasePremium * 0.10;

      // Calculate policy-wide modifiers
      let totalPolicyModifiers = firstInsuranceSurcharge;

      // Loyalty discount: customer with >= 2 years receives 20% loyalty discount on the policy base premium
      if (scenario.customer.yearsWithMHPCO >= 2) {
        totalPolicyModifiers -= policyBasePremium * 0.20;
      }

      // Follow-up contract discount: 15% discount on each contract after their first quote step
      // This discount is on the policy base premium as well.
      if (quoteCount > 0) {
        totalPolicyModifiers -= policyBasePremium * 0.15;
      }

      quoteCount++;

      const rawTotal = policyBasePremium + totalItemModifiers + totalPolicyModifiers + 5;
      return { premium: Math.ceil(rawTotal) };
    }

    if (step.op === "claim") {
      // Create policy tracking on the fly or load existing policy details
      const policyStep = policies[step.policy];
      const policyItems = policyStep ? policyStep.items : [];
      
      // Validate damages do not refer to items not covered by the policy,
      // and that we don't have more entries of a type than covered,
      // and that no damage has negative amount
      const policyCounts: Record<string, number> = {};
      for (const item of policyItems) {
        policyCounts[item.type] = (policyCounts[item.type] || 0) + 1;
      }

      const damageCounts: Record<string, number> = {};
      for (const damage of step.incident.damages) {
        if (damage.amount < 0) {
          throw new Error("Damage amount cannot be negative");
        }
        if (!policyCounts[damage.itemType]) {
          throw new Error(`Item type ${damage.itemType} is not covered by the policy`);
        }
        damageCounts[damage.itemType] = (damageCounts[damage.itemType] || 0) + 1;
      }

      for (const [type, count] of Object.entries(damageCounts)) {
        if (count > (policyCounts[type] || 0)) {
          throw new Error(`Claim contains more entries for item type ${type} than covered by the policy`);
        }
      }

      // Calculate total insurance sum of items in the policy
      let insuranceSum = 0;
      for (const item of policyItems) {
        insuranceSum += insuranceSums[item.type] || 250;
      }

      // Total payout per policy is capped at twice the insurance sum
      let cap = insuranceSum * 2;
      
      // Retrieve or initialize the remaining cap for this policy
      let currentCap = policyRemainingCaps[step.policy] !== undefined ? policyRemainingCaps[step.policy] : cap;

      let totalPayout = 0;

      for (const damage of step.incident.damages) {
        const matchingItem = policyItems.find((item: any) => item.type === damage.itemType);
        
        let payoutForDamage = damage.amount;

        // Damage to items with enchantment level >= 8 is reimbursed at 50%
        if (matchingItem && matchingItem.enchantment >= 8) {
          payoutForDamage = damage.amount * 0.50;
        }

        // Apply 100 G deductible per damage event (applied once per damaged item/entry)
        payoutForDamage = Math.max(0, payoutForDamage - 100);

        totalPayout += Math.floor(payoutForDamage); // Round down in MHPCO's favor (350.5 -> 350)
      }

      totalPayout = Math.min(totalPayout, currentCap);
      const remainingCap = currentCap - totalPayout;
      
      policyRemainingCaps[step.policy] = remainingCap;

      return {
        payout: totalPayout,
        remainingCap
      };
    }

    return {};
  });
  return { results };
}
