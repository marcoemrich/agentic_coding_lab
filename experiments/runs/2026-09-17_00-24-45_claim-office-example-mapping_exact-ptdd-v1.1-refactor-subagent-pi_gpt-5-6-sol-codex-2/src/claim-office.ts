type Item = Record<string, unknown>;
type Damage = { itemType: string; amount: number };
type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

const PROCESSING_FEE_G = 5;
const COMPONENT_BASE_PREMIUM_G = 25;
const QUOTE_BASE_PREMIUM_G_BY_ITEM_TYPE = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE_PREMIUM_G,
  moonstone: COMPONENT_BASE_PREMIUM_G,
} as const;
type QuotedItemType = keyof typeof QUOTE_BASE_PREMIUM_G_BY_ITEM_TYPE;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM_G = 60;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const INSURANCE_VALUE_G_BY_ITEM_TYPE: Record<QuotedItemType, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const POLICY_CAP_MULTIPLIER = 2;
const DAMAGE_DEDUCTIBLE_G = 100;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function basePremiumFor(item: Record<string, unknown>): number {
  return QUOTE_BASE_PREMIUM_G_BY_ITEM_TYPE[String(item.type) as QuotedItemType];
}

function firstInsuranceSurcharge(basePremium: number): number {
  return basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
}

function isComponent(item: Record<string, unknown>): boolean {
  return item.type === "rune" || item.type === "moonstone";
}

function basePremiumForComponentType(items: Array<Record<string, unknown>>, type: unknown): number {
  const count = items.filter((item) => item.type === type).length;
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM_G : count * COMPONENT_BASE_PREMIUM_G;
}

function componentBasePremiumForItems(items: Array<Record<string, unknown>>): number {
  const componentTypes = [...new Set(items.filter(isComponent).map((item) => item.type))];
  return componentTypes.reduce<number>((sum, type) => sum + basePremiumForComponentType(items, type), 0);
}

function basePremiumForItems(items: Array<Record<string, unknown>>): number {
  const mainPremium = items.filter((item) => !isComponent(item)).reduce((sum, item) => sum + basePremiumFor(item), 0);
  return mainPremium + componentBasePremiumForItems(items);
}

function curseSurchargeFor(item: Record<string, unknown>): number {
  return item.cursed === true ? basePremiumFor(item) * CURSE_SURCHARGE_RATE : 0;
}

function isLongStandingCustomer(yearsWithMHPCO: number): boolean {
  return yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

function highEnchantmentSurchargeFor(item: Record<string, unknown>): number {
  const qualifiesForSurcharge =
    typeof item.enchantment === "number" && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD;
  return qualifiesForSurcharge ? basePremiumFor(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
}

function itemSpecificSurchargeFor(item: Record<string, unknown>): number {
  return curseSurchargeFor(item) + highEnchantmentSurchargeFor(item);
}

function itemSpecificSurcharges(items: Array<Record<string, unknown>>): number {
  return items.reduce((sum, item) => sum + itemSpecificSurchargeFor(item), 0);
}

function loyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  return isLongStandingCustomer(yearsWithMHPCO) ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
}

function policyWidePremiumAdjustment(basePremium: number, yearsWithMHPCO: number): number {
  return firstInsuranceSurcharge(basePremium) - loyaltyDiscount(basePremium, yearsWithMHPCO);
}

function followUpContractDiscount(basePremium: number, previousContracts: number): number {
  return previousContracts > 0 ? basePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0;
}

function premiumBeforeProcessingFee(
  items: Array<Record<string, unknown>>,
  yearsWithMHPCO: number,
  previousContracts: number,
): number {
  const basePremium = basePremiumForItems(items);
  return basePremium + itemSpecificSurcharges(items)
    + policyWidePremiumAdjustment(basePremium, yearsWithMHPCO)
    - followUpContractDiscount(basePremium, previousContracts);
}

function roundPremiumInOfficeFavor(premium: number): number {
  return Math.ceil(premium);
}

function isQuotedItemType(type: unknown): type is QuotedItemType {
  return Object.hasOwn(QUOTE_BASE_PREMIUM_G_BY_ITEM_TYPE, String(type));
}

function rejectUnknownItems(items: Item[]): void {
  if (items.some((item) => !isQuotedItemType(item.type))) throw new Error("Unknown item type");
}

function quotePremium(items: Array<Record<string, unknown>>, yearsWithMHPCO: number, previousContracts = 0): number {
  rejectUnknownItems(items);
  const premium = premiumBeforeProcessingFee(items, yearsWithMHPCO, previousContracts) + PROCESSING_FEE_G;
  return roundPremiumInOfficeFavor(premium);
}

function insuranceValueFor(item: Item): number {
  return INSURANCE_VALUE_G_BY_ITEM_TYPE[item.type as QuotedItemType];
}

function insuranceSumFor(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueFor(item), 0);
}

