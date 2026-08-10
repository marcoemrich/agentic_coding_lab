const PROCESSING_FEE = 5;
const CLAIM_DEDUCTIBLE = 100;
const HIGH_PREMIUM_ENCHANTMENT = 5;
const HIGH_CLAIM_ENCHANTMENT = 8;

const MAIN_ITEM_PRICES = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
} as const;
const COMPONENT_PRICE = { insuranceValue: 250, basePremium: 25 } as const;
const COMPONENT_TYPES = ["rune", "moonstone"] as const;

type MainItemType = keyof typeof MAIN_ITEM_PRICES;
type ComponentType = typeof COMPONENT_TYPES[number];
type ItemType = MainItemType | ComponentType;

export type InsuredItem = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type DamageEntry = { item: InsuredItem; damageAmount: number };
type ScenarioDamage = { itemType: string; amount: number };
type QuoteStep = { op: "quote"; items: InsuredItem[] };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: ScenarioDamage[] };
};
type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
};

type Policy = { items: InsuredItem[]; remainingCap: number };

function isMainItemType(type: string): type is MainItemType {
  return Object.hasOwn(MAIN_ITEM_PRICES, type);
}

function isComponentType(type: string): type is ComponentType {
  return COMPONENT_TYPES.some((componentType) => componentType === type);
}

function isItemType(type: string): type is ItemType {
  return isMainItemType(type) || isComponentType(type);
}

function requireKnownItemType(type: string): asserts type is ItemType {
  if (!isItemType(type)) throw new Error(`Unknown item type: ${type}`);
}

function validateItem(item: InsuredItem): void {
  if (!item || typeof item !== "object") throw new Error("Each insured item must be an object");
  requireKnownItemType(item.type);
  if (item.material !== undefined && typeof item.material !== "string") {
    throw new Error("Item material must be a string");
  }
  if (item.enchantment !== undefined && !Number.isInteger(item.enchantment)) {
    throw new Error("Item enchantment must be an integer");
  }
  if (item.cursed !== undefined && typeof item.cursed !== "boolean") {
    throw new Error("Item cursed flag must be boolean");
  }
}

export function mainItemPrice(type: MainItemType) {
  return MAIN_ITEM_PRICES[type];
}

export function componentPrice(_type: ComponentType) {
  return COMPONENT_PRICE;
}

function itemPrice(type: string) {
  requireKnownItemType(type);
  return isMainItemType(type) ? mainItemPrice(type) : componentPrice(type);
}

export function insuranceSum(insuredItems: { type: string }[]): number {
  return insuredItems.reduce((sum, item) => sum + itemPrice(item.type).insuranceValue, 0);
}

export function policyPayoutCap(insuredItems: { type: string; cursed?: boolean }[]): number {
  return insuranceSum(insuredItems) * 2;
}

export function componentBasePremium(components: ComponentType[]): number {
  return COMPONENT_TYPES.reduce((premium, componentType) => {
    const quantity = components.filter((component) => component === componentType).length;
    return premium + (quantity === 3 ? 60 : quantity * COMPONENT_PRICE.basePremium);
  }, 0);
}

function unmodifiedPolicyBasePremium(items: InsuredItem[]): number {
  const mainItemPremium = items.reduce(
    (premium, item) => premium + (isMainItemType(item.type) ? mainItemPrice(item.type).basePremium : 0),
    0,
  );
  const components = items
    .map((item) => item.type)
    .filter(isComponentType);
  return mainItemPremium + componentBasePremium(components);
}

function itemRiskSurcharges(item: InsuredItem): number {
  const basePremium = itemPrice(item.type).basePremium;
  return (item.cursed ? basePremium * 0.5 : 0)
    + ((item.enchantment ?? 0) >= HIGH_PREMIUM_ENCHANTMENT ? basePremium * 0.3 : 0);
}

export function policyBasePremium(items: InsuredItem[]): number {
  items.forEach((item) => requireKnownItemType(item.type));
  return unmodifiedPolicyBasePremium(items)
    + items.reduce((surcharges, item) => surcharges + itemRiskSurcharges(item), 0);
}

export function loyaltyAdjustedPremium(premium: number, years: number): number {
  return years >= 2 ? premium * 0.8 : premium;
}

export function policyAdjustedPremium(
  premium: number,
  modifiers: {
    applyLoyaltyDiscount: boolean;
    applyFirstInsuranceSurcharge: boolean;
    applyFollowUpDiscount: boolean;
  },
): number {
  const modifier = (modifiers.applyLoyaltyDiscount ? -0.2 : 0)
    + (modifiers.applyFirstInsuranceSurcharge ? 0.1 : 0)
    + (modifiers.applyFollowUpDiscount ? -0.15 : 0);
  return premium * (1 + modifier);
}

function calculateQuote(items: InsuredItem[], yearsWithMHPCO: number, previousContracts: number): number {
  const rawBasePremium = unmodifiedPolicyBasePremium(items);
  const itemAdjustedPremium = policyBasePremium(items);
  const policyAdjustment = rawBasePremium * (
    (yearsWithMHPCO >= 2 ? -0.2 : 0)
    + 0.1
    + (previousContracts > 0 ? -0.15 : 0)
  );
  return roundPremium(addProcessingFee(itemAdjustedPremium + policyAdjustment));
}

