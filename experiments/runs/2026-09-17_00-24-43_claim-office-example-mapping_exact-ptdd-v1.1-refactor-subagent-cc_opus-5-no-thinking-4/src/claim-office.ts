/**
 * What MHPCO knows about the customer's standing: the facts of their history
 * with the office that its policy-wide discount rules are written against.
 */
export interface Customer {
  yearsWithMHPCO: number;
  /** Contracts this customer already holds, before the one being quoted. */
  previousContracts?: number;
}

export interface Item {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
}

/**
 * How MHPCO prices one insurable type. `kind` is the pricing category the
 * office files the type under: main items are priced one by one, components
 * are priced as a group so that the building-block offer can be applied.
 */
interface PriceListEntry {
  kind: "main" | "component";
  basePremium: number;
  insuranceValue: number;
}

/**
 * The MHPCO price list: the office's record of every type it insures at all.
 * Absence from this list is the office's rejection condition — MHPCO insures
 * exactly what it has priced.
 */
const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { kind: "main", basePremium: 100, insuranceValue: 1000 },
  amulet: { kind: "main", basePremium: 60, insuranceValue: 600 },
  staff: { kind: "main", basePremium: 80, insuranceValue: 800 },
  potion: { kind: "main", basePremium: 40, insuranceValue: 400 },
  rune: { kind: "component", basePremium: 25, insuranceValue: 250 },
  moonstone: { kind: "component", basePremium: 25, insuranceValue: 250 },
};
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const PROCESSING_FEE = 5;
const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;
const FULL_REIMBURSEMENT_RATE = 1;
const HALF_REIMBURSEMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

/** MHPCO insures exactly the types on its price list; anything else it turns away. */
function priceListEntry(item: Item): PriceListEntry {
  const entry = PRICE_LIST[item.type];
  if (entry === undefined) {
    throw new Error(`MHPCO does not insure items of type "${item.type}"`);
  }
  return entry;
}

function isComponent(item: Item): boolean {
  return priceListEntry(item).kind === "component";
}

function isMainItem(item: Item): boolean {
  return priceListEntry(item).kind === "main";
}

/** What the customer pays to insure the item, before any offer or modifier. */
function itemBasePremium(item: Item): number {
  return priceListEntry(item).basePremium;
}

/**
 * What MHPCO insures the item for. A price-list fact: pricing offers such as
 * the building block and premium modifiers such as a curse surcharge move what
 * the customer pays, never what the office insures the item for.
 */
function itemInsuranceValue(item: Item): number {
  return priceListEntry(item).insuranceValue;
}

/**
 * The building-block offer: MHPCO's standing promotion on a group of alike
 * components. It is a pricing offer, not a price-list fact, so it lives beside
 * the price list rather than inside it.
 */
function alikeGroupBasePremium(group: Item[]): number {
  return group.length === BLOCK_SIZE
    ? BLOCK_BASE_PREMIUM
    : group.reduce((total, component) => total + itemBasePremium(component), 0);
}

/** Components are "alike" when they are of exactly the same type. */
function alikeKey(component: Item): string {
  return component.type;
}

function componentsBasePremium(components: Item[]): number {
  const alikeGroups = new Map<string, Item[]>();
  for (const component of components) {
    const key = alikeKey(component);
    alikeGroups.set(key, [...(alikeGroups.get(key) ?? []), component]);
  }
  return [...alikeGroups.values()].reduce(
    (total, group) => total + alikeGroupBasePremium(group),
    0,
  );
}

