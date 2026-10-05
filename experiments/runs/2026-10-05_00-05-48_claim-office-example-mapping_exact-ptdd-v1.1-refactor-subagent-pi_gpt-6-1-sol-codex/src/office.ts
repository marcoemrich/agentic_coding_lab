export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}
export interface Quote { op: 'quote'; items: Item[] }
export interface Damage { itemType: string; amount: number }
export interface Claim { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } }
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: (Quote | Claim)[] }
export interface Result { premium?: number; payout?: number; remainingCap?: number }

const componentBasePremium = 25;

const basePremiums: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: componentBasePremium, moonstone: componentBasePremium };

function assertKnownQuoteItems(items: Item[]): void {
  for (const item of items) {
    if (!Object.hasOwn(basePremiums, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  }
}

function itemBasePremium(item: Item): number {
  return basePremiums[item.type];
}

function componentBlockSaving(items: Item[]): number {
  const blockSize = 3;
  const blockBasePremium = 60;
  const blockSaving = blockSize * componentBasePremium - blockBasePremium;
  return ['rune', 'moonstone'].reduce((saving, type) => {
    const count = items.filter(item => item.type === type).length;
    return saving + (count === blockSize ? blockSaving : 0);
  }, 0);
}

function policyBasePremium(items: Item[]): number {
  const total = items.reduce((sum, item) => sum + itemBasePremium(item), 0);
  return total - componentBlockSaving(items);
}

function initialAssessmentSurcharge(basePremium: number): number {
  const initialAssessmentRate = 0.1;
  return basePremium * initialAssessmentRate;
}

function roundPremiumInOfficeFavor(premium: number): number {
  return Math.ceil(premium);
}

function itemCurseSurcharge(item: Item): number {
  const curseRate = 0.5;
  return item.cursed ? itemBasePremium(item) * curseRate : 0;
}

function loyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  const loyaltyYears = 2;
  const loyaltyRate = 0.2;
  return yearsWithMHPCO >= loyaltyYears ? basePremium * loyaltyRate : 0;
}

function itemEnchantmentSurcharge(item: Item): number {
  const highEnchantment = 5;
  const enchantmentRate = 0.3;
  return (item.enchantment ?? 0) >= highEnchantment ? itemBasePremium(item) * enchantmentRate : 0;
}

function itemRiskSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemCurseSurcharge(item) + itemEnchantmentSurcharge(item), 0);
}

function followUpContractDiscount(basePremium: number, previousContracts: number): number {
  const followUpRate = 0.15;
  return previousContracts > 0 ? basePremium * followUpRate : 0;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, previousContracts: number): number {
  assertKnownQuoteItems(items);
  const processingFee = 5;
  const basePremium = policyBasePremium(items);
  return roundPremiumInOfficeFavor(basePremium + itemRiskSurcharges(items) + initialAssessmentSurcharge(basePremium) - loyaltyDiscount(basePremium, yearsWithMHPCO) - followUpContractDiscount(basePremium, previousContracts) + processingFee);
}

function payoutAfterDeductible(reimbursement: number): number {
  const deductible = 100;
  return Math.max(0, reimbursement - deductible);
}

const componentInsuranceValue = 250;

function itemInsuranceValue(item: Item): number {
  const insuranceValues: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: componentInsuranceValue, moonstone: componentInsuranceValue };
  return insuranceValues[item.type];
}

function policyInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

function damageReimbursement(item: Item, amount: number): number {
  const reducedEnchantment = 8;
  const reimbursementRate = 0.5;
  return (item.enchantment ?? 0) >= reducedEnchantment ? amount * reimbursementRate : amount;
}

function policyPayoutCap(items: Item[]): number {
  const capMultiplier = 2;
  return policyInsuranceSum(items) * capMultiplier;
}

function takeAvailableInsuredItem(availableItems: Item[], itemType: string): Item {
  const index = availableItems.findIndex(item => item.type === itemType);
  if (index < 0) throw new Error(`Damage item is not insured: ${itemType}`);
  return availableItems.splice(index, 1)[0];
}

function damagePayout(item: Item, amount: number): number {
  return payoutAfterDeductible(damageReimbursement(item, amount));
}

function resolveCoveredDamages(items: Item[], damages: Damage[]): { item: Item; amount: number }[] {
  const availableItems = [...items];
  return damages.map(damage => ({
    item: takeAvailableInsuredItem(availableItems, damage.itemType),
    amount: damage.amount,
  }));
}

function incidentPayout(items: Item[], damages: Damage[]): number {
  const coveredDamages = resolveCoveredDamages(items, damages);
  return coveredDamages.reduce((sum, damage) => sum + damagePayout(damage.item, damage.amount), 0);
}

interface Policy { items: Item[]; remainingCap: number }

function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: policyPayoutCap(items) };
}

function capLimitedPayout(desiredPayout: number, remainingCap: number): number {
  return Math.min(desiredPayout, remainingCap);
}

function roundPayoutInOfficeFavor(payout: number): number {
  return Math.floor(payout);
}

function claimPayout(items: Item[], damages: Damage[], remainingCap: number): number {
  return roundPayoutInOfficeFavor(capLimitedPayout(incidentPayout(items, damages), remainingCap));
}

function assertNonnegativeDamageAmounts(damages: Damage[]): void {
  if (damages.some(damage => damage.amount < 0)) throw new Error('Damage amount must not be negative');
}

function settleClaim(policy: Policy, damages: Damage[]): Result {
  assertNonnegativeDamageAmounts(damages);
  const payout = claimPayout(policy.items, damages, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(input: unknown): { results: Result[] } {
  const scenario = input as Scenario;
  const policies = new Map<number, Policy>();
  return { results: scenario.steps.map((step, index) => {
    if (step.op === 'claim') return settleClaim(policies.get(step.policy)!, step.incident.damages);
    const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, policies.size);
    policies.set(index, createPolicy(step.items));
    return { premium };
  }) };
}
