export type Item = {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
};

export type QuoteStep = {
  op: "quote";
  items: Item[];
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: Incident;
};

export type Step = QuoteStep | ClaimStep;

export type Customer = {
  yearsWithMHPCO: number;
};

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

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

const BASE_PRICES: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

// Expressed as integer percent rather than a 1.1 factor: floating-point
// multiplication by 1.1 loses exactness (100 * 1.1 === 115.00000000000001),
// while scaling by 110 and dividing by 100 stays exact for these prices.
const FIRST_CONTRACT_PERCENT = 110;
const WHOLE_PERCENT = 100;
const CONTRACT_FEE = 5;

const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;

const COMPONENT_TYPES = ["rune", "moonstone"];

const HIGH_ENCHANTMENT_LEVEL = 5;

const applyPercent = (amount: number, percent: number): number =>
  (amount * percent) / WHOLE_PERCENT;

const sumOf = <T>(values: T[], amountOf: (value: T) => number): number =>
  values.reduce((total, value) => total + amountOf(value), 0);

const tablePriceOf = (item: Item): number => BASE_PRICES[item.type];

// Risk surcharges stack multiplicatively: each one that applies scales the
// running price, so a cursed item is 150 % of the table price.
const RISK_SURCHARGES: { applies: (item: Item) => boolean; percent: number }[] =
  [
    { applies: (item) => item.cursed, percent: 150 },
    {
      applies: (item) => item.enchantment >= HIGH_ENCHANTMENT_LEVEL,
      percent: 130,
    },
  ];

const riskAdjustedPriceOf = (item: Item): number =>
  RISK_SURCHARGES.filter((surcharge) => surcharge.applies(item)).reduce(
    (price, surcharge) => applyPercent(price, surcharge.percent),
    tablePriceOf(item),
  );

const isComponent = (item: Item): boolean =>
  COMPONENT_TYPES.includes(item.type);

const allOfSameType = (items: Item[]): boolean =>
  items.every((item) => item.type === items[0].type);

// Only alike components combine into blocks — main items (swords, staves,
// potions, amulets) are always priced individually, however many there are.
const formsBuildingBlocks = (items: Item[]): boolean =>
  items.every(isComponent) && allOfSameType(items);

const sumOfItemPrices = (items: Item[]): number =>
  sumOf(items, riskAdjustedPriceOf);

// Every group of BLOCK_SIZE alike components is priced as one discounted
// building block; leftovers keep their individual price.
const buildingBlockPriceOf = (items: Item[]): number => {
  const blocks = Math.floor(items.length / BLOCK_SIZE);
  const itemsInBlocks = blocks * BLOCK_SIZE;
  const leftovers = items.slice(itemsInBlocks);
  return blocks * BLOCK_PRICE + sumOfItemPrices(leftovers);
};

const itemsPriceOf = (items: Item[]): number =>
  formsBuildingBlocks(items)
    ? buildingBlockPriceOf(items)
    : sumOfItemPrices(items);

const LOYAL_YEARS = 2;
const LOYALTY_PERCENT = 80;

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYAL_YEARS;

const REPEAT_CONTRACT_PERCENT = 85;

// The initial assessment surcharge applies to a customer's first insurance
// only; every later contract earns the repeat-customer discount instead.
const contractPercentFor = (previousContracts: number): number =>
  previousContracts === 0 ? FIRST_CONTRACT_PERCENT : REPEAT_CONTRACT_PERCENT;

// Premiums are always rounded up — rounding in MHPCO's favour, per spec.
const premiumFor = (
  itemsPrice: number,
  customer: Customer,
  previousContracts: number,
): number => {
  const contractPrice = applyPercent(
    itemsPrice,
    contractPercentFor(previousContracts),
  );
  const discountedPrice = isLoyal(customer)
    ? applyPercent(contractPrice, LOYALTY_PERCENT)
    : contractPrice;
  return Math.ceil(discountedPrice + CONTRACT_FEE);
};

const quote = (
  step: QuoteStep,
  customer: Customer,
  previousContracts: number,
): QuoteResult => ({
  premium: premiumFor(itemsPriceOf(step.items), customer, previousContracts),
});

const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;

const insuranceSumOf = (items: Item[]): number =>
  sumOf(items, (item) => INSURANCE_VALUES[item.type]);

// A claim's `policy` indexes the quote step that wrote the contract. Resolving
// it by narrowing rather than casting keeps the discriminated union honest: a
// claim pointing at a non-quote step fails loudly here instead of silently
// reading `items` off the wrong shape.
const policyAt = (steps: Step[], policyIndex: number): QuoteStep => {
  const step = steps[policyIndex];
  if (step?.op !== "quote") {
    throw new Error(`Step ${policyIndex} is not a policy`);
  }
  return step;
};

