const PROCESSING_FEE = 5; // G
const ITEM_BASE_PREMIUMS = {
  sword: 100, // G
  amulet: 60, // G
  staff: 80, // G
  potion: 40, // G
  rune: 25, // G
  moonstone: 25 // G
};

const COMPONENT_STANDARD_PREMIUM = 25; // G per component
const COMPONENT_BLOCK_PREMIUM = 60; // G for exactly 3 alike components

const BLOCK_SIZE = 3;

const calculateComponentPremium = (count: number): number => {
  // Business rule: Special block pricing applies only for exactly 3 of the same component type (60G)
  // For all other quantities (0, 1, 2, 4+), standard rate applies (25G per component)
  if (count === BLOCK_SIZE) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return count * COMPONENT_STANDARD_PREMIUM; // 25G per component
};

const countRuneAndMoonstoneComponents = (items: any[]): { rune: number; moonstone: number } => {
  return items.reduce((counts, item) => {
    if (item.type === "rune") counts.rune++;
    else if (item.type === "moonstone") counts.moonstone++;
    return counts;
  }, { rune: 0, moonstone: 0 });
};

export const calculateInsurancePremium = (input: any): any => {
  const results = [];
  
  for (const step of input.steps) {
    if (step.op === "quote") {
      let basePremium = 0;
      
      // Count rune and moonstone components for block pricing
      const componentCounts = countRuneAndMoonstoneComponents(step.items);
      
      // Calculate base premiums for non-component items (swords, amulets, etc.)
      // Apply risk surcharges for cursed items (50%) and highly enchanted items (30%)
      const nonComponentPremium = step.items
        .filter(item => !['rune', 'moonstone'].includes(item.type))
        .reduce((total, item) => {
          // Start with base premium for the item type
          let itemPremium = ITEM_BASE_PREMIUMS[item.type];
          
          // Calculate risk surcharges based on item properties
          const cursedSurcharge = item.cursed ? itemPremium * 0.5 : 0; // 50% surcharge for cursed items
          const highEnchantmentSurcharge = item.enchantment !== undefined && item.enchantment >= 5 
            ? itemPremium * 0.3 // 30% surcharge for items with enchantment level 5 or higher
            : 0;
          
          itemPremium += cursedSurcharge + highEnchantmentSurcharge;
          
          return total + itemPremium;
        }, 0);
      
      basePremium += nonComponentPremium;
      
      // Apply special block pricing for components: 60G for exactly 3 of the same type
      // Otherwise, standard rate of 25G per component applies
      basePremium += calculateComponentPremium(componentCounts.rune);
      basePremium += calculateComponentPremium(componentCounts.moonstone);
      
      // Apply policy-wide modifiers
      // Long-standing customers (≥ 2 years) receive 20% loyalty discount
      if (input.customer && input.customer.yearsWithMHPCO >= 2) {
        basePremium = basePremium * 0.8; // 20% loyalty discount
      }
      
      // Apply policy-wide modifiers
      // A first insurance carries a 10% initial assessment surcharge
      // Note: Each item in a quote is treated as a first insurance, regardless of customer history
      basePremium = basePremium * 1.1; // 10% initial assessment surcharge
      
      // Final premium includes 5G processing fee and is rounded up (in MHPCO's favor)
      const finalPremium = Math.ceil(basePremium + PROCESSING_FEE);
      results.push({ premium: finalPremium });
    }
  }
  
  return { results };
};