function initialClaimCapFor(items: Item[]): number {
  return insuranceSumFor(items) * POLICY_CAP_MULTIPLIER;
}

interface PolicyState {
  items: Item[];
  remainingCap: number;
}

function issuePolicy(items: Item[]): PolicyState {
  return { items, remainingCap: initialClaimCapFor(items) };
}

function hasHighEnchantmentClaimClause(item: Item): boolean {
  return typeof item.enchantment === "number" && item.enchantment >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD;
}

function claimReimbursementRateFor(item: Item): number {
  return hasHighEnchantmentClaimClause(item) ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE : 1;
}

function reimbursableDamageBeforeDeductible(damage: Damage, item: Item): number {
  return damage.amount * claimReimbursementRateFor(item);
}

function payoutAfterDamageEventDeductible(reimbursableDamage: number): number {
  return Math.max(0, reimbursableDamage - DAMAGE_DEDUCTIBLE_G);
}

function reimbursementFor(damage: Damage, item: Item): number {
  return payoutAfterDamageEventDeductible(reimbursableDamageBeforeDeductible(damage, item));
}

function insuredItemForDamage(policy: PolicyState, damage: Damage): Item {
  return policy.items.find((item) => item.type === damage.itemType)!;
}

function desiredPayoutFor(policy: PolicyState, damages: Damage[]): number {
  return damages.reduce(
    (sum, damage) => sum + reimbursementFor(damage, insuredItemForDamage(policy, damage)),
    0,
  );
}

function policyCoversDamages(insuredItems: Item[], damages: Damage[]): boolean {
  return [...new Set(damages.map((damage) => damage.itemType))].every((type) => {
    const insured = insuredItems.filter((item) => item.type === type).length;
    const reported = damages.filter((damage) => damage.itemType === type).length;
    return reported <= insured;
  });
}

function rejectDamagesOutsidePolicyCoverage(insuredItems: Item[], damages: Damage[]): void {
  if (!policyCoversDamages(insuredItems, damages)) throw new Error("Damage entries exceed insured items");
}

function roundPayoutInOfficeFavor(payout: number): number {
  return Math.floor(payout);
}

function settleClaimAgainstRemainingCap(policy: PolicyState, desiredPayout: number): Record<string, number> {
  const payout = Math.min(desiredPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function rejectNegativeDamageAmounts(damages: Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) throw new Error("Damage amount cannot be negative");
}

function processClaim(policy: PolicyState, damages: Damage[]): Record<string, number> {
  rejectNegativeDamageAmounts(damages);
  rejectDamagesOutsidePolicyCoverage(policy.items, damages);
  return settleClaimAgainstRemainingCap(policy, roundPayoutInOfficeFavor(desiredPayoutFor(policy, damages)));
}

export function runScenario(scenario: Scenario): { results: Array<Record<string, number>> } {
  const policies = new Map<number, PolicyState>();
  let previousContracts = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") return processClaim(policies.get(step.policy)!, step.incident.damages);
    const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, previousContracts);
    policies.set(index, issuePolicy(step.items));
    previousContracts += 1;
    return { premium };
  });
  return { results };
}
