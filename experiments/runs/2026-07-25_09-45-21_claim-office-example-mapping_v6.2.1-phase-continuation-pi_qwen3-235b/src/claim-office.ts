const ITEM_BASE_PREMIUMS: { [key: string]: number } = {
  "sword": 100,
  "amulet": 60,
  "staff": 80,
  "potion": 40,
  "rune": 25,
  "moonstone": 25
};

// Risk adjustment rates (as proportions)
const CURSED_SURCHARGE_RATE = 0.5; // 50% surcharge for cursed items
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3; // 30% surcharge for high enchantment (≥ 5)
const LOYALTY_DISCOUNT_RATE = 0.2; // 20% discount for loyal customers (≥ 2 years)
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1; // 10% surcharge for first insurance
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15; // 15% discount for follow-up contracts

// Component and fee constants
const COMPONENT_BASE_PREMIUM = 25; // Base premium per component
const PROCESSING_FEE = 5; // Fixed processing fee in gold
const QUOTE_OPERATION = "quote";

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
  // Components can be grouped in blocks of 3 alike components
  // for a special base premium of 60 G
}

interface Step {
  op: string;
  items: Item[];
}

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

function groupItemsByType(items: Item[]): { [type: string]: Item[] } {
  return items.reduce((groups, item) => {
    const type = item.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(item);
    return groups;
  }, {} as { [type: string]: Item[] });
}

function calculateComponentsPremium(componentCount: number): number {
  // Three identical components form a building block with special base premium of 60 G
  if (componentCount === 3) {
    return 60;
  }
  // Otherwise, charge 25 G per component
  return componentCount * COMPONENT_BASE_PREMIUM;
}

function calculateItemPremium(item: Item): number {
  // Validate item type and get base premium
  const basePremium = ITEM_BASE_PREMIUMS[item.type];
  if (basePremium === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }

  let itemPremium = basePremium;

  // Apply cursed surcharge (50%) based on base premium
  if (item.cursed) {
    itemPremium += basePremium * CURSED_SURCHARGE_RATE;
  }

  // Apply high enchantment surcharge (30%) for items with enchantment level 5 or higher
  if (item.enchantment !== undefined && item.enchantment >= 5) {
    itemPremium += basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }

  return itemPremium;
}

interface PolicyState {
  initialCap: number;
  remainingCap: number;
}

// Store policy states to track cap exhaustion across claims
const policyStates = new Map<number, PolicyState>();

// Constants for claim adjustments
const DEDUCTIBLE_PER_DAMAGE_EVENT = 100; // 100 G deductible per damage event
const HIGH_ENCHANTMENT_THRESHOLD = 8; // Enchantment level ≥ 8 triggers 50% reimbursement
const DRAGON_MATERIAL = "dragon"; // Material that triggers full reimbursement

