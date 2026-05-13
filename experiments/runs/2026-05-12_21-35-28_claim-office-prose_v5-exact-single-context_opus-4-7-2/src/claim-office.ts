type Item = {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
};

type QuoteStep = { op: "quote"; items: Item[] };

type Damage = { itemType: string; amount: number };

type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};

type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

const MAIN_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const MAIN_INSURANCE_SUM: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_INSURANCE_SUM = 250;

const DEDUCTIBLE = 100;

const basePremiumForItems = (items: Item[]): number => {
  let base = 0;
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    const mainBase = MAIN_BASE_PREMIUM[item.type];
    if (mainBase !== undefined) {
      const cursedMultiplier = item.cursed ? 150 : 100;
      const enchantmentMultiplier = item.enchantment >= 5 ? 130 : 100;
      base += (mainBase * cursedMultiplier * enchantmentMultiplier) / (100 * 100);
    } else {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    }
  }
  for (const count of Object.values(componentCounts)) {
    if (count === 3) {
      base += COMPONENT_BLOCK_PREMIUM;
    } else {
      base += count * COMPONENT_BASE_PREMIUM;
    }
  }
  return base;
};

const insuranceSumForItems = (items: Item[]): number =>
  items.reduce(
    (sum, item) =>
      sum + (MAIN_INSURANCE_SUM[item.type] ?? COMPONENT_INSURANCE_SUM),
    0,
  );

const reimbursementRate = (item: Item | undefined): number => {
  if (item === undefined) return 1;
  if (item.material === "dragon") return 1;
  if (item.enchantment >= 8) return 0.5;
  return 1;
};

export const processScenario = (
  scenario: Scenario,
): { results: Array<{ premium: number } | { payout: number; remainingCap: number }> } => {
  const loyaltyMultiplier =
    scenario.customer.yearsWithMHPCO >= 2 ? 80 : 100;
  const remainingCaps: number[] = [];
  const policyItems: Item[][] = [];
  let quoteCount = 0;

  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const insuranceSum = insuranceSumForItems(step.items);
      remainingCaps[index] = 2 * insuranceSum;
      policyItems[index] = step.items;
      const base = basePremiumForItems(step.items);
      const contractMultiplier = quoteCount === 0 ? 110 : 85;
      quoteCount += 1;
      const premium =
        Math.ceil((base * loyaltyMultiplier * contractMultiplier) / (100 * 100)) + 5;
      return { premium };
    }
    const items = policyItems[step.policy];
    const previousCap = remainingCaps[step.policy];
    const reimbursable = step.incident.damages.reduce((sum, damage) => {
      const item = items.find((i) => i.type === damage.itemType);
      return sum + damage.amount * reimbursementRate(item);
    }, 0);
    const payout = Math.min(previousCap, Math.max(0, reimbursable - DEDUCTIBLE));
    const remainingCap = previousCap - payout;
    remainingCaps[step.policy] = remainingCap;
    return { payout, remainingCap };
  });
  return { results };
};
