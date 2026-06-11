// claim-office.ts

type Customer = {
  yearsWithMHPCO: number;
};

type Item = {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
};

type Damage = {
  itemType: string;
  amount: number;
};

type Incident = {
  cause: string;
  damages: Damage[];
};

type Step = {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: Incident;
};

type ScenarioInput = {
  customer: Customer;
  steps: Step[];
};

type QuoteResult = {
  premium: number;
};

type ClaimResult = {
  payout: number;
  remainingCap: number;
};

type StepResult = QuoteResult | ClaimResult;

type ScenarioOutput = {
  results: StepResult[];
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;
const DEDUCTIBLE = 100;
const HIGH_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;
const CAP_MULTIPLIER = 2;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isComponentBlock = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE;

const basePremiumFor = (type: string): number => {
  const basePremium = BASE_PREMIUMS[type];
  if (basePremium === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return basePremium;
};

const surchargeFor = (
  items: Item[],
  applies: (item: Item) => boolean,
  rate: number
): number =>
  items.reduce(
    (surcharge, item) =>
      applies(item) ? surcharge + basePremiumFor(item.type) * rate : surcharge,
    0
  );

const isCursed = (item: Item): boolean => item.cursed === true;

const hasEnchantmentAtLeast = (
  item: Item | undefined,
  threshold: number
): boolean => (item?.enchantment ?? 0) >= threshold;

const isHighlyEnchanted = (item: Item): boolean =>
  hasEnchantmentAtLeast(item, HIGH_ENCHANTMENT_THRESHOLD);

const curseSurchargeFor = (items: Item[]): number =>
  surchargeFor(items, isCursed, CURSE_SURCHARGE_RATE);

const enchantmentSurchargeFor = (items: Item[]): number =>
  surchargeFor(items, isHighlyEnchanted, HIGH_ENCHANTMENT_SURCHARGE_RATE);

const groupBasePremium = (type: string, count: number): number =>
  isComponentBlock(type, count)
    ? COMPONENT_BLOCK_BASE_PREMIUM
    : count * basePremiumFor(type);

const countByType = <T>(entries: T[], typeOf: (entry: T) => string) => {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const type = typeOf(entry);
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

const policyBaseFor = (items: Item[]): number => {
  let policyBase = 0;
  for (const [type, count] of countByType(items, (item) => item.type)) {
    policyBase += groupBasePremium(type, count);
  }
  return policyBase;
};

const qualifiesForLoyaltyDiscount = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const quotePremium = (
  items: Item[],
  customer: Customer,
  isFollowUp: boolean
): number => {
  const policyBase = policyBaseFor(items);
  const itemSurcharges =
    curseSurchargeFor(items) + enchantmentSurchargeFor(items);
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = qualifiesForLoyaltyDiscount(customer)
    ? policyBase * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = isFollowUp
    ? policyBase * FOLLOW_UP_DISCOUNT_RATE
    : 0;
  return Math.ceil(
    policyBase +
      itemSurcharges +
      firstInsuranceSurcharge -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE
  );
};

const isFollowUpQuote = (stepIndex: number): boolean => stepIndex > 0;

const insuranceSumFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

const reimbursementRateFor = (damagedItem: Item | undefined): number =>
  hasEnchantmentAtLeast(damagedItem, HIGH_REIMBURSEMENT_ENCHANTMENT_THRESHOLD)
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

const insuredItemFor = (damage: Damage, policyItems: Item[]): Item => {
  const insuredItem = policyItems.find(
    (item) => item.type === damage.itemType
  );
  if (insuredItem === undefined) {
    throw new Error(`Damaged item not covered by policy: ${damage.itemType}`);
  }
  return insuredItem;
};

const payoutForDamage = (damage: Damage, policyItems: Item[]): number =>
  damage.amount * reimbursementRateFor(insuredItemFor(damage, policyItems)) -
  DEDUCTIBLE;

const initialCapFor = (policyItems: Item[]): number =>
  insuranceSumFor(policyItems) * CAP_MULTIPLIER;

const assertDamagesCovered = (damages: Damage[], policyItems: Item[]): void => {
  const insuredCounts = countByType(policyItems, (item) => item.type);
  for (const [type, count] of countByType(
    damages,
    (damage) => damage.itemType
  )) {
    if (count > (insuredCounts.get(type) ?? 0)) {
      throw new Error(
        `More damages of type ${type} than insured items of that type`
      );
    }
  }
};

const assertDamageAmountsNonNegative = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
};

const processClaim = (
  step: Step,
  steps: Step[],
  remainingCaps: Map<number, number>
): ClaimResult => {
  const policyIndex = step.policy!;
  const policyItems = steps[policyIndex].items ?? [];
  const damages = step.incident!.damages;
  assertDamagesCovered(damages, policyItems);
  assertDamageAmountsNonNegative(damages);
  const remainingCap =
    remainingCaps.get(policyIndex) ?? initialCapFor(policyItems);
  const uncappedPayout = damages.reduce(
    (sum, damage) => sum + payoutForDamage(damage, policyItems),
    0
  );
  const payout = Math.floor(Math.min(uncappedPayout, remainingCap));
  const newRemainingCap = remainingCap - payout;
  remainingCaps.set(policyIndex, newRemainingCap);
  return { payout, remainingCap: newRemainingCap };
};

const processQuote = (
  step: Step,
  customer: Customer,
  stepIndex: number
): QuoteResult => ({
  premium: quotePremium(step.items ?? [], customer, isFollowUpQuote(stepIndex)),
});

export const processScenario = (input: ScenarioInput): ScenarioOutput => {
  const remainingCaps = new Map<number, number>();
  const results = input.steps.map((step, index) =>
    step.op === "claim"
      ? processClaim(step, input.steps, remainingCaps)
      : processQuote(step, input.customer, index)
  );
  return { results };
};
