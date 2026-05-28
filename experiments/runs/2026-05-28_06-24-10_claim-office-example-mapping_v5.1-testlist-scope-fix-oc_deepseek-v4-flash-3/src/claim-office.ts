const PROCESSING_FEE = 5;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_UNIT_PREMIUM = 25;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_THRESHOLD = 8;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  staff: 80,
  amulet: 60,
  potion: 40,
  rune: COMPONENT_UNIT_PREMIUM,
  moonstone: COMPONENT_UNIT_PREMIUM,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  staff: 800,
  amulet: 600,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

function computeItemBasePremium(item: { type: string }): number {
  return BASE_PREMIUMS[item.type] ?? 0;
}

function computeComponentPremium(items: { type: string }[]): number {
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      counts[item.type] = (counts[item.type] ?? 0) + 1;
    }
  }
  let total = 0;
  for (const type of Object.keys(counts)) {
    const count = counts[type];
    if (count === COMPONENT_BLOCK_SIZE) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * COMPONENT_UNIT_PREMIUM;
    }
  }
  return total;
}

function computeInsuranceSum(items: { type: string }[]): number {
  return items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
}

export function processQuote(input: {
  items: { type: string; material?: string; enchantment?: number; cursed?: boolean }[];
  customer: { yearsWithMHPCO: number };
  contractCount: number;
}): { premium: number; insuranceSum: number } {
  if (input.items.length === 0) return { premium: PROCESSING_FEE, insuranceSum: 0 };

  const { items, customer, contractCount } = input;

  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  const mainItems = items.filter((item) => !COMPONENT_TYPES.has(item.type));
  const componentItems = items.filter((item) => COMPONENT_TYPES.has(item.type));

  const componentBase = computeComponentPremium(componentItems);

  let itemSpecificSurcharges = 0;

  for (const item of mainItems) {
    const base = computeItemBasePremium(item);
    let surcharge = 0;
    if (item.cursed) {
      surcharge += base * 0.5;
    }
    if ((item.enchantment ?? 0) >= 5) {
      surcharge += base * 0.3;
    }
    itemSpecificSurcharges += surcharge;
  }

  const mainBase = mainItems.reduce(
    (sum, item) => sum + computeItemBasePremium(item),
    0,
  );

  const policyBase = mainBase + componentBase;
  let total = policyBase + itemSpecificSurcharges;

  if (customer.yearsWithMHPCO >= 2) {
    total -= policyBase * 0.2;
  }
  total += policyBase * 0.1;
  if (contractCount >= 1) {
    total -= policyBase * 0.15;
  }

  total += PROCESSING_FEE;
  return { premium: Math.ceil(total), insuranceSum: computeInsuranceSum(items) };
}

export function processClaim(input: {
  policyItems: { type: string; material?: string; enchantment?: number; cursed?: boolean }[];
  damages: { itemType: string; amount: number }[];
  previousPayouts: number;
  insuranceSum: number;
}): { payout: number; remainingCap: number } {
  const { policyItems, damages, previousPayouts, insuranceSum } = input;

  const typeCounts: Record<string, number> = {};
  for (const item of policyItems) {
    typeCounts[item.type] = (typeCounts[item.type] ?? 0) + 1;
  }

  const damageCounts: Record<string, number> = {};
  let totalPayout = 0;

  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error("Negative damage amount");
    }

    const insuredCount = typeCounts[damage.itemType] ?? 0;
    if (insuredCount === 0) {
      throw new Error(`Item type "${damage.itemType}" not in policy`);
    }

    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
    if (damageCounts[damage.itemType] > insuredCount) {
      throw new Error(`More damages of type "${damage.itemType}" than insured items`);
    }

    const policyItem = policyItems.find((item) => item.type === damage.itemType)!;
    let reimbursedAmount: number;

    if ((policyItem.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      reimbursedAmount = damage.amount * 0.5;
    } else if (policyItem.material === "dragon") {
      reimbursedAmount = damage.amount;
    } else {
      reimbursedAmount = damage.amount;
    }

    const payout = Math.max(0, reimbursedAmount - DEDUCTIBLE);
    totalPayout += payout;
  }

  totalPayout = Math.floor(totalPayout);

  const cap = CAP_MULTIPLIER * insuranceSum;
  const remainingCap = cap - previousPayouts;
  const actualPayout = Math.min(totalPayout, Math.max(0, remainingCap));
  const newRemainingCap = remainingCap - actualPayout;

  return { payout: actualPayout, remainingCap: newRemainingCap };
}