const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const PREMIUM_TO_INSURANCE = 10;
const VALID_COMPONENTS = new Set(["rune", "moonstone"]);

const DEDUCTIBLE = 100;

const PROCESSING_FEE = 5;
const COMPONENT_PREMIUM = 25;
const BLOCK_PREMIUM = 60;
const BLOCK_SIZE = 3;

function processQuote(step: any, customer: any, stepIndex: number) {
  const componentCounts: Record<string, number> = {};
  let policyBasePremium = 0;
  let itemSurcharges = 0;
  let insuranceSum = 0;

  for (const item of step.items) {
    if (item.type in BASE_PREMIUMS) {
      const itemBase = BASE_PREMIUMS[item.type];
      policyBasePremium += itemBase;
      insuranceSum += itemBase * PREMIUM_TO_INSURANCE;
      if (item.cursed) {
        itemSurcharges += itemBase * 0.5;
      }
      if (item.enchantment >= 5) {
        itemSurcharges += itemBase * 0.3;
      }
    } else if (VALID_COMPONENTS.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
      insuranceSum += COMPONENT_PREMIUM * PREMIUM_TO_INSURANCE;
    } else {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  for (const count of Object.values(componentCounts)) {
    policyBasePremium += count === BLOCK_SIZE ? BLOCK_PREMIUM : COMPONENT_PREMIUM * count;
  }

  let policyModifiers = policyBasePremium * 0.1;
  if (customer.yearsWithMHPCO >= 2) {
    policyModifiers -= policyBasePremium * 0.2;
  }
  if (stepIndex > 0) {
    policyModifiers -= policyBasePremium * 0.15;
  }

  const premium = Math.ceil(policyBasePremium + itemSurcharges + policyModifiers + PROCESSING_FEE);
  return { premium, policy: { items: step.items, insuranceSum, remainingCap: insuranceSum * 2 } };
}

function processClaim(step: any, policy: any) {
  let totalPayout = 0;

  const itemCounts: Record<string, number> = {};
  for (const item of policy.items) {
    itemCounts[item.type] = (itemCounts[item.type] || 0) + 1;
  }

  for (const damage of step.incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount for ${damage.itemType}: ${damage.amount}`);
    }
    if (!itemCounts[damage.itemType]) {
      throw new Error(`Item type ${damage.itemType} not in policy`);
    }
    itemCounts[damage.itemType]--;
    const insuredItem = policy.items.find((i: any) => i.type === damage.itemType);
    const reimbursement = insuredItem.enchantment >= 8
      ? damage.amount * 0.5
      : damage.amount;
    totalPayout += reimbursement - DEDUCTIBLE;
  }

  totalPayout = Math.floor(Math.min(totalPayout, policy.remainingCap));
  policy.remainingCap -= totalPayout;
  return { payout: totalPayout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: any): unknown {
  const policies: any[] = [];
  const results = scenario.steps.map((step: any, stepIndex: number) => {
    if (step.op === "quote") {
      const { premium, policy } = processQuote(step, scenario.customer, stepIndex);
      policies[stepIndex] = policy;
      return { premium };
    } else {
      return processClaim(step, policies[step.policy]);
    }
  });
  return { results };
}
