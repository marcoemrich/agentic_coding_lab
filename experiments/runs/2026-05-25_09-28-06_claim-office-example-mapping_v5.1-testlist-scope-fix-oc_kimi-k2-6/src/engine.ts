export type ItemType = "sword" | "amulet" | "staff" | "potion" | "rune" | "moonstone";

export interface Item {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface StepQuote {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface StepClaim {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
}

export type Step = StepQuote | StepClaim;

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

const ITEM_VALUES: Record<string, { value: number; basePremium: number }> = {
  sword: { value: 1000, basePremium: 100 },
  amulet: { value: 600, basePremium: 60 },
  staff: { value: 800, basePremium: 80 },
  potion: { value: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;

export function processScenario(scenario: Scenario): unknown[] {
  const results: unknown[] = [];
  const policies: Policy[] = [];

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const result = processQuote(step, scenario.customer, policies.length, results);
      results.push(result);
      policies.push({
        items: step.items,
        insuranceSum: calculateInsuranceSum(step.items),
        cap: calculateInsuranceSum(step.items) * 2,
        remainingCap: calculateInsuranceSum(step.items) * 2,
      });
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      if (!policy) {
        throw new Error(`Policy ${step.policy} not found`);
      }
      const result = processClaim(step, policy);
      results.push(result);
      policy.remainingCap = result.remainingCap;
    }
  }

  return results;
}

function calculateInsuranceSum(items: Item[]): number {
  let sum = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      sum += COMPONENT_VALUE;
    } else if (ITEM_VALUES[item.type]) {
      sum += ITEM_VALUES[item.type].value;
    } else {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  return sum;
}

function processQuote(step: StepQuote, customer: Customer, quoteIndex: number, previousResults: unknown[]): { premium: number } {
  const isFirstInsurance = quoteIndex === 0;
  const isFollowUpContract = previousResults.length > 0;

  let policyBasePremium = 0;
  let itemSurcharges = 0;

  // Group components by type
  const componentGroups: Record<string, Item[]> = {};
  const nonComponents: Item[] = [];

  for (const item of step.items) {
    if (COMPONENT_TYPES.has(item.type)) {
      if (!componentGroups[item.type]) {
        componentGroups[item.type] = [];
      }
      componentGroups[item.type].push(item);
    } else {
      nonComponents.push(item);
    }
  }

  // Non-component items
  for (const item of nonComponents) {
    const baseInfo = ITEM_VALUES[item.type];
    if (!baseInfo) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    policyBasePremium += baseInfo.basePremium;

    if (item.cursed) {
      itemSurcharges += baseInfo.basePremium * 0.5;
    }
    if (item.enchantment !== undefined && item.enchantment >= 5) {
      itemSurcharges += baseInfo.basePremium * 0.3;
    }
  }

  // Component items - blocks apply only when exactly 3 of same type
  for (const type of Object.keys(componentGroups)) {
    const group = componentGroups[type];
    if (group.length === 3) {
      policyBasePremium += COMPONENT_BLOCK_PREMIUM;
    } else {
      policyBasePremium += group.length * COMPONENT_BASE_PREMIUM;
    }
  }

  let premium = policyBasePremium + itemSurcharges;

  // Policy-wide modifiers
  let policyModifierRate = 0;

  // First insurance: +10% on policy base premium
  policyModifierRate += 0.1;

  // Loyalty discount: -20% if customer >= 2 years
  if (customer.yearsWithMHPCO >= 2) {
    policyModifierRate -= 0.2;
  }

  // Follow-up contract: -15%
  if (isFollowUpContract) {
    policyModifierRate -= 0.15;
  }

  premium += policyBasePremium * policyModifierRate;

  // Processing fee
  premium += PROCESSING_FEE;

  // Round to whole G in MHPCO's favor (round up)
  premium = Math.ceil(premium);

  return { premium };
}

function processClaim(step: StepClaim, policy: Policy): { payout: number; remainingCap: number } {
  const { damages } = step.incident;

  // Count items in policy by type
  const policyItemCounts: Record<string, number> = {};
  for (const item of policy.items) {
    policyItemCounts[item.type] = (policyItemCounts[item.type] || 0) + 1;
  }

  // Count damages by type
  const damageCounts: Record<string, number> = {};
  for (const damage of damages) {
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] || 0) + 1;
  }

  // Validate damage counts
  for (const type of Object.keys(damageCounts)) {
    const policyCount = policyItemCounts[type] || 0;
    if (policyCount === 0 || damageCounts[type] > policyCount) {
      throw new Error(`Damage for item ${type} exceeds policy coverage`);
    }
    if (!ITEM_VALUES[type] && !COMPONENT_TYPES.has(type)) {
      throw new Error(`Unknown item type: ${type}`);
    }
  }

  let totalPayout = 0;

  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error("Damage amount cannot be negative");
    }

    let payout = damage.amount;

    // Find item in policy
    const matchingItems = policy.items.filter(i => i.type === damage.itemType);
    // Use the first matching item for material/enchantment properties
    const item = matchingItems[0];

    // Apply special reimbursement rules
    let enchantmentHigh = false;
    let dragonMaterial = false;

    if (item && item.enchantment !== undefined && item.enchantment >= 8) {
      enchantmentHigh = true;
    }
    if (item && item.material === "dragon") {
      dragonMaterial = true;
    }

    if (enchantmentHigh) {
      payout *= 0.5;
    } else if (dragonMaterial) {
      // Full reimbursement - no reduction
    }

    // Deductible per damage event
    payout -= DEDUCTIBLE;

    if (payout < 0) {
      payout = 0;
    }

    totalPayout += payout;
  }

  // Cap the payout
  if (totalPayout > policy.remainingCap) {
    totalPayout = policy.remainingCap;
  }

  // Round payout down (MHPCO's favor on payout)
  totalPayout = Math.floor(totalPayout);

  const newRemainingCap = policy.remainingCap - totalPayout;

  return { payout: totalPayout, remainingCap: newRemainingCap };
}
