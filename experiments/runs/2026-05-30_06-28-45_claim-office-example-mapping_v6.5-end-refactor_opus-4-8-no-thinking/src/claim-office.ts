interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

type Step = QuoteStep | ClaimStep;

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const FIRST_INSURANCE_RATE = 0.1;
const PROCESSING_FEE = 5;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const HIGH_DAMAGE_ENCHANTMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const isComponent = (type: string): boolean => COMPONENT_TYPES.includes(type);

const typeBasePremium = (type: string, count: number): number =>
  isComponent(type) && count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * BASE_PREMIUM[type];

const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;

const surchargeForItem = (item: Item): number => {
  const base = BASE_PREMIUM[item.type];
  const curse = item.cursed ? CURSE_RATE * base : 0;
  const highEnchantment =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? HIGH_ENCHANTMENT_RATE * base
      : 0;
  return curse + highEnchantment;
};

const itemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + surchargeForItem(item), 0);

const countBy = <T>(items: T[], keyOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const policyBasePremium = (items: Item[]): number =>
  [...countByType(items)].reduce(
    (total, [type, count]) => total + typeBasePremium(type, count),
    0,
  );

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const policyModifierRate = (customer: Customer, isFollowup: boolean): number =>
  FIRST_INSURANCE_RATE -
  (isLoyal(customer) ? LOYALTY_DISCOUNT_RATE : 0) -
  (isFollowup ? FOLLOWUP_DISCOUNT_RATE : 0);

const isKnownType = (type: string): boolean => type in BASE_PREMIUM;

const validateItems = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const quotePremium = (
  items: Item[],
  customer: Customer,
  isFollowup: boolean,
): number => {
  validateItems(items);
  const policyBase = policyBasePremium(items);
  const policyModifierAmount =
    policyBase * policyModifierRate(customer, isFollowup);
  return Math.ceil(
    policyBase +
      itemSurcharges(items) +
      policyModifierAmount +
      PROCESSING_FEE,
  );
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);

const qualifiesForHalfReimbursement = (item: Item | undefined): boolean =>
  (item?.enchantment ?? 0) >= HIGH_DAMAGE_ENCHANTMENT_THRESHOLD;

const reimbursableAmount = (damage: Damage, item: Item | undefined): number =>
  qualifiesForHalfReimbursement(item)
    ? HALF_REIMBURSEMENT_RATE * damage.amount
    : damage.amount;

const damagePayout = (damage: Damage, policyItems: Item[]): number => {
  const item = policyItems.find((it) => it.type === damage.itemType);
  return reimbursableAmount(damage, item) - DEDUCTIBLE;
};

const assertNonNegativeAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
};

const assertDamagesWithinInsuredCounts = (
  damages: Damage[],
  policyItems: Item[],
): void => {
  const insuredCounts = countByType(policyItems);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [itemType, count] of damageCounts) {
    if (count > (insuredCounts.get(itemType) ?? 0)) {
      throw new Error(
        `Claim rejected: ${count} ${itemType} damages exceed insured count`,
      );
    }
  }
};

const validateDamages = (damages: Damage[], policyItems: Item[]): void => {
  assertNonNegativeAmounts(damages);
  assertDamagesWithinInsuredCounts(damages, policyItems);
};

const claimResult = (
  step: ClaimStep,
  policyItems: Item[],
  remainingCapBefore: number,
): ClaimResult => {
  validateDamages(step.incident.damages, policyItems);
  const rawPayout = step.incident.damages.reduce(
    (sum, damage) => sum + damagePayout(damage, policyItems),
    0,
  );
  const payout = Math.min(Math.floor(rawPayout), remainingCapBefore);
  return { payout, remainingCap: remainingCapBefore - payout };
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

const processClaim = (
  step: ClaimStep,
  policiesByStep: Map<number, Policy>,
): ClaimResult => {
  const policy = policiesByStep.get(step.policy) ?? { items: [], remainingCap: 0 };
  const result = claimResult(step, policy.items, policy.remainingCap);
  policy.remainingCap = result.remainingCap;
  return result;
};

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const policiesByStep = new Map<number, Policy>();
  let quoteCount = 0;
  const results: StepResult[] = [];
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const isFollowup = quoteCount > 0;
      results.push({ premium: quotePremium(step.items, scenario.customer, isFollowup) });
      policiesByStep.set(index, {
        items: step.items,
        remainingCap: CAP_MULTIPLIER * insuranceSum(step.items),
      });
      quoteCount += 1;
    } else {
      results.push(processClaim(step, policiesByStep));
    }
  });
  return { results };
};
