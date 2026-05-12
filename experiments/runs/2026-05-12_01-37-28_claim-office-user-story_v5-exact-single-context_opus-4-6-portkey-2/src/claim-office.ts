const PROCESSING_FEE = 5;
const COMPONENT_PREMIUM = 25;
const BUILDING_BLOCK_PREMIUM = 60;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_MULTIPLIER = 0.8;
const FIRST_INSURANCE_MULTIPLIER = 1.1;
const MULTI_CONTRACT_DISCOUNT = 0.85;
const DEDUCTIBLE = 100;
const PAYOUT_CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_ENCHANTMENT_REIMBURSEMENT = 0.5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_PREMIUM,
};

function calculateTotalBasePremium(items: any[]): number {
  const componentCounts: Record<string, number> = {};
  let total = 0;

  for (const item of items) {
    const base = BASE_PREMIUMS[item.type];
    let surcharge = 0;
    if (item.cursed) surcharge += CURSED_SURCHARGE;
    if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) surcharge += HIGH_ENCHANTMENT_SURCHARGE;
    const itemPremium = base * (1 + surcharge);
    if (base === COMPONENT_PREMIUM) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    } else {
      total += itemPremium;
    }
  }

  for (const type in componentCounts) {
    const count = componentCounts[type];
    const blocks = Math.floor(count / 3);
    const remainder = count % 3;
    total += blocks * BUILDING_BLOCK_PREMIUM + remainder * COMPONENT_PREMIUM;
  }

  return total;
}

function calculateEventPayout(event: any): number {
  if (event.material === "dragon") return event.amount;
  const reimbursableAmount = event.enchantment >= CLAIM_ENCHANTMENT_THRESHOLD ? event.amount * CLAIM_ENCHANTMENT_REIMBURSEMENT : event.amount;
  return Math.max(0, reimbursableAmount - DEDUCTIBLE);
}

function ceilPrecise(value: number): number {
  return Math.ceil(parseFloat(value.toFixed(2)));
}

export function processScenario(scenario: any): any {
  const yearsWithMHPCO = scenario.customer?.yearsWithMHPCO ?? 0;
  const customerMultiplier = yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? LOYALTY_MULTIPLIER : FIRST_INSURANCE_MULTIPLIER;
  const results: any[] = [];
  let remainingCap = 0;
  for (let index = 0; index < scenario.steps.length; index++) {
    const step = scenario.steps[index];
    if (step.op === "claim") {
      const totalEventPayout = step.damageEvents.reduce((sum: number, event: any) => sum + calculateEventPayout(event), 0);
      const payout = Math.min(totalEventPayout, remainingCap);
      remainingCap -= payout;
      results.push({ payout });
    } else {
      const totalBasePremium = calculateTotalBasePremium(step.items);
      const contractMultiplier = index > 0 ? MULTI_CONTRACT_DISCOUNT : 1;
      const premium = ceilPrecise(totalBasePremium * customerMultiplier * contractMultiplier) + PROCESSING_FEE;
      remainingCap = premium * PAYOUT_CAP_MULTIPLIER;
      results.push({ premium });
    }
  }
  return { results };
}
