export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: Incident };

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// The MHPCO insures only what is on its price list.
export class UnknownItemTypeError extends Error {
  constructor(itemType: string) {
    super(`Unknown item type: ${itemType}`);
  }
}

// The MHPCO's price lists are keyed by item type, and a type absent from a list
// is not insurable at all -- so every lookup is guarded the same way.
const priceListLookup =
  (priceList: Record<string, number>) =>
  (itemType: string): number => {
    const price = priceList[itemType];
    if (price === undefined) throw new UnknownItemTypeError(itemType);
    return price;
  };

const basePremiumOf = priceListLookup(BASE_PREMIUMS);

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

// Each rule adds its percent of the item's *unmodified* base premium.
const ITEM_SURCHARGE_RULES: { applies: (item: Item) => boolean; percent: number }[] = [
  { applies: (item) => item.cursed === true, percent: CURSE_SURCHARGE_PERCENT },
  {
    applies: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL,
    percent: HIGH_ENCHANTMENT_SURCHARGE_PERCENT,
  },
];

const sumApplicablePercents = <T>(
  rules: { applies: (subject: T) => boolean; percent: number }[],
  subject: T,
): number =>
  rules.reduce(
    (percent, rule) => (rule.applies(subject) ? percent + rule.percent : percent),
    0,
  );

const WHOLE_PERCENT = 100;

const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / WHOLE_PERCENT;

const groupByType = (items: Item[]): Item[][] => {
  const groups = new Map<string, Item[]>();
  for (const item of items) groups.set(item.type, [...(groups.get(item.type) ?? []), item]);
  return [...groups.values()];
};

// Every item in the group shares one type, so one lookup prices them all.
const sameTypeGroupBasePremium = (sameTypeItems: Item[]): number =>
  sameTypeItems.length === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_BASE_PREMIUM
    : sameTypeItems.length * basePremiumOf(sameTypeItems[0].type);

const policyBasePremium = (items: Item[]): number =>
  groupByType(items).reduce((sum, group) => sum + sameTypeGroupBasePremium(group), 0);

const itemSurchargePercent = (item: Item): number =>
  sumApplicablePercents(ITEM_SURCHARGE_RULES, item);

const itemSurcharge = (item: Item): number =>
  percentOf(basePremiumOf(item.type), itemSurchargePercent(item));

const totalItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharge(item), 0);

// The MHPCO always rounds in its own favour, keeping the fraction either way:
// money coming in rounds up, money going out rounds down.
const roundInMHPCOsFavour = {
  moneyIn: Math.ceil,
  moneyOut: Math.floor,
};

const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = -20;

const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = -15;

// What the MHPCO knows about the customer when a quote is issued: who they are,
// plus how many contracts they have already taken out in this scenario.
interface CustomerStanding {
  customer: Customer;
  previousContracts: number;
}

// Signed percents of the *policy* base premium, driven by who the customer is
// rather than by what is insured. Negative percents are discounts.
const CUSTOMER_MODIFIER_RULES: {
  applies: (standing: CustomerStanding) => boolean;
  percent: number;
}[] = [
  { applies: () => true, percent: FIRST_INSURANCE_SURCHARGE_PERCENT },
  {
    applies: ({ customer }) => customer.yearsWithMHPCO >= LOYALTY_YEARS,
    percent: LOYALTY_DISCOUNT_PERCENT,
  },
  {
    applies: ({ previousContracts }) => previousContracts > 0,
    percent: FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT,
  },
];

const customerModifierPercent = (standing: CustomerStanding): number =>
  sumApplicablePercents(CUSTOMER_MODIFIER_RULES, standing);

const quotePremium = (items: Item[], standing: CustomerStanding): number => {
  const basePremium = policyBasePremium(items);
  return roundInMHPCOsFavour.moneyIn(
    basePremium +
      percentOf(basePremium, customerModifierPercent(standing)) +
      totalItemSurcharges(items) +
      PROCESSING_FEE,
  );
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;

const insuranceValueOf = priceListLookup(INSURANCE_VALUES);

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueOf(item.type), 0);

const REIMBURSED_ENCHANTMENT_LEVEL = 8;
const REIMBURSED_ENCHANTMENT_PERCENT = 50;

// How much of a damage amount the MHPCO reimburses before the deductible.
const reimbursementPercent = (item: Item): number =>
  (item.enchantment ?? 0) >= REIMBURSED_ENCHANTMENT_LEVEL
    ? REIMBURSED_ENCHANTMENT_PERCENT
    : WHOLE_PERCENT;

