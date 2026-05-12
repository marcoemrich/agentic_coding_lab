type Item = { type: string; cursed?: boolean; enchantment?: number };
type Step = { op: string; items?: Item[] };
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };
type StepResult = { premium?: number; payout?: number; remainingCap?: number };
type ScenarioResult = { results: StepResult[] };

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  "building-block": 60,
};

const PROCESSING_FEE = 5;
const COMPONENT_BASE_PREMIUM = 25;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const DRAGON_MATERIAL = "dragon";

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

type QuoteContext = { isFirstContract: boolean; isLoyalCustomer: boolean };

const calculatePremium = (item: Item | undefined, ctx: QuoteContext): number => {
  const basePremium = BASE_PREMIUM[item?.type ?? ""] ?? COMPONENT_BASE_PREMIUM;
  const cursedMultiplier = item?.cursed ? 1.5 : 1;
  const enchantedMultiplier = (item?.enchantment ?? 0) >= 5 ? 1.3 : 1;
  const riskAdjusted = basePremium * cursedMultiplier * enchantedMultiplier;
  const loyaltyMultiplier = ctx.isLoyalCustomer ? 80 / 100 : 1;
  if (ctx.isFirstContract) {
    return Math.ceil(riskAdjusted * 11 / 10 * loyaltyMultiplier) + PROCESSING_FEE; // +10% surcharge
  }
  return Math.ceil(riskAdjusted * 85 / 100 * loyaltyMultiplier) + PROCESSING_FEE; // -15% discount
};

type Policy = { remainingCap: number };

export const processScenario = (scenario: Scenario): ScenarioResult => {
  let quoteCount = 0;
  const isLoyalCustomer = scenario.customer.yearsWithMHPCO >= 2;
  const policies: Policy[] = [];
  const results: StepResult[] = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const ctx: QuoteContext = { isFirstContract: quoteCount === 0, isLoyalCustomer };
      quoteCount++;
      const items = step.items ?? [];
      const isComponentBuildingBlock = items.length === 3 && items.every(i => i.type === items[0].type);
      const item = isComponentBuildingBlock ? { type: "building-block" } : items[0];
      const insuranceSum = INSURANCE_VALUE[item?.type ?? ""] ?? 0;
      policies.push({ remainingCap: insuranceSum * 2 });
      return { premium: calculatePremium(item, ctx) };
    }
    if (step.op === "claim") {
      const claim = step as unknown as { policy: number; incident: { damages: { amount: number; enchantment?: number; material?: string }[] } };
      const policy = policies[claim.policy];
      const damage = claim.incident.damages[0];
      const reimbursableAmount = (damage.enchantment ?? 0) >= 8 ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE : damage.amount;
      const uncappedPayout = damage.material === DRAGON_MATERIAL ? damage.amount : Math.max(0, reimbursableAmount - DEDUCTIBLE);
      const payout = Math.min(uncappedPayout, policy.remainingCap);
      policy.remainingCap -= payout;
      return { payout, remainingCap: policy.remainingCap };
    }
    return {};
  });
  return { results };
};
