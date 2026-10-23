export interface ItemInput {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface DamageInput {
  itemType: string;
  amount: number;
}

export interface QuoteStep {
  op: "quote";
  items: ItemInput[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: DamageInput[];
  };
}

export type ScenarioStep = QuoteStep | ClaimStep;

export interface ScenarioInput {
  customer: {
    yearsWithMHPCO: number;
  };
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

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

const POLICY_CAP_MULTIPLIER = 2;
const DAMAGE_DEDUCTIBLE = 100;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

const PRICE_LIST_BY_TYPE: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: {
    insuranceValue: COMPONENT_INSURANCE_VALUE,
    basePremium: COMPONENT_BASE_PREMIUM,
  },
  moonstone: {
    insuranceValue: COMPONENT_INSURANCE_VALUE,
    basePremium: COMPONENT_BASE_PREMIUM,
  },
};

function getPriceListEntry(itemType: string): PriceListEntry {
  const entry = PRICE_LIST_BY_TYPE[itemType];
  if (!entry) {
    throw new Error(`Unknown item type: ${itemType}`);
  }
  return entry;
}

function calculateItemBasePremium(item: ItemInput): number {
  return getPriceListEntry(item.type).basePremium;
}

function calculateItemInsuranceValue(item: ItemInput): number {
  return getPriceListEntry(item.type).insuranceValue;
}

function roundPremiumInMHPCOFavor(amount: number): number {
  return Math.ceil(amount);
}

function roundPayoutInMHPCOFavor(amount: number): number {
  return Math.floor(amount);
}

const COMPONENT_TYPES = ["rune", "moonstone"];

function calculateComponentBlockDiscount(items: ItemInput[]): number {
  const discountPerBlock =
    COMPONENT_BLOCK_SIZE * COMPONENT_BASE_PREMIUM -
    COMPONENT_BLOCK_BASE_PREMIUM;
  return COMPONENT_TYPES.reduce((discount, componentType) => {
    const count = items.filter((item) => item.type === componentType).length;
    return count === COMPONENT_BLOCK_SIZE
      ? discount + discountPerBlock
      : discount;
  }, 0);
}

function calculatePolicyBasePremium(items: ItemInput[]): number {
  const sumOfItems = items.reduce(
    (sum, item) => sum + calculateItemBasePremium(item),
    0,
  );
  return sumOfItems - calculateComponentBlockDiscount(items);
}

function isHighlyEnchantedForQuote(item: ItemInput): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD;
}

function calculateItemRiskSurcharge(item: ItemInput): number {
  const basePremium = calculateItemBasePremium(item);
  const cursedSurcharge = item.cursed ? basePremium * CURSED_SURCHARGE_RATE : 0;
  const highEnchantmentSurcharge = isHighlyEnchantedForQuote(item)
    ? basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return cursedSurcharge + highEnchantmentSurcharge;
}

function calculatePolicyWideModifierAdjustment(
  basePremium: number,
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number {
  const loyaltyDiscount =
    yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
      ? basePremium * LOYALTY_DISCOUNT_RATE
      : 0;
  const firstInsuranceSurcharge =
    basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const followUpDiscount = isFollowUpContract
    ? basePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    : 0;
  return firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;
}

function calculateQuotePremium(
  items: ItemInput[],
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number {
  const basePremium = calculatePolicyBasePremium(items);
  const itemSurcharges = items.reduce(
    (sum, item) => sum + calculateItemRiskSurcharge(item),
    0,
  );
  const policyModifierAdjustment = calculatePolicyWideModifierAdjustment(
    basePremium,
    yearsWithMHPCO,
    isFollowUpContract,
  );
  return roundPremiumInMHPCOFavor(
    basePremium + itemSurcharges + policyModifierAdjustment + PROCESSING_FEE,
  );
}

interface PolicyRecord {
  items: ItemInput[];
  remainingCap: number;
}

function createPolicy(items: ItemInput[]): PolicyRecord {
  const insuranceSum = items.reduce(
    (sum, item) => sum + calculateItemInsuranceValue(item),
    0,
  );
  return {
    items,
    remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER,
  };
}

function calculateDamageReimbursement(
  item: ItemInput,
  damageAmount: number,
): number {
  if (damageAmount < 0) {
    throw new Error(`Negative damage amount: ${damageAmount}`);
  }
  const reimbursedDamage =
    (item.enchantment ?? 0) >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD
      ? damageAmount * CLAIM_HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
      : damageAmount;
  return Math.max(0, reimbursedDamage - DAMAGE_DEDUCTIBLE);
}

function consumeCoveredItem(
  availableItems: ItemInput[],
  itemType: string,
): ItemInput {
  const itemIndex = availableItems.findIndex((item) => item.type === itemType);
  if (itemIndex === -1) {
    throw new Error(`Item ${itemType} is not covered by policy`);
  }
  const [insuredItem] = availableItems.splice(itemIndex, 1);
  return insuredItem;
}

function processClaim(
  policy: PolicyRecord,
  damages: DamageInput[],
): ClaimResult {
  const availableItems = [...policy.items];
  const totalReimbursement = damages.reduce((sum, damage) => {
    const insuredItem = consumeCoveredItem(availableItems, damage.itemType);
    return sum + calculateDamageReimbursement(insuredItem, damage.amount);
  }, 0);
  const payout = Math.min(
    policy.remainingCap,
    roundPayoutInMHPCOFavor(totalReimbursement),
  );
  policy.remainingCap -= payout;
  return {
    payout,
    remainingCap: policy.remainingCap,
  };
}

export function processScenario(scenario: ScenarioInput): ScenarioOutput {
  const results: StepResult[] = [];
  const policies = new Map<number, PolicyRecord>();
  let quoteCount = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const isFollowUpContract = quoteCount > 0;
      results.push({
        premium: calculateQuotePremium(
          step.items,
          scenario.customer.yearsWithMHPCO,
          isFollowUpContract,
        ),
      });
      policies.set(index, createPolicy(step.items));
      quoteCount += 1;
    } else {
      const policy = policies.get(step.policy)!;
      results.push(processClaim(policy, step.incident.damages));
    }
  });

  return { results };
}
