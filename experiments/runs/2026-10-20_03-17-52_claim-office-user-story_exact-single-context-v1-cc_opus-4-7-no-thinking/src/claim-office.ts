export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

export interface ScenarioOutput {
  results: Result[];
}

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const itemSurchargeMultiplier = (item: Item): number => {
  let m = 1;
  if (item.cursed) m *= 1.5;
  if ((item.enchantment ?? 0) >= 5) m *= 1.3;
  return m;
};

const basePremiumSum = (items: Item[]): number => {
  const componentGroups: Record<string, Item[]> = {};
  let sum = 0;
  for (const it of items) {
    if (COMPONENT_TYPES.has(it.type)) {
      (componentGroups[it.type] ??= []).push(it);
    } else {
      sum += (BASE_PREMIUM[it.type] ?? 0) * itemSurchargeMultiplier(it);
    }
  }
  for (const group of Object.values(componentGroups)) {
    const count = group.length;
    const blocks = Math.floor(count / 3);
    const singles = count % 3;
    // Apply item-level surcharges per component; use the group member average surcharge isn't right.
    // For blocks of 3, each block covers 3 components; surcharge is per item.
    // Sum per-item surcharges by applying each component's multiplier against its share.
    const perItemBase = (count === 0 ? 0 : (blocks * 60 + singles * 25) / count);
    for (const it of group) sum += perItemBase * itemSurchargeMultiplier(it);
  }
  return sum;
};

interface PolicyState {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

const insuranceSumFor = (items: Item[]): number =>
  items.reduce((s, it) => s + (INSURANCE_VALUE[it.type] ?? 0), 0);

export const processScenario = (scenario: Scenario): ScenarioOutput => {
  let quoteCount = 0;
  const policies: Record<number, PolicyState> = {};
  const results: Result[] = scenario.steps.map((step, idx) => {
    if (step.op === "quote") {
      const base = basePremiumSum(step.items);
      let amount = base;
      if (scenario.customer.yearsWithMHPCO >= 2) amount *= 0.8;
      if (quoteCount === 0) amount *= 1.10;
      else amount *= 0.85;
      quoteCount++;
      const premium = Math.ceil(amount - 1e-9) + 5;
      const insuranceSum = insuranceSumFor(step.items);
      policies[idx] = {
        items: step.items,
        insuranceSum,
        remainingCap: insuranceSum * 2,
      };
      return { premium };
    }
    const policy = policies[step.policy];
    let totalPayout = 0;
    for (const dmg of step.incident.damages) {
      const item = policy.items.find((i) => i.type === dmg.itemType);
      let afterDeductible = dmg.amount - 100;
      if (afterDeductible < 0) afterDeductible = 0;
      let payout = afterDeductible;
      const dragon = item?.material === "dragon";
      const highEnch = (item?.enchantment ?? 0) >= 8;
      if (!dragon && highEnch) payout = payout * 0.5;
      totalPayout += payout;
    }
    // Round in MHPCO's favor = round down for payouts
    let payout = Math.floor(totalPayout + 1e-9);
    if (payout > policy.remainingCap) payout = policy.remainingCap;
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
};
