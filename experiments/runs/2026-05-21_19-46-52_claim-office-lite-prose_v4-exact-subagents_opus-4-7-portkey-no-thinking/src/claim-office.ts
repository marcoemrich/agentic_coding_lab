export type Item = {
  kind: "sword" | "amulet" | "staff" | "potion" | "rune" | "moonstone";
  cursed?: boolean;
  enchantment?: number;
  material?: string;
};

export type QuoteStep = { kind: "quote"; items: Item[] };

export type Damage = { itemType: string; amount: number };

export type ClaimStep = {
  kind: "claim";
  policy: number;
  incident: { cause?: string; damages: Damage[] };
};

export type Step = QuoteStep | ClaimStep;

export type Customer = { yearsWithMHPCO: number };

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type ScenarioResult = {
  results: unknown[];
};

const COMPONENT_BASE_PREMIUM = 25;

const BASE_PREMIUM_BY_ITEM: Record<Item["kind"], number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
};

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const PER_CONTRACT_DISCOUNT_RATE = 0.15;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const PROCESSING_FEE = 5;

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const DRAGON_MATERIAL = "dragon";
const DRAGON_MATERIAL_REIMBURSEMENT_RATE = 1.0;
const DEDUCTIBLE = 100;

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function enchantmentLevel(item: Item): number {
  return item.enchantment ?? 0;
}

function isHighlyEnchanted(item: Item): boolean {
  return enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function qualifiesForHighEnchantmentReimbursement(item: Item): boolean {
  return enchantmentLevel(item) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

function riskMultiplierForItem(item: Item): number {
  return (
    1 +
    (isCursed(item) ? CURSED_SURCHARGE_RATE : 0) +
    (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0)
  );
}

function basePremiumForItem(item: Item): number {
  return BASE_PREMIUM_BY_ITEM[item.kind] * riskMultiplierForItem(item);
}

type QuoteResult = { kind: "quote"; premium: number };
type ClaimResult = { kind: "claim"; payout: number };
type StepResult = QuoteResult | ClaimResult;

function reimbursementRateForItem(item: Item): number {
  if (item.material === DRAGON_MATERIAL) return DRAGON_MATERIAL_REIMBURSEMENT_RATE;
  if (qualifiesForHighEnchantmentReimbursement(item)) return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  return 0;
}

function reimbursementForDamage(damage: Damage, policy: QuoteStep): number {
  const item = policy.items.find((i) => i.kind === damage.itemType);
  if (item === undefined) return 0;
  return damage.amount * reimbursementRateForItem(item);
}

function claimStep(step: ClaimStep, policy: QuoteStep): ClaimResult {
  const reimbursable = step.incident.damages.reduce(
    (sum, damage) => sum + reimbursementForDamage(damage, policy),
    0,
  );
  const payout = Math.max(0, reimbursable - DEDUCTIBLE);
  return { kind: "claim", payout };
}

const BUILDING_BLOCK_BASE_PREMIUM = 60;
const BUILDING_BLOCK_SIZE = 3;
const COMPONENT_KINDS: ReadonlyArray<Item["kind"]> = ["rune", "moonstone"];

type ItemGroup = { kind: Item["kind"]; items: Item[] };

function groupByKind(items: Item[]): ItemGroup[] {
  const groups = new Map<Item["kind"], Item[]>();
  for (const item of items) {
    const group = groups.get(item.kind) ?? [];
    group.push(item);
    groups.set(item.kind, group);
  }
  return Array.from(groups, ([kind, items]) => ({ kind, items }));
}

function isComponentKind(kind: Item["kind"]): boolean {
  return COMPONENT_KINDS.includes(kind);
}

function isBuildingBlock(group: ItemGroup): boolean {
  return group.items.length === BUILDING_BLOCK_SIZE && isComponentKind(group.kind);
}

function basePremiumForGroup(group: ItemGroup): number {
  if (isBuildingBlock(group)) {
    return BUILDING_BLOCK_BASE_PREMIUM;
  }
  return group.items.reduce((sum, item) => sum + basePremiumForItem(item), 0);
}

function basePremiumForItems(items: Item[]): number {
  return groupByKind(items).reduce((sum, group) => sum + basePremiumForGroup(group), 0);
}

function contractSequenceRate(contractIndex: number): number {
  return contractIndex === 0 ? FIRST_INSURANCE_SURCHARGE_RATE : -PER_CONTRACT_DISCOUNT_RATE;
}

function loyaltyRate(customer: Customer): number {
  return customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? -LOYALTY_DISCOUNT_RATE : 0;
}

function customerRateForContract(
  contractIndex: number,
  customer: Customer,
): number {
  return contractSequenceRate(contractIndex) + loyaltyRate(customer);
}

function quoteStep(
  step: QuoteStep,
  contractIndex: number,
  customer: Customer,
): QuoteResult {
  const basePremium = basePremiumForItems(step.items);
  const customerAdjustment = basePremium * customerRateForContract(contractIndex, customer);
  const premium = Math.ceil(basePremium + customerAdjustment + PROCESSING_FEE);
  return { kind: "quote", premium };
}

function processStep(
  step: Step,
  contractIndex: number,
  customer: Customer,
  steps: Step[],
): StepResult {
  if (step.kind === "quote") {
    return quoteStep(step, contractIndex, customer);
  }
  return claimStep(step, steps[step.policy] as QuoteStep);
}

function countQuotesBefore(steps: Step[], index: number): number {
  return steps.slice(0, index).filter((step) => step.kind === "quote").length;
}

export function processScenario(scenario: Scenario): ScenarioResult {
  const results = scenario.steps.map((step, index) =>
    processStep(step, countQuotesBefore(scenario.steps, index), scenario.customer, scenario.steps),
  );
  return { results };
}
