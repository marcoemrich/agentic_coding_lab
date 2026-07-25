const PROCESSING_FEE_G = 5;

const KNOWN_ITEM_TYPES = new Set(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Step = { op: string; items?: Item[]; policy?: number; incident?: { damages: Array<{ itemType: string; amount: number }> } };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

const validateSteps = (steps: Step[]): void => {
  const policies: Array<Set<string>> = [];

  for (const step of steps) {
    if (step.op === "quote") {
      const items = step.items ?? [];
      const itemTypes = new Set<string>();
      for (const item of items) {
        if (!KNOWN_ITEM_TYPES.has(item.type)) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
        itemTypes.add(item.type);
      }
      policies.push(itemTypes);
    }
    if (step.op === "claim") {
      const policyIdx = step.policy!;
      const policyItems = policies[policyIdx];
      if (!policyItems) {
        throw new Error(`Invalid policy index: ${policyIdx}`);
      }
      if (step.incident) {
        for (const damage of step.incident.damages) {
          if (damage.amount < 0) {
            throw new Error(`Negative damage amount: ${damage.amount}`);
          }
          if (!policyItems.has(damage.itemType)) {
            throw new Error(`Item ${damage.itemType} not in policy`);
          }
        }
      }
    }
  }

};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const ITEMS_PER_BLOCK = 3;
const BLOCK_BASE_PREMIUM = 60;

const calculateQuotePremium = (items: Array<{ type: string; cursed?: boolean; enchantment?: number }>, customer: { yearsWithMHPCO: number }, quoteIndex: number): number => {
  // Count components by type for block pricing
  const typeCounts: Record<string, number> = {};
  const itemList: Array<{ type: string; cursed?: boolean; enchantment?: number }> = [];
  for (const item of items) {
    typeCounts[item.type] = (typeCounts[item.type] ?? 0) + 1;
    itemList.push(item);
  }
  
  let basePremium = 0;
  for (const [type, count] of Object.entries(typeCounts)) {
    basePremium += COMPONENT_TYPES.has(type) && count === ITEMS_PER_BLOCK
      ? BLOCK_BASE_PREMIUM
      : count * (BASE_PREMIUMS[type] ?? 0);
  }
  
  // Item-specific modifiers
  let itemSurcharge = 0;
  for (const item of itemList) {
    const itemBase = COMPONENT_TYPES.has(item.type) ? (BASE_PREMIUMS[item.type] ?? 0) : (BASE_PREMIUMS[item.type] ?? 0);
    // Actually, for block-priced components, the surcharge should apply to their base premium.
    // But the spec says modifiers apply to the "base premium of the affected item".
    // For simplicity in this minimal implementation: apply to individual base premium.
    if (item.cursed) {
      itemSurcharge += itemBase * 0.5;
    }
    if (item.enchantment && item.enchantment >= 5) {
      itemSurcharge += itemBase * 0.3;
    }
  }
  
  // Policy-wide modifiers
  let modifier = basePremium * 0.1; // first insurance always applies (10%)
  if (customer.yearsWithMHPCO >= 2) {
    modifier -= basePremium * 0.2; // loyalty discount 20%
  }
  // First insurance: spec says "A first insurance carries a 10 % initial assessment surcharge."
  // The clarifying question says: "each item in a quote is treated as a first insurance"
  // But also: "Is 'first insurance' the customer's first ever contract, or the first time we see this particular item?"
  // Answer: "each item in a quote is treated as a first insurance, regardless of customer history."
  // So first insurance always applies (10%). But that conflicts with "long-standing customer with follow-up contract" example.
  // Let me re-read: "The first insurance surcharge still applies to the new sword, even though the customer is on a follow-up contract"
  // So first insurance is always 10%. But then the loyalty discount also applies if ≥2 years.
  // And follow-up discount applies after the first quote (quoteIndex > 0).
  
  // Actually wait, the first insurance surcharge is mentioned as applying, but in the integration example
  // "0 years with MHPCO, no previous contract: cursed sword → 165 G"
  // breakdown: 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
  // No loyalty (0 years), no follow-up (first contract)
  //
  // "3 years with MHPCO; second quote: cursed sword (enchantment 7) → 160 G"
  // breakdown: 100 base + 50 curse + 30 high enchant - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee = 160
  //
  // So first insurance is ALWAYS applied (10% of base premium).
  // Loyalty discount applies if yearsWithMHPCO >= 2.
  // Follow-up discount applies if it's not the first quote.
  
  if (quoteIndex > 0) {
    modifier -= basePremium * 0.15; // follow-up contract 15% discount
  }
  
  const total = basePremium + itemSurcharge + modifier + PROCESSING_FEE_G;
  return Math.ceil(total); // Round up in MHPCO's favor
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;

const calculateClaimPayout = (
  damages: Array<{ itemType: string; amount: number }>,
  policyItems: Array<{ type: string; enchantment?: number; material?: string }>,
  insuranceSum: number,
  capRemaining: number
): { payout: number; newCapRemaining: number } => {
  // Build a map of item type -> items in policy (with enchantment and material)
  const policyItemMap: Record<string, Array<{ enchantment?: number; material?: string }>> = {};
  for (const item of policyItems) {
    if (!policyItemMap[item.type]) policyItemMap[item.type] = [];
    policyItemMap[item.type].push(item);
  }
  
  // Track consumption of items by type
  const consumed: Record<string, number> = {};
  
  let totalPayout = 0;
  for (const damage of damages) {
    consumed[damage.itemType] = (consumed[damage.itemType] ?? 0) + 1;
    const available = policyItemMap[damage.itemType] ?? [];
    if (consumed[damage.itemType] > available.length) {
      throw new Error(`More damage entries for ${damage.itemType} than insured items`);
    }
    
    const policyItem = available[consumed[damage.itemType] - 1];
    let reimbursementRatio = 1; // full reimbursement by default
    
    // Enchantment >= 8 gives 50% reimbursement, takes priority over dragon material
    if (policyItem.enchantment && policyItem.enchantment >= 8) {
      reimbursementRatio = 0.5;
    } else if (policyItem.material === "dragon") {
      reimbursementRatio = 1; // full reimbursement for dragon material
    }
    
    const reimbursedAmount = damage.amount * reimbursementRatio;
    const afterDeductible = Math.max(0, reimbursedAmount - DEDUCTIBLE);
    totalPayout += afterDeductible;
  }
  
  // Cap the payout to remaining cap
  const cappedPayout = Math.min(totalPayout, capRemaining);
  const finalPayout = Math.floor(cappedPayout); // Round down in MHPCO's favor
  const newCapRemaining = capRemaining - finalPayout;
  
  return { payout: finalPayout, newCapRemaining };
};

export const processScenario = (input: unknown): unknown => {
  const scenario = input as Scenario;
  validateSteps(scenario.steps);

  const policies: Array<{ items: Array<{ type: string; enchantment?: number; material?: string }>; insuranceSum: number; capRemaining: number }> = [];
  let quoteIndex = 0;
  
  const results: Array<{ premium?: number; payout?: number; remainingCap?: number }> = [];
  
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const items = step.items ?? [];
      const premium = calculateQuotePremium(items, scenario.customer, quoteIndex);
      quoteIndex++;
      
      let insuranceSum = 0;
      for (const item of items) {
        insuranceSum += INSURANCE_VALUES[item.type] ?? 0;
      }
      const cap = insuranceSum * 2;
      policies.push({ items: [...items], insuranceSum, capRemaining: cap });
      results.push({ premium });
    } else if (step.op === "claim") {
      const policyIdx = step.policy!;
      const policyData = policies[policyIdx];
      const { payout, newCapRemaining } = calculateClaimPayout(
        step.incident!.damages,
        policyData.items,
        policyData.insuranceSum,
        policyData.capRemaining
      );
      policyData.capRemaining = newCapRemaining;
      results.push({ payout, remainingCap: newCapRemaining });
    } else {
      results.push({});
    }
  }

  return { results };
};