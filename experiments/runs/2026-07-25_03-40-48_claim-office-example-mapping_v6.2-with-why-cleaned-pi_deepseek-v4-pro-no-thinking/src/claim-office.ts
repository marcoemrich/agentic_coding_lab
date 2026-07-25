const processingFee = 5;

const knownItemTypes = new Set<string>(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

const basePremiums: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const insuranceValues: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Array<{ itemType: string; amount: number }> };
}

type Step = QuoteStep | ClaimStep;

interface Policy {
  items: Array<{ type: string; enchantment?: number; material?: string; insurance: number }>;
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

const componentTypes = new Set(["rune", "moonstone"]);

export const processScenario = (input: unknown): { results: Array<{ premium?: number; payout?: number; remainingCap?: number }> } => {
  const scenario = input as { customer: { yearsWithMHPCO: number }; steps: Step[] };
  const customer = scenario.customer;
  const results: Array<{ premium?: number; payout?: number; remainingCap?: number }> = [];
  
  let quoteCount = 0;
  const policies: Policy[] = [];

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const items = step.items;
      
      // Validate items
      for (const item of items) {
        if (!knownItemTypes.has(item.type)) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }

      // Compute base premium
      const componentCounts: Record<string, number> = {};
      let totalBasePremium = 0;
      let itemModifiedTotal = 0;
      let insuranceSum = 0;
      const policyItems: Policy["items"] = [];

      for (const item of items) {
        if (componentTypes.has(item.type)) {
          componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
          insuranceSum += insuranceValues[item.type] || 0;
          policyItems.push({ type: item.type, insurance: insuranceValues[item.type] || 0 });
        } else {
          const basePerUnit = basePremiums[item.type] || 0;
          const insValue = insuranceValues[item.type] || 0;
          insuranceSum += insValue;
          totalBasePremium += basePerUnit;
          policyItems.push({ type: item.type, insurance: insValue, enchantment: item.enchantment, material: item.material });
          // Item-specific surcharges
          let itemMod = 0;
          if (item.cursed) itemMod += basePerUnit * 0.5;
          if (item.enchantment && item.enchantment >= 5) itemMod += basePerUnit * 0.3;
          itemModifiedTotal += basePerUnit + itemMod;
        }
      }

      let componentBaseTotal = 0;
      for (const [type, count] of Object.entries(componentCounts)) {
        const basePerUnit = basePremiums[type];
        if (count === 3) {
          componentBaseTotal += 60;
          totalBasePremium += 60;
        } else {
          componentBaseTotal += count * basePerUnit;
          totalBasePremium += count * basePerUnit;
        }
      }
      itemModifiedTotal += componentBaseTotal;

      // Policy-wide modifiers
      let policyMod = 0;
      if (customer.yearsWithMHPCO >= 2) policyMod -= totalBasePremium * 0.2;
      policyMod += totalBasePremium * 0.1; // first insurance
      if (quoteCount > 0) policyMod -= totalBasePremium * 0.15; // follow-up contract

      const subtotal = itemModifiedTotal + policyMod;
      const premium = Math.ceil(subtotal + processingFee);
      results.push({ premium });

      policies.push({
        items: policyItems,
        insuranceSum,
        cap: insuranceSum * 2,
        remainingCap: insuranceSum * 2,
      });
      quoteCount++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      const damages = step.incident.damages;

      // Validate: damages must not exceed insured count per type
      const damageCounts: Record<string, number> = {};
      for (const d of damages) {
        damageCounts[d.itemType] = (damageCounts[d.itemType] || 0) + 1;
      }
      for (const [itemType, count] of Object.entries(damageCounts)) {
        const insuredCount = policy.items.filter((p) => p.type === itemType).length;
        if (count > insuredCount) {
          throw new Error(`More damage entries for "${itemType}" than insured`);
        }
      }

      let totalPayout = 0;

      for (const damage of damages) {
        // Validate: item type must be in policy
        const policyItem = policy.items.find((p) => p.type === damage.itemType);
        if (!policyItem) {
          throw new Error(`Unknown item type: ${damage.itemType}`);
        }
        if (damage.amount < 0) {
          throw new Error(`Negative prestige amount`);
        }
        
        // Default: full reimbursement, then apply clauses
        let reimbursable = damage.amount;
        
        // Enchantment >= 8: only reimburse 50%
        if (policyItem.enchantment !== undefined && policyItem.enchantment >= 8) {
          reimbursable = reimbursable * 0.5;
        }
        
        const payout = Math.floor(reimbursable - 100);
        totalPayout += Math.max(0, payout);
      }

      totalPayout = Math.min(totalPayout, policy.remainingCap);
      policy.remainingCap -= totalPayout;

      results.push({ payout: totalPayout, remainingCap: policy.remainingCap });
    }
  }

  return { results };
};