// claim-office.ts

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

type Item = { type: string; material?: string; cursed?: boolean; enchantment?: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause?: string; damages: Damage[] };
type Step = {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: Incident;
};
type Customer = { yearsWithMHPCO?: number };
type Scenario = { steps: Step[]; customer?: Customer };

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;

const insuranceValueForType = (type: string): number =>
  INSURANCE_VALUES[type] ?? 0;

const sumPolicyInsurance = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueForType(item.type), 0);

const findItemInPolicy = (items: Item[], itemType: string): Item => {
  const found = items.find((i) => i.type === itemType);
  if (!found) throw new Error(`Item type ${itemType} not in policy`);
  return found;
};

const reimbursementForDamage = (item: Item, amount: number): number => {
  const enchantment = item.enchantment ?? 0;
  const reimbursed =
    enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD ? amount * 0.5 : amount;
  return Math.max(0, reimbursed - DEDUCTIBLE);
};

type ClaimResult = { payout: number; remainingCap: number };

const processClaim = (
  step: Step,
  policySteps: Map<number, Step>,
  remainingCaps: Map<number, number>,
): ClaimResult => {
  const policyIndex = step.policy as number;
  const policyStep = policySteps.get(policyIndex);
  if (!policyStep || !policyStep.items) {
    throw new Error(`Policy at index ${policyIndex} not found`);
  }
  const damages = step.incident?.damages ?? [];
  const policyItemCounts = new Map<string, number>();
  for (const item of policyStep.items!) {
    policyItemCounts.set(item.type, (policyItemCounts.get(item.type) ?? 0) + 1);
  }
  const damageCounts = new Map<string, number>();
  for (const damage of damages) {
    damageCounts.set(damage.itemType, (damageCounts.get(damage.itemType) ?? 0) + 1);
  }
  for (const [itemType, count] of damageCounts) {
    if (count > (policyItemCounts.get(itemType) ?? 0)) {
      throw new Error(`Too many damage entries for ${itemType}`);
    }
  }
  const totalReimbursement = damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error(`Negative damage amount`);
    const item = findItemInPolicy(policyStep.items!, damage.itemType);
    return sum + reimbursementForDamage(item, damage.amount);
  }, 0);
  const remainingCap = remainingCaps.get(policyIndex) ?? 0;
  const payout = Math.floor(Math.min(totalReimbursement, remainingCap));
  const newRemainingCap = remainingCap - payout;
  remainingCaps.set(policyIndex, newRemainingCap);
  return { payout, remainingCap: newRemainingCap };
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const basePremiumForType = (type: string): number => BASE_PREMIUMS[type] ?? 0;

const itemBasePremium = (item: Item): number => basePremiumForType(item.type);

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const componentGroupPremium = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * basePremiumForType(type);

const sumItemBasePremiums = (items: Item[]): number => {
  const nonComponents = items.filter((item) => !isComponent(item));
  const components = items.filter(isComponent);
  const nonComponentsTotal = nonComponents.reduce(
    (sum, item) => sum + itemBasePremium(item),
    0,
  );
  const componentsTotal = Array.from(countByType(components)).reduce(
    (sum, [type, count]) => sum + componentGroupPremium(type, count),
    0,
  );
  return nonComponentsTotal + componentsTotal;
};

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const cursedSurcharge = (item: Item, base: number): number =>
  isCursed(item) ? base * CURSED_SURCHARGE_RATE : 0;

const highEnchantmentSurcharge = (item: Item, base: number): number =>
  isHighlyEnchanted(item) ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;

const itemSurcharge = (item: Item): number => {
  const base = itemBasePremium(item);
  return cursedSurcharge(item, base) + highEnchantmentSurcharge(item, base);
};

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharge(item), 0);

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;

const isLongStandingCustomer = (customer: Customer | undefined): boolean =>
  (customer?.yearsWithMHPCO ?? 0) >= LOYALTY_THRESHOLD_YEARS;

const loyaltyDiscountFor = (customer: Customer | undefined, base: number): number =>
  isLongStandingCustomer(customer) ? base * LOYALTY_DISCOUNT_RATE : 0;

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const followUpDiscountFor = (isFollowUp: boolean, base: number): number =>
  isFollowUp ? base * FOLLOW_UP_DISCOUNT_RATE : 0;

const quotePremiumFor = (
  step: Step,
  customer: Customer | undefined,
  isFollowUp: boolean,
): number => {
  const items = step.items ?? [];
  const itemsBase = sumItemBasePremiums(items);
  const surcharges =
    sumItemSurcharges(items) + itemsBase * FIRST_INSURANCE_SURCHARGE;
  const discounts =
    loyaltyDiscountFor(customer, itemsBase) +
    followUpDiscountFor(isFollowUp, itemsBase);
  return Math.ceil(itemsBase + surcharges - discounts + PROCESSING_FEE);
};

const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

export function runScenario(scenario: unknown): { results: any[] } {
  const s = scenario as Scenario;
  const policySteps = new Map<number, Step>();
  const remainingCaps = new Map<number, number>();
  const results = s.steps.map((step, index) => {
    if (step.op === "claim") {
      return processClaim(step, policySteps, remainingCaps);
    }
    const items = step.items ?? [];
    validateItemTypes(items);
    policySteps.set(index, step);
    remainingCaps.set(index, sumPolicyInsurance(items) * CAP_MULTIPLIER);
    return { premium: quotePremiumFor(step, s.customer, index > 0) };
  });
  return { results };
}
