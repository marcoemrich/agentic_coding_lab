interface QuoteStep {
  op: "quote";
  items: object[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Array<{ itemType: string; amount: number }> };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const CAP_MULTIPLIER = 2;
const HIGH_CLAIM_ENCHANTMENT = 8;
const HIGH_CLAIM_REIMBURSEMENT_PERCENT = 50;
const DEDUCTIBLE = 100;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_UNIT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_DISCOUNT = COMPONENT_BLOCK_SIZE * COMPONENT_UNIT_PREMIUM - COMPONENT_BLOCK_PREMIUM;
const COMPONENT_TYPES = ["rune", "moonstone"];
const CURSE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_PERCENT = 30;
const LOYALTY_YEARS = 2;
const LOYALTY_PERCENT = 20;
const INITIAL_ASSESSMENT_PERCENT = 10;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const PROCESSING_FEE = 5;
const PERCENT = 100;

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

const calculateBasePremium = (items: Item[]) => {
  const additivePremium = items.reduce((total, item) => total + BASE_PREMIUMS[item.type], 0);
  const blockDiscount = COMPONENT_TYPES.reduce((discount, type) => {
    const count = items.filter((item) => item.type === type).length;
    return discount + (count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_DISCOUNT : 0);
  }, 0);
  return additivePremium - blockDiscount;
};

const itemSurcharge = (items: Item[], percentage: number, applies: (item: Item) => boolean) =>
  items.reduce(
    (total, item) => total + (applies(item) ? (BASE_PREMIUMS[item.type] * percentage) / PERCENT : 0),
    0,
  );

const calculateQuote = (step: QuoteStep, yearsWithMHPCO: number, contractIndex: number) => {
  const items = step.items as Item[];
  if (items.some((item) => BASE_PREMIUMS[item.type] === undefined)) throw new Error("Unknown item type");
  const basePremium = calculateBasePremium(items);
  const curseSurcharge = itemSurcharge(items, CURSE_PERCENT, (item) => item.cursed === true);
  const enchantmentSurcharge = itemSurcharge(
    items,
    HIGH_ENCHANTMENT_PERCENT,
    (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL,
  );
  const assessment = (basePremium * INITIAL_ASSESSMENT_PERCENT) / PERCENT;
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? (basePremium * LOYALTY_PERCENT) / PERCENT : 0;
  const followUpDiscount = contractIndex > 0 ? (basePremium * FOLLOW_UP_DISCOUNT_PERCENT) / PERCENT : 0;
  return {
    premium: Math.ceil(
      basePremium + curseSurcharge + enchantmentSurcharge + assessment - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
    ),
  };
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

const calculateClaim = (step: ClaimStep, policy: Policy) => {
  const availableItems = [...policy.items];
  const desiredPayout = step.incident.damages.reduce((total, damage) => {
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
    const itemIndex = availableItems.findIndex(({ type }) => type === damage.itemType);
    if (itemIndex < 0) throw new Error("Damage does not match an insured item");
    const [item] = availableItems.splice(itemIndex, 1);
    const reimbursementPercent = (item.enchantment ?? 0) >= HIGH_CLAIM_ENCHANTMENT
      ? HIGH_CLAIM_REIMBURSEMENT_PERCENT
      : PERCENT;
    return total + (damage.amount * reimbursementPercent) / PERCENT - DEDUCTIBLE;
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const processScenario = (scenario: Scenario) => {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") return calculateClaim(step, policies.get(step.policy)!);
    const items = step.items as Item[];
    const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
    policies.set(stepIndex, { items, remainingCap: insuranceSum * CAP_MULTIPLIER });
    return calculateQuote(step, scenario.customer.yearsWithMHPCO, quoteCount++);
  });
  return { results };
};
