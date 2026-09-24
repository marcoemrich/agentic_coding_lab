import { readFileSync } from 'node:fs';
import { basePremiumFor } from './pricing.js';
import { createPolicy, settleClaim, type Damage, type Policy } from './claims.js';

type Item = { type: string; cursed?: boolean; enchantment?: number };
type Quote = { op: 'quote'; items: Item[] };
type Claim = { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };
type Step = Quote | Claim;
const scenario = JSON.parse(readFileSync(0, 'utf8')) as { customer: { yearsWithMHPCO: number }; steps: Step[] };
const PROCESSING_FEE = 5;
const ASSESSMENT_RATE = 0.1;
const BLOCK_SIZE = 3;
const BLOCK_SAVING = 15;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
function componentBlockSaving(items: Item[]): number {
  return ['rune', 'moonstone'].reduce((saving, type) =>
    saving + (items.filter(item => item.type === type).length === BLOCK_SIZE ? BLOCK_SAVING : 0), 0);
}
function cursedItemSurcharge(items: Item[]): number {
  return items.reduce((sum, item) => sum + (item.cursed ? basePremiumFor(item.type) * CURSE_RATE : 0), 0);
}
function enchantedItemSurcharge(items: Item[]): number {
  return items.reduce((sum, item) => sum + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? basePremiumFor(item.type) * ENCHANTMENT_RATE : 0), 0);
}
function loyaltyDiscount(base: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
}
function followUpDiscount(base: number, earlierQuotes: number): number {
  return earlierQuotes > 0 ? base * FOLLOW_UP_RATE : 0;
}
function quotePremium(items: Item[], yearsWithMHPCO: number, earlierQuotes: number): number {
  for (const item of items) {
    basePremiumFor(item.type);
  }
  const base = items.reduce((sum, item) => sum + basePremiumFor(item.type), 0)
    - componentBlockSaving(items);
  const curse = cursedItemSurcharge(items);
  const enchantment = enchantedItemSurcharge(items);
  const loyalty = loyaltyDiscount(base, yearsWithMHPCO);
  const followUp = followUpDiscount(base, earlierQuotes);
  return Math.ceil(base + curse + enchantment + base * ASSESSMENT_RATE - loyalty - followUp + PROCESSING_FEE);
}
const policies = new Map<number, Policy>();
const results: Array<{ premium: number } | { payout: number; remainingCap: number }> = [];
let earlierQuotes = 0;
scenario.steps.forEach((step, index) => {
  if (step.op === 'quote') {
    const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, earlierQuotes);
    policies.set(index, createPolicy(step.items));
    earlierQuotes++;
    results.push({ premium });
  } else {
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
    results.push(settleClaim(policy, step.incident.damages));
  }
});
process.stdout.write(JSON.stringify({ results }));
