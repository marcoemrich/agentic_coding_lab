type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

// A single catalog per main item type keeps its premium and value together,
// so adding a type is a one-row change instead of edits to two parallel maps.
const MAIN_ITEMS: Record<string, { premium: number; value: number }> = {
  sword: { premium: 100, value: 1000 },
  amulet: { premium: 60, value: 600 },
  staff: { premium: 80, value: 800 },
  potion: { premium: 40, value: 400 },
};

const COMPONENT_VALUE = 250;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isMainItemType = (type: string): boolean => type in MAIN_ITEMS;

const isKnownItemType = (type: string): boolean =>
  isMainItemType(type) || COMPONENT_TYPES.has(type);

const assertKnownItems = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const isMainItem = (item: Item): boolean => isMainItemType(item.type);

const componentPremium = (count: number): number => {
  if (count === BLOCK_SIZE) return BLOCK_PREMIUM;
  return count * COMPONENT_PREMIUM;
};

const countOccurrences = <T>(values: T[]): Map<T, number> => {
  const counts = new Map<T, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
};

const sumMainPremiums = (items: Item[]): number =>
  items
    .filter(isMainItem)
    .reduce((total, item) => total + MAIN_ITEMS[item.type].premium, 0);

const sumComponentPremiums = (items: Item[]): number => {
  const counts = countOccurrences(
    items.filter((item) => !isMainItem(item)).map((item) => item.type),
  );
  return [...counts.values()].reduce(
    (total, count) => total + componentPremium(count),
    0,
  );
};

export const basePremium = (items: Item[]): number =>
  sumMainPremiums(items) + sumComponentPremiums(items);

const itemValue = (item: Item): number =>
  MAIN_ITEMS[item.type]?.value ?? COMPONENT_VALUE;

export const insuranceSum = (items: Item[]): number =>
  items.reduce((total, item) => total + itemValue(item), 0);

const CAP_MULTIPLIER = 2;

export const capFor = (items: Item[]): number =>
  CAP_MULTIPLIER * insuranceSum(items);

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

// MHPCO always rounds premiums in its own favor: up for what the customer
// pays. (Payouts, computed elsewhere, round the other way -- down.)
const roundUpInFavorOfMHPCO = (amount: number): number => Math.ceil(amount);
const roundDownInFavorOfMHPCO = (amount: number): number => Math.floor(amount);

const itemBasePremium = (item: Item): number =>
  MAIN_ITEMS[item.type]?.premium ?? COMPONENT_PREMIUM;

// A missing enchantment counts as zero when comparing against a threshold.
const enchantmentAtLeast = (item: Item, threshold: number): boolean =>
  (item.enchantment ?? 0) >= threshold;

const surcharge = (applies: boolean, base: number, rate: number): number =>
  applies ? base * rate : 0;

const itemSurcharges = (item: Item): number => {
  const base = itemBasePremium(item);
  return (
    surcharge(item.cursed ?? false, base, CURSE_RATE) +
    surcharge(
      enchantmentAtLeast(item, HIGH_ENCHANTMENT_THRESHOLD),
      base,
      HIGH_ENCHANTMENT_RATE,
    )
  );
};

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

const policyWideRate = (
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number => {
  const loyaltyRate =
    yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? -LOYALTY_RATE : 0;
  const followUpRate = isFollowUpContract ? -FOLLOWUP_DISCOUNT_RATE : 0;
  return FIRST_INSURANCE_RATE + loyaltyRate + followUpRate;
};

const quotePremium = (
  items: Item[],
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number => {
  assertKnownItems(items);
  const base = basePremium(items);
  const policyWideModifier =
    base * policyWideRate(yearsWithMHPCO, isFollowUpContract);
  const itemModifiers = items.reduce(
    (total, item) => total + itemSurcharges(item),
    0,
  );
  return roundUpInFavorOfMHPCO(
    base + itemModifiers + policyWideModifier + PROCESSING_FEE,
  );
};

const FULL_REIMBURSEMENT_RATE = 1;

const reimbursementRate = (item: Item): number => {
  const highEnchantment = enchantmentAtLeast(
    item,
    HIGH_ENCHANTMENT_PAYOUT_THRESHOLD,
  );
  return highEnchantment ? HIGH_ENCHANTMENT_PAYOUT_RATE : FULL_REIMBURSEMENT_RATE;
};

const damagePayout = (damage: Damage, item: Item): number =>
  damage.amount * reimbursementRate(item) - DEDUCTIBLE;

const findInsuredItem = (items: Item[], damage: Damage): Item => {
  const item = items.find((candidate) => candidate.type === damage.itemType);
  if (item === undefined) {
    throw new Error(`Damaged item not in policy: ${damage.itemType}`);
  }
  return item;
};

const assertValidDamages = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }
};

const assertDamagesCovered = (damages: Damage[], insuredItems: Item[]): void => {
  const damageCounts = countOccurrences(
    damages.map((damage) => damage.itemType),
  );
  const insuredCounts = countOccurrences(insuredItems.map((item) => item.type));
  for (const [type, count] of damageCounts) {
    if (count > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`More damages of type ${type} than insured`);
    }
  }
};

const desiredPayout = (incident: Incident, insuredItems: Item[]): number => {
  const rawPayout = incident.damages.reduce(
    (total, damage) =>
      total + damagePayout(damage, findInsuredItem(insuredItems, damage)),
    0,
  );
  return roundDownInFavorOfMHPCO(rawPayout);
};

const processClaim = (
  claim: ClaimStep,
  steps: Step[],
  remainingCaps: Map<number, number>,
): { payout: number; remainingCap: number } => {
  const policy = steps[claim.policy] as QuoteStep;
  assertValidDamages(claim.incident.damages);
  assertDamagesCovered(claim.incident.damages, policy.items);
  const capBefore = remainingCaps.get(claim.policy) ?? capFor(policy.items);
  const payout = Math.min(desiredPayout(claim.incident, policy.items), capBefore);
  const remainingCap = capBefore - payout;
  remainingCaps.set(claim.policy, remainingCap);
  return { payout, remainingCap };
};

export const runScenario = (scenario: Scenario): { results: unknown[] } => {
  let hasQuotedBefore = false;
  const remainingCaps = new Map<number, number>();
  const results = scenario.steps.map((step) => {
    if (step.op === "claim") {
      return processClaim(step, scenario.steps, remainingCaps);
    }
    const premium = quotePremium(
      step.items,
      scenario.customer.yearsWithMHPCO,
      hasQuotedBefore,
    );
    hasQuotedBefore = true;
    return { premium };
  });
  return { results };
};
