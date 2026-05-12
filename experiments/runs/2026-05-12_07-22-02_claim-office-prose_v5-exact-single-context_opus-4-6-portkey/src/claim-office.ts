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
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BUNDLE_SIZE = 3;
const COMPONENT_BUNDLE_PREMIUM = 60;
const CURSED_SURCHARGE = 1.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 1.3;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT = 0.8;
const MULTI_CONTRACT_DISCOUNT = 0.85;
const FIRST_INSURANCE_SURCHARGE = 1.1;
const PROCESSING_FEE = 5;

function ceilWithPrecision(value: number): number {
  return Math.ceil(parseFloat(value.toFixed(2)));
}

function isComponent(item: any): boolean {
  return !(item.type in BASE_PREMIUMS);
}

function computeComponentPremium(components: any[]): number {
  const groups: Record<string, number> = {};
  for (const item of components) {
    groups[item.type] = (groups[item.type] ?? 0) + 1;
  }
  let total = 0;
  for (const count of Object.values(groups)) {
    const bundles = Math.floor(count / COMPONENT_BUNDLE_SIZE);
    const remainder = count % COMPONENT_BUNDLE_SIZE;
    total += bundles * COMPONENT_BUNDLE_PREMIUM + remainder * COMPONENT_BASE_PREMIUM;
  }
  return total;
}

function computeBasePremium(items: any[]): number {
  const mainItems = items.filter((item: any) => !isComponent(item));
  const components = items.filter((item: any) => isComponent(item));
  const mainPremium = mainItems.reduce(
    (sum: number, item: any) => {
      let itemPremium = BASE_PREMIUMS[item.type];
      if (item.cursed) itemPremium *= CURSED_SURCHARGE;
      if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) itemPremium *= HIGH_ENCHANTMENT_SURCHARGE;
      return sum + itemPremium;
    },
    0
  );
  return mainPremium + computeComponentPremium(components);
}

function computeEffectiveDamage(d: any): number {
  if (d.material === "dragon") return d.amount;
  if (d.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) return d.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  return d.amount;
}

function processClaim(
  step: any,
  policies: Record<number, { insuranceSum: number; remainingCap: number }>
): { payout: number; remainingCap: number } {
  const policy = policies[step.policy];
  const totalDamage = step.incident.damages.reduce(
    (sum: number, d: any) => sum + computeEffectiveDamage(d),
    0
  );
  const payout = Math.max(0, totalDamage - DEDUCTIBLE);
  const actualPayout = Math.min(payout, policy.remainingCap);
  policy.remainingCap -= actualPayout;
  return { payout: actualPayout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: any): any {
  const customer = scenario.customer;
  let quoteCount = 0;
  const policies: Record<number, { insuranceSum: number; remainingCap: number }> = {};
  const results = scenario.steps.map((step: any, index: number) => {
    if (step.op === "quote") {
      quoteCount++;
      const basePremium = computeBasePremium(step.items);
      let adjusted: number;
      if (quoteCount === 1) {
        adjusted = basePremium * FIRST_INSURANCE_SURCHARGE;
      } else {
        adjusted = basePremium * MULTI_CONTRACT_DISCOUNT;
      }
      if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) adjusted *= LOYALTY_DISCOUNT;
      const premium = ceilWithPrecision(adjusted) + PROCESSING_FEE;
      const insuranceSum = step.items.reduce(
        (sum: number, item: any) => sum + (INSURANCE_VALUES[item.type] ?? COMPONENT_INSURANCE_VALUE),
        0
      );
      policies[index] = { insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
      return { premium };
    }
    if (step.op === "claim") {
      return processClaim(step, policies);
    }
    return {};
  });
  return { results };
}
