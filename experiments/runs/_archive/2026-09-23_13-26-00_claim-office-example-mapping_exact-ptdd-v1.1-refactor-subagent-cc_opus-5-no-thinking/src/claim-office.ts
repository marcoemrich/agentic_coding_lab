export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;

const DEDUCTIBLE_PER_DAMAGE = 100;
const REDUCED_REIMBURSEMENT_ENCHANTMENT = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

const CURSE_SURCHARGE_RATE = 0.5;

const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

// The MHPCO price list: what each item type it insures is worth and what it costs
// to insure. Components -- runes, moonstones -- share one component tariff.
interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

const COMPONENT_TARIFF: PriceListEntry = { insuranceValue: 250, basePremium: 25 };

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: COMPONENT_TARIFF,
  moonstone: COMPONENT_TARIFF,
};

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

// The MHPCO insures only the items on its price list.
function priceListEntry(type: string): PriceListEntry {
  const entry = PRICE_LIST[type];
  if (entry === undefined) {
    throw new Error(`The MHPCO does not insure items of type ${type}`);
  }
  return entry;
}

function itemBasePremium(type: string): number {
  return priceListEntry(type).basePremium;
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

// The MHPCO offers the building block of 3 alike components. No active example
// prices a group of three alike main items, so the size test below is not yet
// restricted to components; restrict it when such an example is activated.
function alikeGroupBasePremium(type: string, count: number): number {
  if (count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_BASE_PREMIUM;
  }
  return count * itemBasePremium(type);
}

function policyBasePremium(items: Item[]): number {
  let total = 0;
  for (const [type, count] of countByType(items)) {
    total += alikeGroupBasePremium(type, count);
  }
  return total;
}

// Which risk surcharges an item's own risk profile earns, as a combined rate.
function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function itemSurchargeRate(item: Item): number {
  return (
    (item.cursed === true ? CURSE_SURCHARGE_RATE : 0) +
    (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0)
  );
}

// Item-specific modifiers apply to the base premium of the affected item, not to
// the policy total.
function itemSurcharges(items: Item[]): number {
  return items.reduce(
    (total, item) => total + itemSurchargeRate(item) * itemBasePremium(item.type),
    0,
  );
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

// Which policy-wide modifiers the customer's standing earns, as a combined signed
// rate: discounts are negative, surcharges positive. The first-insurance surcharge
// is unconditional -- every quoted item is a first insurance, whatever the
// customer's history.
function policyWideRate(customer: Customer, precedingContracts: number): number {
  return (
    (isLongStanding(customer) ? -LOYALTY_DISCOUNT_RATE : 0) +
    FIRST_INSURANCE_SURCHARGE_RATE +
    (precedingContracts > 0 ? -FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0)
  );
}

// The MHPCO stages a premium: item-specific modifiers apply to the base premium
// of the affected item, policy-wide modifiers apply to the policy base premium,
// and the processing fee is added at the very end.
export function quote(customer: Customer, items: Item[], precedingContracts = 0): number {
  const basePremium = policyBasePremium(items);
  const premiumBeforeFee =
    basePremium +
    itemSurcharges(items) +
    // Policy-wide modifiers apply to the policy base premium, not to any single item.
    policyWideRate(customer, precedingContracts) * basePremium;
  return premiumBeforeFee + PROCESSING_FEE;
}

export interface QuoteStep {
  op: "quote";
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

// The MHPCO insures each item at its price-list insurance value; the block
// discount affects the premium only, not the insurance sum.
function itemInsuranceValue(type: string): number {
  return priceListEntry(type).insuranceValue;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + itemInsuranceValue(item.type), 0);
}

// A policy the MHPCO has written: the items it covers and the payout cap still
// available on it.
interface Policy {
  items: Item[];
  remainingCap: number;
}

const FULL_REIMBURSEMENT_RATE = 1;

// The share of a damage the MHPCO reimburses, arbitrating both of its clauses:
// damage to a highly enchanted item earns half the damage amount, and damage to
// an item of dragon material is fully reimbursed. The 50 % clause wins wherever
// both apply, and full reimbursement is what the MHPCO grants anyway, so dragon
// material never moves the rate and the decision turns on enchantment alone.
function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT
    ? REDUCED_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;
}

// The MHPCO reimburses a damage at the rate its item's clauses earn, less the
// deductible that applies to every damage event.
// A damage that does not exceed the deductible earns nothing; the MHPCO never
// pays out a negative amount.
function damagePayout({ item, damage }: DamageToInsuredItem): number {
  return Math.max(0, reimbursementRate(item) * damage.amount - DEDUCTIBLE_PER_DAMAGE);
}

// The MHPCO rounds in its own favour: a payout is rounded down.
function roundedPayout(payout: number): number {
  return Math.floor(payout);
}

// The MHPCO writes a policy over the quoted items and opens its payout cap at
// twice the insurance sum.
function writePolicy(items: Item[]): Policy {
  return {
    items,
    remainingCap: CAP_MULTIPLE_OF_INSURANCE_SUM * insuranceSum(items),
  };
}

// A damage report the MHPCO has accepted: the reported damage together with the
// one insured item it is charged against.
interface DamageToInsuredItem {
  item: Item;
  damage: Damage;
}

// A damage report the MHPCO will not consider at all. Damage is a loss, so a
// report of a negative amount is not a claim the MHPCO can assess.
function requireReportableDamage(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`A damage amount cannot be negative: ${String(damage.amount)}`);
  }
}

