export type ItemType = "sword" | "amulet" | "staff" | "potion" | "rune" | "moonstone";

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: DamageEntry[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
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

interface ItemSpec {
  insuranceValue: number;
  basePremium: number;
  isComponent: boolean;
}

const ITEM_SPECS: Record<string, ItemSpec> = {
  sword:     { insuranceValue: 1000, basePremium: 100, isComponent: false },
  amulet:    { insuranceValue: 600,  basePremium: 60,  isComponent: false },
  staff:     { insuranceValue: 800,  basePremium: 80,  isComponent: false },
  potion:    { insuranceValue: 400,  basePremium: 40,  isComponent: false },
  rune:      { insuranceValue: 250,  basePremium: 25,  isComponent: true  },
  moonstone: { insuranceValue: 250,  basePremium: 25,  isComponent: true  },
};

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const PROCESSING_FEE = 5;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const LOYALTY_YEARS_THRESHOLD = 2;
const HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const CLAIM_HALF_REIMBURSEMENT_RATE = 0.5;

function specFor(type: string): ItemSpec {
  const spec = ITEM_SPECS[type];
  if (!spec) throw new Error(`Unknown item type: ${type}`);
  return spec;
}

interface PolicyRecord {
  items: Item[];
  remainingCap: number;
}

/**
 * Compute per-item base premiums and the policy base total, applying
 * the "exactly 3 alike components" block discount. The block applies
 * only when a component group has exactly 3 items.
 */
function computeItemBasePremiums(items: Item[]): {
  perItem: Map<Item, number>;
  policyBase: number;
} {
  const perItem = new Map<Item, number>();
  const componentGroups = new Map<string, Item[]>();
  let policyBase = 0;

  for (const item of items) {
    const spec = specFor(item.type);
    if (spec.isComponent) {
      const list = componentGroups.get(item.type) ?? [];
      list.push(item);
      componentGroups.set(item.type, list);
    } else {
      perItem.set(item, spec.basePremium);
      policyBase += spec.basePremium;
    }
  }

  for (const group of componentGroups.values()) {
    const groupTotal =
      group.length === BLOCK_SIZE
        ? BLOCK_PREMIUM
        : group.length * specFor(group[0].type).basePremium;
    policyBase += groupTotal;
    const perItemAmount = groupTotal / group.length;
    for (const it of group) perItem.set(it, perItemAmount);
  }

  return { perItem, policyBase };
}

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function isHighlyEnchantedForPremium(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD;
}

function itemSurcharge(item: Item, base: number): number {
  let surcharge = 0;
  if (isCursed(item)) surcharge += base * CURSED_SURCHARGE_RATE;
  if (isHighlyEnchantedForPremium(item)) surcharge += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  return surcharge;
}

function computeQuotePremium(
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): number {
  const { perItem, policyBase } = computeItemBasePremiums(items);

  let total = policyBase;
  for (const item of items) {
    total += itemSurcharge(item, perItem.get(item) ?? 0);
  }

  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    total -= policyBase * LOYALTY_DISCOUNT_RATE;
  }
  total += policyBase * FIRST_INSURANCE_SURCHARGE_RATE;
  if (isFollowUpContract) {
    total -= policyBase * FOLLOW_UP_DISCOUNT_RATE;
  }
  total += PROCESSING_FEE;

  return Math.ceil(total);
}

function computeInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + specFor(item.type).insuranceValue, 0);
}

function triggersClaimHighEnchantment(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

// The half-rate applies whenever enchantment ≥ 8, regardless of material.
// Dragon material only matters as a tiebreaker for non-enchanted items —
// where it would otherwise grant full reimbursement, which is also the
// default. So a single check on the half-rate clause suffices.
function reimbursementRate(item: Item): number {
  return triggersClaimHighEnchantment(item) ? CLAIM_HALF_REIMBURSEMENT_RATE : 1;
}

/**
 * Pair each damage entry with one insured item of the matching type,
 * consuming items as it goes. Throws if a damage refers to a type the
 * policy does not cover or covers fewer of than were damaged.
 */
function matchDamagesToItems(items: Item[], damages: DamageEntry[]): Item[] {
  const remaining = new Map<string, Item[]>();
  for (const item of items) {
    const list = remaining.get(item.type) ?? [];
    list.push(item);
    remaining.set(item.type, list);
  }

  return damages.map((d) => {
    const list = remaining.get(d.itemType);
    if (!list || list.length === 0) {
      throw new Error(`Claim references item not part of policy: ${d.itemType}`);
    }
    return list.shift()!;
  });
}

function validateDamages(damages: DamageEntry[]): void {
  for (const d of damages) {
    if (d.amount < 0) throw new Error(`Negative damage amount: ${d.amount}`);
    specFor(d.itemType);
  }
}

function processClaim(policy: PolicyRecord, incident: Incident): ClaimResult {
  validateDamages(incident.damages);
  const matched = matchDamagesToItems(policy.items, incident.damages);

  let totalPayout = 0;
  for (let i = 0; i < incident.damages.length; i++) {
    const rate = reimbursementRate(matched[i]);
    const afterDeductible = incident.damages[i].amount * rate - DEDUCTIBLE;
    if (afterDeductible > 0) totalPayout += afterDeductible;
  }

  const payout = Math.min(Math.floor(totalPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioOutput {
  const results: StepResult[] = [];
  const policies = new Map<number, PolicyRecord>();
  let priorQuoteCount = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const isFollowUp = priorQuoteCount > 0;
      const premium = computeQuotePremium(step.items, scenario.customer, isFollowUp);
      const insuranceSum = computeInsuranceSum(step.items);
      policies.set(index, {
        items: step.items,
        remainingCap: insuranceSum * 2,
      });
      results.push({ premium });
      priorQuoteCount++;
    } else {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`No policy at step index ${step.policy}`);
      results.push(processClaim(policy, step.incident));
    }
  });

  return { results };
}
