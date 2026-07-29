import { readFileSync } from "node:fs";

const STDIN_FD = 0;
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_PERCENT = 10;
const CURSED_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

const BASE_PREMIUMS: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const INSURANCE_VALUES: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const DEDUCTIBLE = 100;
const INSURANCE_CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAUSE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_PRICE = 60;

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

interface QuoteStep {
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  policy: number;
  incident: { damages: Damage[] };
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function surchargeForMatching(
  items: Item[],
  predicate: (item: Item) => boolean,
  percent: number,
): number {
  return items
    .filter(predicate)
    .reduce((sum, item) => sum + percentOf(BASE_PREMIUMS[item.type], percent), 0);
}

function percentOf(amount: number, percent: number): number {
  return (amount * percent) / 100;
}

function enchantmentLevelOf(item: Item | undefined): number {
  return item?.enchantment ?? 0;
}

function buildingBlockSavings(type: string, count: number): number {
  return count === BUILDING_BLOCK_SIZE
    ? BUILDING_BLOCK_SIZE * BASE_PREMIUMS[type] - BUILDING_BLOCK_PRICE
    : 0;
}

function computeBasePremium(items: Item[]): number {
  const countByType = new Map<string, number>();
  for (const item of items) {
    countByType.set(item.type, (countByType.get(item.type) ?? 0) + 1);
  }
  let basePremium = items.reduce((sum, item) => {
    const premium = BASE_PREMIUMS[item.type];
    if (premium === undefined) {
      throw new Error(`unknown item type: ${item.type}`);
    }
    return sum + premium;
  }, 0);
  for (const [type, count] of countByType) {
    basePremium -= buildingBlockSavings(type, count);
  }
  return basePremium;
}

function priceQuoteStep(
  { items }: QuoteStep,
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): { premium: number } {
  const basePremium = computeBasePremium(items);
  const cursedSurcharge = surchargeForMatching(items, (item) => item.cursed ?? false, CURSED_SURCHARGE_PERCENT);
  const highEnchantmentSurcharge = surchargeForMatching(
    items,
    (item) => enchantmentLevelOf(item) >= HIGH_ENCHANTMENT_THRESHOLD,
    HIGH_ENCHANTMENT_SURCHARGE_PERCENT,
  );
  const firstInsuranceSurcharge = percentOf(basePremium, FIRST_INSURANCE_PERCENT);
  const loyaltyDiscount =
    yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? percentOf(basePremium, LOYALTY_DISCOUNT_PERCENT) : 0;
  const followUpDiscount = isFollowUpContract ? percentOf(basePremium, FOLLOW_UP_DISCOUNT_PERCENT) : 0;
  return {
    premium: Math.ceil(
      basePremium +
        cursedSurcharge +
        highEnchantmentSurcharge +
        firstInsuranceSurcharge -
        loyaltyDiscount -
        followUpDiscount +
        PROCESSING_FEE,
    ),
  };
}

function reimbursementFor(damage: Damage, items: Item[]): number {
  const insuredItem = items.find((item) => item.type === damage.itemType);
  return enchantmentLevelOf(insuredItem) >= HIGH_ENCHANTMENT_CLAUSE_THRESHOLD
    ? percentOf(damage.amount, HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT)
    : damage.amount;
}

function settleClaimStep(
  { policy: policyIndex, incident }: ClaimStep,
  policies: Policy[],
): { payout: number; remainingCap: number } {
  const settledPolicy = policies[policyIndex];
  const claimedAmount = incident.damages.reduce(
    (sum, damage) => sum + reimbursementFor(damage, settledPolicy.items) - DEDUCTIBLE,
    0,
  );
  const payout = Math.floor(Math.min(claimedAmount, settledPolicy.remainingCap));
  settledPolicy.remainingCap -= payout;
  return { payout, remainingCap: settledPolicy.remainingCap };
}

const scenario = JSON.parse(readFileSync(STDIN_FD, "utf-8"));
try {
  const policies: Policy[] = [];
  const results = scenario.steps.map((step: QuoteStep & ClaimStep & { op: string }, index: number) => {
    if (step.op === "quote") {
      const insuranceSum = step.items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
      policies[index] = { items: step.items, remainingCap: INSURANCE_CAP_MULTIPLIER * insuranceSum };
      const isFollowUpContract = index > 0;
      return priceQuoteStep(step, scenario.customer.yearsWithMHPCO, isFollowUpContract);
    }
    return settleClaimStep(step, policies);
  });
  console.log(JSON.stringify({ results }));
} catch (error) {
  console.error((error as Error).message);
  process.exit(1);
}
