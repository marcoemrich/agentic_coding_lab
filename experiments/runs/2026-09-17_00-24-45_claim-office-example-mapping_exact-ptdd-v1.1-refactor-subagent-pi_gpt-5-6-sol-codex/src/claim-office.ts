export interface Item {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
}

interface QuoteStep { op: "quote"; items: Item[] }
interface Damage { itemType: string; amount: number }
interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}
interface QuoteResult { premium: number }
interface ClaimResult { payout: number; remainingCap: number }
interface Policy { items: Item[]; remainingCap: number }
type Result = QuoteResult | ClaimResult;
export interface ScenarioResult { results: Result[] }

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const ENCHANTED_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};
const COMPONENT_TYPES = ["rune", "moonstone"];

function itemBasePremium(item: Item): number {
  const premium = BASE_PREMIUMS[item.type];
  if (premium === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return premium;
}

function alikeComponentGroupBasePremium(count: number, unitPremium: number): number {
  return count === BLOCK_SIZE ? BLOCK_PREMIUM : count * unitPremium;
}

function componentBasePremium(items: Item[]): number {
  return COMPONENT_TYPES.reduce((total, type) => {
    const count = items.filter((item) => item.type === type).length;
    return total + alikeComponentGroupBasePremium(count, BASE_PREMIUMS[type]);
  }, 0);
}

function policyBasePremium(items: Item[]): number {
  const mainItems = items.filter((item) => !COMPONENT_TYPES.includes(item.type));
  return mainItems.reduce(
    (total, item) => total + itemBasePremium(item), componentBasePremium(items),
  );
}

function cursedItemSurcharge(item: Item): number {
  return item.cursed ? itemBasePremium(item) * CURSE_RATE : 0;
}

function highEnchantmentSurcharge(item: Item): number {
  const applies = item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_LEVEL;
  return applies ? itemBasePremium(item) * HIGH_ENCHANTMENT_RATE : 0;
}

function itemSpecificSurcharge(items: Item[]): number {
  return items.reduce(
    (total, item) => total + cursedItemSurcharge(item) + highEnchantmentSurcharge(item), 0,
  );
}

function loyaltyDiscount(basePremium: number, years: number): number {
  return years >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
}

function policyWidePremiumAdjustment(base: number, years: number, followUp: boolean): number {
  const assessment = base * INITIAL_ASSESSMENT_RATE;
  const followUpDiscount = followUp ? base * FOLLOW_UP_DISCOUNT_RATE : 0;
  return assessment - loyaltyDiscount(base, years) - followUpDiscount;
}

function quotePremium(items: Item[], years: number, followUp: boolean): number {
  const base = policyBasePremium(items);
  const unrounded = base + itemSpecificSurcharge(items)
    + policyWidePremiumAdjustment(base, years, followUp) + PROCESSING_FEE;
  return Math.ceil(unrounded);
}

function itemInsuranceValue(item: Item): number {
  return INSURANCE_VALUES[item.type];
}

function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + itemInsuranceValue(item), 0);
}

function initialPolicyPayoutCap(items: Item[]): number {
  return insuranceSum(items) * CAP_MULTIPLIER;
}

function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: initialPolicyPayoutCap(items) };
}

function issuePolicyQuote(
  items: Item[], yearsWithMHPCO: number, isFollowUpContract: boolean,
): { result: QuoteResult; policy: Policy } {
  return {
    result: { premium: quotePremium(items, yearsWithMHPCO, isFollowUpContract) },
    policy: createPolicy(items),
  };
}

function highEnchantmentClaimClauseApplies(item: Item): boolean {
  return item.enchantment !== undefined && item.enchantment >= CLAIM_ENCHANTMENT_LEVEL;
}

function claimReimbursementRate(item: Item): number {
  return highEnchantmentClaimClauseApplies(item) ? ENCHANTED_REIMBURSEMENT_RATE : 1;
}

function reimbursableDamage(damage: Damage, item: Item): number {
  return damage.amount * claimReimbursementRate(item);
}

function payoutAfterDamageEventDeductible(reimbursableAmount: number): number {
  return Math.max(0, reimbursableAmount - DEDUCTIBLE);
}

function damageEventPayout(damage: Damage, item: Item): number {
  return payoutAfterDamageEventDeductible(reimbursableDamage(damage, item));
}

interface MatchedDamageEvent { damage: Damage; insuredItem: Item }

function takeInsuredItemForDamage(damage: Damage, unmatchedItems: Item[]): Item {
  const index = unmatchedItems.findIndex((item) => item.type === damage.itemType);
  if (index < 0) throw new Error(`Damage item not insured: ${damage.itemType}`);
  return unmatchedItems.splice(index, 1)[0];
}

function requireNonnegativeDamageAmount(damage: Damage): void {
  if (damage.amount < 0) throw new Error(`Invalid damage amount: ${damage.amount}`);
}

function matchDamageEvents(damages: Damage[], items: Item[]): MatchedDamageEvent[] {
  const unmatchedItems = [...items];
  return damages.map((damage) => {
    requireNonnegativeDamageAmount(damage);
    return {
      damage,
      insuredItem: takeInsuredItemForDamage(damage, unmatchedItems),
    };
  });
}

function requestedClaimPayout(damages: Damage[], items: Item[]): number {
  return matchDamageEvents(damages, items).reduce(
    (total, event) => total + damageEventPayout(event.damage, event.insuredItem), 0,
  );
}

function roundFinalPayoutInOfficeFavor(payout: number): number {
  return Math.floor(payout);
}

function settlePolicyClaim(policy: Policy, damages: Damage[]): ClaimResult {
  const cappedPayout = Math.min(
    requestedClaimPayout(damages, policy.items), policy.remainingCap,
  );
  const payout = roundFinalPayoutInOfficeFavor(cappedPayout);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function executeScenario(scenario: Scenario): ScenarioResult {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      const issuedQuote = issuePolicyQuote(
        step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0,
      );
      results.push(issuedQuote.result);
      policies.set(stepIndex, issuedQuote.policy);
      quoteCount += 1;
      return;
    }
    const policy = policies.get(step.policy)!;
    results.push(settlePolicyClaim(policy, step.incident.damages));
  });
  return { results };
}
