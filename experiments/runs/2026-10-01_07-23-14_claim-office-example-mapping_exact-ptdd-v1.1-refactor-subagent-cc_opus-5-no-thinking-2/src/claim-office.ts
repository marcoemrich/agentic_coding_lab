export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

// One entry of the MHPCO price list. The two published figures are quoted
// independently: the office prints them side by side and has never promised that one
// follows the other, so neither is derived from the other here.
interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

// The MHPCO price list: the single statement of which item types the office insures at
// all and what each of them is worth and costs. Main items are listed individually.
const MAIN_ITEM_PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

// Components (e.g. runes, moonstones) are not individually price-listed: they all share
// one tariff, so the component roster is the single source of which types are components
// and what each of them is worth and costs.
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_PRICE: PriceListEntry = { insuranceValue: 250, basePremium: 25 };

const PRICE_LIST: Record<string, PriceListEntry> = {
  ...MAIN_ITEM_PRICE_LIST,
  ...Object.fromEntries(COMPONENT_TYPES.map((type) => [type, COMPONENT_PRICE])),
};

// What the MHPCO is willing to insure at all: only item types on its price list. The
// acceptance rule is enforced at the lookup every price enquiry must pass through, so no
// part of a declined cover can be priced or covered by any route.
function listedPrice(type: string): PriceListEntry {
  const price = PRICE_LIST[type];
  if (price === undefined) {
    throw new Error(`MHPCO does not insure items of type "${type}"`);
  }
  return price;
}

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

