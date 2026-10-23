export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: DamageEntry[];
  };
}

export type ScenarioStep = QuoteStep | ClaimStep;

export interface Scenario {
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

const PROCESSING_FEE_G = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_DISCOUNT_MIN_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const HUNDREDTHS_PER_G = 100;

const SWORD_BASE_PREMIUM_G = 100;
const AMULET_BASE_PREMIUM_G = 60;
const STAFF_BASE_PREMIUM_G = 80;
const POTION_BASE_PREMIUM_G = 40;
const COMPONENT_BASE_PREMIUM_G = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM_G = 60;

const SWORD_INSURANCE_VALUE_G = 1000;
const AMULET_INSURANCE_VALUE_G = 600;
const STAFF_INSURANCE_VALUE_G = 800;
const POTION_INSURANCE_VALUE_G = 400;
const COMPONENT_INSURANCE_VALUE_G = 250;
const POLICY_CAP_MULTIPLIER = 2;
const DEDUCTIBLE_PER_DAMAGE_G = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

interface ItemCatalogueEntry {
  insuranceValue: number;
  basePremium: number;
  isComponent: boolean;
}

const ITEM_CATALOGUE: Record<string, ItemCatalogueEntry> = {
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

function calculateComponentTypeBasePremium(count: number): number {
  return count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_BASE_PREMIUM_G
    : count * COMPONENT_BASE_PREMIUM_G;
}

function getCatalogueEntry(itemType: string): ItemCatalogueEntry {
  const entry = ITEM_CATALOGUE[itemType];
  if (!entry) {
    throw new Error(`Unknown item type: ${itemType}`);
  }
  return entry;
}

function calculatePolicyBasePremium(items: QuoteItem[]): number {
  const componentCounts = new Map<string, number>();
  let mainItemsBasePremium = 0;

  for (const item of items) {
    const entry = getCatalogueEntry(item.type);
    if (entry.isComponent) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      mainItemsBasePremium += entry.basePremium;
    }
  }

  let componentsBasePremium = 0;
  for (const count of componentCounts.values()) {
    componentsBasePremium += calculateComponentTypeBasePremium(count);
  }

  return mainItemsBasePremium + componentsBasePremium;
}

function roundPremiumInMhpcoFavor(amount: number): number {
  return Math.ceil(Math.round(amount * HUNDREDTHS_PER_G) / HUNDREDTHS_PER_G);
}

function calculateItemRiskSurcharge(item: QuoteItem): number {
  const itemBasePremium = getCatalogueEntry(item.type).basePremium;
  const curseSurcharge = item.cursed
    ? itemBasePremium * CURSED_SURCHARGE_RATE
    : 0;
  const highEnchantmentSurcharge =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD
      ? itemBasePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return curseSurcharge + highEnchantmentSurcharge;
}

function calculatePolicyWideModifier(
  basePremium: number,
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number {
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount =
    yearsWithMHPCO >= LOYALTY_DISCOUNT_MIN_YEARS
      ? basePremium * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscount = isFollowUpContract
    ? basePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    : 0;
  return firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;
}

function calculateQuotePremium(
  step: QuoteStep,
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): QuoteResult {
  const basePremium = calculatePolicyBasePremium(step.items);
  const itemRiskSurcharges = step.items.reduce(
    (sum, item) => sum + calculateItemRiskSurcharge(item),
    0,
  );
  const policyWideModifier = calculatePolicyWideModifier(
    basePremium,
    yearsWithMHPCO,
    isFollowUpContract,
  );
  return {
    premium: roundPremiumInMhpcoFavor(
      basePremium +
        itemRiskSurcharges +
        policyWideModifier +
        PROCESSING_FEE_G,
    ),
  };
}

interface PolicyState {
  items: QuoteItem[];
  remainingCap: number;
}

function createPolicy(items: QuoteItem[]): PolicyState {
  const insuranceSum = items.reduce(
    (sum, item) => sum + getCatalogueEntry(item.type).insuranceValue,
    0,
  );
  return {
    items,
    remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER,
  };
}

function calculateDamageReimbursement(
  damage: DamageEntry,
  insuredItem: QuoteItem,
): number {
  if (damage.amount < 0) {
    throw new Error(`Invalid damage amount: ${damage.amount}`);
  }
  const reimbursementRate =
    (insuredItem.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
      ? HIGH_ENCHANTMENT_CLAIM_RATE
      : 1;
  return Math.max(
    0,
    damage.amount * reimbursementRate - DEDUCTIBLE_PER_DAMAGE_G,
  );
}

function roundPayoutInMhpcoFavor(amount: number): number {
  return Math.floor(Math.round(amount * HUNDREDTHS_PER_G) / HUNDREDTHS_PER_G);
}

function matchDamageToInsuredItem(
  damage: DamageEntry,
  remainingPolicyItems: QuoteItem[],
): QuoteItem {
  const itemIndex = remainingPolicyItems.findIndex(
    (item) => item.type === damage.itemType,
  );
  if (itemIndex < 0) {
    throw new Error(`Item type not covered by policy: ${damage.itemType}`);
  }
  const [insuredItem] = remainingPolicyItems.splice(itemIndex, 1);
  return insuredItem;
}

function processClaim(step: ClaimStep, policy: PolicyState): ClaimResult {
  const remainingPolicyItems = [...policy.items];
  const rawPayout = step.incident.damages.reduce((sum, damage) => {
    const insuredItem = matchDamageToInsuredItem(damage, remainingPolicyItems);
    return sum + calculateDamageReimbursement(damage, insuredItem);
  }, 0);
  const payout = Math.min(
    roundPayoutInMhpcoFavor(rawPayout),
    policy.remainingCap,
  );
  policy.remainingCap -= payout;
  return {
    payout,
    remainingCap: policy.remainingCap,
  };
}

export function processScenario(scenario: Scenario): ScenarioOutput {
  let hasPreviousContract = false;
  const policiesByStepIndex = new Map<number, PolicyState>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === "quote") {
        const result = calculateQuotePremium(
          step,
          scenario.customer.yearsWithMHPCO,
          hasPreviousContract,
        );
        hasPreviousContract = true;
        policiesByStepIndex.set(index, createPolicy(step.items));
        return result;
      }
      const policy = policiesByStepIndex.get(step.policy);
      if (!policy) {
        throw new Error(`Invalid policy reference: ${step.policy}`);
      }
      return processClaim(step, policy);
    }),
  };
}
