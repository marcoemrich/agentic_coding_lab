// MHPCO Claim Office — policy management for magical items

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
  op: 'quote';
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: 'claim';
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

export interface Output {
  results: StepResult[];
}

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
  isComponent: boolean;
}

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword:     { insuranceValue: 1000, basePremium: 100, isComponent: false },
  amulet:    { insuranceValue:  600, basePremium:  60, isComponent: false },
  staff:     { insuranceValue:  800, basePremium:  80, isComponent: false },
  potion:    { insuranceValue:  400, basePremium:  40, isComponent: false },
  rune:      { insuranceValue:  250, basePremium:  25, isComponent: true  },
  moonstone: { insuranceValue:  250, basePremium:  25, isComponent: true  },
};

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const DEDUCTIBLE = 100;
const PROCESSING_FEE = 5;
const CAP_MULTIPLIER = 2;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOWUP_CONTRACT_DISCOUNT_RATE = 0.15;

const DAMAGE_HALF_ENCHANTMENT_THRESHOLD = 8;

interface Policy {
  items: Item[];
  remainingCap: number;
}

function priceListEntry(itemType: string): PriceListEntry {
  const entry = PRICE_LIST[itemType];
  if (!entry) {
    throw new Error(`Unknown item type: ${itemType}`);
  }
  return entry;
}

function isHighlyEnchanted(item: Item, threshold: number): boolean {
  return typeof item.enchantment === 'number' && item.enchantment >= threshold;
}

// Premium amounts round up (in MHPCO's favor); payouts round down.
function roundInFavor(value: number, direction: 'up' | 'down'): number {
  const eps = 1e-9;
  return direction === 'up' ? Math.ceil(value - eps) : Math.floor(value + eps);
}

// Policy base premium = sum of every item's base premium, with the building-block
// discount applied to component groups of exactly 3 alike items.
function policyBasePremium(items: Item[]): number {
  const componentCount = new Map<string, number>();
  let mainTotal = 0;
  for (const item of items) {
    const entry = priceListEntry(item.type);
    if (entry.isComponent) {
      componentCount.set(item.type, (componentCount.get(item.type) ?? 0) + 1);
    } else {
      mainTotal += entry.basePremium;
    }
  }
  let componentTotal = 0;
  for (const [type, count] of componentCount) {
    componentTotal += count === COMPONENT_BLOCK_SIZE
      ? COMPONENT_BLOCK_PREMIUM
      : count * PRICE_LIST[type].basePremium;
  }
  return mainTotal + componentTotal;
}

// Item-specific surcharges (cursed, high enchantment) — applied to each item's base premium.
function itemSurcharge(item: Item): number {
  const base = priceListEntry(item.type).basePremium;
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * CURSE_SURCHARGE_RATE;
  }
  if (isHighlyEnchanted(item, HIGH_ENCHANTMENT_THRESHOLD)) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
}

// Policy-wide modifiers — applied to the policy base premium.
function policyModifiers(policyBase: number, customer: Customer, quoteIndex: number): number {
  let modifiers = policyBase * FIRST_INSURANCE_SURCHARGE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    modifiers -= policyBase * LOYALTY_DISCOUNT_RATE;
  }
  if (quoteIndex > 0) {
    modifiers -= policyBase * FOLLOWUP_CONTRACT_DISCOUNT_RATE;
  }
  return modifiers;
}

export function computePremium(items: Item[], customer: Customer, quoteIndex: number): number {
  const base = policyBasePremium(items);
  const surcharges = items.reduce((s, i) => s + itemSurcharge(i), 0);
  const modifiers = policyModifiers(base, customer, quoteIndex);

  return roundInFavor(base + surcharges + modifiers + PROCESSING_FEE, 'up');
}

export function computeInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + priceListEntry(item.type).insuranceValue, 0);
}

// Dragon-material items would reimburse at 100% — but ordinary items already do,
// and when dragon material AND high enchantment coincide the spec says the 50%
// rule wins. So dragon material has no observable effect on the payout.
function damagePayout(item: Item, damageAmount: number): number {
  const rate = isHighlyEnchanted(item, DAMAGE_HALF_ENCHANTMENT_THRESHOLD) ? 0.5 : 1;
  return Math.max(0, damageAmount * rate - DEDUCTIBLE);
}

// Each damage entry consumes one matching item from the policy. If a damage
// references an item type that isn't in the policy (or is already consumed by
// an earlier damage in the same incident), the claim is rejected.
function matchDamageToItem(policy: Policy, itemType: string, consumed: Set<number>): Item {
  for (let i = 0; i < policy.items.length; i++) {
    if (!consumed.has(i) && policy.items[i].type === itemType) {
      consumed.add(i);
      return policy.items[i];
    }
  }
  throw new Error(`Damage references item type "${itemType}" that is not in the policy`);
}

export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  for (const d of incident.damages) {
    if (d.amount < 0) {
      throw new Error(`Negative damage amount: ${d.amount}`);
    }
    priceListEntry(d.itemType);
  }

  const consumed = new Set<number>();
  let totalPayout = 0;
  for (const damage of incident.damages) {
    const item = matchDamageToItem(policy, damage.itemType, consumed);
    totalPayout += damagePayout(item, damage.amount);
  }

  const payout = roundInFavor(Math.min(totalPayout, policy.remainingCap), 'down');
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): Output {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;

  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === 'quote') {
      const premium = computePremium(step.items, scenario.customer, quoteCount);
      const cap = computeInsuranceSum(step.items) * CAP_MULTIPLIER;
      policies.set(stepIndex, { items: step.items, remainingCap: cap });
      results.push({ premium });
      quoteCount++;
    } else {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`Claim references unknown policy index: ${step.policy}`);
      }
      results.push(processClaim(policy, step.incident));
    }
  });

  return { results };
}
