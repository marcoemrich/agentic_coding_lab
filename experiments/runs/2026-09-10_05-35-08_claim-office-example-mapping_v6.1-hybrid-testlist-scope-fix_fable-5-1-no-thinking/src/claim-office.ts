// ---------------------------------------------------------------------------
// Scenario input and output
// ---------------------------------------------------------------------------

export type Item = { type: string; enchantment?: number; cursed?: boolean };
export type Damage = { itemType: string; amount: number };
export type Incident = { cause: string; damages: Damage[] };
export type QuoteStep = { op: "quote"; items: Item[] };
// A claim references its policy by the zero-based index of the quote step in the scenario.
export type ClaimStep = { op: "claim"; policy: number; incident: Incident };
export type Step = QuoteStep | ClaimStep;
export type Customer = { yearsWithMHPCO: number };
export type Scenario = { customer: Customer; steps: Step[] };

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type Result = QuoteResult | ClaimResult;

// ---------------------------------------------------------------------------
// Price list: each item type has an insurance value and a base premium (10 % of the value).
// ---------------------------------------------------------------------------

type Price = { insuranceValue: number; basePremium: number };

const PRICE_LIST: Record<string, Price> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

const priceOf = (type: string): Price => {
  const price = PRICE_LIST[type];
  if (price === undefined) throw new Error(`Unknown item type: ${type}`);
  return price;
};

const basePremiumOf = (type: string): number => priceOf(type).basePremium;

const insuranceValueOf = (type: string): number => priceOf(type).insuranceValue;

const enchantmentOf = (item: Item): number => item.enchantment ?? 0;

// ---------------------------------------------------------------------------
// Quote: base premium
// ---------------------------------------------------------------------------

// The building block of 3 alike items applies to components only, never to main items.
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const formsComponentBlock = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE;

const countByType = (items: Item[]): Map<string, number> =>
  items.reduce(
    (counts, item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1),
    new Map<string, number>(),
  );

const groupPremium = (type: string, count: number): number =>
  formsComponentBlock(type, count) ? COMPONENT_BLOCK_PREMIUM : count * basePremiumOf(type);

const calculateBasePremium = (items: Item[]): number =>
  [...countByType(items)].reduce((sum, [type, count]) => sum + groupPremium(type, count), 0);

// ---------------------------------------------------------------------------
// Quote: item-specific modifiers are percentages of the affected item's own base premium.
// ---------------------------------------------------------------------------

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;

const shareOfItemBasePremium = (item: Item, rate: number): number => basePremiumOf(item.type) * rate;

const isHighlyEnchanted = (item: Item): boolean => enchantmentOf(item) >= HIGH_ENCHANTMENT_LEVEL;

const curseSurcharge = (item: Item): number =>
  item.cursed ? shareOfItemBasePremium(item, CURSE_SURCHARGE) : 0;

const highEnchantmentSurcharge = (item: Item): number =>
  isHighlyEnchanted(item) ? shareOfItemBasePremium(item, HIGH_ENCHANTMENT_SURCHARGE) : 0;

const calculateItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + curseSurcharge(item) + highEnchantmentSurcharge(item), 0);

// ---------------------------------------------------------------------------
// Quote: policy-wide modifiers are percentages of the policy base premium (sum of all item base premiums).
// ---------------------------------------------------------------------------

const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

const isLoyalCustomer = (customer: Customer): boolean => customer.yearsWithMHPCO >= LOYALTY_YEARS;

const firstInsuranceSurcharge = (basePremium: number): number => basePremium * FIRST_INSURANCE_SURCHARGE;

const loyaltyDiscount = (basePremium: number, customer: Customer): number =>
  isLoyalCustomer(customer) ? basePremium * LOYALTY_DISCOUNT : 0;

const followUpContractDiscount = (basePremium: number, isFollowUpContract: boolean): number =>
  isFollowUpContract ? basePremium * FOLLOW_UP_CONTRACT_DISCOUNT : 0;

