type Item = {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
  component?: boolean;
};

type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;

type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type Result = QuoteResult | ClaimResult;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const basePremiumFor = (type: string): number => BASE_PREMIUM[type];

const riskMultiplied = (base: number, item: Item): number => {
  let pct = 100;
  if (item.cursed) pct += 50;
  if (item.enchantment >= 5) pct += 30;
  return (base * pct) / 100;
};

const basePremiumForItems = (items: Item[]): number => {
  const mainItems = items.filter((i) => !i.component);
  const components = items.filter((i) => i.component);
  const mainBase = mainItems.reduce(
    (sum, item) => sum + riskMultiplied(basePremiumFor(item.type), item),
    0,
  );
  const componentCounts = new Map<string, number>();
  for (const c of components) {
    componentCounts.set(c.type, (componentCounts.get(c.type) ?? 0) + 1);
  }
  let componentBase = 0;
  for (const count of componentCounts.values()) {
    const blocks = Math.floor(count / 3);
    const singles = count % 3;
    componentBase += blocks * 60 + singles * 25;
  }
  return mainBase + componentBase;
};

const insuranceSumFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + (item.component ? 250 : INSURANCE_VALUE[item.type] ?? 0), 0);

type Policy = { items: Item[]; remainingCap: number };

export const processScenario = (input: Scenario): { results: Result[] } => {
  const loyaltyDiscount = input.customer.yearsWithMHPCO >= 2;
  let contractIndex = 0;
  const policies: Record<number, Policy> = {};

  const results: Result[] = input.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const base = basePremiumForItems(step.items);
      const afterLoyalty = loyaltyDiscount ? (base * 80) / 100 : base;
      const contractPct = contractIndex === 0 ? 110 : 85;
      contractIndex += 1;
      const afterContract = Math.ceil((afterLoyalty * contractPct) / 100);
      const premium = afterContract + 5;
      const insuranceSum = insuranceSumFor(step.items);
      policies[stepIndex] = { items: step.items, remainingCap: insuranceSum * 2 };
      return { premium };
    }
    // claim
    const policy = policies[step.policy];
    let reimbursement = 0;
    for (const dmg of step.incident.damages) {
      const item = policy.items.find((i) => i.type === dmg.itemType);
      if (item && item.material === "dragon") {
        reimbursement += dmg.amount;
      } else if (item && item.enchantment >= 8) {
        reimbursement += Math.floor(dmg.amount / 2);
      } else {
        reimbursement += dmg.amount;
      }
    }
    const afterDeductible = Math.max(0, reimbursement - 100);
    const payout = Math.min(afterDeductible, policy.remainingCap);
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
};
