export interface Customer {
  yearsWithMHPCO: number;
}

export interface InsuredItemInput {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface DamageEntryInput {
  itemType: string;
  amount: number;
}

export interface IncidentInput {
  cause: string;
  damages: DamageEntryInput[];
}

export interface QuoteStep {
  op: "quote";
  items: InsuredItemInput[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: IncidentInput;
}

export type ScenarioStep = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: ScenarioStep[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioOutput {
  results: StepResult[];
}

const PROCESSING_FEE_G = 5;
const SWORD_BASE_PREMIUM_G = 100;
const AMULET_BASE_PREMIUM_G = 60;
const STAFF_BASE_PREMIUM_G = 80;
const POTION_BASE_PREMIUM_G = 40;
const COMPONENT_BASE_PREMIUM_G = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM_G = 60;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const SWORD_INSURANCE_VALUE_G = 1000;
const AMULET_INSURANCE_VALUE_G = 600;
const STAFF_INSURANCE_VALUE_G = 800;
const POTION_INSURANCE_VALUE_G = 400;
const COMPONENT_INSURANCE_VALUE_G = 250;
const POLICY_CAP_MULTIPLIER = 2;
const DEDUCTIBLE_PER_DAMAGE_G = 100;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
  isComponent: boolean;
}

const MHPCO_PRICE_LIST: Record<string, PriceListEntry> = {
  sword: {
    insuranceValue: SWORD_INSURANCE_VALUE_G,
    basePremium: SWORD_BASE_PREMIUM_G,
    isComponent: false,
  },
  amulet: {
    insuranceValue: AMULET_INSURANCE_VALUE_G,
    basePremium: AMULET_BASE_PREMIUM_G,
    isComponent: false,
  },
  staff: {
    insuranceValue: STAFF_INSURANCE_VALUE_G,
    basePremium: STAFF_BASE_PREMIUM_G,
    isComponent: false,
  },
  potion: {
    insuranceValue: POTION_INSURANCE_VALUE_G,
    basePremium: POTION_BASE_PREMIUM_G,
    isComponent: false,
  },
  rune: {
    insuranceValue: COMPONENT_INSURANCE_VALUE_G,
    basePremium: COMPONENT_BASE_PREMIUM_G,
    isComponent: true,
  },
  moonstone: {
    insuranceValue: COMPONENT_INSURANCE_VALUE_G,
    basePremium: COMPONENT_BASE_PREMIUM_G,
    isComponent: true,
  },
};

function getPriceListEntry(itemType: string): PriceListEntry {
  const entry = MHPCO_PRICE_LIST[itemType];
  if (!entry) {
    throw new Error(`Unknown item type: ${itemType}`);
  }
  return entry;
}

function getItemBasePremium(itemType: string): number {
  return getPriceListEntry(itemType).basePremium;
}

function roundPremiumInMhpcoFavor(amount: number): number {
  return Math.ceil(amount);
}

function calculateComponentBlockDiscount(items: InsuredItemInput[]): number {
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (getPriceListEntry(item.type).isComponent) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
  }
  const singleBlockSavings = COMPONENT_BLOCK_SIZE * COMPONENT_BASE_PREMIUM_G - COMPONENT_BLOCK_BASE_PREMIUM_G;
  let totalDiscount = 0;
  for (const count of componentCounts.values()) {
    if (count === COMPONENT_BLOCK_SIZE) {
      totalDiscount += singleBlockSavings;
    }
  }
  return totalDiscount;
}

function calculatePolicyBasePremium(items: InsuredItemInput[]): number {
  const itemSum = items.reduce(
    (sum, item) => sum + getItemBasePremium(item.type),
    0,
  );
  return itemSum - calculateComponentBlockDiscount(items);
}

function isHighlyEnchantedForQuote(item: InsuredItemInput): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD;
}

