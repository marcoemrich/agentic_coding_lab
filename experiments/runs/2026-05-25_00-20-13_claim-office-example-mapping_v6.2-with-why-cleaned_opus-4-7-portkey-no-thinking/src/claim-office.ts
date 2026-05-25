export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const EPSILON = 1e-9;

const roundUp = (n: number): number => Math.ceil(n - EPSILON);
const roundDown = (n: number): number => Math.floor(n + EPSILON);

const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

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
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;

const insuranceValue = (type: string): number => INSURANCE_VALUES[type] ?? 0;
const policyCap = (items: Item[]): number =>
  CAP_MULTIPLIER * items.reduce((sum, item) => sum + insuranceValue(item.type), 0);

const COMPONENT_BASE_PREMIUMS: Record<string, number> = {
  rune: 25,
  moonstone: 25,
};

const ITEM_BASE_PREMIUMS: Record<string, number> = {
  ...MAIN_ITEM_BASE_PREMIUMS,
  ...COMPONENT_BASE_PREMIUMS,
};

const COMPONENT_TYPES = new Set(Object.keys(COMPONENT_BASE_PREMIUMS));
const BLOCK_SIZE = 3;
const BLOCK_BASE = 60;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

const itemBase = (type: string): number => ITEM_BASE_PREMIUMS[type] ?? 0;

const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const componentGroupBase = (count: number, unitBase: number): number => {
  if (count === BLOCK_SIZE) return BLOCK_BASE;
  return count * unitBase;
};

