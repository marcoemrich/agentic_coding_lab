#!/usr/bin/env -S node --import tsx

const PROCESSING_FEE = 5;
const PRICE_LIST: Record<string, { basePremium: number; insuranceValue: number }> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};
const POLICY_CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_PERCENT = 50;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_SURCHARGE_PERCENT = 30;
const INITIAL_ASSESSMENT_PERCENT = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const PERCENT = 100;

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
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

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

type Result = { premium: number } | { payout: number; remainingCap: number }; 

function priceFor(itemType: string): { basePremium: number; insuranceValue: number } {
  const price = PRICE_LIST[itemType];
  if (price === undefined) {
    throw new Error(`Unknown item type: ${itemType}`);
  }
  return price;
}

function percentageOfItemPremiums(
  items: Item[],
  applies: (item: Item) => boolean,
  percent: number,
): number {
  return items.reduce(
    (total, item) => total + (applies(item) ? priceFor(item.type).basePremium * percent / PERCENT : 0),
    0,
  );
}

function calculateBasePremium(items: Item[]): number {
  const unitPremium = items.reduce(
    (total, item) => total + priceFor(item.type).basePremium,
    0,
  );
  const blockCount = COMPONENT_TYPES.filter((type) =>
    items.filter((item) => item.type === type).length === COMPONENT_BLOCK_SIZE
  ).length;
  const blockSaving = COMPONENT_BLOCK_SIZE * priceFor("rune").basePremium - COMPONENT_BLOCK_PREMIUM;
  return unitPremium - blockCount * blockSaving;
}

function calculatePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const basePremium = calculateBasePremium(items);
  const curseSurcharge = percentageOfItemPremiums(
    items,
    (item) => item.cursed === true,
    CURSE_SURCHARGE_PERCENT,
  );
  const enchantmentSurcharge = percentageOfItemPremiums(
    items,
    (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL,
    ENCHANTMENT_SURCHARGE_PERCENT,
  );
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS
    ? basePremium * LOYALTY_DISCOUNT_PERCENT / PERCENT
    : 0;
  const followUpDiscount = isFollowUp
    ? basePremium * FOLLOW_UP_DISCOUNT_PERCENT / PERCENT
    : 0;
  return items.length === 0
    ? PROCESSING_FEE
    : Math.ceil(
      basePremium
      + basePremium * INITIAL_ASSESSMENT_PERCENT / PERCENT
      + curseSurcharge
      + enchantmentSurcharge
      - loyaltyDiscount
      - followUpDiscount
      + PROCESSING_FEE,
    );
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce(
    (total, item) => total + priceFor(item.type).insuranceValue,
    0,
  );
  return { items, remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER };
}

function desiredDamagePayout(damage: Damage, item: Item): number {
  if (damage.amount < 0) {
    throw new Error("Damage amount cannot be negative");
  }
  const reimbursementPercent = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? REDUCED_REIMBURSEMENT_PERCENT
    : PERCENT;
  return Math.max(0, damage.amount * reimbursementPercent / PERCENT - DEDUCTIBLE);
}

function processClaim(step: ClaimStep, policy: Policy): Result {
  const unmatchedItems = [...policy.items];
  const desired = step.incident.damages.reduce((total, damage) => {
    const itemIndex = unmatchedItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) {
      throw new Error(`Damage item is not covered: ${damage.itemType}`);
    }
    const [item] = unmatchedItems.splice(itemIndex, 1);
    return total + desiredDamagePayout(damage, item);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function processScenario(scenario: Scenario): Result[] {
  const policies: Array<Policy | undefined> = [];
  const results: Result[] = [];
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "claim") {
      results.push(processClaim(step, policies[step.policy] as Policy));
      return;
    }
    const premium = calculatePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
    policies[index] = createPolicy(step.items);
    quoteCount += 1;
    results.push({ premium });
  });
  return results;
}

process.stdin.setEncoding("utf8");
let input = "";
process.stdin.on("data", (chunk: string) => {
  input += chunk;
});
process.stdin.on("end", () => {
  const results = processScenario(JSON.parse(input) as Scenario);
  process.stdout.write(JSON.stringify({ results }));
});
