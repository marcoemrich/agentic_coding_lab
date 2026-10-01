export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

// The MHPCO price list: one row per insurable item type, stating that type's
// insurance value and base premium. The spec lists both figures together
// ("Amulet: 600 G / 60 G"), and the set of rows is one piece of knowledge --
// a type MHPCO will not price is a type it will not insure.
interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

// The only two places that know how the price list is stored; pricing and
// claim policies ask for a type's listed figure rather than indexing.
function listedEntry(type: string): PriceListEntry {
  const entry = PRICE_LIST[type];
  if (entry === undefined) {
    throw new Error(`MHPCO does not insure items of type "${type}"`);
  }
  return entry;
}

function listedBasePremium(type: string): number {
  return listedEntry(type).basePremium;
}

function listedInsuranceValue(type: string): number {
  return listedEntry(type).insuranceValue;
}

// --- MHPCO claim rulebook: what a damage report is owed ------------------

// A reported damage, and the incident that reports it. These are MHPCO's
// vocabulary for a claim, not a transport shape: the clause, deductible and
// cap decisions below are all stated in terms of them.
export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

const DEDUCTIBLE_PER_DAMAGE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const DRAGON_MATERIAL = "dragon";
const DRAGON_MATERIAL_REIMBURSEMENT_RATE = 1;
const NO_CLAUSE_REIMBURSEMENT_RATE = 1;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

// --- MHPCO premium rulebook: what a policy costs to write ----------------

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

// "Alike" means the same item type: 2 runes + 1 moonstone form no block,
// while 3 runes + 3 moonstones form two separate blocks.
function groupAlikeItems(items: Item[]): Map<string, number> {
  const countsPerAlikeGroup = new Map<string, number>();
  for (const item of items) {
    countsPerAlikeGroup.set(item.type, (countsPerAlikeGroup.get(item.type) ?? 0) + 1);
  }
  return countsPerAlikeGroup;
}

function qualifiesForComponentBlock(count: number): boolean {
  return count === COMPONENT_BLOCK_SIZE;
}

function basePremiumForAlikeGroup(type: string, count: number): number {
  if (qualifiesForComponentBlock(count)) {
    return COMPONENT_BLOCK_BASE_PREMIUM;
  }
  return count * listedBasePremium(type);
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

// Item-specific modifiers apply to the base premium of the affected item,
// not to the policy total.
function itemSurcharges(item: Item): number {
  const itemBasePremium = listedBasePremium(item.type);
  let surcharges = 0;
  if (item.cursed === true) {
    surcharges += itemBasePremium * CURSE_SURCHARGE_RATE;
  }
  if (isHighlyEnchanted(item)) {
    surcharges += itemBasePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharges;
}

// The spec's "policy base premium": the sum of all item base premiums,
// before any item-specific or policy-wide modifier.
function policyBasePremium(items: Item[]): number {
  let total = 0;
  for (const [type, count] of groupAlikeItems(items)) {
    total += basePremiumForAlikeGroup(type, count);
  }
  return total;
}

function totalItemSurcharges(items: Item[]): number {
  return items.reduce((total, item) => total + itemSurcharges(item), 0);
}

// How the customer stands with MHPCO when this policy is quoted. Loyalty and
// the follow-up discount both read this one history, so it travels as one value.
interface CustomerStanding {
  yearsWithMHPCO: number;
  previousContracts: number;
}

function isLongStanding(standing: CustomerStanding): boolean {
  return standing.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

// The spec's "each contract after their first": keyed on the customer's
// contract history, not on anything about this policy's items.
function isFollowUpContract(standing: CustomerStanding): boolean {
  return standing.previousContracts > 0;
}

// Discounts MHPCO grants for who the customer is. Changes whenever MHPCO
// revises how it rewards customer history.
function customerStandingDiscounts(standing: CustomerStanding, basePremium: number): number {
  let discounts = 0;
  if (isLongStanding(standing)) {
    discounts += basePremium * LOYALTY_DISCOUNT_RATE;
  }
  if (isFollowUpContract(standing)) {
    discounts += basePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
  }
  return discounts;
}

// Every quote newly assesses the items it covers, so this surcharge applies to
// each policy regardless of the customer's standing (see the spec's second
// integration example). Changes independently of the history-based discounts.
function firstInsuranceSurcharge(basePremium: number): number {
  return basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
}

function roundPremiumInMHPCOsFavour(premium: number): number {
  return Math.ceil(premium);
}

// The assessed premium for the items under this customer's standing, before
// MHPCO's fee. Every policy-wide modifier is a percentage of the policy base
// premium itself, never of the premium already raised by item-specific
// surcharges -- so they all scale `basePremium` and not a running total.
function assessedPremium(standing: CustomerStanding, items: Item[]): number {
  const basePremium = policyBasePremium(items);
  return (
    basePremium +
    totalItemSurcharges(items) +
    firstInsuranceSurcharge(basePremium) -
    customerStandingDiscounts(standing, basePremium)
  );
}

// The fee is MHPCO's flat charge for handling the paperwork, not a risk
// modifier: it is added once the assessment is complete and no modifier
// scales it.
export function quote(customer: Customer, items: Item[], previousContracts = 0): number {
  const standing: CustomerStanding = { ...customer, previousContracts };
  return roundPremiumInMHPCOsFavour(assessedPremium(standing, items) + PROCESSING_FEE);
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + listedInsuranceValue(item.type), 0);
}

function roundPayoutInMHPCOsFavour(payout: number): number {
  return Math.floor(payout);
}

// The two special claim clauses are keyed on the damaged item, so each asks
// about the item the damage refers to.
function isVeryHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

function isMadeOfDragonMaterial(item: Item): boolean {
  return item.material === DRAGON_MATERIAL;
}

// Which clause governs the damage, and what share of the damage amount it
// reimburses. The spec adjudicates the overlap -- a dragon-material item with
// enchantment >= 8 is reimbursed at 50 %, not fully -- so the high-enchantment
// clause is asked first. Dragon material grants full reimbursement, which is
// also what an item under no clause receives; the two rates are listed
// separately because MHPCO can revise the dragon clause without touching the
// standard treatment of ordinary items.
function reimbursementRateForDamagedItem(item: Item): number {
  if (isVeryHighlyEnchanted(item)) {
    return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  if (isMadeOfDragonMaterial(item)) {
    return DRAGON_MATERIAL_REIMBURSEMENT_RATE;
  }
  return NO_CLAUSE_REIMBURSEMENT_RATE;
}

function coveredAmount(item: Item, damage: Damage): number {
  return damage.amount * reimbursementRateForDamagedItem(item);
}

// A deductible applies per damage event, so each damaged item is reimbursed
// separately — clauses first, then the deductible — before the policy cap.
function reimbursementForDamage(item: Item, damage: Damage): number {
  return coveredAmount(item, damage) - DEDUCTIBLE_PER_DAMAGE;
}

// A damage entry, resolved to the particular insured item it claims.
interface ClaimedDamage {
  item: Item;
  damage: Damage;
}

// Whether MHPCO will assess a damage report at all, asked before the report is
// matched to an insured item: a negative amount is a malformed report rather
// than a claim with an answer. Changes when MHPCO revises what it accepts as a
// well-formed report, independently of how a report is matched to coverage.
function assertReportedAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`damage to a ${damage.itemType} reports a negative amount: ${String(damage.amount)}`);
  }
}