export const calculateQuote = (scenario: Scenario): { results: { premium: number }[] } => {
  // Initialize results array to store premiums for each quote operation
  // and contractNumber to track contract sequence for follow-up discounts
  const results = [];
  let contractNumber = 0;
  
  // Process each step in the scenario
  for (let i = 0; i < scenario.steps.length; i++) {
  
    const step = scenario.steps[i];
    // Only process quote operations
    if (step.op === QUOTE_OPERATION) {
      // Process quote operation to calculate premium
      const itemGroups = groupItemsByType(step.items);
      
      let basePremium = 0;
      
          // Calculate base premium by processing each item group
      for (const [type, items] of Object.entries(itemGroups)) {
        if (type === "rune" || type === "moonstone") {
          // Component items: apply special pricing for blocks of 3 identical components
          basePremium += calculateComponentsPremium(items.length);
        } else {
          // Non-component items: calculate premium for each item and sum
          basePremium += items.reduce((sum, item) => sum + calculateItemPremium(item), 0);
        }
      }
      
      // Apply policy-level adjustments in sequence
      
          // Start with the base premium which already includes item-specific modifiers and component pricing
      let policyAdjustedPremium = basePremium;
      
      // Apply policy-wide modifiers in sequence
      
      // 1. Apply 20% loyalty discount for customers with 2+ years of service
      if (scenario.customer.yearsWithMHPCO >= 2) {
        policyAdjustedPremium = policyAdjustedPremium - basePremium * LOYALTY_DISCOUNT_RATE;
      }
      
      // 2. Apply contract sequence adjustment
      if (contractNumber === 0) {
        // First contract: 10% surcharge on base premium
        policyAdjustedPremium = policyAdjustedPremium + basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
      } else {
        // Follow-up contract: 15% discount on base premium
        policyAdjustedPremium = policyAdjustedPremium - basePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
      }
      
      // Apply policy-wide modifiers, item-specific modifiers and processing fee
      // Add 5 G processing fee and round up final premium in MHPCO's favor
      const premium = Math.ceil(policyAdjustedPremium + PROCESSING_FEE);
      results.push({ premium });
      
      // Calculate total insurance sum based on base premiums of all items in policy
      const totalInsuranceSum = step.items.reduce((sum, item) => {
        const itemBasePremium = ITEM_BASE_PREMIUMS[item.type];
        if (itemBasePremium === undefined) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
        return sum + itemBasePremium;
      }, 0);
      
         // Set policy cap to twice the total insurance sum
      const policyCap = totalInsuranceSum * 2;
      
      // Store policy state using the step index i
      policyStates.set(i, {
        initialCap: policyCap,
        remainingCap: policyCap
      });
      
      contractNumber++;
    }
  }
  
  return { results };
};

interface Incident {
  cause: string;
  damages: Array<{
    itemType: string;
    amount: number;
  }>;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export const processClaim = (scenario: Scenario, policyIndex: number, incident: Incident): ClaimResult => {
  // Ensure policy index is valid
  if (policyIndex < 0 || policyIndex >= scenario.steps.length) {
    throw new Error("Policy index out of bounds");
  }
  
  // Get the policy step for this claim
  const policyStep = scenario.steps[policyIndex];
  if (!policyStep || policyStep.op !== "quote") {
    throw new Error("Policy not found or not a quote operation");
  }
  
  // Get current policy state
  const policyState = policyStates.get(policyIndex);
  
  if (!policyState) {
    throw new Error(`Policy state not initialized for index ${policyIndex}`);
  }
  
  // Calculate payout for each damage in the incident
  const payout = incident.damages
    .map(damage => {
      // Find the item in policy that corresponds to this damage claim
      const coveredItem = policyStep.items.find(item => item.type === damage.itemType);
      if (!coveredItem) {
        throw new Error(`Item type ${damage.itemType} not covered by policy`);
      }
      
      // Calculate base payout for this damage amount
      let claimPayout = damage.amount;
      
              // Apply 50% reimbursement rule for highly-enchanted items (level 8+) made of non-dragon material
      if (coveredItem.enchantment !== undefined && 
          coveredItem.enchantment >= HIGH_ENCHANTMENT_THRESHOLD && 
          coveredItem.material !== DRAGON_MATERIAL) {
        claimPayout *= 0.5;
      }
      
                  // Apply 100 G deductible per damage event
      // and ensure non-negative payout
      claimPayout = Math.max(0, claimPayout - DEDUCTIBLE_PER_DAMAGE_EVENT);

      return claimPayout;
    })
    .reduce((sum, payout) => sum + payout, 0);
  
  // Ensure payout does not exceed remaining policy coverage
  const coveredPayout = Math.min(payout, policyState.remainingCap);
  
  // Round down the final payout in MHPCO's favor
  const finalPayout = Math.floor(coveredPayout);
  
  // Update policy's remaining coverage by deducting the actual payout
  policyState.remainingCap -= finalPayout;

  return {
    payout: finalPayout,
    remainingCap: policyState.remainingCap
  };
};
