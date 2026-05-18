const PROCESSING_FEE = 5;

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANT_SURCHARGE = 0.3;
const HIGH_ENCHANT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const DEDUCTIBLE = 100;
const HIGH_ENCHANT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

type Customer = { yearsWithMHPCO: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

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
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_PREMIUM = 60;
const BLOCK_SIZE = 3;

const itemSurcharge = (item: Item): number => {
  const base = BASE_PREMIUMS[item.type];
  const curseSurcharge = item.cursed ? base * CURSE_SURCHARGE : 0;
  const enchantSurcharge =
    (item.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD ? base * HIGH_ENCHANT_SURCHARGE : 0;
  return curseSurcharge + enchantSurcharge;
};

const componentTypePremium = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * BASE_PREMIUMS[type];

const policyBasePremium = (items: Item[]): number => {
  const components = items.filter((item) => COMPONENT_TYPES.has(item.type));
  const nonComponents = items.filter((item) => !COMPONENT_TYPES.has(item.type));
  const nonComponentTotal = nonComponents.reduce((sum, item) => sum + BASE_PREMIUMS[item.type], 0);
  const componentCounts = countBy(components, (item) => item.type);
  const componentTotal = Object.entries(componentCounts).reduce(
    (sum, [type, count]) => sum + componentTypePremium(type, count),
    0,
  );
  return nonComponentTotal + componentTotal;
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

const validateItems = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const quote = (items: Item[], customer: Customer, isFollowUp: boolean): QuoteResult => {
  validateItems(items);
  const base = policyBasePremium(items);
  const surcharges = items.reduce((sum, item) => sum + itemSurcharge(item), 0);
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_THRESHOLD ? -base * LOYALTY_DISCOUNT : 0;
  const firstInsurance = base * FIRST_INSURANCE_SURCHARGE;
  const followUp = isFollowUp ? -base * FOLLOW_UP_DISCOUNT : 0;
  const premium = Math.ceil(base + surcharges + loyalty + firstInsurance + followUp + PROCESSING_FEE);
  return { premium };
};

type Policy = {
  items: Item[];
  remainingCap: number;
};

const reimbursementRate = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANT_PAYOUT_THRESHOLD
    ? HIGH_ENCHANT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

const damagePayout = (damage: Damage, item: Item): number =>
  Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);

const findInsuredItem = (policy: Policy, damage: Damage): Item | undefined =>
  policy.items.find((item) => item.type === damage.itemType);

const countBy = <T>(items: T[], getType: (item: T) => string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const type = getType(item);
    counts[type] = (counts[type] ?? 0) + 1;
  }
  return counts;
};

const validateDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }
};

const validateDamageCounts = (damages: Damage[], items: Item[]): void => {
  const insuredCounts = countBy(items, (item) => item.type);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const type of Object.keys(damageCounts)) {
    if ((insuredCounts[type] ?? 0) < damageCounts[type]) {
      throw new Error(`Claim has more ${type} damages than insured`);
    }
  }
};

const validateDamages = (incident: Incident, policy: Policy): void => {
  validateDamageAmounts(incident.damages);
  validateDamageCounts(incident.damages, policy.items);
};

const grossPayout = (incident: Incident, policy: Policy): number =>
  incident.damages.reduce((sum, damage) => {
    const item = findInsuredItem(policy, damage);
    return item ? sum + damagePayout(damage, item) : sum;
  }, 0);

const claim = (incident: Incident, policy: Policy): ClaimResult => {
  validateDamages(incident, policy);
  const payout = Math.floor(Math.min(grossPayout(incident, policy), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  let quoteCount = 0;
  const policies: Record<number, Policy> = {};
  const results: StepResult[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount += 1;
      const sum = insuranceSum(step.items);
      policies[index] = { items: step.items, remainingCap: sum * 2 };
      return quote(step.items, scenario.customer, isFollowUp);
    } else {
      return claim(step.incident, policies[step.policy]);
    }
  });
  return { results };
};
