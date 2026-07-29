import { readFileSync } from "node:fs";

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const WHOLE_PERCENT = 100;
const BASE_PREMIUMS: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const CURSED_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_MIN_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const STDIN_FD = 0;

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { damages: Damage[] };
}

type Step = QuoteStep | ClaimStep;

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

/** Percentage of an amount, integer-first to avoid float rounding. */
function percentOf(amount: number, percent: number): number {
  return (amount * percent) / WHOLE_PERCENT;
}

/** An item's enchantment level; items without imbue count as 0. */
function enchantmentOf(item: Item): number {
  return item.enchantment ?? 0;
}

/** An item counts as highly enchanted at enchantment level 5 or above. */
function isHighEnchantment(item: Item): boolean {
  return enchantmentOf(item) >= HIGH_ENCHANTMENT_THRESHOLD;
}

/** All per-item surcharges: first insurance always; cursed and high-enchantment when applicable. */
function surchargesFor(item: Item, unitPremium: number): number {
  return (
    percentOf(unitPremium, FIRST_INSURANCE_SURCHARGE_PERCENT) +
    percentWhen(item.cursed, unitPremium, CURSED_SURCHARGE_PERCENT) +
    percentWhen(isHighEnchantment(item), unitPremium, HIGH_ENCHANTMENT_SURCHARGE_PERCENT)
  );
}

/** Count items by type, e.g. 2 runes + 1 moonstone -> { rune: 2, moonstone: 1 }. */
function countByType(items: Item[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return counts;
}

/** Base for `count` alike items: exactly BLOCK_SIZE form a building block at flat BLOCK_BASE_PREMIUM. */
function basePremiumFor(count: number, unitPremium: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * unitPremium;
}

/** Policy base premium: block-adjusted sum over item types. */
function policyBasePremium(items: Item[]): number {
  return Object.entries(countByType(items)).reduce(
    (total, [type, count]) => total + basePremiumFor(count, BASE_PREMIUMS[type]),
    0,
  );
}

/** Sum of per-item surcharges across the policy. */
function totalItemSurcharges(items: Item[]): number {
  return items.reduce((total, item) => total + surchargesFor(item, BASE_PREMIUMS[item.type]), 0);
}

/** Percentage of an amount when a condition applies, otherwise nothing. */
function percentWhen(applies: boolean | undefined, amount: number, percent: number): number {
  return applies ? percentOf(amount, percent) : 0;
}

/** Loyal customers (2+ years) get 20% off the policy base premium. */
function loyaltyDiscount(policyBase: number, customer: Customer): number {
  return percentWhen(customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS, policyBase, LOYALTY_DISCOUNT_PERCENT);
}

/** Follow-up contracts get 15% off the policy base premium. */
function followUpDiscount(policyBase: number, isFollowUp: boolean): number {
  return percentWhen(isFollowUp, policyBase, FOLLOW_UP_DISCOUNT_PERCENT);
}

/** Premium = policy base + item surcharges - policy-wide discounts, rounded up, plus fee. */
function quotePremium(items: Item[], customer: Customer, isFollowUp: boolean): number {
  const policyBase = policyBasePremium(items);
  const discounts = loyaltyDiscount(policyBase, customer) + followUpDiscount(policyBase, isFollowUp);
  const subtotal = policyBase + totalItemSurcharges(items) - discounts;
  return Math.ceil(subtotal) + PROCESSING_FEE;
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const INSURANCE_VALUES: Record<string, number> = { sword: 1000, amulet: 600, rune: 250 };
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

interface Policy {
  items: Item[];
  remainingCap: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

/** Insurance sum: sum of the items' insurance values. */
function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
}

/** Reimbursed share of one damage entry: 50% for items with enchantment >= 8, else full. */
function reimbursedAmount(item: Item, amount: number): number {
  if (enchantmentOf(item) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return percentOf(amount, HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT);
  }
  return amount;
}

/** Requested payout: each damage entry's reimbursed amount minus the deductible. */
function requestedPayout(items: Item[], damages: Damage[]): number {
  return damages.reduce((total, damage) => {
    const item = items.find((candidate) => candidate.type === damage.itemType)!;
    return total + reimbursedAmount(item, damage.amount) - DEDUCTIBLE;
  }, 0);
}

/** Pay at most the policy's remaining cap; the payout reduces that cap. */
function payClaim(policy: Policy, amount: number): ClaimResult {
  const payout = Math.min(amount, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

const scenario: Scenario = JSON.parse(readFileSync(STDIN_FD, "utf-8"));
const policies = new Map<number, Policy>();
const results = scenario.steps.map((step, index) => {
  if (step.op === "quote") {
    policies.set(index, {
      items: step.items,
      remainingCap: CAP_MULTIPLIER * insuranceSum(step.items),
    });
    return { premium: quotePremium(step.items, scenario.customer, index > 0) };
  }
  const policy = policies.get(step.policy)!;
  return payClaim(policy, requestedPayout(policy.items, step.incident.damages));
});
process.stdout.write(JSON.stringify({ results }));
