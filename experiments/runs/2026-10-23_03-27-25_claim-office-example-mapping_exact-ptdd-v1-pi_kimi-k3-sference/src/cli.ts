const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE_PER_ITEM = 100;
const SEVERE_ENCHANTMENT_THRESHOLD = 8;
const SEVERE_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function componentBlockDiscount(items: Array<{ type: string }>): number {
  return COMPONENT_TYPES.filter(
    (component) =>
      items.filter((item) => item.type === component).length === COMPONENT_BLOCK_SIZE,
  ).reduce(
    (sum, component) =>
      sum + COMPONENT_BLOCK_SIZE * BASE_PREMIUMS[component] - COMPONENT_BLOCK_PREMIUM,
    0,
  );
}

function itemPremium(item: { type: string; cursed?: boolean; enchantment?: number }): number {
  const base = BASE_PREMIUMS[item.type];
  const curseSurcharge = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const enchantmentSurcharge =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return base + curseSurcharge + enchantmentSurcharge;
}

function policyBasePremium(items: Array<{ type: string }>): number {
  const flatSum = items.reduce((sum, item) => sum + BASE_PREMIUMS[item.type], 0);
  return flatSum - componentBlockDiscount(items);
}

function quotePremium(
  items: Array<{ type: string; cursed?: boolean; enchantment?: number }>,
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number {
  const policyBase = policyBasePremium(items);
  const itemSurcharges = items.reduce(
    (sum, item) => sum + itemPremium(item) - BASE_PREMIUMS[item.type],
    0,
  );
  const loyaltyDiscount =
    yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUpContract ? policyBase * FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0;
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_RATE;
  return (
    Math.ceil(
      policyBase +
        itemSurcharges +
        firstInsuranceSurcharge -
        loyaltyDiscount -
        followUpDiscount,
    ) + PROCESSING_FEE
  );
}

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Array<{ itemType: string; amount: number }> };
}

function claimPayout(
  policyItems: Item[],
  damages: Array<{ itemType: string; amount: number }>,
): number {
  return damages.reduce((sum, damage) => {
    const item = policyItems.find((candidate) => candidate.type === damage.itemType);
    const reimbursement =
      (item?.enchantment ?? 0) >= SEVERE_ENCHANTMENT_THRESHOLD
        ? damage.amount * SEVERE_ENCHANTMENT_REIMBURSEMENT_RATE
        : damage.amount;
    return sum + Math.max(reimbursement - DEDUCTIBLE_PER_ITEM, 0);
  }, 0);
}

function capForPolicy(items: Item[]): number {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  return insuranceSum * CAP_MULTIPLIER;
}

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

function reject(message: string): never {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function validateQuoteStep(step: QuoteStep): void {
  const unknown = step.items.find((item) => !(item.type in BASE_PREMIUMS));
  if (unknown) {
    reject(`Unknown item type: ${unknown.type}`);
  }
}

function validateClaimStep(step: ClaimStep, policyItems: Item[]): void {
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) {
      reject(`Negative damage amount: ${damage.amount}`);
    }
    if (!(damage.itemType in BASE_PREMIUMS)) {
      reject(`Unknown item type: ${damage.itemType}`);
    }
    if (!policyItems.some((item) => item.type === damage.itemType)) {
      reject(`Damaged item not covered by policy: ${damage.itemType}`);
    }
  }
  const damagedTypes = [...new Set(step.incident.damages.map((damage) => damage.itemType))];
  for (const type of damagedTypes) {
    const damagedCount = step.incident.damages.filter((damage) => damage.itemType === type).length;
    const coveredCount = policyItems.filter((item) => item.type === type).length;
    if (damagedCount > coveredCount) {
      reject(`More damages of type ${type} than the policy covers`);
    }
  }
}

function validateScenario(scenario: Scenario): void {
  const policies: Item[][] = [];
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      validateQuoteStep(step);
      policies[index] = step.items;
    } else {
      validateClaimStep(step, policies[step.policy] ?? []);
    }
  });
}

function runScenario(scenario: Scenario): Array<Record<string, number>> {
  const results: Array<Record<string, number>> = [];
  const remainingCaps: number[] = [];
  const policies: Item[][] = [];
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push({
        premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0),
      });
      remainingCaps[index] = capForPolicy(step.items);
      policies[index] = step.items;
      quoteCount += 1;
    } else {
      const payout = Math.floor(claimPayout(policies[step.policy], step.incident.damages));
      const capped = Math.min(payout, remainingCaps[step.policy]);
      remainingCaps[step.policy] -= capped;
      results.push({ payout: capped, remainingCap: remainingCaps[step.policy] });
    }
  });
  return results;
}

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  const scenario = JSON.parse(input) as Scenario;
  validateScenario(scenario);
  process.stdout.write(JSON.stringify({ results: runScenario(scenario) }));
});