// MHPCO reading of "alike": two items are alike exactly when their types match,
// not merely when they belong to the same family (rune-y, gemstone-y).
function countAlikeItems(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

// A building block is offered for exactly 3 alike components.
function blockOfferApplies(type: string, count: number): boolean {
  return COMPONENT_TYPES.includes(type) && count === BLOCK_SIZE;
}

function typeBasePremium(type: string, count: number): number {
  if (blockOfferApplies(type, count)) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * listedPrice(type).basePremium;
}

function policyBasePremium(items: Item[]): number {
  let total = 0;
  for (const [type, count] of countAlikeItems(items)) {
    total += typeBasePremium(type, count);
  }
  return total;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const SURCHARGED_ENCHANTMENT_LEVEL = 5;

// An item that carries no enchantment level at all is not enchanted: the MHPCO rates it
// at level 0. Runes and moonstones are the usual such items. Both the premium-side and
// the claim-side enchantment clauses read a level through here, so neither can disagree
// with the other about what an unenchanted item is.
function enchantmentLevel(item: Item): number {
  return item.enchantment ?? 0;
}

// The enchantment level from which the MHPCO rates an item as a heightened risk worth a
// premium surcharge. Deliberately a lower bar than the level at which the claim side
// halves a reimbursement: charging more for enchantment and paying out less for it are
// two clauses with their own thresholds, and neither follows the other when it moves.
function isEnchantedEnoughToSurcharge(item: Item): boolean {
  return enchantmentLevel(item) >= SURCHARGED_ENCHANTMENT_LEVEL;
}

// Each risk factor the MHPCO recognises contributes its own rate; a cursed and
// highly enchanted item is assessed both surcharges.
function riskSurchargeRate(item: Item): number {
  return (
    (item.cursed === true ? CURSE_SURCHARGE : 0) +
    (isEnchantedEnoughToSurcharge(item) ? HIGH_ENCHANTMENT_SURCHARGE : 0)
  );
}

// Item-scoped risk surcharges are assessed against the affected item's own listed
// base premium -- the block offer discounts the policy base premium only and does not
// lower the surcharge base. Each item is rated separately and the results are summed.
function itemScopedSurcharges(items: Item[]): number {
  return items.reduce(
    (total, item) => total + listedPrice(item.type).basePremium * riskSurchargeRate(item),
    0,
  );
}

const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;

// Long-standing means at least LOYALTY_YEARS years of business. A discount, so it
// enters the policy-scoped rate as a negative rate.
function loyaltyRate(customer: Customer): number {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS ? -LOYALTY_DISCOUNT : 0;
}

const FOLLOW_UP_DISCOUNT = 0.15;

// Every contract after the customer's first earns the follow-up discount.
function followUpRate(previousContracts: number): number {
  return previousContracts > 0 ? -FOLLOW_UP_DISCOUNT : 0;
}

// The MHPCO's policy-scoped tariff: each recognised policy-wide modifier contributes
// its own rate, and the rates are assessed together against the policy base premium.
//
// MHPCO reading of "a first insurance": the initial assessment is of the items newly
// brought in, not of the customer. Every quote is therefore a first insurance for the
// items it covers, so the surcharge is an unconditional term here -- it consults no
// customer history, and a long-standing customer on a follow-up contract is assessed
// it alongside the loyalty and follow-up discounts rather than instead of them.
function policyScopedRate(customer: Customer, previousContracts: number): number {
  return FIRST_INSURANCE_SURCHARGE + loyaltyRate(customer) + followUpRate(previousContracts);
}

// Policy-scoped modifiers are assessed against the policy base premium alone -- the
// plain sum of the item base premiums, deliberately excluding item-scoped surcharges.
function policyScopedAdjustment(
  basePremium: number,
  customer: Customer,
  previousContracts: number,
): number {
  return basePremium * policyScopedRate(customer, previousContracts);
}

const PROCESSING_FEE = 5;

// Amounts are rounded in the MHPCO's favor, which means opposite directions on the two
// sides of the ledger: a premium the MHPCO collects rounds up, a payout it owes rounds
// down. Both tolerate the same floating-point slack so that an amount computed as
// exactly 197.5 or 350.5 is not pushed across the boundary by representation error.
const AMOUNT_PRECISION = 1e-9;

function roundUpInMHPCOFavor(amount: number): number {
  return Math.ceil(amount - AMOUNT_PRECISION);
}

function roundDownInMHPCOFavor(amount: number): number {
  return Math.floor(amount + AMOUNT_PRECISION);
}

// How the MHPCO closes a premium: the processing fee is added at the very end, after
// every percentage modifier, and only that final figure is rounded -- intermediate
// amounts stay fractional, and rounding always favours the MHPCO.
function closedPremium(modifiedPremium: number): number {
  return roundUpInMHPCOFavor(modifiedPremium + PROCESSING_FEE);
}

export function quote(customer: Customer, items: Item[], previousContracts: number): number {
  const basePremium = policyBasePremium(items);
  return closedPremium(
    basePremium +
      itemScopedSurcharges(items) +
      policyScopedAdjustment(basePremium, customer, previousContracts),
  );
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimSettlement {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;

// The insurance sum is the plain total of the insured items' values; block discounts and
// premium modifiers affect what the customer pays, never what the policy covers.
function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + listedPrice(item.type).insuranceValue, 0);
}

// The MHPCO pays out at most twice the insurance sum over the life of a policy.
function policyCap(items: Item[]): number {
  return CAP_MULTIPLE * insuranceSum(items);
}

const HALVED_ENCHANTMENT_LEVEL = 8;
const HALVED_REIMBURSEMENT = 0.5;

// Which insured items the MHPCO considers too enchanted to reimburse in full.
function isEnchantedEnoughToHalve(insured: Item): boolean {
  return enchantmentLevel(insured) >= HALVED_ENCHANTMENT_LEVEL;
}

// How much of a reported damage the MHPCO recognises before the deductible: a special
// clause can reduce the recognised amount, and absent any clause the full damage counts.
//
// The dragon-material clause is deliberately absent rather than forgotten. "Damage to items
// made of dragon material is fully reimbursed" grants exactly what every unclassified item
// already gets here -- full recognition -- so on its own it is indistinguishable from the
// default, and where it meets the halving clause the halving clause wins. Dragon material
// therefore never changes a recognised amount: it is subsumed by the default when it
// applies alone and overridden when it does not. A branch for it would be unreachable by
// any observation, so the clause is recorded here instead of being coded. Should the MHPCO
// ever grant dragon material more than full reimbursement, the clause becomes observable
// and earns a branch -- and a precedence decision against halving -- at that point.
function reimbursableDamage(damage: Damage, insured: Item): number {
  if (isEnchantedEnoughToHalve(insured)) {
    return damage.amount * HALVED_REIMBURSEMENT;
  }
  return damage.amount;
}

// Each damage event bears its own deductible, and the MHPCO never pays less than nothing.
function reimbursement(damage: Damage, insured: Item): number {
  return Math.max(reimbursableDamage(damage, insured) - DEDUCTIBLE, 0);
}

// One reported damage, admitted against the single insured item it is settled on.
interface AdmittedDamage {
  damage: Damage;
  insured: Item;
}

// Whether a reported damage is a damage report the MHPCO can read at all. A report states
// how much harm was done, so a negative amount leaves nothing to assess -- the office
// declines the paperwork rather than the cover. This question consults no policy, no price
// list and no insured item, which is why it is settled on the whole report before admission
// looks anything up: an unreadable entry is refused at intake, and a claim carrying one is
// declined on that ground even where it also names an item the policy does not cover.
function validateReport(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`MHPCO cannot assess a damage amount of ${damage.amount}`);
    }
  }
}