const calculatePolicyModifiers = (
  basePremium: number,
  customer: Customer,
  isFollowUpContract: boolean,
): number =>
  firstInsuranceSurcharge(basePremium) -
  loyaltyDiscount(basePremium, customer) -
  followUpContractDiscount(basePremium, isFollowUpContract);

// ---------------------------------------------------------------------------
// Quote: premium
// ---------------------------------------------------------------------------

const PROCESSING_FEE = 5;

// Rounding always favors MHPCO: premiums round up, payouts round down (calculatePayout).
const calculatePremium = (items: Item[], customer: Customer, isFollowUpContract: boolean): number => {
  const basePremium = calculateBasePremium(items);
  return Math.ceil(
    basePremium +
      calculateItemSurcharges(items) +
      calculatePolicyModifiers(basePremium, customer, isFollowUpContract) +
      PROCESSING_FEE,
  );
};

const quote = (step: QuoteStep, customer: Customer, isFollowUpContract: boolean): QuoteResult => ({
  premium: calculatePremium(step.items, customer, isFollowUpContract),
});

// ---------------------------------------------------------------------------
// Claim: reimbursement per damaged item
// ---------------------------------------------------------------------------

const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

const reimbursementRateFor = (item: Item): number =>
  enchantmentOf(item) >= HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL ? HALF_REIMBURSEMENT_RATE : 1;

// Each damage consumes one distinct insured item of its type.
const takeInsuredItemFor = (damage: Damage, availableItems: Item[]): Item => {
  const index = availableItems.findIndex((item) => item.type === damage.itemType);
  if (index === -1) throw new Error(`No insured ${damage.itemType} left to claim damage on`);
  return availableItems.splice(index, 1)[0];
};

// The deductible is charged once per damaged item.
const reimbursementFor = (damage: Damage, insuredItem: Item): number => {
  if (damage.amount < 0) throw new Error(`Invalid damage amount: ${damage.amount}`);
  return damage.amount * reimbursementRateFor(insuredItem) - DEDUCTIBLE;
};

const calculatePayout = (damages: Damage[], insuredItems: Item[]): number => {
  const availableItems = [...insuredItems];
  return Math.floor(
    damages.reduce(
      (sum, damage) => sum + reimbursementFor(damage, takeInsuredItemFor(damage, availableItems)),
      0,
    ),
  );
};

// ---------------------------------------------------------------------------
// Claim: payout limited by the policy's running cap
// ---------------------------------------------------------------------------

const CAP_MULTIPLIER = 2;

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueOf(item.type), 0);

const insuredItemsOf = (step: ClaimStep, scenario: Scenario): Item[] =>
  (scenario.steps[step.policy] as QuoteStep).items;

const claim = (
  step: ClaimStep,
  scenario: Scenario,
  remainingCaps: Map<number, number>,
): ClaimResult => {
  const insuredItems = insuredItemsOf(step, scenario);
  const availableCap =
    remainingCaps.get(step.policy) ?? insuranceSum(insuredItems) * CAP_MULTIPLIER;
  const payout = Math.min(calculatePayout(step.incident.damages, insuredItems), availableCap);
  const remainingCap = availableCap - payout;
  remainingCaps.set(step.policy, remainingCap);
  return { payout, remainingCap };
};

// ---------------------------------------------------------------------------
// Scenario
// ---------------------------------------------------------------------------

const isQuote = (step: Step): step is QuoteStep => step.op === "quote";

// The follow-up discount applies to every contract after the customer's first one.
const isFollowUpContract = (steps: Step[], index: number): boolean =>
  steps.slice(0, index).some(isQuote);

export const runScenario = (scenario: Scenario): { results: Result[] } => {
  const remainingCaps = new Map<number, number>();
  return {
    results: scenario.steps.map((step, index) =>
      isQuote(step)
        ? quote(step, scenario.customer, isFollowUpContract(scenario.steps, index))
        : claim(step, scenario, remainingCaps),
    ),
  };
};
