export type Customer = {
  yearsWithMHPCO: number;
};

export type Step = Record<string, unknown> & { op: string };

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type StepResult = Record<string, number>;

export type ScenarioResult = {
  results: StepResult[];
};

type ItemPricing = { basePremium: number; insuranceValue: number };

const ITEM_PRICING: Record<string, ItemPricing> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
};

const FIRST_INSURANCE_SURCHARGE = 0.10;
const FIRST_INSURANCE_FACTOR = 1 + FIRST_INSURANCE_SURCHARGE;
const SUBSEQUENT_CONTRACT_DISCOUNT = 0.15;
const SUBSEQUENT_CONTRACT_FACTOR = 1 - SUBSEQUENT_CONTRACT_DISCOUNT;
const LOYALTY_DISCOUNT = 0.20;
const LOYALTY_YEARS_THRESHOLD = 2;
const PROCESSING_FEE = 5;

const loyaltyFactor = (customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? 1 - LOYALTY_DISCOUNT : 1;

const contractFactor = (stepIndex: number): number =>
  stepIndex === 0 ? FIRST_INSURANCE_FACTOR : SUBSEQUENT_CONTRACT_FACTOR;

// Rounds up to whole G in MHPCO's favor, guarding against floating-point drift.
const roundUpInFavor = (amount: number): number =>
  Math.ceil(amount - 1e-9);

type Item = {
  type: string;
  category?: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

const COMPONENT_CATEGORY = "component";
const COMPONENT_BASE_PREMIUM = 25;
const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_BASE_PREMIUM = 60;

const isComponent = (item: Item): boolean => item.category === COMPONENT_CATEGORY;

const componentsBasePremium = (components: Item[]): number => {
  const countsByType = new Map<string, number>();
  for (const c of components) {
    countsByType.set(c.type, (countsByType.get(c.type) ?? 0) + 1);
  }
  let total = 0;
  for (const count of countsByType.values()) {
    const blocks = Math.floor(count / BUILDING_BLOCK_SIZE);
    const singles = count - blocks * BUILDING_BLOCK_SIZE;
    total += blocks * BUILDING_BLOCK_BASE_PREMIUM + singles * COMPONENT_BASE_PREMIUM;
  }
  return total;
};

const CURSED_SURCHARGE = 0.50;
const HIGH_ENCHANTMENT_SURCHARGE = 0.30;
const HIGH_ENCHANTMENT_QUOTE_THRESHOLD = 5;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_QUOTE_THRESHOLD;

const itemRiskFactor = (item: Item): number =>
  (item.cursed ? 1 + CURSED_SURCHARGE : 1) *
  (isHighlyEnchanted(item) ? 1 + HIGH_ENCHANTMENT_SURCHARGE : 1);

const mainItemsBasePremium = (mainItems: Item[]): number =>
  mainItems.reduce((sum, item) => sum + ITEM_PRICING[item.type].basePremium * itemRiskFactor(item), 0);

const itemsBasePremium = (items: Item[]): number => {
  const mainItems = items.filter((i) => !isComponent(i));
  const components = items.filter(isComponent);
  return mainItemsBasePremium(mainItems) + componentsBasePremium(components);
};

const COMPONENT_INSURANCE_VALUE = 250;
const PAYOUT_CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;

const itemInsuranceValue = (item: Item): number =>
  isComponent(item) ? COMPONENT_INSURANCE_VALUE : ITEM_PRICING[item.type].insuranceValue;

const itemsInsuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

type Policy = { items: Item[]; remainingCap: number };

type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

const damageReimbursementFactor = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT
    : 1;

const processQuote = (
  step: Step,
  customer: Customer,
  stepIndex: number,
): { result: StepResult; policy: Policy } => {
  const items = step.items as Item[];
  const base = itemsBasePremium(items);
  const premium =
    roundUpInFavor(base * contractFactor(stepIndex) * loyaltyFactor(customer)) +
    PROCESSING_FEE;
  const cap = PAYOUT_CAP_MULTIPLIER * itemsInsuranceSum(items);
  return { result: { premium }, policy: { items, remainingCap: cap } };
};

const damagedItem = (policy: Policy, damage: Damage): Item =>
  policy.items.find((i) => i.type === damage.itemType)!;

const coveredDamage = (damage: Damage, policy: Policy): number =>
  damage.amount * damageReimbursementFactor(damagedItem(policy, damage));

const isDragonMaterial = (item: Item): boolean => item.material === "dragon";

const processClaim = (step: Step, policies: Policy[]): StepResult => {
  const policy = policies[step.policy as number];
  const incident = step.incident as Incident;
  const totalCovered = incident.damages.reduce(
    (sum, d) => sum + coveredDamage(d, policy),
    0,
  );
  const allDragon = incident.damages.every((d) =>
    isDragonMaterial(damagedItem(policy, d)),
  );
  const requestedPayout = totalCovered - (allDragon ? 0 : DEDUCTIBLE);
  const payout = Math.min(requestedPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const processScenario = (scenario: Scenario): ScenarioResult => {
  const policies: Policy[] = [];
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const { result, policy } = processQuote(step, scenario.customer, index);
      policies[index] = policy;
      return result;
    }
    return processClaim(step, policies);
  });
  return { results };
};
