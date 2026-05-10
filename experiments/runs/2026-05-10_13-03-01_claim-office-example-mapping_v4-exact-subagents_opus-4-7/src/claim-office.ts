export type Customer = {
  yearsWithMHPCO: number;
  priorContracts: number;
  firstInsurance?: boolean;
};

export type Item = Record<string, unknown>;

export type Policy = {
  customer: Customer;
  items: Item[];
};

export type QuoteResult = {
  premium: number;
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

const PROCESSING_FEE = 5;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  component: COMPONENT_BASE_PREMIUM,
};

const basePremiumForItem = (item: Item): number =>
  BASE_PREMIUM_BY_ITEM_TYPE[item.type as string] ?? 0;

const isComponent = (item: Item): boolean => item.type === "component";

const groupComponentsByType = (items: Item[]): Map<string, number> => {
  const groups = new Map<string, number>();
  for (const item of items.filter(isComponent)) {
    const key = item.componentType as string;
    groups.set(key, (groups.get(key) ?? 0) + 1);
  }
  return groups;
};

const componentGroupPremium = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_BASE_PREMIUM;

const componentsPremium = (items: Item[]): number =>
  Array.from(groupComponentsByType(items).values()).reduce(
    (sum, count) => sum + componentGroupPremium(count),
    0,
  );

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

type ItemModifier = (item: Item, base: number) => number;

const curseModifier: ItemModifier = (item, base) =>
  item.cursed === true ? base * CURSE_SURCHARGE_RATE : 0;

const highEnchantmentModifier: ItemModifier = (item, base) =>
  (item.enchantment as number) >= HIGH_ENCHANTMENT_THRESHOLD
    ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;

const ITEM_MODIFIERS: ItemModifier[] = [curseModifier, highEnchantmentModifier];

const itemPremium = (item: Item): number => {
  const base = basePremiumForItem(item);
  return ITEM_MODIFIERS.reduce(
    (premium, modifier) => premium + modifier(item, base),
    base,
  );
};

type NonComponentTotals = { base: number; withModifiers: number };

const nonComponentsTotals = (items: Item[]): NonComponentTotals =>
  items
    .filter((item) => !isComponent(item))
    .reduce<NonComponentTotals>(
      (totals, item) => ({
        base: totals.base + basePremiumForItem(item),
        withModifiers: totals.withModifiers + itemPremium(item),
      }),
      { base: 0, withModifiers: 0 },
    );

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const FOLLOW_UP_PRIOR_CONTRACTS_THRESHOLD = 1;

type PolicyAdjustment = (customer: Customer, basePremium: number) => number;

const loyaltyAdjustment: PolicyAdjustment = (customer, basePremium) =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? -basePremium * LOYALTY_DISCOUNT_RATE
    : 0;

const firstInsuranceAdjustment: PolicyAdjustment = (customer, basePremium) =>
  customer.firstInsurance === true ? basePremium * FIRST_INSURANCE_SURCHARGE_RATE : 0;

const followUpAdjustment: PolicyAdjustment = (customer, basePremium) =>
  customer.priorContracts >= FOLLOW_UP_PRIOR_CONTRACTS_THRESHOLD
    ? -basePremium * FOLLOW_UP_DISCOUNT_RATE
    : 0;

const POLICY_ADJUSTMENTS: PolicyAdjustment[] = [
  loyaltyAdjustment,
  firstInsuranceAdjustment,
  followUpAdjustment,
];

const totalPolicyAdjustment = (customer: Customer, basePremium: number): number =>
  POLICY_ADJUSTMENTS.reduce(
    (sum, adjustment) => sum + adjustment(customer, basePremium),
    0,
  );

export function quote(policy: Policy): QuoteResult {
  const componentsTotal = componentsPremium(policy.items);
  const nonComponents = nonComponentsTotals(policy.items);
  const itemsTotal = nonComponents.withModifiers + componentsTotal;
  const policyBase = nonComponents.base + componentsTotal;
  return {
    premium: Math.ceil(itemsTotal + totalPolicyAdjustment(policy.customer, policyBase) + PROCESSING_FEE),
  };
}

export type Damage = {
  itemType: string;
  amount: number;
  componentType?: string;
};

export type ClaimEvent = {
  cause: string;
  damages: Damage[];
};

const DEDUCTIBLE_PER_DAMAGE = 100;

const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  component: 250,
};

const insuranceValueForItem = (item: Item): number =>
  INSURANCE_VALUE_BY_ITEM_TYPE[item.type as string] ?? 0;

const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const findPolicyItem = (items: Item[], itemType: string): Item | undefined =>
  items.find((item) => item.type === itemType);

const reimbursementBeforeDeductible = (damage: Damage, item: Item | undefined): number => {
  if (item && (item.enchantment as number) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return damage.amount;
};

const damagePayout = (damage: Damage, items: Item[]): number => {
  const item = findPolicyItem(items, damage.itemType);
  return reimbursementBeforeDeductible(damage, item) - DEDUCTIBLE_PER_DAMAGE;
};

const totalInsuranceValue = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueForItem(item), 0);

const initialCapFor = (items: Item[]): number =>
  CAP_MULTIPLIER * totalInsuranceValue(items);

const damageKey = (damage: Damage): string =>
  damage.itemType === "component"
    ? `component:${damage.componentType as string}`
    : damage.itemType;

const itemKey = (item: Item): string =>
  item.type === "component"
    ? `component:${item.componentType as string}`
    : (item.type as string);

const countByKey = <T>(values: T[], keyFn: (value: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = keyFn(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const validateDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error("Damage amount must be non-negative");
    }
  }
};

const validateDamageCounts = (items: Item[], damages: Damage[]): void => {
  const itemCounts = countByKey(items, itemKey);
  const damageCounts = countByKey(damages, damageKey);
  for (const [key, count] of damageCounts) {
    if (count > (itemCounts.get(key) ?? 0)) {
      throw new Error(`More damages of type ${key} than insured`);
    }
  }
};

const validateDamages = (items: Item[], damages: Damage[]): void => {
  validateDamageAmounts(damages);
  validateDamageCounts(items, damages);
};

export function claim(policy: { items: Item[]; remainingCap?: number }, event: ClaimEvent): ClaimResult {
  validateDamages(policy.items, event.damages);
  const uncappedPayout = event.damages.reduce(
    (sum, damage) => sum + damagePayout(damage, policy.items),
    0,
  );
  const cap = policy.remainingCap ?? initialCapFor(policy.items);
  const payout = Math.floor(Math.min(uncappedPayout, cap));
  return { payout, remainingCap: cap - payout };
}