// Who the MHPCO admits to a claim. A damage entry names an insured item by type, and each
// entry is settled on an item of its own: the policy covers one damage per insured item,
// so two entries naming the same type need two such items on the policy. An entry that
// finds no item left to settle on is declined, and with it the whole claim, before any
// damage is valued. Which insured item of a matching type an entry is settled on is left
// unstated: the MHPCO takes them in the order the policy lists them.
//
// This one rule is the whole of the office's claim admission, and it declines on a single
// ground -- no insured item left for this entry. Every way a claim can name an item the
// MHPCO will not settle reduces to that ground: a type the policy does not cover at all, a
// type claimed more often than the policy covers it, and a type the MHPCO does not insure
// anywhere. The last needs no price-list check of its own on the claim path: the policy's
// items were all priced through listedPrice when it was quoted, so an uninsurable type can
// never appear among them, and an entry naming one finds nothing to match for that reason.
// Admission therefore asks only what the policy covers, and stays correct when the price
// list grows or shrinks. Whether a reported damage is a well-formed report in the first
// place -- its amount, say -- is a separate question that consults no policy at all.
function admitDamages(damages: Damage[], items: Item[]): AdmittedDamage[] {
  const unsettled = [...items];
  return damages.map((damage) => {
    const index = unsettled.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`MHPCO policy does not cover a further "${damage.itemType}" to claim for`);
    }
    return { damage, insured: unsettled.splice(index, 1)[0] };
  });
}

// What the MHPCO owes for one incident: every admitted damage valued on its own and summed.
function incidentReimbursement(damages: Damage[], items: Item[]): number {
  return admitDamages(damages, items).reduce(
    (total, { damage, insured }) => total + reimbursement(damage, insured),
    0,
  );
}

// How the MHPCO closes a claim against its cap. The cap is a lifetime limit on the policy,
// so what this settlement may pay is bounded by what the cap had left beforehand -- the
// cap less everything the policy has already paid out. An over-cap claim is trimmed to the
// remainder rather than declined: the customer is paid what is left and the cap closes at
// zero. Whether a claim may exceed its remaining cap, and by what rule, is the MHPCO's own
// decision and moves independently of how a damage is valued.
function cappedSettlement(desired: number, remainingBefore: number): ClaimSettlement {
  const payout = Math.min(desired, remainingBefore);
  return { payout, remainingCap: remainingBefore - payout };
}

// How the MHPCO settles one claim against one policy: the report is read for
// well-formedness before anything is looked up, then valued against the policy, then
// closed against what the cap has left. The three steps answer questions that move
// independently of one another, so the office's one operation sequences them in the
// order its clerks work rather than nesting one inside another.
export function claim(items: Item[], incident: Incident, alreadyPaid = 0): ClaimSettlement {
  validateReport(incident.damages);
  return cappedSettlement(
    roundDownInMHPCOFavor(incidentReimbursement(incident.damages, items)),
    policyCap(items) - alreadyPaid,
  );
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

// A policy the scenario has issued: the items it covers and what it has paid out so far,
// because the cap is a lifetime limit across the policy's successive claims.
interface Policy {
  items: Item[];
  paidOut: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult = { premium: number } | ClaimSettlement;

export interface ScenarioResults {
  results: StepResult[];
}

// A claim against an issued policy, charged to that policy's record. The cap is a lifetime
// limit, so the policy's own running total is both what bounds this settlement and what the
// settlement adds to -- one decision, read and written together.
function settleAgainstPolicy(policy: Policy, incident: Incident): ClaimSettlement {
  const settlement = claim(policy.items, incident, policy.paidOut);
  policy.paidOut += settlement.payout;
  return settlement;
}

// A claim can only be made against a policy an earlier quote step actually issued. The
// policy register is addressed by the step index that issued the policy, which is how a
// claim step names the cover it is claiming against.
function issuedPolicy(policies: Map<number, Policy>, index: number): Policy {
  const policy = policies.get(index);
  if (policy === undefined) {
    throw new Error(`MHPCO has no policy issued by step ${index} to claim against`);
  }
  return policy;
}

// The scenario clerk: one customer's steps worked in the order they were filed. Each quote
// is a further contract for that customer, so every quote after the first earns the follow-up
// discount, and each one leaves a policy in the register under its own step index for later
// claim steps to name.
export function runScenario(scenario: Scenario): ScenarioResults {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let contractsSoFar = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push({ premium: quote(scenario.customer, step.items, contractsSoFar) });
      contractsSoFar += 1;
      policies.set(index, { items: step.items, paidOut: 0 });
    } else {
      results.push(settleAgainstPolicy(issuedPolicy(policies, step.policy), step.incident));
    }
  });
  return { results };
}
