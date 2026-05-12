interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: string; items?: any[]; policy?: number; incident?: any }>;
}

interface ScenarioResult {
  results: Array<{ premium?: number; payout?: number; remainingCap?: number }>;
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;
const ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const HIGH_ENCHANTMENT_THRESHOLD = 8;

function computeComponentPremium(components: any[]): number {
  const countsByType: Record<string, number> = {};
  for (const component of components) {
    countsByType[component.type] = (countsByType[component.type] || 0) + 1;
  }
  let premium = 0;
  for (const type in countsByType) {
    const count = countsByType[type];
    if (count === COMPONENT_BLOCK_SIZE) {
      premium += COMPONENT_BLOCK_PREMIUM;
    } else {
      premium += count * COMPONENT_PREMIUM;
    }
  }
  return premium;
}

function computeMainItemPremiums(mainItems: any[]): { basePremium: number; surcharges: number } {
  let basePremium = 0;
  let surcharges = 0;
  for (const item of mainItems) {
    const base = BASE_PREMIUMS[item.type];
    if (base === undefined) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    basePremium += base;
    if (item.cursed) {
      surcharges += base * 0.5;
    }
    if (item.enchantment >= ENCHANTMENT_SURCHARGE_THRESHOLD) {
      surcharges += base * 0.3;
    }
  }
  return { basePremium, surcharges };
}

interface Policy {
  items: any[];
  insuranceSum: number;
  remainingCap: number;
}

function processQuote(
  step: Scenario["steps"][0],
  stepIndex: number,
  scenario: Scenario,
  policies: Policy[],
) {
  const items = step.items || [];
  const mainItems = items.filter((i) => !COMPONENT_TYPES.has(i.type));
  const components = items.filter((i) => COMPONENT_TYPES.has(i.type));

  const { basePremium: mainBasePremium, surcharges: itemSurcharges } = computeMainItemPremiums(mainItems);
  const componentPremium = computeComponentPremium(components);

  const policyBasePremium = mainBasePremium + componentPremium;
  const firstInsuranceSurcharge = policyBasePremium * 0.1;
  const loyaltyDiscount = scenario.customer.yearsWithMHPCO >= 2 ? policyBasePremium * 0.2 : 0;
  const followUpDiscount = stepIndex >= 1 ? policyBasePremium * 0.15 : 0;

  const premium = Math.ceil(policyBasePremium + itemSurcharges + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);

  const insuranceSum = mainItems.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0)
    + components.length * COMPONENT_INSURANCE_VALUE;
  policies.push({ items, insuranceSum, remainingCap: insuranceSum * 2 });

  return { premium };
}

function processClaim(step: Scenario["steps"][0], policies: Policy[]) {
  const policy = policies[step.policy!];
  const damages = step.incident.damages as Array<{ type: string; damage: number }>;

  const damageCountsByType: Record<string, number> = {};
  for (const d of damages) {
    damageCountsByType[d.type] = (damageCountsByType[d.type] || 0) + 1;
  }
  for (const type in damageCountsByType) {
    const insuredCount = policy.items.filter((i) => i.type === type).length;
    if (damageCountsByType[type] > insuredCount) {
      throw new Error(`More damage entries for ${type} than insured items`);
    }
  }

  let totalPayout = 0;
  for (const damageEntry of damages) {
    const policyItem = policy.items.find((i) => i.type === damageEntry.type)!;
    if (damageEntry.damage < 0) {
      throw new Error(`Negative damage amount: ${damageEntry.damage}`);
    }
    const reimbursement = policyItem.enchantment >= HIGH_ENCHANTMENT_THRESHOLD
      ? damageEntry.damage * 0.5
      : damageEntry.damage;
    totalPayout += reimbursement - DEDUCTIBLE;
  }

  totalPayout = Math.min(Math.floor(totalPayout), policy.remainingCap);
  policy.remainingCap -= totalPayout;
  return { payout: totalPayout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): ScenarioResult {
  const policies: Policy[] = [];
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      return processQuote(step, stepIndex, scenario, policies);
    } else {
      return processClaim(step, policies);
    }
  });
  return { results };
}