function calculateItemRiskSurcharge(item: InsuredItemInput): number {
  const itemBasePremium = getItemBasePremium(item.type);
  let surcharge = 0;
  if (item.cursed) {
    surcharge += itemBasePremium * CURSED_SURCHARGE_RATE;
  }
  if (isHighlyEnchantedForQuote(item)) {
    surcharge += itemBasePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
}

function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

function calculatePolicyWideModifierAdjustment(
  policyBasePremium: number,
  customer: Customer,
  isFollowUpContract: boolean,
): number {
  const firstInsuranceSurcharge = policyBasePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = isLongStandingCustomer(customer)
    ? policyBasePremium * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = isFollowUpContract
    ? policyBasePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    : 0;
  return firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;
}

function calculateQuotePremium(
  items: InsuredItemInput[],
  customer: Customer,
  isFollowUpContract: boolean,
): number {
  const policyBasePremium = calculatePolicyBasePremium(items);
  const itemRiskSurcharges = items.reduce(
    (sum, item) => sum + calculateItemRiskSurcharge(item),
    0,
  );
  const policyWideAdjustment = calculatePolicyWideModifierAdjustment(
    policyBasePremium,
    customer,
    isFollowUpContract,
  );
  return roundPremiumInMhpcoFavor(
    policyBasePremium +
      itemRiskSurcharges +
      policyWideAdjustment +
      PROCESSING_FEE_G,
  );
}

interface ActivePolicy {
  items: InsuredItemInput[];
  remainingCap: number;
}

function getItemInsuranceValue(itemType: string): number {
  return getPriceListEntry(itemType).insuranceValue;
}

function createPolicy(items: InsuredItemInput[]): ActivePolicy {
  const insuranceSum = items.reduce(
    (sum, item) => sum + getItemInsuranceValue(item.type),
    0,
  );
  return {
    items,
    remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER,
  };
}

function hasHighEnchantmentClaimClause(insuredItem: InsuredItemInput): boolean {
  return (insuredItem.enchantment ?? 0) >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD;
}

function calculateSingleDamageReimbursement(
  damage: DamageEntryInput,
  insuredItem: InsuredItemInput,
): number {
  if (damage.amount < 0) {
    throw new Error(`Invalid negative damage amount: ${damage.amount}`);
  }
  const reimbursableAmount = hasHighEnchantmentClaimClause(insuredItem)
    ? damage.amount * CLAIM_HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;
  return Math.max(0, reimbursableAmount - DEDUCTIBLE_PER_DAMAGE_G);
}

function roundPayoutInMhpcoFavor(amount: number): number {
  return Math.floor(amount);
}

function matchDamageToPolicyItem(
  availableItems: InsuredItemInput[],
  damage: DamageEntryInput,
): InsuredItemInput {
  const itemIndex = availableItems.findIndex(
    (item) => item.type === damage.itemType,
  );
  if (itemIndex < 0) {
    throw new Error(
      `Damaged item type '${damage.itemType}' is not covered by policy`,
    );
  }
  return availableItems.splice(itemIndex, 1)[0];
}

function calculateIncidentRawPayout(
  policyItems: InsuredItemInput[],
  damages: DamageEntryInput[],
): number {
  const availableItems = [...policyItems].sort(
    (a, b) => (b.enchantment ?? 0) - (a.enchantment ?? 0),
  );
  const sortedDamages = [...damages].sort((a, b) => b.amount - a.amount);
  return sortedDamages.reduce((sum, damage) => {
    const insuredItem = matchDamageToPolicyItem(availableItems, damage);
    return sum + calculateSingleDamageReimbursement(damage, insuredItem);
  }, 0);
}

function settlePayoutAgainstPolicyCap(
  policy: ActivePolicy,
  desiredPayout: number,
): ClaimResult {
  const payout = Math.min(desiredPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function processClaim(
  policy: ActivePolicy,
  incident: IncidentInput,
): ClaimResult {
  const rawPayout = calculateIncidentRawPayout(policy.items, incident.damages);
  const desiredPayout = roundPayoutInMhpcoFavor(rawPayout);
  return settlePayoutAgainstPolicyCap(policy, desiredPayout);
}

function getPolicyByStepIndex(
  policies: Map<number, ActivePolicy>,
  policyIndex: number,
): ActivePolicy {
  const policy = policies.get(policyIndex);
  if (!policy) {
    throw new Error(`Policy not found at step index ${policyIndex}`);
  }
  return policy;
}

export function processScenario(scenario: Scenario): ScenarioOutput {
  let quoteCount = 0;
  const policies = new Map<number, ActivePolicy>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === "quote") {
        const isFollowUpContract = quoteCount > 0;
        quoteCount += 1;
        policies.set(index, createPolicy(step.items));
        return {
          premium: calculateQuotePremium(
            step.items,
            scenario.customer,
            isFollowUpContract,
          ),
        };
      }
      const policy = getPolicyByStepIndex(policies, step.policy);
      return processClaim(policy, step.incident);
    }),
  };
}
