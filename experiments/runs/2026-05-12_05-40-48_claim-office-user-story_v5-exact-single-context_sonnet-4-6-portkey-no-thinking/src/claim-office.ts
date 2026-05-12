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

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
}

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: (QuoteStep | ClaimStep)[];
}

interface ScenarioResult {
  results: unknown[];
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  component: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  component: 250,
};

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_DISCOUNT_RATE = 0.2;
const REPEAT_CONTRACT_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;
const TRIPLE_COMPONENT_PREMIUM = 60;

const applySurcharge = (amount: number, rate: number): number => amount * (1 + rate);
const applyDiscount = (amount: number, rate: number): number => Math.floor(amount * (1 - rate));

const calculateQuotePremium = (step: QuoteStep, yearsWithMHPCO: number, quoteIndex: number): number => {
  const isTripleAlikeComponents =
    step.items.length === 3 && step.items.every((item) => item.type === "component");
  const basePremium = isTripleAlikeComponents
    ? TRIPLE_COMPONENT_PREMIUM
    : step.items.reduce((sum, item) => sum + BASE_PREMIUMS[item.type], 0);
  const isCursed = step.items.some((item) => item.cursed);
  const isHighlyEnchanted = step.items.some((item) => item.enchantment >= 5);
  const afterCursed = isCursed ? applySurcharge(basePremium, CURSED_SURCHARGE_RATE) : basePremium;
  const afterRiskSurcharges = isHighlyEnchanted ? applySurcharge(afterCursed, HIGH_ENCHANTMENT_SURCHARGE_RATE) : afterCursed;
  const afterAssessment = Math.floor(applySurcharge(afterRiskSurcharges, INITIAL_ASSESSMENT_RATE));
  const isLoyalCustomer = yearsWithMHPCO >= 2;
  const isRepeatContract = quoteIndex > 0;
  const afterLoyalty = isLoyalCustomer ? applyDiscount(afterAssessment, LOYALTY_DISCOUNT_RATE) : afterAssessment;
  const afterDiscounts = isRepeatContract ? applyDiscount(afterLoyalty, REPEAT_CONTRACT_DISCOUNT_RATE) : afterLoyalty;
  return afterDiscounts + PROCESSING_FEE;
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

const findPolicyItem = (damage: Damage, policyItems: Item[]): Item | undefined =>
  policyItems.find((i) => i.type === damage.itemType);

const effectiveDamageAmount = (damage: Damage, policyItems: Item[]): number => {
  const item = findPolicyItem(damage, policyItems);
  if (item && item.material === "dragon") return damage.amount;
  if (item && item.enchantment >= 8) return Math.floor(damage.amount * HIGH_ENCHANTMENT_CLAIM_RATE);
  return damage.amount;
};

const processClaimStep = (step: ClaimStep, policies: Policy[]): { payout: number; remainingCap: number } => {
  const policy = policies[step.policy];
  const allDragon = step.incident.damages.every((d) => findPolicyItem(d, policy.items)?.material === "dragon");
  const totalDamage = step.incident.damages.reduce((sum, d) => sum + effectiveDamageAmount(d, policy.items), 0);
  const damageAfterDeductible = allDragon ? totalDamage : Math.max(totalDamage - DEDUCTIBLE, 0);
  const payout = Math.min(damageAfterDeductible, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const processScenario = (scenario: Scenario): ScenarioResult => {
  let quoteCount = 0;
  const policies: Policy[] = [];
  const results = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const premium = calculateQuotePremium(step, scenario.customer.yearsWithMHPCO, quoteCount);
      quoteCount++;
      const insuranceSum = step.items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
      policies.push({ items: step.items, remainingCap: insuranceSum * 2 });
      return { premium };
    } else {
      return processClaimStep(step, policies);
    }
  });
  return { results };
};