const itemSurchargeRate = (item: Item): number => {
  let rate = 0;
  if (item.cursed) rate += CURSE_SURCHARGE_RATE;
  if (enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD) {
    rate += HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return rate;
};

const itemSurcharge = (item: Item, base: number): number =>
  base * itemSurchargeRate(item);

const policyModifierRate = (customer: Customer, priorQuoteCount: number): number => {
  let rate = FIRST_INSURANCE_SURCHARGE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    rate -= LOYALTY_DISCOUNT_RATE;
  }
  if (priorQuoteCount >= 1) {
    rate -= FOLLOWUP_DISCOUNT_RATE;
  }
  return rate;
};

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const countBy = <T>(entries: readonly T[], keyOf: (entry: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const key = keyOf(entry);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const componentsBaseTotal = (components: Item[]): number => {
  let total = 0;
  for (const [type, count] of countBy(components, (item) => item.type)) {
    total += componentGroupBase(count, itemBase(type));
  }
  return total;
};

const mainItemsBaseTotal = (mainItems: Item[]): number =>
  mainItems.reduce((sum, item) => sum + itemBase(item.type), 0);

const mainItemsSurchargeTotal = (mainItems: Item[]): number =>
  mainItems.reduce((sum, item) => sum + itemSurcharge(item, itemBase(item.type)), 0);

const quotePremium = (items: Item[], customer: Customer, priorQuoteCount: number): number => {
  const mainItems = items.filter((item) => !isComponent(item));
  const components = items.filter(isComponent);

  const policyBase = mainItemsBaseTotal(mainItems) + componentsBaseTotal(components);
  const itemSurchargeTotal = mainItemsSurchargeTotal(mainItems);
  const policyModifierTotal = policyBase * policyModifierRate(customer, priorQuoteCount);

  const total = policyBase + itemSurchargeTotal + policyModifierTotal;
  return roundUp(total) + PROCESSING_FEE;
};

const coveredDamageAmount = (insuredItem: Item, damageAmount: number): number => {
  if (enchantmentLevel(insuredItem) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD) {
    return damageAmount * HIGH_ENCHANTMENT_PAYOUT_RATE;
  }
  return damageAmount;
};

const damagePayout = (damage: Damage, insuredItem: Item): number =>
  Math.max(0, coveredDamageAmount(insuredItem, damage.amount) - DEDUCTIBLE);

const findInsuredItem = (items: Item[], itemType: string): Item =>
  items.find((item) => item.type === itemType) as Item;

const totalPayout = (damages: Damage[], items: Item[]): number =>
  damages.reduce(
    (sum, damage) => sum + damagePayout(damage, findInsuredItem(items, damage.itemType)),
    0,
  );

const policyItems = (scenario: Scenario, policyIndex: number): Item[] =>
  (scenario.steps[policyIndex] as QuoteStep).items;

const currentCap = (
  remainingCaps: Map<number, number>,
  policy: number,
  items: Item[],
): number => remainingCaps.get(policy) ?? policyCap(items);

const processClaim = (
  step: ClaimStep,
  scenario: Scenario,
  remainingCaps: Map<number, number>,
): ClaimResult => {
  const items = policyItems(scenario, step.policy);
  const capBefore = currentCap(remainingCaps, step.policy, items);
  const uncappedPayout = roundDown(totalPayout(step.incident.damages, items));
  const payout = Math.min(uncappedPayout, capBefore);
  const remainingCap = capBefore - payout;
  remainingCaps.set(step.policy, remainingCap);
  return { payout, remainingCap };
};

const processStep = (
  step: Step,
  scenario: Scenario,
  priorQuoteCount: number,
  remainingCaps: Map<number, number>,
): StepResult => {
  if (step.op === "quote") {
    return { premium: quotePremium(step.items, scenario.customer, priorQuoteCount) };
  }
  return processClaim(step, scenario, remainingCaps);
};

const KNOWN_ITEM_TYPES = new Set(Object.keys(INSURANCE_VALUES));

const isQuoteStep = (step: Step): step is QuoteStep => step.op === "quote";
const isClaimStep = (step: Step): step is ClaimStep => step.op === "claim";

const quotedItems = (scenario: Scenario): Item[] =>
  scenario.steps.filter(isQuoteStep).flatMap((step) => step.items);

const insuredItemTypes = (scenario: Scenario, policy: number): Set<string> =>
  new Set(policyItems(scenario, policy).map((item) => item.type));

const validateQuotedItemsAreKnown = (scenario: Scenario): void => {
  for (const item of quotedItems(scenario)) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
};

const claimDamages = (scenario: Scenario): { step: ClaimStep; damage: Damage }[] =>
  scenario.steps
    .filter(isClaimStep)
    .flatMap((step) => step.incident.damages.map((damage) => ({ step, damage })));

const validateClaimDamagesReferenceInsuredItems = (scenario: Scenario): void => {
  for (const { step, damage } of claimDamages(scenario)) {
    const insured = insuredItemTypes(scenario, step.policy);
    if (!insured.has(damage.itemType)) {
      throw new Error(`claim references item "${damage.itemType}" not in policy`);
    }
  }
};

const validateClaimDamageAmountsAreNonNegative = (scenario: Scenario): void => {
  for (const { damage } of claimDamages(scenario)) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
  }
};

const validateClaimDamageCountsFitPolicy = (scenario: Scenario): void => {
  for (const step of scenario.steps.filter(isClaimStep)) {
    const insuredCounts = countBy(policyItems(scenario, step.policy), (item) => item.type);
    const damageCounts = countBy(step.incident.damages, (damage) => damage.itemType);
    for (const [type, count] of damageCounts) {
      if (count > (insuredCounts.get(type) ?? 0)) {
        throw new Error(`claim has more "${type}" damages than insured`);
      }
    }
  }
};

export const validateScenario = (scenario: Scenario): void => {
  validateQuotedItemsAreKnown(scenario);
  validateClaimDamagesReferenceInsuredItems(scenario);
  validateClaimDamageAmountsAreNonNegative(scenario);
  validateClaimDamageCountsFitPolicy(scenario);
};

export const processScenario = (scenario: Scenario): ScenarioResult => {
  let priorQuoteCount = 0;
  const remainingCaps = new Map<number, number>();
  const results: StepResult[] = scenario.steps.map((step) => {
    const result = processStep(step, scenario, priorQuoteCount, remainingCaps);
    if (step.op === "quote") priorQuoteCount++;
    return result;
  });
  return { results };
};
