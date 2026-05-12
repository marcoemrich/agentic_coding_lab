const MAIN_ITEMS: Record<string, { premium: number; insuranceValue: number }> = {
  sword: { premium: 100, insuranceValue: 1000 },
  amulet: { premium: 60, insuranceValue: 600 },
  staff: { premium: 80, insuranceValue: 800 },
  potion: { premium: 40, insuranceValue: 400 },
};

const COMPONENT_PREMIUM = 25;
const BUILDING_BLOCK_PREMIUM = 60;
const FIRST_INSURANCE_SURCHARGE = 0.10;
const LOYALTY_DISCOUNT = 0.20;
const REPEAT_CONTRACT_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;
const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 8;

function partitionItems(items: any[]): { mainItems: any[]; components: any[] } {
  const mainItems = items.filter((i: any) => i.type in MAIN_ITEMS);
  const components = items.filter((i: any) => !(i.type in MAIN_ITEMS));
  return { mainItems, components };
}

function calculateItemPremiums(items: any[]): number {
  const { mainItems, components } = partitionItems(items);

  const mainTotal = mainItems.reduce((sum: number, item: any) => {
    let itemPremium = MAIN_ITEMS[item.type].premium;
    if (item.cursed) itemPremium *= 1.5;
    if (item.enchantment >= 5) itemPremium *= 1.3;
    return sum + itemPremium;
  }, 0);

  const componentCounts: Record<string, number> = {};
  for (const c of components) {
    componentCounts[c.type] = (componentCounts[c.type] || 0) + 1;
  }

  let componentTotal = 0;
  for (const type in componentCounts) {
    const count = componentCounts[type];
    const blocks = Math.floor(count / 3);
    const remaining = count % 3;
    componentTotal += blocks * BUILDING_BLOCK_PREMIUM + remaining * COMPONENT_PREMIUM;
  }

  return mainTotal + componentTotal;
}

function calculateInsuranceSum(items: any[]): number {
  const { mainItems, components } = partitionItems(items);
  const mainSum = mainItems.reduce((sum: number, item: any) => sum + MAIN_ITEMS[item.type].insuranceValue, 0);
  const componentSum = components.length * COMPONENT_INSURANCE_VALUE;
  return mainSum + componentSum;
}

function processClaim(policy: { items: any[]; insuranceSum: number; totalPaid: number }, incident: any): { payout: number; remainingCap: number } {
  const totalCap = CAP_MULTIPLIER * policy.insuranceSum;
  const availableCap = totalCap - policy.totalPaid;
  const totalReimbursable = incident.damages.reduce((sum: number, d: any) => {
    const item = policy.items.find((i: any) => i.type === d.itemType);
    let reimbursable = d.amount;
    if (item && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD && item.material !== "dragon") {
      reimbursable *= ENCHANTMENT_REIMBURSEMENT_RATE;
    }
    return sum + reimbursable;
  }, 0);
  const uncappedPayout = Math.max(0, totalReimbursable - DEDUCTIBLE);
  const payout = Math.floor(Math.min(uncappedPayout, availableCap));
  policy.totalPaid += payout;
  const remainingCap = totalCap - policy.totalPaid;
  return { payout, remainingCap };
}

export function processScenario(scenario: any): unknown {
  const customer = scenario.customer;
  const results: any[] = [];
  let quoteCount = 0;
  const policies: { items: any[]; insuranceSum: number; totalPaid: number }[] = [];

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const totalBasePremium = calculateItemPremiums(step.items);
      let adjustedPremium: number;
      if (quoteCount === 0) {
        adjustedPremium = totalBasePremium * (1 + FIRST_INSURANCE_SURCHARGE);
      } else {
        adjustedPremium = totalBasePremium * (1 - REPEAT_CONTRACT_DISCOUNT);
      }
      if (customer.yearsWithMHPCO >= 2) {
        adjustedPremium *= (1 - LOYALTY_DISCOUNT);
      }
      const premium = Math.ceil(Number(adjustedPremium.toFixed(2))) + PROCESSING_FEE;
      results.push({ premium });
      policies.push({ items: step.items, insuranceSum: calculateInsuranceSum(step.items), totalPaid: 0 });
      quoteCount++;
    } else if (step.op === "claim") {
      results.push(processClaim(policies[step.policy], step.incident));
    }
  }

  return { results };
}
