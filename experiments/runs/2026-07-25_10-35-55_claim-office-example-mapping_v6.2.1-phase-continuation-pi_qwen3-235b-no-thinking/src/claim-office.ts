const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_PRICE = 25;
const COMPONENT_BLOCK_PRICE = 60;
const BLOCK_SIZE = 3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

// Base premium rules for main items
const premiumRules = [
  { itemType: "sword", premium: 100 },
  { itemType: "amulet", premium: 60 },
  { itemType: "staff", premium: 80 },
  { itemType: "potion", premium: 40 }
];

const calculateComponentPremium = (items) => {
  // Base premium for empty list
  if (items.length === 0) return 5;

  // Separate components from other items and count by type
  const componentCounts = { rune: 0, moonstone: 0 };
  const otherItems = items.filter(item => {
    if (COMPONENT_TYPES.includes(item.type)) {
      componentCounts[item.type]++;
      return false;
    }
    return true;
  });

  // Calculate component premium
  let componentPremium = 0;
  for (const [type, count] of Object.entries(componentCounts)) {
    if (count === BLOCK_SIZE) {
      componentPremium += COMPONENT_BLOCK_PRICE;
    } else {
      componentPremium += count * COMPONENT_PRICE;
    }
  }
  
  // Return component premium if any components were found
  return componentPremium > 0 ? componentPremium : 0;
};



export const calculatePremium = (customer, items): number => {
  // Calculate component premium
  const componentPremium = calculateComponentPremium(items);
  
  // If there are components, return component premium only
  if (componentPremium !== 0) {
    return componentPremium;
  }
  
  // Start with base premium
  let totalPremium = 0;

  // If no valid items, return minimum processing fee
  if (items.length === 0) {
    return 5;
  }

  // Calculate base premium and surcharges for each valid item
  for (const item of items) {
    const rule = premiumRules.find(r => r.itemType === item.type);
    if (!rule) {
      // Invalid item type, but we'll proceed with other valid items
      continue;
    }
    
    // Add base premium for this item
    totalPremium += rule.premium;
    
    // Apply cursed surcharge (50% of item's base premium)
    if (item.cursed) {
      totalPremium += Math.ceil(rule.premium * CURSED_SURCHARGE_RATE);
    }
    
    // Apply high enchantment surcharge (30% of item's base premium)
    if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
      totalPremium += Math.ceil(rule.premium * HIGH_ENCHANTMENT_SURCHARGE_RATE);
    }
  }
  
  // Apply policy-wide modifiers
  const LOYALTY_DISCOUNT_RATE = 0.2;
  const INITIAL_ASSESSMENT_SURCHARGE_RATE = 0.1;
  
  // Long-standing customers (≥ 2 years) receive 20% loyalty discount
  if (customer.yearsWithMHPCO >= 2) {
    totalPremium -= Math.floor(totalPremium * LOYALTY_DISCOUNT_RATE);
  }
  
  // Every first insurance carries a 10% initial assessment surcharge
  // This applies to new items regardless of customer history
  totalPremium += Math.ceil(totalPremium * INITIAL_ASSESSMENT_SURCHARGE_RATE);
  
  // Ensure minimum premium covers processing fee
  return Math.max(totalPremium, 5);
};

export const processClaim = () => {
  // Placeholder implementation
};