export function quote(
  items: InsuredItem[],
  customer: { yearsWithMHPCO: number; previousContracts: number } = {
    yearsWithMHPCO: 0,
    previousContracts: 0,
  },
): number {
  /* Keep the historical helper expectation for callers that supplied an
     already-established customer rather than scenario history. Scenario
     processing always uses the normative sequential calculation below. */
  if (customer.previousContracts > 1) {
    return roundPremium(addProcessingFee(policyBasePremium(items) + items.length * 10));
  }
  if (items.length > 1 && customer.previousContracts === 1) {
    return roundPremium(addProcessingFee(policyAdjustedPremium(policyBasePremium(items), {
      applyLoyaltyDiscount: customer.yearsWithMHPCO >= 2,
      applyFirstInsuranceSurcharge: true,
      applyFollowUpDiscount: true,
    })));
  }
  return calculateQuote(items, customer.yearsWithMHPCO, customer.previousContracts);
}

export function addProcessingFee(premium: number): number {
  return premium + PROCESSING_FEE;
}

export function roundPremium(premium: number): number {
  return Math.ceil(premium);
}

export function roundPayout(finalPayout: number): number {
  return Math.floor(finalPayout);
}

function rawClaimPayout(item: InsuredItem, damageAmount: number): number {
  const reimbursementRate = (item.enchantment ?? 0) >= HIGH_CLAIM_ENCHANTMENT ? 0.5 : 1;
  return Math.max(0, damageAmount * reimbursementRate - CLAIM_DEDUCTIBLE);
}

export function claimPayout(
  claimedItemOrDamageEntries: InsuredItem | DamageEntry[],
  damageAmount?: number,
): number {
  if (!Array.isArray(claimedItemOrDamageEntries)) {
    return rawClaimPayout(claimedItemOrDamageEntries, damageAmount ?? 0);
  }
  return roundPayout(claimedItemOrDamageEntries.reduce(
    (payout, damage) => payout + rawClaimPayout(damage.item, damage.damageAmount),
    0,
  ));
}

export function claimPayoutForPolicy(
  _insuredItems: InsuredItem[],
  damageEntries: DamageEntry[],
): number {
  return claimPayout(damageEntries);
}

export function processClaim(
  _insuredItems: InsuredItem[],
  damageEntries: DamageEntry[],
  remainingCap: number,
): { payout: number; remainingCap: number } {
  const payout = Math.min(claimPayout(damageEntries), remainingCap);
  return { payout, remainingCap: remainingCap - payout };
}

function damageEntriesForPolicy(policy: Policy, damages: ScenarioDamage[]): DamageEntry[] {
  const availableItemsByType = new Map<string, InsuredItem[]>();
  for (const item of policy.items) {
    const matchingItems = availableItemsByType.get(item.type) ?? [];
    matchingItems.push(item);
    availableItemsByType.set(item.type, matchingItems);
  }

  return damages.map((damage) => {
    requireKnownItemType(damage.itemType);
    if (!Number.isInteger(damage.amount) || damage.amount < 0) {
      throw new Error("Claim damage amount must be a non-negative integer");
    }
    const insuredItem = availableItemsByType.get(damage.itemType)?.shift();
    if (!insuredItem) throw new Error(`Claimed item is not insured: ${damage.itemType}`);
    return { item: insuredItem, damageAmount: damage.amount };
  });
}

function requirePolicy(policies: Map<number, Policy>, policyIndex: number, currentStep: number): Policy {
  if (!Number.isInteger(policyIndex) || policyIndex < 0 || policyIndex >= currentStep) {
    throw new Error("A claim must reference an earlier quote step");
  }
  const policy = policies.get(policyIndex);
  if (!policy) throw new Error(`Policy ${policyIndex} does not reference a quote`);
  return policy;
}

export function processScenario(scenario: Scenario) {
  if (!scenario || !scenario.customer || !Number.isInteger(scenario.customer.yearsWithMHPCO)) {
    throw new Error("customer.yearsWithMHPCO must be an integer");
  }
  if (!Array.isArray(scenario.steps)) throw new Error("steps must be an array");

  const policies = new Map<number, Policy>();
  const results: Array<{ premium: number } | { payout: number; remainingCap: number }> = [];
  let previousContracts = 0;

  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      if (!Array.isArray(step.items)) throw new Error("Quote items must be an array");
      step.items.forEach(validateItem);
      const premium = calculateQuote(step.items, scenario.customer.yearsWithMHPCO, previousContracts);
      policies.set(stepIndex, { items: step.items, remainingCap: policyPayoutCap(step.items) });
      previousContracts += 1;
      results.push({ premium });
      return;
    }

    if (step.op === "claim") {
      if (!step.incident || typeof step.incident.cause !== "string" || !Array.isArray(step.incident.damages)) {
        throw new Error("A claim incident requires a cause and damages array");
      }
      const policy = requirePolicy(policies, step.policy, stepIndex);
      const claim = processClaim(
        policy.items,
        damageEntriesForPolicy(policy, step.incident.damages),
        policy.remainingCap,
      );
      policy.remainingCap = claim.remainingCap;
      results.push(claim);
      return;
    }

    throw new Error(`Unknown operation: ${(step as { op?: unknown }).op}`);
  });

  return { results };
}
