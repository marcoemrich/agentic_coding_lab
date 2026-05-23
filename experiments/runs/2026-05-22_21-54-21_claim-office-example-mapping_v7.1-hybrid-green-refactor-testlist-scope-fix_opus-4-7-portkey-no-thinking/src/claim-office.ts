const PROCESSING_FEE_G = 5;
const BLOCK_SIZE = 3;
const BLOCK_PRICE_G = 60;
const COMPONENT_UNIT_PRICE_G = 25;

const MAIN_ITEM_BASE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const DEDUCTIBLE_G = 100;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

type Item = { type: string; cursed?: boolean; enchantment?: number };
type Damage = { itemType: string; amount: number };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: { cause?: string; damages: Damage[] } };
type Step = QuoteStep | ClaimStep;
type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

const sum = (numbers: number[]): number =>
  numbers.reduce((acc, n) => acc + n, 0);

const componentBaseForGroup = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PRICE_G : count * COMPONENT_UNIT_PRICE_G;

const countByType = <T>(items: T[], typeOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(typeOf(item), (counts.get(typeOf(item)) ?? 0) + 1);
  }
  return counts;
};

const componentBaseTotal = (componentItems: Item[]): number => {
  const counts = countByType(componentItems, (i) => i.type);
  return sum([...counts.values()].map(componentBaseForGroup));
};

const mainItemBase = (item: Item): number => MAIN_ITEM_BASE[item.type] ?? 0;

const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const isCursed = (item: Item): boolean => item.cursed === true;
const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const mainItemModifiers = (item: Item): number => {
  const base = mainItemBase(item);
  const rate =
    (isCursed(item) ? CURSE_RATE : 0) +
    (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_RATE : 0);
  return base * rate;
};

const firstInsuranceSurcharge = (policyBase: number): number => policyBase / 10;

const loyaltyDiscount = (policyBase: number, yearsWithMHPCO: number): number =>
  yearsWithMHPCO >= 2 ? policyBase * 0.2 : 0;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const followUpDiscount = (policyBase: number, isFollowUp: boolean): number =>
  isFollowUp ? policyBase * 0.15 : 0;

const quotePremium = (items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number => {
  const mainItems = items.filter((i) => !isComponent(i));
  const componentItems = items.filter(isComponent);
  const policyBase = sum(mainItems.map(mainItemBase)) + componentBaseTotal(componentItems);
  const itemModifiersTotal = sum(mainItems.map(mainItemModifiers));
  const surcharges = firstInsuranceSurcharge(policyBase);
  const discounts = loyaltyDiscount(policyBase, yearsWithMHPCO) + followUpDiscount(policyBase, isFollowUp);
  return Math.ceil(policyBase + itemModifiersTotal + surcharges - discounts + PROCESSING_FEE_G);
};

const insuranceSum = (items: Item[]): number =>
  sum(items.map((i) => ITEM_INSURANCE_VALUE[i.type] ?? 0));

type Policy = { items: Item[]; remainingCap: number };

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

const isHighEnchantmentClaim = (item: Item | undefined): boolean =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const findDamagedItem = (damage: Damage, items: Item[]): Item | undefined =>
  items.find((i) => i.type === damage.itemType);

const effectiveDamageAmount = (damage: Damage, items: Item[]): number => {
  const item = findDamagedItem(damage, items);
  return isHighEnchantmentClaim(item)
    ? Math.floor(damage.amount * HIGH_ENCHANTMENT_CLAIM_RATE)
    : damage.amount;
};

const damagePayout = (damage: Damage, remainingCap: number, items: Item[]): number =>
  Math.min(effectiveDamageAmount(damage, items) - DEDUCTIBLE_G, remainingCap);

const applyDamages = (
  damages: Damage[],
  startingCap: number,
  items: Item[],
): { payout: number; remainingCap: number } =>
  damages.reduce(
    ({ payout, remainingCap }, damage) => {
      const next = damagePayout(damage, remainingCap, items);
      return { payout: payout + next, remainingCap: remainingCap - next };
    },
    { payout: 0, remainingCap: startingCap },
  );

const initialCap = (items: Item[]): number => 2 * insuranceSum(items);

const isKnownItemType = (type: string): boolean => type in ITEM_INSURANCE_VALUE;

const assertKnownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const assertDamagesCoveredByPolicy = (damages: Damage[], items: Item[]): void => {
  const damageCounts = countByType(damages, (d) => d.itemType);
  const policyCounts = countByType(items, (i) => i.type);
  for (const [type, count] of damageCounts) {
    if (count > (policyCounts.get(type) ?? 0)) {
      throw new Error(`Claim references item not covered by policy: ${type}`);
    }
  }
};

const assertNonNegativeDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative: ${damage.amount}`);
    }
  }
};

export const runScenario = (scenario: unknown): unknown => {
  const { customer, steps } = scenario as Scenario;
  const policies: Record<number, Policy> = {};
  let priorQuoteCount = 0;
  const results = steps.map((step, index) => {
    if (step.op === "quote") {
      assertKnownItemTypes(step.items);
      const isFollowUp = priorQuoteCount > 0;
      priorQuoteCount += 1;
      policies[index] = { items: step.items, remainingCap: initialCap(step.items) };
      return { premium: quotePremium(step.items, customer.yearsWithMHPCO, isFollowUp) };
    }
    const policy = policies[step.policy];
    const { damages } = step.incident;
    assertNonNegativeDamageAmounts(damages);
    assertDamagesCoveredByPolicy(damages, policy.items);
    const result = applyDamages(damages, policy.remainingCap, policy.items);
    policy.remainingCap = result.remainingCap;
    return result;
  });
  return { results };
};
