interface Item {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

interface ScenarioResult {
  results: (QuoteResult | ClaimResult)[];
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const ITEM_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_VALUE = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;
const DRAGON_MATERIAL = "dragon";

const COMPONENT_BASE_PREMIUM = 25;
const BUILDING_BLOCK_PREMIUM = 60;
const BUILDING_BLOCK_SIZE = 3;
const CURSED_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const SUBSEQUENT_CONTRACT_DISCOUNT_PERCENT = 15;
const PROCESSING_FEE = 5;

function ceilPercent(amount: number, percent: number): number {
  return Math.ceil(amount * percent / 100);
}

function floorPercent(amount: number, percent: number): number {
  return Math.floor(amount * percent / 100);
}

function calculateItemPremium(item: Item): number {
  let premium = BASE_PREMIUMS[item.type];
  if (item.cursed) {
    premium += ceilPercent(premium, CURSED_SURCHARGE_PERCENT);
  }
  if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
    premium += ceilPercent(premium, HIGH_ENCHANTMENT_SURCHARGE_PERCENT);
  }
  return premium;
}

function calculateQuotePremium(items: Item[], customer: { yearsWithMHPCO: number }, isFirstContract: boolean): number {
  let premium = 0;
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (item.type in BASE_PREMIUMS) {
      premium += calculateItemPremium(item);
    } else {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    }
  }
  for (const count of Object.values(componentCounts)) {
    const blocks = Math.floor(count / BUILDING_BLOCK_SIZE);
    const remainder = count % BUILDING_BLOCK_SIZE;
    premium += blocks * BUILDING_BLOCK_PREMIUM + remainder * COMPONENT_BASE_PREMIUM;
  }
  if (isFirstContract) {
    premium += ceilPercent(premium, FIRST_INSURANCE_SURCHARGE_PERCENT);
  } else {
    premium -= floorPercent(premium, SUBSEQUENT_CONTRACT_DISCOUNT_PERCENT);
  }
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    premium -= floorPercent(premium, LOYALTY_DISCOUNT_PERCENT);
  }
  premium += PROCESSING_FEE;
  return premium;
}

function calculateInsuranceSum(items: Item[]): number {
  let sum = 0;
  for (const item of items) {
    sum += ITEM_VALUES[item.type] ?? COMPONENT_VALUE;
  }
  return sum;
}

function calculateClaimPayout(claim: ClaimStep, policyItems: Item[], priorPayouts: number): ClaimResult {
  const insuranceSum = calculateInsuranceSum(policyItems);
  const effectiveDamage = claim.incident.damages.reduce((sum, d) => {
    const policyItem = policyItems.find(item => item.type === d.itemType);
    let amount = d.amount;
    if (policyItem && policyItem.material !== DRAGON_MATERIAL && policyItem.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
      amount = floorPercent(amount, HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT);
    }
    return sum + amount;
  }, 0);
  const remainingCap = insuranceSum * CAP_MULTIPLIER - priorPayouts;
  const rawPayout = Math.max(0, effectiveDamage - DEDUCTIBLE);
  const payout = Math.min(rawPayout, remainingCap);
  return { payout, remainingCap: remainingCap - payout };
}

export function processScenario(scenario: Scenario): ScenarioResult {
  const results: (QuoteResult | ClaimResult)[] = [];
  const policyPayouts: Record<number, number> = {};
  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      results.push({
        premium: calculateQuotePremium(step.items, scenario.customer, i === 0),
      });
    } else {
      const policyStep = scenario.steps[step.policy] as QuoteStep;
      const priorPayouts = policyPayouts[step.policy] ?? 0;
      const claimResult = calculateClaimPayout(step, policyStep.items, priorPayouts);
      policyPayouts[step.policy] = priorPayouts + claimResult.payout;
      results.push(claimResult);
    }
  }
  return { results };
}
