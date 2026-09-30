export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export type QuoteStep = { op: "quote"; items: Item[] };
export type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

// MHPCO price list
const COMPONENT = { insuranceValue: 250, basePremium: 25 };
const COMPONENT_TYPES = ["rune", "moonstone"];
const PRICE_LIST: Record<string, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: COMPONENT,
  moonstone: COMPONENT,
};
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

// Rates are integer percentages so amounts stay exact until the final rounding.
const PERCENT = 100;

// Premium modifiers
const CURSE_SURCHARGE = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 30;
const FIRST_INSURANCE_SURCHARGE = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 20;
const FOLLOW_UP_DISCOUNT = 15;
const PROCESSING_FEE = 5;

// Claim processing
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAUSE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 50;
// Dragon material is "fully reimbursed" — identical to the standard rate; the 50 % clause wins over it.
const FULL_REIMBURSEMENT = PERCENT;

const countOfType = (items: Item[], type: string): number =>
  items.filter((item) => item.type === type).length;

export const policyBasePremium = (items: Item[]): number => {
  const listPremium = items.reduce((total, item) => total + PRICE_LIST[item.type].basePremium, 0);
  const blockSavings = BLOCK_SIZE * COMPONENT.basePremium - BLOCK_BASE_PREMIUM;
  const blockCount = COMPONENT_TYPES.filter((type) => countOfType(items, type) === BLOCK_SIZE).length;
  return listPremium - blockCount * blockSavings;
};

const enchantmentAtLeast = (item: Item | undefined, level: number): boolean =>
  (item?.enchantment ?? 0) >= level;

const isHighlyEnchanted = (item: Item): boolean => enchantmentAtLeast(item, HIGH_ENCHANTMENT_THRESHOLD);

// Surcharge in percent-G (G × 100).
const riskSurcharge = (item: Item): number => {
  const curseRate = item.cursed ? CURSE_SURCHARGE : 0;
  const enchantmentRate = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE : 0;
  return PRICE_LIST[item.type].basePremium * (curseRate + enchantmentRate);
};

const riskSurcharges = (items: Item[]): number =>
  items.reduce((total, item) => total + riskSurcharge(item), 0);

const policyModifierRate = (yearsWithMHPCO: number, isFollowUp: boolean): number => {
  const loyaltyRate = yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_DISCOUNT : 0;
  const followUpRate = isFollowUp ? FOLLOW_UP_DISCOUNT : 0;
  return FIRST_INSURANCE_SURCHARGE - loyaltyRate - followUpRate;
};

const quotePremium = (items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number => {
  const policyBase = policyBasePremium(items);
  const premiumInPercentG =
    policyBase * (PERCENT + policyModifierRate(yearsWithMHPCO, isFollowUp)) +
    riskSurcharges(items) +
    PROCESSING_FEE * PERCENT;
  return Math.ceil(premiumInPercentG / PERCENT);
};

const reimbursementRate = (item: Item | undefined): number =>
  enchantmentAtLeast(item, HIGH_ENCHANTMENT_CLAUSE_THRESHOLD) ? HIGH_ENCHANTMENT_REIMBURSEMENT : FULL_REIMBURSEMENT;

// Payout in percent-G (G × 100).
const damagePayout = (damage: Damage, insuredItems: Item[]): number => {
  const item = insuredItems.find((insured) => insured.type === damage.itemType);
  return damage.amount * reimbursementRate(item) - DEDUCTIBLE * PERCENT;
};

const claimPayout = (damages: Damage[], insuredItems: Item[]): number => {
  const payoutInPercentG = damages.reduce((total, damage) => total + damagePayout(damage, insuredItems), 0);
  return Math.floor(payoutInPercentG / PERCENT);
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + PRICE_LIST[item.type].insuranceValue, 0);

const policyCap = (items: Item[]): number => CAP_MULTIPLIER * insuranceSum(items);

const insuredItemsOf = (steps: Step[], policyIndex: number): Item[] => (steps[policyIndex] as QuoteStep).items;

const assertValidDamages = (damages: Damage[], insuredItems: Item[]): void => {
  for (const itemType of new Set(damages.map((damage) => damage.itemType))) {
    const insuredCount = countOfType(insuredItems, itemType);
    const damagedCount = damages.filter((damage) => damage.itemType === itemType).length;
    if (insuredCount === 0) throw new Error(`Damaged item not insured by policy: ${itemType}`);
    if (damagedCount > insuredCount) throw new Error(`More ${itemType} damages than insured`);
  }
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) throw new Error(`Damage amount must not be negative: ${negative.amount}`);
};

const processClaim = (step: ClaimStep, steps: Step[], remainingCaps: Map<number, number>): Result => {
  const insuredItems = insuredItemsOf(steps, step.policy);
  assertValidDamages(step.incident.damages, insuredItems);
  const capBefore = remainingCaps.get(step.policy) ?? policyCap(insuredItems);
  const desiredPayout = claimPayout(step.incident.damages, insuredItems);
  const payout = Math.min(desiredPayout, capBefore);
  const remainingCap = capBefore - payout;
  remainingCaps.set(step.policy, remainingCap);
  return { payout, remainingCap };
};

const assertKnownItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !(item.type in PRICE_LIST));
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
};

const processQuote = (step: QuoteStep, earlierSteps: Step[], yearsWithMHPCO: number): Result => {
  assertKnownItemTypes(step.items);
  const isFollowUp = earlierSteps.some((earlier) => earlier.op === "quote");
  return { premium: quotePremium(step.items, yearsWithMHPCO, isFollowUp) };
};

export const runScenario = (scenario: Scenario): { results: Result[] } => {
  const { steps, customer } = scenario;
  const remainingCaps = new Map<number, number>();
  const results = steps.map((step, index) =>
    step.op === "claim"
      ? processClaim(step, steps, remainingCaps)
      : processQuote(step, steps.slice(0, index), customer.yearsWithMHPCO),
  );
  return { results };
};
