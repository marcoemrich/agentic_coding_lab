const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const ALIKE_BLOCK_SIZE = 3;
const ALIKE_BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };
type Policy = { items: Item[]; cap: number };

const isKnownItemType = (type: string): boolean => type in BASE_PREMIUM;

const assertKnownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const basePremiumOf = (item: Item): number => BASE_PREMIUM[item.type];

const groupByType = (items: Item[]): Item[][] => {
  const groups = Map.groupBy(items, (item) => item.type);
  return Array.from(groups.values());
};

const sumBasePremiums = (items: Item[]): number =>
  items.reduce((acc, item) => acc + basePremiumOf(item), 0);

const basePremiumForGroup = (group: Item[]): number =>
  group.length === ALIKE_BLOCK_SIZE ? ALIKE_BLOCK_PREMIUM : sumBasePremiums(group);

const basePremiumForItems = (items: Item[]): number =>
  groupByType(items).reduce((sum, group) => sum + basePremiumForGroup(group), 0);

const cursedSurcharge = (item: Item): number =>
  item.cursed ? basePremiumOf(item) * CURSED_SURCHARGE_RATE : 0;

const highEnchantmentSurcharge = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? basePremiumOf(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;

const itemSurcharges = (items: Item[]): number =>
  items.reduce(
    (sum, item) => sum + cursedSurcharge(item) + highEnchantmentSurcharge(item),
    0,
  );

const firstInsuranceSurcharge = (basePremium: number): number =>
  basePremium * FIRST_INSURANCE_SURCHARGE_RATE;

const loyaltyDiscount = (basePremium: number, customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? basePremium * LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscount = (basePremium: number, isFollowUp: boolean): number =>
  isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;

const quotePremium = (items: Item[], customer: Customer, isFollowUp: boolean): number => {
  const basePremium = basePremiumForItems(items);
  return (
    Math.ceil(
      basePremium +
        itemSurcharges(items) +
        firstInsuranceSurcharge(basePremium) -
        loyaltyDiscount(basePremium, customer) -
        followUpDiscount(basePremium, isFollowUp),
    ) + PROCESSING_FEE
  );
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);

const reimbursableAmount = (item: Item, damageAmount: number): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
    ? damageAmount * HIGH_ENCHANTMENT_PAYOUT_RATE
    : damageAmount;

const payoutForDamage = (item: Item, damage: Damage): number =>
  reimbursableAmount(item, damage.amount) - DEDUCTIBLE;

const openPolicy = (items: Item[]): Policy => ({
  items,
  cap: insuranceSum(items) * CAP_MULTIPLIER,
});

const findItem = (policy: Policy, itemType: string): Item =>
  policy.items.find((i) => i.type === itemType) as Item;

const countDamagesByType = (damages: Damage[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const damage of damages) {
    counts.set(damage.itemType, (counts.get(damage.itemType) ?? 0) + 1);
  }
  return counts;
};

const policyItemCount = (policy: Policy, itemType: string): number =>
  policy.items.filter((item) => item.type === itemType).length;

const assertDamagesCoveredByPolicy = (policy: Policy, damages: Damage[]): void => {
  for (const [itemType, count] of countDamagesByType(damages)) {
    if (count > policyItemCount(policy, itemType)) {
      throw new Error(`Damage references item not in policy: ${itemType}`);
    }
  }
};

const assertNonNegativeDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
};

const settleClaim = (policy: Policy, incident: Incident): { payout: number; remainingCap: number } => {
  const payoutFor = (damage: Damage) => payoutForDamage(findItem(policy, damage.itemType), damage);
  const desiredPayout = incident.damages.reduce((sum, damage) => sum + payoutFor(damage), 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.cap));
  return { payout, remainingCap: policy.cap - payout };
};

export const runScenario = (scenario: Scenario): unknown => {
  const policies: Policy[] = [];

  const handleQuote = (step: QuoteStep) => {
    assertKnownItemTypes(step.items);
    const isFollowUp = policies.length > 0;
    policies.push(openPolicy(step.items));
    return { premium: quotePremium(step.items, scenario.customer, isFollowUp) };
  };

  const handleClaim = (step: ClaimStep) => {
    const policy = policies[step.policy];
    assertNonNegativeDamageAmounts(step.incident.damages);
    assertDamagesCoveredByPolicy(policy, step.incident.damages);
    const result = settleClaim(policy, step.incident);
    policies[step.policy] = { ...policy, cap: result.remainingCap };
    return result;
  };

  const results = scenario.steps.map((step) =>
    step.op === "claim" ? handleClaim(step) : handleQuote(step),
  );
  return { results };
};
