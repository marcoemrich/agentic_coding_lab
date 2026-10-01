const PROCESSING_FEE_G = 5;

// The spec's component taxonomy, open-ended by its own wording ("components --
// for example runes and moonstones"). This is where a new component type is
// declared; it must also get a price-list row below, which the price lookup
// enforces for every quoted type.
const COMPONENT_TYPES: ReadonlySet<string> = new Set(["rune", "moonstone"]);

// The spec states one component tariff for all components ("insured at 250 G
// each, with a base premium of 25 G per component"), so every component row
// carries it.
const COMPONENT_BASE_PREMIUM_G = 25;

const BASE_PREMIUM_G: Readonly<Record<string, number>> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE_PREMIUM_G,
  moonstone: COMPONENT_BASE_PREMIUM_G,
};

const ALIKE_BLOCK_SIZE = 3;
const ALIKE_BLOCK_BASE_PREMIUM_G = 60;

export interface Customer {
  readonly yearsWithMHPCO: number;
}

export interface Item {
  readonly type: string;
  readonly cursed?: boolean;
  readonly enchantment?: number;
}

// Resolves the spec's open question on "alike" -- exactly the same type, or
// just the same family? -- in favour of identical type. The spec's
// mixed-component examples decide it; the specs assert them.
function groupAlikeItems(items: readonly Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

// Eligibility for the building-block offer, resolving two spec readings:
//   - exactly ALIKE_BLOCK_SIZE, not repeating within a larger count -- the
//     spec's 4-rune and 7-rune examples rule out charging a second block;
//   - components only -- the spec offers the block for "3 alike components",
//     so three swords are three swords.
// The specs assert all of these.
function formsAlikeBlock(type: string, count: number): boolean {
  return count === ALIKE_BLOCK_SIZE && isComponent(type);
}

// The price-list tariff for a single item of this type, before any
// building-block offer and before any item-specific surcharge.
function itemBasePremium(type: string): number {
  return BASE_PREMIUM_G[type];
}

function alikeItemsBasePremium(type: string, count: number): number {
  if (formsAlikeBlock(type, count)) {
    return ALIKE_BLOCK_BASE_PREMIUM_G;
  }
  return count * itemBasePremium(type);
}

export function policyBasePremium(items: readonly Item[]): number {
  let total = 0;
  for (const [type, count] of groupAlikeItems(items)) {
    total += alikeItemsBasePremium(type, count);
  }
  return total;
}

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

// The premium side's own "highly enchanted" threshold. The claim rules use a
// separate, independently changeable enchantment threshold for reimbursement,
// so this constant is named for the surcharge it governs and must not be
// shared with it.
const HIGH_ENCHANTMENT_SURCHARGE_LEVEL = 5;

// "Highly enchanted" in the premium sense. An item may carry no enchantment
// level at all -- the spec gives components (runes, moonstones) neither an
// enchantment level nor a material -- and an absent level is not a high one.
function isHighlyEnchanted(item: Item): boolean {
  return item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_SURCHARGE_LEVEL;
}

// The risk the MHPCO prices into one individual item, in G -- charged on that
// item's own base premium, not on the policy total. The spec lists two such
// surcharges (curse, high enchantment) and they stack: a cursed sword at
// enchantment 5 costs 180 G, not the 150 G a highest-clause-wins rule would
// charge. Clause set and stacking rule change together here, because each
// premium-side clause is stated as an "add" clause; the claim side composes
// its own clauses by precedence instead, so that rule is not shared with this
// one. This is the one place a premium-side item risk clause is declared.
//
// The clauses are charged on "the base premium of the affected item", and this
// is the one place that phrase is given a meaning: the single-item price-list
// tariff. The spec leaves the phrase open for a component inside a building
// block, since the block replaces the members' separate tariffs with one block
// price; the reading adopted here charges the member's own tariff rather than a
// share of the block price, because the spec treats the block as an aggregate
// discount on the premium that is not pushed down into per-item figures. The
// specs pin it.
function itemRiskSurcharge(item: Item): number {
  let rate = 0;
  if (item.cursed === true) {
    rate += CURSE_SURCHARGE_RATE;
  }
  if (isHighlyEnchanted(item)) {
    rate += HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return itemBasePremium(item.type) * rate;
}

// The premium stage between the two modifier scopes the spec distinguishes:
// item-specific surcharges have been applied to the base premium of each
// affected item; policy-wide modifiers and the fee have not been applied yet.
export function premiumAfterItemModifiers(items: readonly Item[]): number {
  let total = policyBasePremium(items);
  for (const item of items) {
    total += itemRiskSurcharge(item);
  }
  return total;
}

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_DISCOUNT_MIN_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

// "Long-standing" in the spec's own words -- the category of customer the
// loyalty discount is offered to ("long-standing customers (>= 2 years of
// business with MHPCO)"). Who qualifies is a separate decision from what the
// policy-wide clauses add up to: the MHPCO could redefine the category (count
// anniversaries rather than calendar years, or require a prior contract)
// without touching any clause's rate. This is the one place that category is
// decided. The threshold is a floor, so exactly 2 years qualifies.
function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_DISCOUNT_MIN_YEARS;
}

// A contract "after their first", in the spec's own words -- the position in the
// customer's history that the follow-up discount is offered for ("customers
// receive a 15 % discount on each contract after their first"). Which contracts
// count towards "their first" is a separate decision from what the clause is
// worth: the MHPCO could stop counting lapsed or cancelled policies, or count
// only contracts of the same item class, without touching any clause's rate.
// This is the one place that position is decided. The clause is open-ended:
// having any previous contract at all is enough, so every contract after the
// first qualifies -- not the second one alone.
function isFollowUpContract(previousContracts: number): boolean {
  return previousContracts > 0;
}

// The net rate of the spec's three policy-wide clauses: first insurance,
// loyalty and the follow-up-contract discount. Each is stated as a signed
// percentage and they compose additively, so one net rate carries them; this is
// the one place a policy-wide clause is declared. Discounts subtract.
//
// The first-insurance surcharge has no guard because every quote qualifies: the
// spec's second integration example rules that "each item in a `quote` is
// treated as a first insurance, regardless of customer history". The absent
// predicate is that ruling, not an unhandled case. The specs pin it.
//
// The clause is charged once on the policy base premium even though the spec
// words it per item. No test can tell the two readings apart, which is the
// point: the policy base is the sum of the item bases and the rate is uniform,
// so 10 % of the sum equals the sum of the per-item 10 %s.
function policyModifierRate(customer: Customer, previousContracts: number): number {
  let rate = FIRST_INSURANCE_SURCHARGE_RATE;
  if (isLongStandingCustomer(customer)) {
    rate -= LOYALTY_DISCOUNT_RATE;
  }
  if (isFollowUpContract(previousContracts)) {
    rate -= FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
  }
  return rate;
}

// What the policy-wide clauses add to (or take off) the premium, in G -- the
// counterpart of itemRiskSurcharge on the other modifier scope. The two scopes
// are charged on different bases, and this is the one place the policy-wide
// base is fixed: the policy base premium, NOT the premium after item
// surcharges. The spec's integration examples settle it -- the 3-year second
// contract is 100 + 50 + 30 - 20 + 10 - 15, where the -20 loyalty is 20 % of
// the 100 G base, not of the 180 G running total.
function policyModifierTotal(
  customer: Customer,
  items: readonly Item[],
  previousContracts: number,
): number {
  return policyBasePremium(items) * policyModifierRate(customer, previousContracts);
}

// The premium once both of the spec's modifier scopes have been priced, before
// the fee. Each scope contributes a surcharge pool charged on its own base.
export function premiumBeforeFee(
  customer: Customer,
  items: readonly Item[],
  previousContracts: number,
): number {
  return (
    premiumAfterItemModifiers(items) +
    policyModifierTotal(customer, items, previousContracts)
  );
}

// The spec's premium: both modifier scopes, then the processing fee at the very
// end, after all percentage modifiers.
export function quote(
  customer: Customer,
  items: readonly Item[],
  previousContracts: number,
): number {
  return premiumBeforeFee(customer, items, previousContracts) + PROCESSING_FEE_G;
}
