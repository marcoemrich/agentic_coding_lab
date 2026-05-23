const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

type CatalogEntry = { base: number; insurance: number };

const ITEM_CATALOG: Record<string, CatalogEntry> = {
  sword:     { base: 100, insurance: 1000 },
  amulet:    { base:  60, insurance:  600 },
  staff:     { base:  80, insurance:  800 },
  potion:    { base:  40, insurance:  400 },
  rune:      { base:  25, insurance:  250 },
  moonstone: { base:  25, insurance:  250 },
};

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;
type ScenarioResult = { results: StepResult[] };

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const itemBasePremium = (item: Item): number => ITEM_CATALOG[item.type].base;

const groupByType = (items: Item[]): Map<string, Item[]> => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const bucket = groups.get(item.type) ?? [];
    bucket.push(item);
    groups.set(item.type, bucket);
  }
  return groups;
};

const groupBasePremium = (type: string, group: Item[]): number => {
  if (COMPONENT_TYPES.has(type) && group.length === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return group.reduce((sum, item) => sum + itemBasePremium(item), 0);
};

const policyBasePremium = (items: Item[]): number =>
  Array.from(groupByType(items).entries()).reduce(
    (total, [type, group]) => total + groupBasePremium(type, group),
    0,
  );

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

type Customer = { yearsWithMHPCO: number };

const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const curseSurcharge = (item: Item): number =>
  item.cursed ? itemBasePremium(item) * CURSE_SURCHARGE_RATE : 0;

const highEnchantmentSurcharge = (item: Item): number =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD
    ? itemBasePremium(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;

const itemSurcharges = (items: Item[]): number =>
  items.reduce(
    (sum, item) => sum + curseSurcharge(item) + highEnchantmentSurcharge(item),
    0,
  );

const quotePremium = (
  items: Item[],
  customer: Customer,
  isFollowUp: boolean,
): number => {
  const basePremium = policyBasePremium(items);
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
      ? basePremium * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return (
    basePremium +
    itemSurcharges(items) +
    firstInsuranceSurcharge -
    loyaltyDiscount -
    followUpDiscount +
    PROCESSING_FEE
  );
};

const policyInsuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + ITEM_CATALOG[item.type].insurance, 0);

const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const reimbursableAmount = (item: Item, damageAmount: number): number =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
    ? damageAmount * HIGH_ENCHANTMENT_PAYOUT_RATE
    : damageAmount;

const damagePayout = (items: Item[], damage: Damage): number => {
  const item = items.find((i) => i.type === damage.itemType)!;
  return reimbursableAmount(item, damage.amount) - DEDUCTIBLE;
};

const claimPayout = (items: Item[], damages: Damage[]): number =>
  damages.reduce((sum, d) => sum + damagePayout(items, d), 0);

const policyCap = (items: Item[]): number =>
  policyInsuranceSum(items) * CAP_MULTIPLIER;

const countBy = <T>(xs: T[], key: (x: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const x of xs) {
    const k = key(x);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
};

const validateDamageAmounts = (damages: Damage[]): void => {
  for (const d of damages) {
    if (d.amount < 0) {
      throw new Error(`negative damage amount: ${d.amount}`);
    }
  }
};

const validateDamageCounts = (items: Item[], damages: Damage[]): void => {
  const insuredCounts = countBy(items, (i) => i.type);
  const damageCounts = countBy(damages, (d) => d.itemType);
  for (const [type, claimed] of damageCounts) {
    const insured = insuredCounts.get(type) ?? 0;
    if (claimed > insured) {
      throw new Error(`damages contain ${claimed} ${type}(s) but policy covers ${insured}`);
    }
  }
};

const validateIncident = (items: Item[], incident: Incident): void => {
  validateDamageAmounts(incident.damages);
  validateDamageCounts(items, incident.damages);
};

const settleClaim = (
  items: Item[],
  incident: Incident,
  remainingCap: number,
): ClaimResult => {
  validateIncident(items, incident);
  const rawPayout = Math.floor(claimPayout(items, incident.damages));
  const payout = Math.min(rawPayout, remainingCap);
  return { payout, remainingCap: remainingCap - payout };
};

const quoteForPolicy = (
  items: Item[],
  customer: Customer,
  isFollowUp: boolean,
): QuoteResult => ({
  premium: Math.ceil(quotePremium(items, customer, isFollowUp)),
});

type Policy = { items: Item[]; remainingCap: number };

const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in ITEM_CATALOG)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
};

const openPolicy = (items: Item[]): Policy => {
  validateItemTypes(items);
  return { items, remainingCap: policyCap(items) };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies: Policy[] = [];
  const results: StepResult[] = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const isFollowUp = policies.length > 0;
      policies.push(openPolicy(step.items));
      return quoteForPolicy(step.items, scenario.customer, isFollowUp);
    }
    const policy = policies[step.policy];
    const result = settleClaim(policy.items, step.incident, policy.remainingCap);
    policy.remainingCap = result.remainingCap;
    return result;
  });
  return { results };
};
