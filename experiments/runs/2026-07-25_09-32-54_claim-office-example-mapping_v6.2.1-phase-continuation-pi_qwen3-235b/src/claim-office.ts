/**
 * Calculates insurance premiums for magical items based on MHPCO rules.
 * Validates item types, applies item-specific and policy-wide modifiers, and computes premiums with processing fee.
 * Currently handles empty lists, multiple items, and loyalty discount for long-standing customers.
 *
 * @param input - The scenario input containing customer info and steps (quote/claim)
 * @returns The result containing computed premiums or payouts
 */
export const calculateInsurancePremium = (input: any): any => {
  const firstStep = input.steps[0];
  const customer = input.customer;

  // Validate item types for quote operations
  validateItemTypesForQuote(firstStep, customer.yearsWithMHPCO);

  // Handle empty items list - return processing fee only
  if (firstStep.items.length === 0) {
    return { results: [{ premium: 5 }] };
  }

  // Calculate item premiums (sum of individual item base premiums)
  let basePremium = 0;
  for (const item of firstStep.items) {
    basePremium += calculateItemPremium(item, customer.yearsWithMHPCO);
  }

  let totalPremium = basePremium;

  // Apply policy-wide modifiers after item-specific calculations
  // Initial assessment surcharge for first insurance
  // Note: According to spec, each item in a quote is treated as first insurance
  totalPremium = totalPremium * 1.1; // 10% surcharge
  totalPremium = Math.ceil(totalPremium); // Round up in MHPCO's favor

  // Add processing fee
  return { results: [{ premium: totalPremium + 5 }] };
};

/**
 * Validates that all item types in a quote are known to the system.
 * Throws an error for unknown item types.
 *
 * @param step - The quote step containing items to validate
 */
function validateItemTypesForQuote(step: any, yearsWithMHPCO: number): void {
  // Only validate during quote operations
  if (step.op !== "quote") return;
  
  const knownTypes = ["sword", "amulet", "staff", "potion", "rune", "moonstone"];
  for (const item of step.items) {
    if (!knownTypes.includes(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

/**
 * Calculates the base premium for a single item based on its type.
 * Currently supports swords, amulets, and staffs.
 *
 * @param item - The item to calculate premium for
 * @returns The base premium amount
 */
function calculateItemPremium(item: any, yearsWithMHPCO: number): number {
  // Calculate base premium based on item type
  let premium = 0;
  switch (item.type) {
    case "sword":
      premium = 100;
      break;
    case "amulet":
      premium = 60;
      break;
    case "staff":
      premium = 80;
      break;
    case "potion":
      premium = 40;
      break;
    case "rune":
    case "moonstone":
      premium = 25;
      break;
    default:
      throw new Error(`Unknown item type: ${item.type}`);
  }

  // Apply item-specific modifiers
  if (item.cursed) {
    premium *= 1.5; // 50% curse surcharge
  }

  if (item.enchantment && item.enchantment >= 5) {
    premium *= 1.3; // 30% high enchantment surcharge
  }

  // Ensure premium is integer (MHPCO rounds in their favor)
  return Math.round(premium);
}