// Which insured item each damage report is charged against. The MHPCO only
// reimburses damage to an item its policy actually covers, and every damage is a
// damage to one insured item, so each report claims a distinct item of its type:
// a policy cannot be claimed for more items than it covers.
function damagesToInsuredItems(policy: Policy, damages: Damage[]): DamageToInsuredItem[] {
  const unclaimed = [...policy.items];
  return damages.map((damage) => {
    requireReportableDamage(damage);
    const index = unclaimed.findIndex((insured) => insured.type === damage.itemType);
    if (index === -1) {
      throw new Error(`The policy does not cover a further item of type ${damage.itemType}`);
    }
    return { item: unclaimed.splice(index, 1)[0], damage };
  });
}

// What the MHPCO owes for an incident: every damage reimbursed in turn against
// its own insured item, the total rounded in the MHPCO's favour.
function claimPayout(policy: Policy, incident: Incident): number {
  return roundedPayout(
    damagesToInsuredItems(policy, incident.damages).reduce(
      (total, charged) => total + damagePayout(charged),
      0,
    ),
  );
}

// A payout consumes the policy's cap, so successive claims on one policy
// accumulate against the same remaining cap.
function drawDownCap(policy: Policy, payout: number): number {
  policy.remainingCap -= payout;
  return policy.remainingCap;
}

// The total payout per policy is capped at twice the insurance sum, so the MHPCO
// never pays out more than the cap the policy has left: a claim that asks for
// more is reduced to the remainder, and once the cap is exhausted it earns
// nothing.
function limitedToRemainingCap(policy: Policy, owed: number): number {
  return Math.min(owed, policy.remainingCap);
}

// What the MHPCO settles for an incident: the amount the damages earn, limited to
// the policy's remaining cap, and drawn down from it.
function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  const payout = limitedToRemainingCap(policy, claimPayout(policy, incident));
  return { payout, remainingCap: drawDownCap(policy, payout) };
}

// The MHPCO rounds in its own favour: a premium is rounded up, and only the
// final amount is rounded -- intermediate amounts stay fractional.
function roundedPremium(premium: number): number {
  return Math.ceil(premium);
}

// Only a quote writes a contract. A claim is settled against a contract the
// MHPCO already holds, so it does not move the customer towards the follow-up
// contract discount.
function writesContract(step: Step): step is QuoteStep {
  return step.op === "quote";
}

// A claim names its policy by the index of the quote step that wrote it, so a
// claim against a step that wrote none is a claim the MHPCO cannot place.
function policyNamedBy(policies: Map<number, Policy>, step: number): Policy {
  const policy = policies.get(step);
  if (policy === undefined) {
    throw new Error(`Claim refers to step ${String(step)}, which wrote no policy`);
  }
  return policy;
}

// A scenario is one customer's sequence of operations, processed in order. Each
// step is quoted against the number of contracts that preceded it, so every
// contract after the customer's first earns the follow-up-contract discount.
export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const policies = new Map<number, Policy>();
  let precedingContracts = 0;
  const results = scenario.steps.map((step, index): StepResult => {
    if (!writesContract(step)) {
      return settleClaim(policyNamedBy(policies, step.policy), step.incident);
    }
    const premium = roundedPremium(quote(scenario.customer, step.items, precedingContracts));
    policies.set(index, writePolicy(step.items));
    precedingContracts += 1;
    return { premium };
  });
  return { results };
}