// Each damage entry is a separate damaged item, so a policy covering one sword
// cannot absorb two sword damages: every entry claims its own insured item,
// and a claimed item is no longer available to a later entry. Which item an
// entry claims -- and the rejection that follows from running out of matches --
// changes independently of what a claimed damage is reimbursed. An item type
// MHPCO does not insure is covered by no policy, so it is rejected here by the
// same "no insured item matches" decision rather than by a separate check.
function claimDamages(items: Item[], damages: Damage[]): ClaimedDamage[] {
  const unclaimed = [...items];
  return damages.map((damage) => {
    assertReportedAmount(damage);
    const index = unclaimed.findIndex((candidate) => candidate.type === damage.itemType);
    if (index === -1) {
      throw new Error(`the policy does not cover a damaged ${damage.itemType}`);
    }
    return { item: unclaimed.splice(index, 1)[0], damage };
  });
}

function reimbursementForIncident(items: Item[], incident: Incident): number {
  return claimDamages(items, incident.damages).reduce(
    (total, { item, damage }) => total + reimbursementForDamage(item, damage),
    0,
  );
}

// --- MHPCO policy exposure: what a written policy will pay out in total --

// What settling a claim yields: the amount MHPCO pays and the exposure the
// policy has left afterwards. This is the rulebook's own answer -- the CLI
// schema happens to name the same two figures.
export interface Settlement {
  payout: number;
  remainingCap: number;
}


// A written policy: the items it covers and how much of its total payout cap
// is still available. The cap is claim-rule knowledge, so the policy that
// carries it belongs with the rulebook rather than with the scenario adapter.
export interface Policy {
  items: Item[];
  remainingCap: number;
}

// The spec's "total payout per policy is capped at twice the insurance sum":
// how much total exposure MHPCO accepts against the items' worth. Changes
// independently of what the items are worth (the price list) and of how an
// individual claim is limited by the cap still remaining.
function totalPayoutCap(items: Item[]): number {
  return insuranceSum(items) * CAP_MULTIPLE_OF_INSURANCE_SUM;
}

export function openPolicy(items: Item[]): Policy {
  return { items, remainingCap: totalPayoutCap(items) };
}

// The cap decision, independent of which claim clauses produced the
// reimbursement: MHPCO never pays more than the policy's remaining cap, and
// whatever it pays is consumed from that cap.
function payoutAllowedByCap(reimbursement: number, remainingCap: number): Settlement {
  const payout = roundPayoutInMHPCOsFavour(Math.min(reimbursement, remainingCap));
  return { payout, remainingCap: remainingCap - payout };
}

// Settling a claim composes two independently changing decisions: what the
// claim clauses reimburse, and how much of that the policy cap still allows.
export function settleClaim(policy: Policy, incident: Incident): Settlement {
  return payoutAllowedByCap(reimbursementForIncident(policy.items, incident), policy.remainingCap);
}

// The scenario adapter is re-exported so callers reach the whole claim office
// through one module; the transport shapes themselves live in ./scenario.
export * from "./scenario.js";