function curseSurcharge(item: Item): number {
  return item.cursed === true
    ? itemBasePremium(item) * CURSE_SURCHARGE_RATE
    : 0;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function highEnchantmentSurcharge(item: Item): number {
  return isHighlyEnchanted(item)
    ? itemBasePremium(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
}

/**
 * Item-specific modifiers apply to the base premium of the affected item and
 * are added to it, never multiplied onto it. Each risk rule is independent:
 * its own condition, its own rate.
 */
function itemSpecificModifiers(item: Item): number {
  return curseSurcharge(item) + highEnchantmentSurcharge(item);
}

function mainItemsBasePremium(mainItems: Item[]): number {
  return mainItems.reduce((total, item) => total + itemBasePremium(item), 0);
}

/** The policy base premium: the sum of all unmodified item base premiums. */
function policyBasePremiumFor(items: Item[]): number {
  return (
    mainItemsBasePremium(items.filter(isMainItem)) +
    componentsBasePremium(items.filter(isComponent))
  );
}

/**
 * The item-specific surcharges of every affected item, summed. A risk rule reads
 * the item it is written against, not the pricing category the office files it
 * under: a cursed component would carry the curse surcharge like anything else.
 */
function itemSpecificModifiersFor(items: Item[]): number {
  return items.reduce((total, item) => total + itemSpecificModifiers(item), 0);
}

/**
 * Rounding in the MHPCO's favour is a single policy with two arms: an amount
 * the customer pays goes up, an amount MHPCO pays out goes down. This is the
 * premium arm; it is named for the amount it rounds so that a payout can never
 * reach it by mistake.
 */
function roundPremiumInMHPCOsFavour(premium: number): number {
  return Math.ceil(premium);
}

/** Every item in a quote is treated as a first insurance. */
function firstInsuranceSurcharge(policyBasePremium: number): number {
  return policyBasePremium * FIRST_INSURANCE_SURCHARGE_RATE;
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function loyaltyDiscount(customer: Customer, policyBasePremium: number): number {
  return isLongStanding(customer)
    ? policyBasePremium * LOYALTY_DISCOUNT_RATE
    : 0;
}

function isFollowUpContract(customer: Customer): boolean {
  return (customer.previousContracts ?? 0) > 0;
}

function followUpDiscount(
  customer: Customer,
  policyBasePremium: number,
): number {
  return isFollowUpContract(customer)
    ? policyBasePremium * FOLLOW_UP_DISCOUNT_RATE
    : 0;
}

/**
 * Policy-wide modifiers apply to the policy base premium (the sum of all item
 * base premiums) and are added to it, never multiplied onto it. Each rule is
 * independent: its own condition, its own rate. Surcharges raise the premium
 * and discounts lower it; each is computed as a positive amount off the
 * unmodified policy base premium and given its sign here.
 */
function policyWideModifiers(
  customer: Customer,
  policyBasePremium: number,
): number {
  return (
    firstInsuranceSurcharge(policyBasePremium) -
    loyaltyDiscount(customer, policyBasePremium) -
    followUpDiscount(customer, policyBasePremium)
  );
}

export function quote(customer: Customer, items: Item[]): number {
  const policyBasePremium = policyBasePremiumFor(items);
  const premium =
    policyBasePremium +
    itemSpecificModifiersFor(items) +
    policyWideModifiers(customer, policyBasePremium) +
    PROCESSING_FEE;
  return roundPremiumInMHPCOsFavour(premium);
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

/** A policy MHPCO has written: the items it covers and the cap still available. */
export interface Policy {
  items: Item[];
  remainingCap: number;
}

/** The insurance sum: what MHPCO insures the policy's items for, unmodified. */
function insuranceSumFor(items: Item[]): number {
  return items.reduce((total, item) => total + itemInsuranceValue(item), 0);
}

/**
 * The cap MHPCO writes a policy for: twice the insurance sum. It is derived
 * from the unmodified insurance values alone — premium modifiers such as a
 * curse surcharge raise what the customer pays, never what the office owes.
 */
function capFor(items: Item[]): number {
  return insuranceSumFor(items) * CAP_MULTIPLE_OF_INSURANCE_SUM;
}

export function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: capFor(items) };
}

/** Rounded in MHPCO's favour: a payout of 350.5 G is settled at 350 G. */
function roundPayoutInMHPCOsFavour(payout: number): number {
  return Math.floor(payout);
}

/**
 * A damage entry reports against an insured item when they are of the same
 * type: the entry names a type, and the policy's items are what the office has
 * written against that name.
 */
function reportsAgainst(damage: Damage, covered: Item): boolean {
  return covered.type === damage.itemType;
}

/**
 * A damage entry paired with the insured item MHPCO has held it against. The
 * office settles damages, not items: what it needs to read a claim is which
 * insured item answers for which reported damage.
 */
interface DamagedItem {
  item: Item;
  damage: Damage;
}

/**
 * A damage reports a loss; MHPCO does not entertain one reported as negative.
 * Admissibility is a condition on the entry itself, read when the office takes
 * the incident in hand, and independent of what the entry would later earn.
 */
function admitReportedDamage(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(
      `a damage cannot report a negative amount (${damage.amount})`,
    );
  }
}

/**
 * Which insured item answers for each of an incident's damages. The office
 * reads every entry before it settles anything: an inadmissible entry is turned
 * away, and so is one it can hold no insured item against. It holds a damaged
 * item to account once — an item already spoken for by an earlier entry is no
 * longer available to a later one, so an incident that reports more damages of a
 * type than the policy covers is turned away naming that type, as is one that
 * reports a type the policy never covered at all.
 */
function damagedItems(policy: Policy, incident: Incident): DamagedItem[] {
  const unclaimed = [...policy.items];
  return incident.damages.map((damage) => {
    admitReportedDamage(damage);
    const index = unclaimed.findIndex((covered) =>
      reportsAgainst(damage, covered),
    );
    if (index === -1) {
      throw new Error(
        `the policy does not cover items of type "${damage.itemType}"`,
      );
    }
    return { item: unclaimed.splice(index, 1)[0], damage };
  });
}

/**
 * Damage to a highly enchanted item is reimbursed at half: MHPCO reads a high
 * enchantment as the item courting its own misfortune.
 */
function isHalfReimbursed(item: Item): boolean {
  return (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_LEVEL;
}

/**
 * The reimbursement clauses of the damaged item, as the rates they carry. Each
 * clause is independent: its own condition on the item, its own rate. A clause
 * that does not apply is simply absent, and an item the office has written no
 * clause against reimburses in full.
 *
 * MHPCO's dragon-material clause is deliberately absent here, and its absence is
 * a conclusion rather than an omission. The clause reimburses in full, so the
 * rate it carries is FULL_REIMBURSEMENT_RATE — the same rate an item with no
 * clause at all already receives, and the most generous rate there is. Since the
 * office settles at the least generous applicable rate, a dragon entry could
 * never lower a settlement and could never raise one above the default: it is
 * inert at every enchantment level, both where it applies alone and where the
 * half-reimbursement clause applies alongside it. Listing it would add an
 * element that cannot change an outcome. Should the office ever rewrite its
 * conflict rule to read the clauses in the customer's favour, or write a dragon
 * clause at a rate other than full, this is where that clause belongs.
 */
function reimbursementClauseRates(item: Item): number[] {
  return isHalfReimbursed(item) ? [HALF_REIMBURSEMENT_RATE] : [];
}

/**
 * The rate MHPCO reimburses the damaged item at. Where several clauses apply
 * the office reads them in its own favour and settles at the least generous.
 */
function reimbursementRate(item: Item): number {
  return Math.min(FULL_REIMBURSEMENT_RATE, ...reimbursementClauseRates(item));
}

/** How much of a damage MHPCO reimburses before its excess is deducted. */
function reimbursableDamage(item: Item, damage: Damage): number {
  return damage.amount * reimbursementRate(item);
}

/**
 * What one damage earns after the office's excess: the clause decides how much
 * of the damage is reimbursable, and the deductible falls on the damage event,
 * so every entry in an incident bears it separately — two damaged items, two
 * deductibles.
 */
function damageNetOfDeductible({ item, damage }: DamagedItem): number {
  return reimbursableDamage(item, damage) - DEDUCTIBLE_PER_DAMAGE;
}

/** What the incident earns on its own merits, cap not yet applied. */
function reimbursementForIncident(policy: Policy, incident: Incident): number {
  return damagedItems(policy, incident).reduce(
    (total, damagedItem) => total + damageNetOfDeductible(damagedItem),
    0,
  );
}

/**
 * The cap MHPCO has left on the policy is the ceiling on every further
 * settlement: however much an incident earns, the office pays at most what the
 * policy still has available, and a claim against an exhausted cap earns nothing.
 */
function limitedToRemainingCap(policy: Policy, reimbursement: number): number {
  return Math.min(reimbursement, policy.remainingCap);
}

/**
 * The settlement: what MHPCO actually pays. The incident earns on its own
 * merits, the policy's remaining cap limits it, and the amount is rounded in
 * the office's favour.
 */
function settlementFor(policy: Policy, incident: Incident): number {
  return roundPayoutInMHPCOsFavour(
    limitedToRemainingCap(policy, reimbursementForIncident(policy, incident)),
  );
}

/**
 * Settling a claim pays the settlement and draws it down from the policy's cap:
 * what MHPCO has paid on a policy it will not pay again, so the policy carries
 * the drawdown between claims and each settlement lowers the ceiling on the next.
 */
export function claim(policy: Policy, incident: Incident): ClaimResult {
  const payout = settlementFor(policy, incident);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

/** A piece of business the customer brings to the office: a quote, or a claim. */
export type Business =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: Incident };

export type BusinessOutcome = { premium: number } | ClaimResult;

/** The customer's whole visit: who they are, and what they bring in order. */
export interface Scenario {
  customer: Customer;
  steps: Business[];
}

/**
 * The office's book of the policies written during one visit. A claim names a
 * policy by the step that wrote it, so that is the name this book files under —
 * and a claim can only be held against business that actually put a policy on
 * the books. How many policies stand in the book is also how many contracts the
 * customer has taken on so far in the visit.
 */
class PolicyRegister {
  private readonly byWritingStep = new Map<number, Policy>();

  get policiesWritten(): number {
    return this.byWritingStep.size;
  }

  fileWrittenBy(writingStep: number, policy: Policy): void {
    this.byWritingStep.set(writingStep, policy);
  }

  writtenBy(writingStep: number): Policy {
    const policy = this.byWritingStep.get(writingStep);
    if (policy === undefined) {
      throw new Error(`step ${writingStep} did not write a policy`);
    }
    return policy;
  }
}

/**
 * How many contracts the customer already holds when the office takes the next
 * quote in hand. MHPCO counts the policies it has written them in this visit on
 * top of whatever history they arrived with, so the second quote of a visit is a
 * follow-up contract even for a customer who walked in with none.
 */
function standingBefore(customer: Customer, policiesWritten: number): Customer {
  return {
    ...customer,
    previousContracts: (customer.previousContracts ?? 0) + policiesWritten,
  };
}

/**
 * The office works the customer's business in order, because each piece may
 * depend on what the earlier ones settled: a quote prices against the standing
 * the customer has reached by then and writes the policy later claims report
 * against, and each claim draws down the cap of the policy it names.
 */
export function transactScenario(scenario: Scenario): BusinessOutcome[] {
  const policies = new PolicyRegister();
  return scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const premium = quote(
        standingBefore(scenario.customer, policies.policiesWritten),
        step.items,
      );
      policies.fileWrittenBy(index, createPolicy(step.items));
      return { premium };
    }
    return claim(policies.writtenBy(step.policy), step.incident);
  });
}
