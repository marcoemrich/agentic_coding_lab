const ITEMS: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
};

const COMPONENT_BASE_PREMIUM = 25;
const BUILDING_BLOCK_PREMIUM = 60;
const CURSED_SURCHARGE = 1.5;
const ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const ENCHANTMENT_SURCHARGE = 1.3;
const LOYALTY_DISCOUNT = 0.8;
const FIRST_INSURANCE_SURCHARGE = 1.1;
const SUBSEQUENT_CONTRACT_DISCOUNT = 0.85;
const PROCESSING_FEE = 5;
const FLOAT_EPSILON = 1e-9;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const FULLY_REIMBURSED_MATERIAL = "dragon";

export function processScenario(scenario: any): { results: unknown[] } {
  const results: unknown[] = [];
  const policyPayouts: Record<number, number> = {};

  for (const step of scenario.steps) {
    if (step.op === "claim") {
      const policy = scenario.steps[step.policyStepIndex];
      let totalInsuredValue = 0;
      for (const item of policy.items) {
        totalInsuredValue += ITEMS[item.type]?.value ?? 0;
      }
      const cap = totalInsuredValue * CAP_MULTIPLIER;

      let totalPayout = 0;
      for (const event of step.damageEvents) {
        const item = policy.items[event.itemIndex];
        let damageAmount = event.amount;
        if (item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD && item.material !== FULLY_REIMBURSED_MATERIAL) {
          damageAmount *= HIGH_ENCHANTMENT_REIMBURSEMENT;
        }
        const eventPayout = Math.max(0, damageAmount - DEDUCTIBLE);
        totalPayout += eventPayout;
      }

      const priorPayouts = policyPayouts[step.policyStepIndex] ?? 0;
      const remainingCap = cap - priorPayouts;
      totalPayout = Math.min(totalPayout, remainingCap);
      totalPayout = Math.floor(totalPayout);
      policyPayouts[step.policyStepIndex] = priorPayouts + totalPayout;
      results.push({ payout: totalPayout, remainingCap: remainingCap - totalPayout });
    } else {
      let totalItemPremium = 0;

      const componentCounts: Record<string, number> = {};
      for (const item of step.items) {
        const mainPremium = ITEMS[item.type]?.premium;
        if (mainPremium !== undefined) {
          let itemPremium = item.cursed ? mainPremium * CURSED_SURCHARGE : mainPremium;
          if (item.enchantment >= ENCHANTMENT_SURCHARGE_THRESHOLD) {
            itemPremium *= ENCHANTMENT_SURCHARGE;
          }
          totalItemPremium += itemPremium;
        } else {
          componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
        }
      }

      for (const count of Object.values(componentCounts)) {
        const blocks = Math.floor(count / 3);
        const remainder = count % 3;
        totalItemPremium += blocks * BUILDING_BLOCK_PREMIUM + remainder * COMPONENT_BASE_PREMIUM;
      }

      const contractMultiplier = results.length === 0
        ? FIRST_INSURANCE_SURCHARGE
        : SUBSEQUENT_CONTRACT_DISCOUNT;
      let adjustedPremium = totalItemPremium * contractMultiplier;
      if (scenario.customer.yearsWithMHPCO >= 2) {
        adjustedPremium *= LOYALTY_DISCOUNT;
      }
      const premium = Math.ceil(adjustedPremium - FLOAT_EPSILON) + PROCESSING_FEE;
      results.push({ premium });
    }
  }

  return { results };
}
