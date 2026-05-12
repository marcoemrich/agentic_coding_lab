export type ItemType = "sword" | "amulet" | "staff" | "potion" | "component";

export type Item = {
  type: ItemType;
  material: string;
  enchantment: number;
  cursed: boolean;
};

export type Customer = {
  yearsWithMHPCO: number;
};

export type QuoteStep = {
  op: "quote";
  items: Item[];
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
};

export type Scenario = {
  customer: Customer;
  steps: Array<QuoteStep | ClaimStep>;
};

export type QuoteResult = {
  premium: number;
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

export type ScenarioResult = {
  results: Array<QuoteResult | ClaimResult>;
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSED_SURCHARGE_PERCENT = 50;
const LOYALTY_DISCOUNT_PERCENT = 20;

const DEDUCTIBLE = 100;
const BUNDLE_BASE_PREMIUM = 60;

const BASE_PREMIUMS: Record<ItemType, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  component: 25,
};

const INSURANCE_VALUES: Record<ItemType, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  component: 250,
};

export const processScenario = (scenario: Scenario): ScenarioResult => {
  const results: Array<QuoteResult | ClaimResult> = [];
  const caps: Record<number, number> = {};

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      const isBundle = step.items.length === 3 && step.items.every((item) => item.type === "component");
      const base = isBundle ? BUNDLE_BASE_PREMIUM : BASE_PREMIUMS[step.items[0].type];
      const cursedSurcharge = step.items[0].cursed ? CURSED_SURCHARGE_PERCENT : 0;
      const loyaltyDiscount = scenario.customer.yearsWithMHPCO >= 2 ? LOYALTY_DISCOUNT_PERCENT : 0;
      const ratePercent = 100 + FIRST_INSURANCE_SURCHARGE_PERCENT + cursedSurcharge - loyaltyDiscount;
      const premium = Math.ceil(base * ratePercent / 100) + PROCESSING_FEE;
      const insuranceSum = step.items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
      caps[i] = 2 * insuranceSum;
      results.push({ premium });
    } else {
      const totalDamage = step.incident.damages.reduce((sum, damage) => sum + damage.amount, 0);
      const payout = totalDamage - DEDUCTIBLE;
      caps[step.policy] -= payout;
      results.push({ payout, remainingCap: caps[step.policy] });
    }
  }

  return { results };
};
