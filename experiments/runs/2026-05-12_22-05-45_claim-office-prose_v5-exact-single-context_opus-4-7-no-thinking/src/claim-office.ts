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
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const MAIN_ITEM_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const MAIN_ITEM_INSURANCE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_INSURANCE = 250;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const isComponent = (item: Item): boolean =>
  MAIN_ITEM_PREMIUM[item.type] === undefined;

// Per-item base premium share. 3 alike components → 60 G total (20 each); rest 25 G.
const itemBasePremiums = (items: Item[]): number[] => {
  const componentIndices: Record<string, number[]> = {};
  const shares = new Array<number>(items.length).fill(0);
  items.forEach((item, idx) => {
    if (isComponent(item)) {
      (componentIndices[item.type] ??= []).push(idx);
    } else {
      shares[idx] = MAIN_ITEM_PREMIUM[item.type];
    }
  });
  for (const indices of Object.values(componentIndices)) {
    const blocks = Math.floor(indices.length / COMPONENT_BLOCK_SIZE);
    const blocked = blocks * COMPONENT_BLOCK_SIZE;
    const blockShare = COMPONENT_BLOCK_PREMIUM / COMPONENT_BLOCK_SIZE;
    indices.forEach((idx, i) => {
      shares[idx] = i < blocked ? blockShare : COMPONENT_PREMIUM;
    });
  }
  return shares;
};

const insuranceValueOf = (item: Item): number =>
  MAIN_ITEM_INSURANCE[item.type] ?? COMPONENT_INSURANCE;

const itemPremium = (item: Item, base: number): number => {
  let premium = base;
  if (item.cursed) premium = (premium * 150) / 100;
  if (item.enchantment >= 5) premium = (premium * 130) / 100;
  return premium;
};

type Policy = {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
};

const computeQuote = (
  items: Item[],
  yearsWithMHPCO: number,
  isFirstContract: boolean,
): number => {
  const bases = itemBasePremiums(items);
  const subtotal = items.reduce(
    (sum, item, i) => sum + itemPremium(item, bases[i]),
    0,
  );
  let amount = subtotal * 100;
  amount = (amount * (isFirstContract ? 110 : 85)) / 100;
  if (yearsWithMHPCO >= 2) amount = (amount * 80) / 100;
  return Math.ceil(amount / 100) + 5;
};

type CoveredDamage = { amount: number; bypassDeductible: boolean };

const coverFor = (policy: Policy, damage: Damage): CoveredDamage => {
  const item = policy.items.find((it) => it.type === damage.itemType);
  if (item?.material === "dragon") {
    return { amount: damage.amount, bypassDeductible: true };
  }
  if (item && item.enchantment >= 8) {
    return { amount: damage.amount / 2, bypassDeductible: false };
  }
  return { amount: damage.amount, bypassDeductible: false };
};

const processClaim = (policy: Policy, damages: Damage[]): ClaimResult => {
  const covers = damages.map((d) => coverFor(policy, d));
  const dragonAmount = covers
    .filter((c) => c.bypassDeductible)
    .reduce((sum, c) => sum + c.amount, 0);
  const regularAmount = covers
    .filter((c) => !c.bypassDeductible)
    .reduce((sum, c) => sum + c.amount, 0);
  const regularAfterDeductible = Math.max(0, regularAmount - DEDUCTIBLE);
  const desired = Math.floor(dragonAmount + regularAfterDeductible);
  const payout = Math.min(desired, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  let contractsSoFar = 0;
  const policies: Policy[] = [];
  const results: StepResult[] = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const premium = computeQuote(
        step.items,
        scenario.customer.yearsWithMHPCO,
        contractsSoFar === 0,
      );
      contractsSoFar += 1;
      const insuranceSum = step.items.reduce(
        (sum, item) => sum + insuranceValueOf(item),
        0,
      );
      policies.push({
        items: step.items,
        insuranceSum,
        remainingCap: insuranceSum * CAP_MULTIPLIER,
      });
      return { premium };
    }
    return processClaim(policies[step.policy], step.incident.damages);
  });
  return { results };
};
