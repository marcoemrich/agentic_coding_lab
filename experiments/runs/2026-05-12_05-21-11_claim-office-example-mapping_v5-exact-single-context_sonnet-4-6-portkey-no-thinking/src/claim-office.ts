const PROCESSING_FEE = 5;
const COMPONENT_BASE_PREMIUM = 25;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

export const quote = (customer: unknown, items: unknown[]): number => {
  const typedCustomer = customer as { yearsWithMHPCO: number; contractCount: number };
  const typedItems = items as { type: string; cursed?: boolean; enchantment?: number }[];
  const counts: Record<string, number> = {};
  for (const item of typedItems) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  let policyBase = 0;
  for (const [type, count] of Object.entries(counts)) {
    if (!(type in BASE_PREMIUM)) throw new Error(`Unknown item type: ${type}`);
    if (count === COMPONENT_BLOCK_SIZE && COMPONENT_TYPES.has(type)) {
      policyBase += COMPONENT_BLOCK_PREMIUM;
    } else {
      policyBase += count * BASE_PREMIUM[type];
    }
  }
  let totalPremium = policyBase;
  for (const item of typedItems) {
    const basePremium = BASE_PREMIUM[item.type];
    if (item.cursed) totalPremium += basePremium * CURSED_SURCHARGE_RATE;
    if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) totalPremium += basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  totalPremium += policyBase * FIRST_INSURANCE_SURCHARGE_RATE;
  if (typedCustomer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) totalPremium -= policyBase * LOYALTY_DISCOUNT_RATE;
  if (typedCustomer.contractCount > 0) totalPremium -= policyBase * FOLLOWUP_DISCOUNT_RATE;
  return Math.ceil(totalPremium + PROCESSING_FEE);
};

export const claim = (policy: unknown, incident: unknown): unknown => {
  const typedPolicy = policy as { items: { type: string; enchantment?: number }[]; remainingCap: number };
  const typedIncident = incident as { damages: { itemType: string; amount: number }[] };
  const damageCounts: Record<string, number> = {};
  for (const damage of typedIncident.damages) {
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
  }
  const policyCounts: Record<string, number> = {};
  for (const item of typedPolicy.items) {
    policyCounts[item.type] = (policyCounts[item.type] ?? 0) + 1;
  }
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] ?? 0)) throw new Error(`More damages than insured items for type: ${type}`);
  }
  let payout = 0;
  for (const damage of typedIncident.damages) {
    if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
    const policyItem = typedPolicy.items.find(i => i.type === damage.itemType)!;
    const isHighEnchantment = (policyItem.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
    payout += (isHighEnchantment ? damage.amount * HIGH_ENCHANTMENT_CLAIM_RATE : damage.amount) - DEDUCTIBLE;
  }
  payout = Math.min(payout, typedPolicy.remainingCap);
  const remainingCap = typedPolicy.remainingCap - payout;
  return { payout, remainingCap };
};