const FRAGILE_ENCHANTMENT_LEVEL = 8;
const FRAGILE_REIMBURSEMENT_PERCENT = 50;

// The MHPCO holds that heavily enchanted magic is inherently unstable, and
// only reimburses damage to such an item by half.
const isFragile = (item: Item): boolean =>
  item.enchantment >= FRAGILE_ENCHANTMENT_LEVEL;

const UNCOVERED_REIMBURSEMENT_PERCENT = 0;

const DRAGON_MATERIAL = "dragon";

// Dragon-forged items are reimbursed in full however enchanted they are.
const isDragonMade = (item: Item): boolean =>
  item.material === DRAGON_MATERIAL;

const insuredItemFor = (damage: Damage, insured: Item[]): Item | undefined =>
  insured.find((insuredItem) => insuredItem.type === damage.itemType);

// Every rate the MHPCO pays at, in precedence order: the first rule that
// matches the insured item wins. Dragon-forging is listed above fragility
// because it overrides it — a dragon-forged item is paid in full however
// heavily enchanted. Anything no rule claims is reimbursed in full.
const REIMBURSEMENT_RATES: {
  applies: (item: Item) => boolean;
  percent: number;
}[] = [
  { applies: isDragonMade, percent: WHOLE_PERCENT },
  { applies: isFragile, percent: FRAGILE_REIMBURSEMENT_PERCENT },
];

const reimbursementPercentFor = (item: Item | undefined): number => {
  if (item === undefined) return UNCOVERED_REIMBURSEMENT_PERCENT;
  return (
    REIMBURSEMENT_RATES.find((rate) => rate.applies(item))?.percent ??
    WHOLE_PERCENT
  );
};

const reimbursementFor = (damage: Damage, insured: Item[]): number =>
  applyPercent(
    damage.amount,
    reimbursementPercentFor(insuredItemFor(damage, insured)),
  );

// What an incident is worth before the policy's cap is considered: one
// deductible comes off the incident total, and a claim never pays out
// negative — a damage below the deductible simply pays nothing.
const claimedAmountFor = (incident: Incident, insured: Item[]): number =>
  Math.max(
    0,
    sumOf(incident.damages, (damage) => reimbursementFor(damage, insured)) -
      DEDUCTIBLE,
  );

// A policy will only ever pay out twice what its items are insured for.
const policyCapOf = (policy: QuoteStep): number =>
  CAP_MULTIPLE * insuranceSumOf(policy.items);

// However much an incident is worth, a policy pays only what its cap allows.
const cappedTo = (cap: number, amount: number): number =>
  Math.min(cap, amount);

// The cap belongs to the policy, not to the claim: each claim can only draw
// on what earlier claims against the same policy have left.
const claim = (
  step: ClaimStep,
  policy: QuoteStep,
  remainingCap: number,
): ClaimResult => {
  const payout = cappedTo(
    remainingCap,
    claimedAmountFor(step.incident, policy.items),
  );
  return { payout, remainingCap: remainingCap - payout };
};

// A policy's cap is spent down across every claim made against it, so the
// caps left over are carried from step to step. A policy not in the ledger
// has not been claimed against yet and still has its full cap.
type CapLedger = Map<number, number>;

const remainingCapFor = (
  ledger: CapLedger,
  policyIndex: number,
  policy: QuoteStep,
): number => ledger.get(policyIndex) ?? policyCapOf(policy);

const settleClaim = (
  step: ClaimStep,
  steps: Step[],
  ledger: CapLedger,
): ClaimResult => {
  const policy = policyAt(steps, step.policy);
  const result = claim(
    step,
    policy,
    remainingCapFor(ledger, step.policy, policy),
  );
  ledger.set(step.policy, result.remainingCap);
  return result;
};

// How many contracts the customer had already been written when this step was
// reached: only quote steps write contracts, so intervening claims must not
// advance the count.
const contractsWrittenBefore = (steps: Step[], stepIndex: number): number =>
  steps.slice(0, stepIndex).filter((step) => step.op === "quote").length;

// Steps are processed in order because a claim depletes the cap its policy
// has left for later claims.
export const run = (scenario: Scenario): ScenarioResult => {
  const ledger: CapLedger = new Map();

  const results = scenario.steps.map((step, stepIndex) =>
    step.op === "quote"
      ? quote(
          step,
          scenario.customer,
          contractsWrittenBefore(scenario.steps, stepIndex),
        )
      : settleClaim(step, scenario.steps, ledger),
  );

  return { results };
};
