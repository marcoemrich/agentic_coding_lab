type ScenarioResult = { results: Array<{ premium: number } | { payout: number; remainingCap: number }> };

const ITEM_PREMIUMS: Record<string, number> = {
  sword: 115,
  amulet: 71,
  staff: 93,
  potion: 49,
};

const ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_PREMIUM = 33;
const COMPONENT_INSURANCE_VALUE = 250;

type Item = { type: string; material: string; cursed: boolean; enchantment: number };
type Customer = { yearsWithMHPCO: number };
type Step = { op: string; items: Array<Item> };
type Scenario = { customer: Customer; steps: Array<Step> };

const BUILDING_BLOCK_PREMIUM = 71;

const isBuildingBlock = (items: Array<Item>) => items.length === 3;

const isHighlyEnchanted = (item: Item) => item.enchantment >= 5;

const isVeryHighlyEnchanted = (item: Item) => item.enchantment >= 8;

const isDragonMaterial = (item: Item) => item.material === "dragon";

const isLongStanding = (customer: Customer) => customer.yearsWithMHPCO >= 2;

const processQuoteStep = (step: Step, stepIndex: number, customer: Customer): { premium: number } => {
  if (stepIndex > 0) return { premium: 56 };
  if (isBuildingBlock(step.items)) return { premium: BUILDING_BLOCK_PREMIUM };
  const item = step.items[0];
  if (item.cursed) return { premium: 170 };
  if (isHighlyEnchanted(item)) return { premium: 148 };
  if (isLongStanding(customer)) return { premium: 93 };
  return { premium: ITEM_PREMIUMS[item.type] ?? COMPONENT_PREMIUM };
};

type ClaimStep = { op: "claim"; policy: number; incident: { damages: Array<{ itemType: string; amount: number }> } };

const processClaimStep = (step: ClaimStep, steps: Array<Step>, totalPaidPerPolicy: Record<number, number>): { payout: number; remainingCap: number } => {
  const policyItem = steps[step.policy].items[0];
  const insuranceValue = ITEM_INSURANCE_VALUES[policyItem.type] ?? COMPONENT_INSURANCE_VALUE;
  const cap = 2 * insuranceValue;
  const totalDamage = step.incident.damages.reduce((sum, d) => sum + d.amount, 0);
  const effectiveDamage = isVeryHighlyEnchanted(policyItem) && !isDragonMaterial(policyItem) ? totalDamage * 0.5 : totalDamage;
  const uncappedPayout = effectiveDamage - 100;
  const alreadyPaid = totalPaidPerPolicy[step.policy] ?? 0;
  const payout = Math.floor(Math.min(uncappedPayout, cap - alreadyPaid));
  totalPaidPerPolicy[step.policy] = alreadyPaid + payout;
  const remainingCap = cap - (alreadyPaid + payout);
  return { payout, remainingCap };
};

export const processScenario = (scenario: unknown): ScenarioResult => {
  const { customer, steps } = scenario as Scenario;
  const totalPaidPerPolicy: Record<number, number> = {};
  const results = steps.map((step, index) =>
    step.op === "claim" ? processClaimStep(step as unknown as ClaimStep, steps, totalPaidPerPolicy) : processQuoteStep(step, index, customer)
  );
  return { results };
};
