const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

const INSURANCE_SUM_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const DEDUCTIBLE = 100;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const itemBaseAndSurcharges = (item: Item): { base: number; surcharges: number } => {
  const basePremium = BASE_PREMIUM_BY_TYPE[item.type];
  const cursedSurcharge = item.cursed === true ? basePremium * 0.5 : 0;
  const highEnchantmentSurcharge =
    (item.enchantment ?? 0) >= 5 ? basePremium * 0.3 : 0;
  return { base: basePremium, surcharges: cursedSurcharge + highEnchantmentSurcharge };
};

const componentGroupBasePremium = (type: string, count: number): number => {
  if (count === BLOCK_SIZE) return BLOCK_BASE_PREMIUM;
  return count * BASE_PREMIUM_BY_TYPE[type];
};

const quotePremium = (items: Item[], customer: { yearsWithMHPCO: number }, isFollowUp: boolean): number => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM_BY_TYPE)) {
      throw new Error(`Unknown item type in quote: ${item.type}`);
    }
  }
  const componentItems = items.filter((item) => COMPONENT_TYPES.has(item.type));
  const mainItems = items.filter((item) => !COMPONENT_TYPES.has(item.type));

  const mainBaseTotal = mainItems.reduce((sum, item) => sum + itemBaseAndSurcharges(item).base, 0);
  const mainSurchargeTotal = mainItems.reduce((sum, item) => sum + itemBaseAndSurcharges(item).surcharges, 0);

  const countsByType = componentItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] ?? 0) + 1;
    return acc;
  }, {});

  const componentBaseTotal = Object.entries(countsByType).reduce(
    (sum, [type, count]) => sum + componentGroupBasePremium(type, count),
    0,
  );

  const policyBase = mainBaseTotal + componentBaseTotal;
  const loyaltyDiscount = customer.yearsWithMHPCO >= 2 ? policyBase * 0.2 : 0;
  const followUpDiscount = isFollowUp ? policyBase * 0.15 : 0;
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_SURCHARGE_RATE;

  return Math.ceil(policyBase + mainSurchargeTotal - loyaltyDiscount - followUpDiscount + firstInsuranceSurcharge + PROCESSING_FEE);
};

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const remainingCapByPolicy: Record<number, number> = {};
  const itemsByPolicy: Record<number, Item[]> = {};
  let quoteCount = 0;
  const results: StepResult[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer, quoteCount > 0);
      quoteCount += 1;
      const insuranceSum = step.items.reduce((sum, item) => sum + (INSURANCE_SUM_BY_TYPE[item.type] ?? 0), 0);
      remainingCapByPolicy[index] = 2 * insuranceSum;
      itemsByPolicy[index] = step.items;
      return { premium };
    }
    let payout = 0;
    let remainingCap = remainingCapByPolicy[step.policy];
    const policyItems = itemsByPolicy[step.policy];
    for (const damage of step.incident.damages) {
      if (damage.amount < 0) {
        throw new Error(`Negative damage amount: ${damage.amount}`);
      }
      const item = policyItems.find((i) => i.type === damage.itemType);
      if (item === undefined) {
        throw new Error(`Unknown item type in claim: ${damage.itemType}`);
      }
      const reimbursable = (item.enchantment ?? 0) >= 8 ? damage.amount * 0.5 : damage.amount;
      const rawPayout = Math.max(0, reimbursable - DEDUCTIBLE);
      const cappedPayout = Math.floor(Math.min(rawPayout, remainingCap));
      payout += cappedPayout;
      remainingCap -= cappedPayout;
    }
    remainingCapByPolicy[step.policy] = remainingCap;
    return { payout, remainingCap };
  });
  return { results };
};
