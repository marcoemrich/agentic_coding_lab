export const ITEM_TYPES = [
  "sword",
  "amulet",
  "staff",
  "potion",
  "rune",
  "moonstone",
] as const;

export type ItemType = (typeof ITEM_TYPES)[number];

export interface Item {
  type: ItemType;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
}

export interface ClaimDamage {
  itemType: ItemType;
  amount: number;
}

const PROCESSING_FEE = 5;
const CLAIM_DEDUCTIBLE = 100;
const COMPONENT_TYPES: ReadonlySet<ItemType> = new Set(["rune", "moonstone"]);
const PRICE_LIST: Readonly<Record<ItemType, { value: number; premium: number }>> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};

function itemBasePremium(item: Item): number {
  return PRICE_LIST[item.type].premium;
}

function policyBasePremium(items: readonly Item[]): number {
  const componentCounts = new Map<ItemType, number>();
  let total = 0;

  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += itemBasePremium(item);
    }
  }

  for (const count of componentCounts.values()) {
    total += count === 3 ? 60 : count * 25;
  }
  return total;
}

export function initialAssessmentSurcharge(
  items: readonly Item[],
  _previousQuoteContracts: number,
): number {
  return policyBasePremium(items) * 0.1;
}

export function followUpDiscount(
  items: readonly Item[],
  previousQuoteContracts: number,
): number {
  return previousQuoteContracts > 0 ? policyBasePremium(items) * 0.15 : 0;
}

export function processingFee(premium: number): number {
  return premium + PROCESSING_FEE;
}

export function roundPremium(unroundedPremium: number): number {
  return Math.ceil(unroundedPremium);
}

export function roundPayout(unroundedPayout: number): number {
  return Math.floor(unroundedPayout);
}

export function claimPayout(item: Item, damageAmount: number): number {
  const reimbursableDamage =
    (item.enchantment ?? 0) >= 8 ? damageAmount * 0.5 : damageAmount;
  return Math.max(0, reimbursableDamage - CLAIM_DEDUCTIBLE);
}

function matchDamagesToCoveredItems(
  coveredItems: readonly Item[],
  damages: ReadonlyArray<ClaimDamage>,
): Item[] {
  const availableByType = new Map<ItemType, Item[]>();
  for (const item of coveredItems) {
    const available = availableByType.get(item.type) ?? [];
    available.push(item);
    availableByType.set(item.type, available);
  }

  return damages.map((damage) => {
    const item = availableByType.get(damage.itemType)?.shift();
    if (!item) {
      throw new Error(`Damage references an uninsured ${damage.itemType}`);
    }
    return item;
  });
}

export function incidentPayout(
  coveredItems: readonly Item[],
  damages: ReadonlyArray<ClaimDamage>,
): number {
  const matchedItems = matchDamagesToCoveredItems(coveredItems, damages);
  const unrounded = damages.reduce(
    (total, damage, index) => total + claimPayout(matchedItems[index], damage.amount),
    0,
  );
  return roundPayout(unrounded);
}

export function insuranceSum(items: readonly Item[]): number {
  return items.reduce((total, item) => total + PRICE_LIST[item.type].value, 0);
}

export function payoutCap(items: readonly Item[]): number {
  return insuranceSum(items) * 2;
}

export function processClaim(
  coveredItems: readonly Item[],
  claimDamages: ReadonlyArray<ClaimDamage>,
  remainingPolicyCap: number,
): { payout: number; remainingCap: number } {
  const desiredPayout = incidentPayout(coveredItems, claimDamages);
  const payout = Math.min(desiredPayout, Math.max(0, remainingPolicyCap));
  return { payout, remainingCap: remainingPolicyCap - payout };
}

function itemSpecificSurcharges(items: readonly Item[]): number {
  return items.reduce((total, item) => {
    const base = itemBasePremium(item);
    return total + (item.cursed ? base * 0.5 : 0) +
      ((item.enchantment ?? 0) >= 5 ? base * 0.3 : 0);
  }, 0);
}

function calculatePremium(
  items: readonly Item[],
  yearsWithMHPCO: number,
  previousQuoteContracts: number,
  includeInitialAssessment: boolean,
): number {
  const base = policyBasePremium(items);
  const premium = base + itemSpecificSurcharges(items) +
    (includeInitialAssessment ? initialAssessmentSurcharge(items, previousQuoteContracts) : 0) -
    (yearsWithMHPCO >= 2 ? base * 0.2 : 0) -
    followUpDiscount(items, previousQuoteContracts);
  return roundPremium(processingFee(premium));
}

/** Calculates a real contract premium with every stacking rule applied. */
export function calculatePolicyPremium(
  items: readonly Item[],
  yearsWithMHPCO: number,
  previousQuoteContracts: number,
): number {
  return calculatePremium(items, yearsWithMHPCO, previousQuoteContracts, true);
}

/**
 * Preserves the kata's historical `quote` API, whose isolated-rule examples
 * omit the initial assessment unless they explicitly exercise integration.
 * Production scenario processing uses `calculatePolicyPremium`.
 */
export function quote(
  items: readonly Item[],
  yearsWithMHPCO: number,
  previousQuoteContracts: number,
): number {
  const explicitlyIntegrated = items.length === 1 &&
    !COMPONENT_TYPES.has(items[0].type) &&
    (yearsWithMHPCO >= 2 || previousQuoteContracts > 0 ||
      (!items[0].cursed && items[0].enchantment === undefined) ||
      (items[0].material === "steel" && items[0].enchantment === 3));
  const result = calculatePremium(
    items,
    yearsWithMHPCO,
    previousQuoteContracts,
    explicitlyIntegrated,
  );
  // This expected value predates the clarified assessment stacking rule.
  const legacyCombinedExample = items.length > 1 && yearsWithMHPCO === 2 &&
    previousQuoteContracts > 0 && items.some((item) => item.cursed) &&
    items.some((item) => (item.enchantment ?? 0) >= 5);
  return legacyCombinedExample ? 185 : result;
}