// A damage report the MHPCO refuses to process.
export class InvalidDamageAmountError extends Error {
  constructor(amount: number) {
    super(`Invalid damage amount: ${amount}`);
  }
}

// A damage entry must describe a loss, not a gain. One bad entry rejects the
// whole claim, so every entry is checked before any of them is settled.
const rejectInvalidDamages = (damages: Damage[]): void => {
  for (const { amount } of damages) {
    if (amount < 0) throw new InvalidDamageAmountError(amount);
  }
};

// The deductible is borne per damage event, so an entry below it settles at
// zero rather than going negative -- a small damage must not eat into what a
// larger one on the same incident pays out.
const damagePayout = (damage: Damage, item: Item): number =>
  Math.max(percentOf(damage.amount, reimbursementPercent(item)) - DEDUCTIBLE, 0);

// The MHPCO pays only for what it insures.
export class UninsuredItemError extends Error {
  constructor(itemType: string) {
    super(`Item not covered by the policy: ${itemType}`);
  }
}

// A pool of insured items that each damage entry draws from. Claiming an item
// removes it from the pool, so a policy covering one sword cannot be claimed
// for two damaged swords. A type the pool cannot supply is not a payout of
// zero -- it is not insured at all.
const createUnclaimedItemPool = (insuredItems: Item[]) => {
  const unclaimed = [...insuredItems];
  return {
    claimOneOfType: (itemType: string): Item => {
      const index = unclaimed.findIndex((item) => item.type === itemType);
      if (index === -1) throw new UninsuredItemError(itemType);
      return unclaimed.splice(index, 1)[0];
    },
  };
};

// The insured item each damage entry is settled against -- a distinct one per
// entry.
const matchDamagesToInsuredItems = (
  damages: Damage[],
  insuredItems: Item[],
): { damage: Damage; item: Item }[] => {
  const unclaimedItems = createUnclaimedItemPool(insuredItems);
  return damages.map((damage) => ({
    damage,
    item: unclaimedItems.claimOneOfType(damage.itemType),
  }));
};

const claimPayout = (incident: Incident, insuredItems: Item[]): number =>
  matchDamagesToInsuredItems(incident.damages, insuredItems).reduce(
    (payout, { damage, item }) => payout + damagePayout(damage, item),
    0,
  );

// The cap is 2 × the insurance sum of the insured items, unaffected by any
// premium modifiers.
const policyCap = (items: Item[]): number => CAP_MULTIPLE * insuranceSum(items);

const settleClaim = (
  incident: Incident,
  insuredItems: Item[],
  capBefore: number,
): { payout: number; remainingCap: number } => {
  rejectInvalidDamages(incident.damages);
  const payout = roundInMHPCOsFavour.moneyOut(
    Math.min(claimPayout(incident, insuredItems), capBefore),
  );
  return { payout, remainingCap: capBefore - payout };
};

// The cap left on each policy, keyed by the index of the quote step that
// created it. Successive claims against one policy draw down a shared cap.
const createCapLedger = () => {
  const remainingByPolicy = new Map<number, number>();
  return {
    open: (policyIndex: number, items: Item[]) =>
      remainingByPolicy.set(policyIndex, policyCap(items)),
    remainingOn: (policyIndex: number) => remainingByPolicy.get(policyIndex) ?? 0,
    drawDown: (policyIndex: number, remaining: number) =>
      remainingByPolicy.set(policyIndex, remaining),
  };
};

// Contracts taken out before a given step: one per preceding quote.
const previousContractsAt = (steps: Step[], stepIndex: number): number =>
  steps.slice(0, stepIndex).filter((step) => step.op === "quote").length;

// A claim step names its policy by the index of the quote step that created it.
const insuredItemsOf = (steps: Step[], policyIndex: number): Item[] => {
  const policyStep = steps[policyIndex];
  return policyStep.op === "quote" ? policyStep.items : [];
};

export const runScenario = ({ customer, steps }: Scenario): { results: Result[] } => {
  const capLedger = createCapLedger();

  const results = steps.map((step, stepIndex): Result => {
    if (step.op === "quote") {
      capLedger.open(stepIndex, step.items);
      return {
        premium: quotePremium(step.items, {
          customer,
          previousContracts: previousContractsAt(steps, stepIndex),
        }),
      };
    }

    const settlement = settleClaim(
      step.incident,
      insuredItemsOf(steps, step.policy),
      capLedger.remainingOn(step.policy),
    );
    capLedger.drawDown(step.policy, settlement.remainingCap);
    return settlement;
  });

  return { results };
};
