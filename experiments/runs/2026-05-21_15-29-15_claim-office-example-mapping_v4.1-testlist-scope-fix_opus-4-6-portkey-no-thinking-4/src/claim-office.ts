const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = Object.fromEntries(
  Object.entries(BASE_PREMIUMS).map(([type, premium]) => [type, premium * 10])
);

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function processClaim(
  step: any,
  policyStep: any,
  policyCumulativePayouts: Record<number, number>
): any {
  let insuranceSum = 0;
  for (const item of policyStep.items) {
    insuranceSum += INSURANCE_VALUES[item.type] || 0;
  }
  const cap = 2 * insuranceSum;

  const insuredCounts: Record<string, number> = {};
  for (const item of policyStep.items) {
    insuredCounts[item.type] = (insuredCounts[item.type] || 0) + 1;
  }

  const damageCounts: Record<string, number> = {};
  for (const damage of step.incident.damages) {
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] || 0) + 1;
  }

  for (const type of Object.keys(damageCounts)) {
    if (damageCounts[type] > (insuredCounts[type] || 0)) {
      throw new Error(`More damages of type ${type} than insured`);
    }
  }

  for (const damage of step.incident.damages) {
    if (damage.amount < 0) {
      throw new Error("Negative damage amount");
    }
  }

  let totalPayout = 0;
  for (const damage of step.incident.damages) {
    const matchedItem = policyStep.items.find((i: any) => i.type === damage.itemType);
    let reimbursement = damage.amount;
    if (matchedItem && matchedItem.enchantment >= 8) {
      reimbursement = damage.amount * 0.5;
    }
    totalPayout += reimbursement - DEDUCTIBLE;
  }

  let payout = Math.floor(totalPayout);
  const previousPayouts = policyCumulativePayouts[step.policy] || 0;
  const remainingCap = cap - previousPayouts;
  if (payout > remainingCap) {
    payout = remainingCap;
  }
  policyCumulativePayouts[step.policy] = previousPayouts + payout;

  return { payout, remainingCap: cap - policyCumulativePayouts[step.policy] };
}

function processQuote(
  step: any,
  customer: any,
  isFollowUp: boolean
): any {
  const items = step.items;

  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    }
  }

  let totalPremium = 0;
  let policyBasePremium = 0;
  const blocksApplied = new Set<string>();

  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    const isBlock = COMPONENT_TYPES.has(item.type) && componentCounts[item.type] === BLOCK_SIZE;
    if (isBlock && !blocksApplied.has(item.type)) {
      totalPremium += BLOCK_PREMIUM;
      policyBasePremium += BASE_PREMIUMS[item.type] * BLOCK_SIZE;
      blocksApplied.add(item.type);
    } else if (!isBlock) {
      let itemPremium = BASE_PREMIUMS[item.type];
      policyBasePremium += BASE_PREMIUMS[item.type];
      if (item.cursed) {
        itemPremium += BASE_PREMIUMS[item.type] * 0.5;
      }
      if (item.enchantment >= 5) {
        itemPremium += BASE_PREMIUMS[item.type] * 0.3;
      }
      totalPremium += itemPremium;
    }
  }

  if (customer.yearsWithMHPCO >= 2) {
    totalPremium -= policyBasePremium * 0.2;
  }

  totalPremium += policyBasePremium * 0.1;

  if (isFollowUp) {
    totalPremium -= policyBasePremium * 0.15;
  }

  return { premium: Math.ceil(totalPremium + PROCESSING_FEE) };
}

export function claimOffice(request: any): any {
  const customer = request.customer;
  const results: any[] = [];
  const policyCumulativePayouts: Record<number, number> = {};

  for (let stepIndex = 0; stepIndex < request.steps.length; stepIndex++) {
    const step = request.steps[stepIndex];

    if (step.type === "claim") {
      const policyStep = request.steps[step.policy];
      results.push(processClaim(step, policyStep, policyCumulativePayouts));
    } else {
      results.push(processQuote(step, customer, stepIndex > 0));
    }
  }

  return results;
}
