import { readFileSync } from "node:fs";

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_MIN_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_PREMIUM = 60;
const DEDUCTIBLE_PER_ITEM = 100;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_RATE = 0.5;
const CAP_MULTIPLE = 2;
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

function countBy<T>(values: T[], keyOf: (value: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = keyOf(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function premiumForGroup(type: string, count: number): number {
  return count === BUILDING_BLOCK_SIZE ? BUILDING_BLOCK_PREMIUM : count * BASE_PREMIUMS[type];
}

function basePremiumFor(items: Item[]): number {
  let total = 0;
  for (const [type, count] of countBy(items, (item) => item.type)) {
    total += premiumForGroup(type, count);
  }
  return total;
}

const isCursed = (item: Item) => item.cursed ?? false;
const enchantmentOf = (item: Item) => item.enchantment ?? 0;
const hasHighEnchantment = (item: Item) => enchantmentOf(item) >= HIGH_ENCHANTMENT_THRESHOLD;

function surchargeFor(items: Item[], appliesTo: (item: Item) => boolean, rate: number): number {
  return items
    .filter(appliesTo)
    .reduce((sum, item) => sum + BASE_PREMIUMS[item.type] * rate, 0);
}

function cursedSurchargeFor(items: Item[]): number {
  return surchargeFor(items, isCursed, CURSED_SURCHARGE_RATE);
}

function highEnchantmentSurchargeFor(items: Item[]): number {
  return surchargeFor(items, hasHighEnchantment, HIGH_ENCHANTMENT_SURCHARGE_RATE);
}

function loyaltyDiscountFor(yearsWithMHPCO: number, basePremium: number): number {
  return yearsWithMHPCO >= LOYALTY_MIN_YEARS ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
}

function followUpDiscountFor(isFollowUpContract: boolean, basePremium: number): number {
  return isFollowUpContract ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
}

function premiumFor(items: Item[], yearsWithMHPCO: number, isFollowUpContract: boolean): number {
  const basePremium = basePremiumFor(items);
  const cursedSurcharge = cursedSurchargeFor(items);
  const highEnchantmentSurcharge = highEnchantmentSurchargeFor(items);
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = loyaltyDiscountFor(yearsWithMHPCO, basePremium);
  const followUpDiscount = followUpDiscountFor(isFollowUpContract, basePremium);
  return Math.ceil(
    basePremium + cursedSurcharge + highEnchantmentSurcharge + firstInsuranceSurcharge
      - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
  );
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

interface QuoteStep {
  op: "quote";
  items: Item[];
}

type Step = QuoteStep | ClaimStep;

interface Policy {
  items: Item[];
  remainingCap: number;
}

const hasClaimHighEnchantment = (item: Item) =>
  enchantmentOf(item) >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD;

function reimbursementFor(damage: Damage, policy: Policy): number {
  const item = policy.items.find((candidate) => candidate.type === damage.itemType);
  if (!item) {
    throw new Error(`Damaged item is not part of the policy: ${damage.itemType}`);
  }
  const rate = hasClaimHighEnchantment(item) ? CLAIM_HIGH_ENCHANTMENT_RATE : 1;
  return damage.amount * rate - DEDUCTIBLE_PER_ITEM;
}

function uncappedPayoutFor(damages: Damage[], policy: Policy): number {
  return damages.reduce((sum, damage) => sum + reimbursementFor(damage, policy), 0);
}

function assertDamagesCovered(damages: Damage[], policy: Policy): void {
  const claimed = countBy(damages, (damage) => damage.itemType);
  const covered = countBy(policy.items, (item) => item.type);
  for (const [type, count] of claimed) {
    if (count > (covered.get(type) ?? 0)) {
      throw new Error(`Claim reports more damages of type ${type} than the policy covers`);
    }
  }
}

function assertNoNegativeAmounts(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative: ${damage.amount}`);
    }
  }
}

function processClaim(policies: Policy[], step: ClaimStep) {
  const policy = policies[step.policy];
  assertNoNegativeAmounts(step.incident.damages);
  assertDamagesCovered(step.incident.damages, policy);
  const payout = Math.floor(Math.min(uncappedPayoutFor(step.incident.damages, policy), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function processQuote(
  policies: Policy[],
  items: Item[],
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
) {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  policies.push({ items, remainingCap: insuranceSum * CAP_MULTIPLE });
  return { premium: premiumFor(items, yearsWithMHPCO, isFollowUpContract) };
}

function fail(message: string): never {
  process.stderr.write(message + "\n");
  process.exit(1);
}

function assertKnownItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      fail(`Unknown item type: ${item.type}`);
    }
  }
}

try {
  const scenario = JSON.parse(readFileSync(0, "utf8"));
  const policies: Policy[] = [];
  const results = scenario.steps.map((step: Step, index: number) => {
    if (step.op === "claim") {
      return processClaim(policies, step);
    }
    assertKnownItemTypes(step.items);
    return processQuote(policies, step.items, scenario.customer.yearsWithMHPCO, index > 0);
  });
  process.stdout.write(JSON.stringify({ results }));
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
