export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: string; [key: string]: unknown }>;
}

export interface Result {
  premium?: number;
  payout?: number;
  remainingCap?: number;
}

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

interface Damage {
  itemType: string;
  amount: number;
}

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const MAIN_ITEM_TERMS = {
  sword: { premium: 100, insuranceValue: 1000 },
  amulet: { premium: 60, insuranceValue: 600 },
  staff: { premium: 80, insuranceValue: 800 },
  potion: { premium: 40, insuranceValue: 400 },
} as const;

const COMPONENT_TERMS = { premium: 25, insuranceValue: 250 } as const;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

function isComponent(item: Item): boolean {
  return item.type === "rune" || item.type === "moonstone";
}

function itemTerms(item: Item) {
  if (isComponent(item)) return COMPONENT_TERMS;
  if (item.type in MAIN_ITEM_TERMS) return MAIN_ITEM_TERMS[item.type as keyof typeof MAIN_ITEM_TERMS];
  throw new Error(`Unknown item type: ${item.type}`);
}

function formsBuildingBlock(componentCount: number): boolean {
  return componentCount === COMPONENT_BLOCK_SIZE;
}

function alikeComponentPremium(count: number): number {
  return formsBuildingBlock(count) ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_TERMS.premium;
}

function countItemTypes(itemTypes: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  itemTypes.forEach((itemType) => counts.set(itemType, (counts.get(itemType) ?? 0) + 1));
  return counts;
}

function componentPremium(items: Item[]): number {
  const componentTypes = items.filter(isComponent).map((item) => item.type);
  return [...countItemTypes(componentTypes).values()].reduce(
    (total, count) => total + alikeComponentPremium(count),
    0,
  );
}

function basePremium(items: Item[]): number {
  const mainItems = items.filter((item) => !isComponent(item));
  return mainItems.reduce((total, item) => total + itemTerms(item).premium, 0) + componentPremium(items);
}

function roundPremiumInMhpcoFavor(amount: number): number {
  return Math.ceil(amount);
}

function curseSurcharge(items: Item[]): number {
  return items.filter((item) => item.cursed).reduce(
    (total, item) => total + itemTerms(item).premium * CURSE_SURCHARGE_RATE,
    0,
  );
}

function initialAssessmentSurcharge(policyBasePremium: number): number {
  return policyBasePremium * INITIAL_ASSESSMENT_RATE;
}

function isLongStandingCustomer(yearsWithMhpco: number): boolean {
  return yearsWithMhpco >= LOYALTY_YEARS_THRESHOLD;
}

function loyaltyDiscount(base: number, yearsWithMhpco: number): number {
  return isLongStandingCustomer(yearsWithMhpco) ? base * LOYALTY_DISCOUNT_RATE : 0;
}

function highEnchantmentSurcharge(item: Item): number {
  if ((item.enchantment ?? 0) < HIGH_ENCHANTMENT_THRESHOLD) return 0;
  return itemTerms(item).premium * ENCHANTMENT_SURCHARGE_RATE;
}

function enchantmentSurcharge(items: Item[]): number {
  return items.reduce((total, item) => total + highEnchantmentSurcharge(item), 0);
}

function itemSpecificSurcharges(items: Item[]): number {
  return curseSurcharge(items) + enchantmentSurcharge(items);
}

function isFollowUpContract(previousContractCount: number): boolean {
  return previousContractCount > 0;
}

function followUpDiscount(base: number, hasPreviousContract: boolean): number {
  return hasPreviousContract ? base * FOLLOW_UP_DISCOUNT_RATE : 0;
}

function quotePremium(items: Item[], yearsWithMhpco: number, hasPreviousContract: boolean): number {
  const base = basePremium(items);
  return roundPremiumInMhpcoFavor(
    base + itemSpecificSurcharges(items) + initialAssessmentSurcharge(base)
      - loyaltyDiscount(base, yearsWithMhpco) - followUpDiscount(base, hasPreviousContract) + PROCESSING_FEE,
  );
}

function itemInsuranceValue(item: Item): number {
  return itemTerms(item).insuranceValue;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + itemInsuranceValue(item), 0);
}

function policyCap(items: Item[]): number {
  return insuranceSum(items) * CAP_MULTIPLIER;
}

function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: policyCap(items) };
}

function damageAmountAfterHighEnchantmentClause(item: Item, damageAmount: number): number {
  return (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD
    ? damageAmount * REDUCED_REIMBURSEMENT_RATE
    : damageAmount;
}

function payoutAfterDamageEventDeductible(reimbursableAmount: number): number {
  return Math.max(0, reimbursableAmount - DEDUCTIBLE);
}

function damagePayout(item: Item, damageAmount: number): number {
  const reimbursableAmount = damageAmountAfterHighEnchantmentClause(item, damageAmount);
  return payoutAfterDamageEventDeductible(reimbursableAmount);
}

function insuredItemForDamage(policy: Policy, damage: Damage): Item {
  return policy.items.find((insuredItem) => insuredItem.type === damage.itemType)!;
}

function claimPayoutBeforePolicyCap(policy: Policy, damages: Damage[]): number {
  return damages.reduce(
    (total, damage) => total + damagePayout(insuredItemForDamage(policy, damage), damage.amount),
    0,
  );
}

function rejectUninsuredDamages(policy: Policy, damages: Damage[]): void {
  const insuredCounts = countItemTypes(policy.items.map((item) => item.type));
  const damageCounts = countItemTypes(damages.map((damage) => damage.itemType));
  for (const [itemType, count] of damageCounts) {
    if (count > (insuredCounts.get(itemType) ?? 0)) throw new Error(`Damage exceeds insured ${itemType} count`);
  }
}

function payoutLimitedByRemainingCap(payoutBeforeCap: number, remainingCap: number): number {
  return Math.min(payoutBeforeCap, remainingCap);
}

function roundPayoutInMhpcoFavor(amount: number): number {
  return Math.floor(amount);
}

function rejectNegativeDamageAmounts(damages: Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) throw new Error("Damage amount cannot be negative");
}

function claimPayout(policy: Policy, damages: Damage[]): number {
  const payoutBeforeCap = claimPayoutBeforePolicyCap(policy, damages);
  return roundPayoutInMhpcoFavor(
    payoutLimitedByRemainingCap(payoutBeforeCap, policy.remainingCap),
  );
}

function processClaim(policy: Policy, damages: Damage[]): Result {
  rejectNegativeDamageAmounts(damages);
  rejectUninsuredDamages(policy, damages);
  const payout = claimPayout(policy, damages);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const items = step.items as Item[];
      const hasPreviousContract = isFollowUpContract(policies.size);
      policies.set(index, createPolicy(items));
      results.push({ premium: quotePremium(items, scenario.customer.yearsWithMHPCO, hasPreviousContract) });
    } else {
      const policy = policies.get(step.policy as number)!;
      const incident = step.incident as { damages: Damage[] };
      results.push(processClaim(policy, incident.damages));
    }
  });
  return { results };
}
