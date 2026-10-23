export interface Customer {
  readonly yearsWithMHPCO: number;
}

export interface QuoteItem {
  readonly type: string;
  readonly material?: string;
  readonly enchantment?: number;
  readonly cursed?: boolean;
}

export interface QuoteStep {
  readonly op: "quote";
  readonly items: readonly QuoteItem[];
}

export interface DamageEntry {
  readonly itemType: string;
  readonly amount: number;
}

export interface Incident {
  readonly cause: string;
  readonly damages: readonly DamageEntry[];
}

export interface ClaimStep {
  readonly op: "claim";
  readonly policy: number;
  readonly incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  readonly customer: Customer;
  readonly steps: readonly Step[];
}

export interface QuoteResult {
  readonly premium: number;
}

export interface ClaimResult {
  readonly payout: number;
  readonly remainingCap: number;
}

export interface ScenarioOutcome {
  readonly results: readonly (QuoteResult | ClaimResult)[];
}

export class ClaimOfficeError extends Error {}

const PROCESSING_FEE_G = 5;
const SWORD_BASE_PREMIUM_G = 100;
const AMULET_BASE_PREMIUM_G = 60;
const STAFF_BASE_PREMIUM_G = 80;
const POTION_BASE_PREMIUM_G = 40;
const COMPONENT_BASE_PREMIUM_G = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM_G = 60;
const RUNE = "rune";
const MOONSTONE = "moonstone";
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const SWORD_INSURANCE_VALUE_G = 1000;
const AMULET_INSURANCE_VALUE_G = 600;
const STAFF_INSURANCE_VALUE_G = 800;
const POTION_INSURANCE_VALUE_G = 400;
const COMPONENT_INSURANCE_VALUE_G = 250;
const DEDUCTIBLE_G = 100;
const HIGH_CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const PAYOUT_CAP_FACTOR = 2;

interface MainItemPrice {
  readonly basePremium: number;
  readonly insuranceValue: number;
}

const MAIN_ITEM_PRICE_LIST: Record<string, MainItemPrice> = {
  sword: { basePremium: SWORD_BASE_PREMIUM_G, insuranceValue: SWORD_INSURANCE_VALUE_G },
  amulet: { basePremium: AMULET_BASE_PREMIUM_G, insuranceValue: AMULET_INSURANCE_VALUE_G },
  staff: { basePremium: STAFF_BASE_PREMIUM_G, insuranceValue: STAFF_INSURANCE_VALUE_G },
  potion: { basePremium: POTION_BASE_PREMIUM_G, insuranceValue: POTION_INSURANCE_VALUE_G },
};

function mainItemBasePremium(type: string): number {
  return MAIN_ITEM_PRICE_LIST[type]?.basePremium ?? 0;
}

function isKnownItemType(type: string): boolean {
  return type in MAIN_ITEM_PRICE_LIST || isComponent(type);
}

function validateQuoteItems(items: readonly QuoteItem[]): void {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new ClaimOfficeError(`unknown item type "${item.type}"`);
    }
  }
}

function isComponent(type: string): boolean {
  return type === RUNE || type === MOONSTONE;
}

function componentBlockPremium(count: number): number {
  if (count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_PREMIUM_G;
  }
  return count * COMPONENT_BASE_PREMIUM_G;
}

function policyBasePremium(items: readonly QuoteItem[]): number {
  const componentCounts = new Map<string, number>();
  let basePremium = 0;
  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      basePremium += mainItemBasePremium(item.type);
    }
  }
  for (const count of componentCounts.values()) {
    basePremium += componentBlockPremium(count);
  }
  return basePremium;
}

function riskSurcharge(item: QuoteItem): number {
  const itemBasePremium = mainItemBasePremium(item.type);
  let surcharge = 0;
  if (item.cursed === true) {
    surcharge += itemBasePremium * CURSED_SURCHARGE_RATE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    surcharge += itemBasePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
}

function quotePremium(
  items: readonly QuoteItem[],
  customer: Customer,
  contractIndex: number,
): number {
  const basePremium = policyBasePremium(items);
  const riskSurcharges = items.reduce((sum, item) => sum + riskSurcharge(item), 0);
  const firstInsurance = basePremium * FIRST_INSURANCE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
      ? basePremium * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscount =
    contractIndex > 0 ? basePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0;
  return Math.ceil(
    basePremium +
      riskSurcharges +
      firstInsurance -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE_G,
  );
}

interface Policy {
  readonly items: readonly QuoteItem[];
  remainingCap: number;
}

function insuranceValue(item: QuoteItem): number {
  if (isComponent(item.type)) {
    return COMPONENT_INSURANCE_VALUE_G;
  }
  return MAIN_ITEM_PRICE_LIST[item.type]?.insuranceValue ?? 0;
}

function policyInsuranceSum(items: readonly QuoteItem[]): number {
  return items.reduce((sum, item) => sum + insuranceValue(item), 0);
}

function findInsuredItem(policy: Policy, itemType: string): QuoteItem | undefined {
  return policy.items.find((item) => item.type === itemType);
}

function reimbursement(entry: DamageEntry, insuredItem: QuoteItem | undefined): number {
  const enchantment = insuredItem?.enchantment ?? 0;
  const rate =
    enchantment >= HIGH_CLAIM_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE : 1;
  return entry.amount * rate - DEDUCTIBLE_G;
}

function createPolicy(items: readonly QuoteItem[]): Policy {
  return { items, remainingCap: PAYOUT_CAP_FACTOR * policyInsuranceSum(items) };
}

function validateDamageCoverage(policy: Policy, damages: readonly DamageEntry[]): void {
  const remainingByType = new Map<string, number>();
  for (const item of policy.items) {
    remainingByType.set(item.type, (remainingByType.get(item.type) ?? 0) + 1);
  }
  for (const entry of damages) {
    const remaining = remainingByType.get(entry.itemType) ?? 0;
    if (remaining <= 0) {
      throw new ClaimOfficeError(
        `damage entry for "${entry.itemType}" exceeds the insured items on this policy`,
      );
    }
    remainingByType.set(entry.itemType, remaining - 1);
  }
}

function validateIncident(policy: Policy, incident: Incident): void {
  for (const entry of incident.damages) {
    if (entry.amount < 0) {
      throw new ClaimOfficeError(`damage amount must not be negative (got ${entry.amount})`);
    }
  }
  validateDamageCoverage(policy, incident.damages);
}

function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  validateIncident(policy, incident);
  const rawPayout = incident.damages.reduce((sum, entry) => {
    const insuredItem = findInsuredItem(policy, entry.itemType);
    if (!insuredItem) {
      throw new ClaimOfficeError(`no insured item of type "${entry.itemType}" on this policy`);
    }
    return sum + reimbursement(entry, insuredItem);
  }, 0);
  const payout = Math.min(Math.floor(rawPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): ScenarioOutcome {
  const policies = new Map<number, Policy>();
  let contractIndex = 0;
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const items = step.items;
      validateQuoteItems(items);
      policies.set(stepIndex, createPolicy(items));
      const premium = quotePremium(items, scenario.customer, contractIndex);
      contractIndex += 1;
      return { premium } satisfies QuoteResult;
    }
    const policy = policies.get(step.policy);
    if (!policy) {
      throw new ClaimOfficeError(`claim references unknown policy step ${step.policy}`);
    }
    return settleClaim(policy, step.incident) satisfies ClaimResult;
  });
  return { results };
}
