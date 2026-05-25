export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25
};

function calculateComponentsBasePremium(componentCounts: Record<string, number>): number {
  let premium = 0;
  for (const count of Object.values(componentCounts)) {
    if (count === 3) {
      premium += 60;
    } else {
      premium += count * 25;
    }
  }
  return premium;
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250
};

export function processScenario(scenario: Scenario): ScenarioResult {
  let quoteStepsProcessed = 0;
  
  // Track policy state: remaining cap
  const policies: { initialCap: number; remainingCap: number; items: Item[] }[] = [];
  
  return {
    results: scenario.steps.map((step, stepIndex) => {
      if (step.op === "quote") {
        let basePremiumTotal = 0;
        const componentCounts: Record<string, number> = {};
        let modifierSurchargesTotal = 0;
        
        for (const item of step.items) {
          if (!(item.type in BASE_PREMIUMS)) {
            throw new Error(`Unknown item type in quote: ${item.type}`);
          }
          if (item.type === "rune" || item.type === "moonstone") {
            componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
          } else {
            const itemBase = BASE_PREMIUMS[item.type] ?? 0;
            basePremiumTotal += itemBase;
            if (item.cursed) {
              modifierSurchargesTotal += itemBase * 0.5;
            }
            if (item.enchantment !== undefined && item.enchantment >= 5) {
              modifierSurchargesTotal += itemBase * 0.3;
            }
          }
        }

        basePremiumTotal += calculateComponentsBasePremium(componentCounts);

        for (const item of step.items) {
          if (item.type === "rune" || item.type === "moonstone") {
            if (item.cursed) {
              modifierSurchargesTotal += 25 * 0.5;
            }
            if (item.enchantment !== undefined && item.enchantment >= 5) {
              modifierSurchargesTotal += 25 * 0.3;
            }
          }
        }

        // Policy-wide modifiers
        let policyModifierPercent = 0;
        if (scenario.customer.yearsWithMHPCO >= 2) {
          policyModifierPercent -= 0.2;
        }

        policyModifierPercent += 0.1;

        if (quoteStepsProcessed > 0) {
          policyModifierPercent -= 0.15;
        }

        const policyModifiersTotal = basePremiumTotal * policyModifierPercent;
        const totalPremium = basePremiumTotal + modifierSurchargesTotal + policyModifiersTotal + 5;
        quoteStepsProcessed++;

        // Calculate insurance sum and cap
        let insuranceSum = 0;
        for (const item of step.items) {
          insuranceSum += INSURANCE_VALUES[item.type] ?? 0;
        }
        const cap = insuranceSum * 2;
        policies[stepIndex] = {
          initialCap: cap,
          remainingCap: cap,
          items: step.items
        };

        return { premium: Math.ceil(totalPremium) };
      } else {
        // Claim step
        const policyIndex = step.policy;
        if (policyIndex < 0 || policyIndex >= policies.length || !policies[policyIndex]) {
          throw new Error(`Referenced policy index ${policyIndex} does not exist`);
        }
        const policy = policies[policyIndex];
        
        let payoutTotal = 0;
        
        // Count how many items of each type are covered by the policy
        const policyCounts: Record<string, number> = {};
        for (const item of policy.items) {
          policyCounts[item.type] = (policyCounts[item.type] ?? 0) + 1;
        }

        // Count how many items of each type are being claimed as damaged
        const claimCounts: Record<string, number> = {};
        for (const damage of step.incident.damages) {
          claimCounts[damage.itemType] = (claimCounts[damage.itemType] ?? 0) + 1;
        }

        // Validate that claim counts don't exceed policy counts
        for (const [itemType, count] of Object.entries(claimCounts)) {
          const coveredCount = policyCounts[itemType] ?? 0;
          if (coveredCount < count) {
            throw new Error(`Claim contains more damages for itemType ${itemType} (${count}) than policy covers (${coveredCount})`);
          }
        }
        
        // Group step.incident.damages by item type, then sort policy items of that type
        // so that item-specific rules (enchantment >= 8, dragon material) are matched correctly
        // to specific items on the policy in a deterministic way.
        // Let's copy the policy items so we can consume them as we match damages.
        const availableItems = [...policy.items];

        for (const damage of step.incident.damages) {
          if (damage.amount < 0) {
            throw new Error(`Negative damage amount: ${damage.amount}`);
          }

          // Find the best/first matching item of damage.itemType from availableItems
          const itemIdx = availableItems.findIndex(item => item.type === damage.itemType);
          if (itemIdx === -1) {
            throw new Error(`Item type ${damage.itemType} is not covered by the policy`);
          }
          const matchedItem = availableItems[itemIdx];
          // Remove from availableItems so it's not reused for another damage
          availableItems.splice(itemIdx, 1);
          
          let rate = 1.0;
          if (matchedItem) {
            if (matchedItem.material === "dragon") {
              rate = 1.0;
            }
            if (matchedItem.enchantment !== undefined && matchedItem.enchantment >= 8) {
              rate = 0.5;
            }
          }
          
          let damageReimbursement = damage.amount * rate;
          // Apply deductible per damage event / per item:
          // "The 100 G deductible applies once per damaged item"
          damageReimbursement -= 100;
          if (damageReimbursement < 0) damageReimbursement = 0;
          
          payoutTotal += damageReimbursement;
        }
        
        // Payout capped at remaining cap
        const payout = Math.floor(Math.min(payoutTotal, policy.remainingCap));
        policy.remainingCap -= payout;
        
        return {
          payout,
          remainingCap: policy.remainingCap
        };
      }
    })
  };
}
