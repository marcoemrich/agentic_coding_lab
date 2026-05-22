// --- Domain types ---

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;

type Customer = { yearsWithMHPCO: number };
type Input = { customer: Customer; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number };

// --- Pricing constants ---

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPE = "rune";
const COMPONENT_SINGLE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_QUOTE_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_QUOTE_THRESHOLD = 5;

const FIRST_INSURANCE_SURCHARGE = 0.1;
const SUBSEQUENT_CONTRACT_DISCOUNT = 0.15;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const PROCESSING_FEE = 5;

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_PAYOUT_RATIO = 0.5;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const DRAGON_MATERIAL = "dragon";

// --- Quote pricing ---

const isComponent = (item: Item): boolean => item.type === COMPONENT_TYPE;

const componentsPremium = (count: number): number => {
  const blocks = Math.floor(count / COMPONENT_BLOCK_SIZE);
  const singles = count % COMPONENT_BLOCK_SIZE;
  return blocks * COMPONENT_BLOCK_PREMIUM + singles * COMPONENT_SINGLE_PREMIUM;
};

const itemSurcharge = (item: Item): number => {
  const cursed = item.cursed ? CURSED_SURCHARGE : 0;
  const highlyEnchanted =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_QUOTE_THRESHOLD
      ? HIGH_ENCHANTMENT_QUOTE_SURCHARGE
      : 0;
  return cursed + highlyEnchanted;
};

const mainItemPremium = (item: Item): number =>
  BASE_PREMIUMS[item.type] * (1 + itemSurcharge(item));

const itemsBasePremium = (items: Item[]): number => {
  const componentCount = items.filter(isComponent).length;
  const mainTotal = items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + mainItemPremium(item), 0);
  return mainTotal + componentsPremium(componentCount);
};

const customerModifier = (customer: Customer, isFirstQuote: boolean): number => {
  const contractModifier = isFirstQuote
    ? FIRST_INSURANCE_SURCHARGE
    : -SUBSEQUENT_CONTRACT_DISCOUNT;
  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? -LOYALTY_DISCOUNT : 0;
  return contractModifier + loyalty;
};

const roundUpInFavorOfMHPCO = (value: number): number => {
  const epsilon = 1e-9;
  return Math.ceil(value - epsilon);
};

const quote = (
  items: Item[],
  customer: Customer,
  isFirstQuote: boolean,
): QuoteResult => {
  const base = itemsBasePremium(items);
  const adjusted = base * (1 + customerModifier(customer, isFirstQuote));
  return { premium: roundUpInFavorOfMHPCO(adjusted) + PROCESSING_FEE };
};

// --- Claim payout ---

const reimbursementFor = (damage: Damage, policyItems: Item[]): number => {
  const insured = policyItems.find((item) => item.type === damage.itemType);
  if (insured?.material === DRAGON_MATERIAL) return damage.amount;
  if ((insured?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATIO;
  }
  return damage.amount;
};

const claim = (incident: Incident, policyItems: Item[]): ClaimResult => {
  const reimbursement = incident.damages.reduce(
    (sum, damage) => sum + reimbursementFor(damage, policyItems),
    0,
  );
  return { payout: reimbursement - DEDUCTIBLE };
};

// --- Scenario runner ---

export const run = (input: Input): { results: (QuoteResult | ClaimResult)[] } => {
  let quoteCount = 0;
  const results = input.steps.map((step) => {
    if (step.op === "claim") {
      const policy = input.steps[step.policy] as QuoteStep;
      return claim(step.incident, policy.items);
    }
    const isFirstQuote = quoteCount === 0;
    quoteCount += 1;
    return quote(step.items, input.customer, isFirstQuote);
  });
  return { results };
};
