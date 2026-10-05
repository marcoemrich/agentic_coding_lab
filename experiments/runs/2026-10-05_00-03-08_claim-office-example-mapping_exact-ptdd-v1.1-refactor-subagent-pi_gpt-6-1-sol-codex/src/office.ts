export interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
export interface Damage { itemType: string; amount: number }
export type Step = { op: 'quote'; items: Item[] } | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
export type Result = { premium: number } | { payout: number; remainingCap: number };
const processingFee = 5;

const itemPriceList: Record<string, { basePremium: number; insuranceValue: number }> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};
const initialAssessmentRate = 0.1;

function initialAssessmentSurcharge(basePremium: number): number {
  return basePremium * initialAssessmentRate;
}

function itemBasePremium(type: string): number {
  if (!Object.hasOwn(itemPriceList, type)) throw new Error(`Unknown item type: ${type}`);
  return itemPriceList[type].basePremium;
}

const blockSize = 3;
const blockBasePremium = 60;
function componentBlockDiscount(type: string, count: number): number {
  return count === blockSize ? count * itemBasePremium(type) - blockBasePremium : 0;
}

function totalComponentBlockDiscount(items: Item[]): number {
  return ['rune', 'moonstone'].reduce((sum, type) =>
    sum + componentBlockDiscount(type, items.filter(item => item.type === type).length), 0);
}

function policyBasePremium(items: Item[]): number {
  const regularBase = items.reduce((sum, item) => sum + itemBasePremium(item.type), 0);
  return regularBase - totalComponentBlockDiscount(items);
}

function finalizePremium(premiumBeforeFee: number): number {
  return Math.ceil(premiumBeforeFee + processingFee);
}

const curseRate = 0.5;
function itemCurseSurcharge(item: Item): number {
  return item.cursed ? itemBasePremium(item.type) * curseRate : 0;
}

const loyaltyYears = 2;
const loyaltyRate = 0.2;
function policyLoyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= loyaltyYears ? basePremium * loyaltyRate : 0;
}

const highEnchantmentLevel = 5;
const enchantmentRate = 0.3;
function itemEnchantmentSurcharge(item: Item): number {
  return (item.enchantment ?? 0) >= highEnchantmentLevel ? itemBasePremium(item.type) * enchantmentRate : 0;
}

function totalItemRiskSurcharge(items: Item[]): number {
  const curseSurcharge = items.reduce((sum, item) => sum + itemCurseSurcharge(item), 0);
  const enchantmentSurcharge = items.reduce((sum, item) => sum + itemEnchantmentSurcharge(item), 0);
  return curseSurcharge + enchantmentSurcharge;
}

const followUpRate = 0.15;
function policyFollowUpDiscount(basePremium: number, previousContracts: number): number {
  return previousContracts > 0 ? basePremium * followUpRate : 0;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, previousContracts: number): number {
  const basePremium = policyBasePremium(items);
  const followUpDiscount = policyFollowUpDiscount(basePremium, previousContracts);
  return finalizePremium(basePremium + initialAssessmentSurcharge(basePremium) + totalItemRiskSurcharge(items) - policyLoyaltyDiscount(basePremium, yearsWithMHPCO) - followUpDiscount);
}

interface Policy { items: Item[]; remainingCap: number }
function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + (itemPriceList[item.type]?.insuranceValue ?? 0), 0);
}

const capMultiplier = 2;
function policyCap(items: Item[]): number {
  return insuranceSum(items) * capMultiplier;
}

function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: policyCap(items) };
}
const deductible = 100;
const reducedReimbursementLevel = 8;
const reducedReimbursementRate = 0.5;
function nonNegativeDamageAmount(amount: number): number {
  if (amount < 0) throw new Error('Damage amount must not be negative');
  return amount;
}

function damageReimbursement(damage: Damage, item: Item): number {
  const amount = nonNegativeDamageAmount(damage.amount);
  return (item.enchantment ?? 0) >= reducedReimbursementLevel ? amount * reducedReimbursementRate : amount;
}

function damagePayoutAfterDeductible(damage: Damage, item: Item): number {
  return Math.max(0, damageReimbursement(damage, item) - deductible);
}

function finalizePayout(payout: number): number {
  return Math.floor(payout);
}

function cappedClaimPayout(desiredPayout: number, remainingCap: number): number {
  return finalizePayout(Math.min(desiredPayout, remainingCap));
}

function insuredItemForDamage(damage: Damage, availableItems: Item[]): Item {
  const index = availableItems.findIndex(item => item.type === damage.itemType);
  if (index < 0) throw new Error(`No insured item available for damage: ${damage.itemType}`);
  return availableItems.splice(index, 1)[0];
}

function matchInsuredDamages(damages: Damage[], items: Item[]): { damage: Damage; item: Item }[] {
  const availableItems = [...items];
  return damages.map(damage => ({ damage, item: insuredItemForDamage(damage, availableItems) }));
}

function totalPayoutAfterDeductibles(damages: Damage[], items: Item[]): number {
  return matchInsuredDamages(damages, items).reduce((sum, { damage, item }) =>
    sum + damagePayoutAfterDeductible(damage, item), 0);
}

function processClaim(policy: Policy, damages: Damage[]): Result {
  const desiredPayout = totalPayoutAfterDeductibles(damages, policy.items);
  const payout = cappedClaimPayout(desiredPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  let previousContracts = 0;
  const policies = new Map<number, Policy>();
  const results: Result[] = scenario.steps.map((step, index) => {
    if (step.op === 'claim') return processClaim(policies.get(step.policy)!, step.incident.damages);
    const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, previousContracts);
    policies.set(index, createPolicy(step.items));
    previousContracts++;
    return { premium };
  });
  return { results };
}
