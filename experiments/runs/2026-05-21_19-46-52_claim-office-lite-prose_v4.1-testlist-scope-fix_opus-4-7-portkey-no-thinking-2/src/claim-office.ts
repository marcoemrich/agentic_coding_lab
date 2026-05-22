const BASE_PRICES: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const SUBSEQUENT_CONTRACT_DISCOUNT_PERCENT = 15;
const FIXED_FEE = 5;
const ALIKE_COMPONENT_BLOCK_SIZE = 3;
const ALIKE_COMPONENT_BLOCK_PRICE = 60;
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATIO = 0.5;
const DRAGON_MATERIAL = "dragon";
const DRAGON_REIMBURSEMENT_RATIO = 1;
const CLAIM_DEDUCTIBLE = 100;

function applyFirstInsuranceSurcharge(amount: number): number {
  return Math.ceil((amount * (100 + FIRST_INSURANCE_SURCHARGE_PERCENT)) / 100);
}

function applySubsequentContractDiscount(amount: number): number {
  return Math.ceil((amount * (100 - SUBSEQUENT_CONTRACT_DISCOUNT_PERCENT)) / 100);
}

function countByType(items: { type: string }[]): Record<string, number> {
  return items.reduce<Record<string, number>>((counts, item) => {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
    return counts;
  }, {});
}

function priceForType(type: string, count: number): number {
  const blocks = Math.floor(count / ALIKE_COMPONENT_BLOCK_SIZE);
  const leftover = count % ALIKE_COMPONENT_BLOCK_SIZE;
  return blocks * ALIKE_COMPONENT_BLOCK_PRICE + leftover * BASE_PRICES[type];
}

function quoteBasePrice(items: { type: string }[]): number {
  const counts = countByType(items);
  return Object.entries(counts).reduce(
    (total, [type, count]) => total + priceForType(type, count),
    0
  );
}

function applyRatioIf(
  condition: boolean,
  basePrice: number,
  numerator: number,
  denominator: number
): number {
  return condition ? Math.ceil((basePrice * numerator) / denominator) : basePrice;
}

function applyCursedSurcharge(items: { cursed: boolean }[], basePrice: number): number {
  const hasCursed = items.some((item) => item.cursed);
  return applyRatioIf(hasCursed, basePrice, 3, 2);
}

function applyEnchantedSurcharge(items: { enchantment: number }[], basePrice: number): number {
  const hasHighEnchant = items.some((item) => item.enchantment >= 5);
  return applyRatioIf(hasHighEnchant, basePrice, 13, 10);
}

function applyLoyaltyDiscount(yearsWithMHPCO: number, basePrice: number): number {
  return applyRatioIf(yearsWithMHPCO >= 2, basePrice, 8, 10);
}

function reimbursementRatio(item: any): number {
  if (item.material === DRAGON_MATERIAL) return DRAGON_REIMBURSEMENT_RATIO;
  if (item.enchantment >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD)
    return HIGH_ENCHANTMENT_REIMBURSEMENT_RATIO;
  return 0;
}

function reimbursementForDamage(policyItems: any[], damage: any): number {
  const item = policyItems.find((i: any) => i.type === damage.itemType);
  return damage.amount * reimbursementRatio(item);
}

function computeClaimPayout(scenario: any, step: any): number {
  const policyItems = scenario.steps[step.policy].items;
  const totalReimbursement = step.damages.reduce(
    (sum: number, damage: any) => sum + reimbursementForDamage(policyItems, damage),
    0
  );
  return Math.max(0, totalReimbursement - CLAIM_DEDUCTIBLE);
}

export function runScenario(scenario: any): unknown {
  const results: ({ premium: number } | { payout: number })[] = [];
  for (const step of scenario.steps) {
    if (step.op === "claim") {
      results.push({ payout: computeClaimPayout(scenario, step) });
      continue;
    }
    const items = step.items;
    const basePrice = quoteBasePrice(items);
    const withCursed = applyCursedSurcharge(items, basePrice);
    const withEnchanted = applyEnchantedSurcharge(items, withCursed);
    const withLoyalty = applyLoyaltyDiscount(scenario.customer.yearsWithMHPCO, withEnchanted);
    const isFirstQuote = results.length === 0;
    const withContractAdjustment = isFirstQuote
      ? applyFirstInsuranceSurcharge(withLoyalty)
      : applySubsequentContractDiscount(withLoyalty);
    const premium = withContractAdjustment + FIXED_FEE;
    results.push({ premium });
  }
  return { results };
}
