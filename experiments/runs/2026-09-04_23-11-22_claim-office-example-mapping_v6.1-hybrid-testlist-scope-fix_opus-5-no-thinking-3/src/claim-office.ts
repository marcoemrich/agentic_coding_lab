export type QuoteResult = {
  premium: number;
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

export type StepResult = QuoteResult | ClaimResult;

export type ScenarioResult = {
  results: StepResult[];
};

const BASE_PREMIUMS = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
} as const satisfies Record<string, number>;

const INSURANCE_VALUES = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
} as const satisfies Record<keyof typeof BASE_PREMIUMS, number>;

type InsurableItemType = keyof typeof BASE_PREMIUMS;

type Item = {
  type: InsurableItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type QuoteStep = {
  op: "quote";
  items: Item[];
};

type Damage = {
  itemType: string;
  amount: number;
};

type Incident = {
  cause: string;
  damages: Damage[];
};

type ClaimStep = {
  op: "claim";
  policy: number;
  incident: Incident;
};

type Step = QuoteStep | ClaimStep;

type Customer = {
  yearsWithMHPCO: number;
};

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

const PERCENT_PER_WHOLE = 100;

const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / PERCENT_PER_WHOLE;

// The MHPCO always rounds in its own favour: premiums (which the customer
// pays) round up, payouts (which it pays out) round down.
const roundedUpInMHPCOsFavour = (premium: number): number => Math.ceil(premium);

const itemBasePremiumOf = (item: Item): number => BASE_PREMIUMS[item.type];

// Exactly this many components of the same type form a "building block",
// priced as a unit rather than per item.
const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_BASE_PREMIUM = 60;

const sumOf = (amounts: number[]): number =>
  amounts.reduce((total, amount) => total + amount, 0);

// The MHPCO refuses to process a scenario it cannot price or pay out on. Every
// such refusal names the offending value, so they all take the same shape:
// yield the value when there is one, reject with an explanation when there
// is not.
const orRejected = <Value>(
  value: Value | undefined,
  reason: string,
): Value => {
  if (value === undefined) {
    throw new Error(reason);
  }

  return value;
};

// A requirement the MHPCO places on the scenario it is handed, paired with the
// explanation it gives when the requirement is not met. Checking one yields the
// subject back, so requirements compose with the rest of the pipeline the same
// way `orRejected` does.
type Requirement<Subject> = {
  isMetBy: (subject: Subject) => boolean;
  reasonRejecting: (subject: Subject) => string;
};

const meeting = <Subject>(
  requirement: Requirement<Subject>,
  subject: Subject,
): Subject =>
  orRejected(
    requirement.isMetBy(subject) ? subject : undefined,
    requirement.reasonRejecting(subject),
  );

// The MHPCO insures exactly the item types its price list names.
const insurableItemTypes = Object.keys(BASE_PREMIUMS) as InsurableItemType[];

const isInsurableItemType = (type: string): type is InsurableItemType =>
  insurableItemTypes.includes(type as InsurableItemType);

const alikeItemGroups = (items: Item[]): Item[][] =>
  insurableItemTypes
    .map((type) => items.filter((item) => item.type === type))
    .filter((alikeItems) => alikeItems.length > 0);

const formsBuildingBlock = (alikeItems: Item[]): boolean =>
  alikeItems.length === BUILDING_BLOCK_SIZE;

const alikeGroupBasePremiumOf = (alikeItems: Item[]): number =>
  formsBuildingBlock(alikeItems)
    ? BUILDING_BLOCK_BASE_PREMIUM
    : sumOf(alikeItems.map(itemBasePremiumOf));

const policyBasePremiumOf = (items: Item[]): number =>
  sumOf(alikeItemGroups(items).map(alikeGroupBasePremiumOf));

const isCursed = (item: Item): boolean => item.cursed === true;

// An item without an enchantment counts as enchantment 0 everywhere.
const enchantmentOf = (item: Item): number => item.enchantment ?? 0;

const isEnchantedBeyondSurchargeThreshold = (item: Item): boolean =>
  enchantmentOf(item) >= HIGH_ENCHANTMENT_THRESHOLD;

// A modifier adjusts a base premium by a percentage of it, when it applies to
// the subject it is about (an item, a contract, ...). A surcharge has a
// positive percent, a discount a negative one, so they all combine by summing.
// Modifiers are cumulative: every applicable one applies.
type Modifier<Subject> = {
  appliesTo: (subject: Subject) => boolean;
  percent: number;
};

const modifierTotalOf = <Subject>(
  modifiers: Modifier<Subject>[],
  subject: Subject,
  basePremium: number,
): number =>
  sumOf(
    modifiers
      .filter((modifier) => modifier.appliesTo(subject))
      .map((modifier) => percentOf(basePremium, modifier.percent)),
  );

const ITEM_MODIFIERS: Modifier<Item>[] = [
  { appliesTo: isCursed, percent: CURSE_SURCHARGE_PERCENT },
  {
    appliesTo: isEnchantedBeyondSurchargeThreshold,
    percent: HIGH_ENCHANTMENT_SURCHARGE_PERCENT,
  },
];

// Item-specific modifiers apply to the base premium of the affected item.
const itemModifierTotalOf = (item: Item): number =>
  modifierTotalOf(ITEM_MODIFIERS, item, itemBasePremiumOf(item));

const isLongStanding = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

// A contract is one quote within a scenario. A quote is a follow-up when the
// customer already holds a policy with the MHPCO at the time it is drawn up.
type Contract = {
  customer: Customer;
  heldPoliciesBefore: number;
};

const isFollowUpContract = (contract: Contract): boolean =>
  contract.heldPoliciesBefore > 0;

// Policy-wide modifiers apply to the policy base premium and are about the
// contract as a whole rather than any single item.
const alwaysApplies = (): boolean => true;

const POLICY_MODIFIERS: Modifier<Contract>[] = [
  { appliesTo: alwaysApplies, percent: INITIAL_ASSESSMENT_SURCHARGE_PERCENT },
  {
    appliesTo: (contract) => isLongStanding(contract.customer),
    percent: -LOYALTY_DISCOUNT_PERCENT,
  },
  { appliesTo: isFollowUpContract, percent: -FOLLOW_UP_DISCOUNT_PERCENT },
];

const policyModifierTotalOf = (
  contract: Contract,
  policyBasePremium: number,
): number => modifierTotalOf(POLICY_MODIFIERS, contract, policyBasePremium);

const quote = (step: QuoteStep, contract: Contract): QuoteResult => {
  const policyBasePremium = policyBasePremiumOf(step.items);
  const itemModifiers = sumOf(step.items.map(itemModifierTotalOf));
  const policyModifiers = policyModifierTotalOf(contract, policyBasePremium);

  return {
    premium: roundedUpInMHPCOsFavour(
      policyBasePremium + itemModifiers + policyModifiers + PROCESSING_FEE,
    ),
  };
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const PARTIAL_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const PARTIAL_REIMBURSEMENT_PERCENT = 50;
const FULL_REIMBURSEMENT_PERCENT = PERCENT_PER_WHOLE;
const DRAGON_MATERIAL = "dragon";

// A clause of the policy saying how much of a damage the MHPCO reimburses for
// the items it speaks to. Clauses are exclusive — unlike premium modifiers,
// which are cumulative — so at most one decides any given damage.
type ReimbursementClause = {
  appliesTo: (item: Item) => boolean;
  percentReimbursed: number;
};

const roundedDownInMHPCOsFavour = (payout: number): number =>
  Math.floor(payout);

const insuranceValueOf = (item: Item): number => INSURANCE_VALUES[item.type];

// A policy is created by a quote step and remembers how much of its cap the
// customer has already claimed.
type Policy = {
  items: Item[];
  remainingCap: number;
};

// Enchantment carries two unrelated thresholds: 5 surcharges the premium, 8
// halves the reimbursement. Each predicate names the threshold it tests so the
// two are never mistaken for one another.
const isEnchantedBeyondReimbursementThreshold = (item: Item): boolean =>
  enchantmentOf(item) >= PARTIAL_REIMBURSEMENT_ENCHANTMENT_THRESHOLD;

const isDragonMaterial = (item: Item): boolean => item.material === DRAGON_MATERIAL;

// The reimbursement clauses decide how much of the damage is covered; the
// deductible is then withheld from that amount afterwards. The MHPCO applies
// the first clause that speaks to the damaged item, so the order below is the
// order of precedence: a dragon-material item enchanted to 8 or above is
// reimbursed in part, the enchantment clause having been reached first.
const REIMBURSEMENT_CLAUSES: ReimbursementClause[] = [
  {
    appliesTo: isEnchantedBeyondReimbursementThreshold,
    percentReimbursed: PARTIAL_REIMBURSEMENT_PERCENT,
  },
  { appliesTo: isDragonMaterial, percentReimbursed: FULL_REIMBURSEMENT_PERCENT },
];

// An item the clauses are silent about is reimbursed in full, same as one the
// dragon-material clause speaks for — the MHPCO withholds only the deductible.
const DEFAULT_REIMBURSEMENT_PERCENT = FULL_REIMBURSEMENT_PERCENT;

const percentReimbursedFor = (item: Item): number =>
  REIMBURSEMENT_CLAUSES.find((clause) => clause.appliesTo(item))
    ?.percentReimbursed ?? DEFAULT_REIMBURSEMENT_PERCENT;

const reimbursementOf = (damage: Damage, item: Item): number =>
  percentOf(damage.amount, percentReimbursedFor(item));

// The MHPCO does not entertain damages that would pay it.
const IS_NOT_NEGATIVE: Requirement<Damage> = {
  isMetBy: (damage) => damage.amount >= 0,
  reasonRejecting: (damage) =>
    `damage amount cannot be negative: ${damage.amount}`,
};

const damagePayoutOf = (damage: Damage, item: Item): number =>
  reimbursementOf(meeting(IS_NOT_NEGATIVE, damage), item) -
  DEDUCTIBLE_PER_DAMAGE;

// What a damage entry resolved to: the entry itself and the insured item it is
// charged against.
type ChargedDamage = {
  damage: Damage;
  item: Item;
};

// Each damage entry is about one insured item, and no two entries may be about
// the same one: a policy covering a single sword cannot suffer two damaged
// swords. Entries are charged against the items still unaccounted for, each
// claimed item dropping out of reach of the entries that follow, so the MHPCO
// refuses both damages to what it did not insure and damages beyond the number
// of alike items it did.
const chargedDamagesIn = (
  policy: Policy,
  incident: Incident,
): ChargedDamage[] => {
  let unclaimed = policy.items;

  return incident.damages.map((damage) => {
    // Two slots of a policy may hold the very same item object (a customer
    // insuring two identical swords), so a claimed slot is dropped by its
    // position, never by identity.
    const claimedSlot = unclaimed.findIndex(
      (candidate) => candidate.type === damage.itemType,
    );
    const item = orRejected(
      unclaimed[claimedSlot],
      `damaged item is not insured by this policy: ${damage.itemType}`,
    );
    unclaimed = [
      ...unclaimed.slice(0, claimedSlot),
      ...unclaimed.slice(claimedSlot + 1),
    ];

    return { damage, item };
  });
};

const chargedDamagePayoutOf = ({ damage, item }: ChargedDamage): number =>
  damagePayoutOf(damage, item);

const incidentPayoutOf = (incident: Incident, policy: Policy): number =>
  roundedDownInMHPCOsFavour(
    sumOf(chargedDamagesIn(policy, incident).map(chargedDamagePayoutOf)),
  );

// The total payout per policy is capped, so a claim can only draw what the cap
// still holds.
const drawnFromCap = (desiredPayout: number, policy: Policy): number =>
  Math.min(desiredPayout, policy.remainingCap);

// Claiming draws the payout from the policy's remaining cap, so it yields both
// the result and the policy as it stands afterwards, rather than mutating.
const claim = (
  step: ClaimStep,
  policy: Policy,
): { result: ClaimResult; policy: Policy } => {
  const payout = drawnFromCap(incidentPayoutOf(step.incident, policy), policy);
  const remainingCap = policy.remainingCap - payout;

  return {
    result: { payout, remainingCap },
    policy: { ...policy, remainingCap },
  };
};

const policyFor = (items: Item[]): Policy => ({
  items,
  remainingCap: CAP_MULTIPLIER * sumOf(items.map(insuranceValueOf)),
});

// A scenario is processed step by step: each step produces a result and may
// leave behind policies the later steps claim against. Policies are keyed by
// the index of the quote step that created them, which is how claim steps
// refer to them.
type Office = {
  policies: Map<number, Policy>;
  results: StepResult[];
};

const emptyOffice = (): Office => ({ policies: new Map(), results: [] });

// The scenario arrives as untyped JSON, so the item types it names have to be
// checked against the MHPCO's price list before anything is priced.
const IS_INSURABLE: Requirement<Item> = {
  isMetBy: (item) => isInsurableItemType(item.type),
  reasonRejecting: (item) => `unknown item type: ${item.type}`,
};

// Every step yields its result plus the policy it wrote, under the key that
// later steps use to find it.
type StepOutcome = {
  result: StepResult;
  policyKey: number;
  policy: Policy;
};

const withOutcomeRecorded = (office: Office, outcome: StepOutcome): Office => ({
  policies: new Map(office.policies).set(outcome.policyKey, outcome.policy),
  results: [...office.results, outcome.result],
});

const outcomeOf = (
  office: Office,
  step: Step,
  stepIndex: number,
  customer: Customer,
): StepOutcome => {
  if (step.op === "quote") {
    const items = step.items.map((item) => meeting(IS_INSURABLE, item));
    // Claims re-file the policy they draw on under its existing key, so the
    // number of policies on file only ever grows on a quote.
    const contract = { customer, heldPoliciesBefore: office.policies.size };

    return {
      result: quote(step, contract),
      policyKey: stepIndex,
      policy: policyFor(items),
    };
  }

  const claimed = claim(step, office.policies.get(step.policy)!);

  return {
    result: claimed.result,
    policyKey: step.policy,
    policy: claimed.policy,
  };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const office = scenario.steps.reduce(
    (office, step, stepIndex) =>
      withOutcomeRecorded(
        office,
        outcomeOf(office, step, stepIndex, scenario.customer),
      ),
    emptyOffice(),
  );

  return { results: office.results };
};
