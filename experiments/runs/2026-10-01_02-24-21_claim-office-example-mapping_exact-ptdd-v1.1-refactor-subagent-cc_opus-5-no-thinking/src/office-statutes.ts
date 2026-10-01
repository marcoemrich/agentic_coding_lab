/** An item a customer brings to be insured, as the office records it. */
export interface Item {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
}

/**
 * How the office classes an item on its price list. Main items each have a row of
 * their own; components share a single uniform rate, and the office's
 * building-block offer is written for components alone.
 */
type PriceListClass = "main item" | "component";

/** One row of the MHPCO price list: what the office charges to insure one such item. */
export interface PriceListEntry {
  class: PriceListClass;
  basePremium: number;
  insuranceValue: number;
}

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;

/**
 * The MHPCO price list, as posted at the counter: every kind of item the office
 * recognises, and what it charges for one of them. An item type absent from the
 * list is one the office does not insure.
 */
const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { class: "main item", basePremium: 100, insuranceValue: 1000 },
  amulet: { class: "main item", basePremium: 60, insuranceValue: 600 },
  staff: { class: "main item", basePremium: 80, insuranceValue: 800 },
  potion: { class: "main item", basePremium: 40, insuranceValue: 400 },
  rune: {
    class: "component",
    basePremium: COMPONENT_BASE_PREMIUM,
    insuranceValue: COMPONENT_INSURANCE_VALUE,
  },
  moonstone: {
    class: "component",
    basePremium: COMPONENT_BASE_PREMIUM,
    insuranceValue: COMPONENT_INSURANCE_VALUE,
  },
};

/** The price list's row for the given item type. */
export function priceListEntryOf(type: string): PriceListEntry {
  const entry = PRICE_LIST[type];
  if (entry === undefined) {
    throw new Error(`the MHPCO price list does not cover a ${type}`);
  }
  return entry;
}

/**
 * Which way money moves across the office's counter. The office's favour is one
 * principle for all its amounts, but which way it rounds an amount follows from
 * this: a fraction kept is a fraction the office gains.
 */
type DirectionOfPayment = "owed to the office" | "handed out by the office";

/**
 * The office writes whole G. Its one rounding principle -- "all amounts are rounded
 * to whole G in the MHPCO's favor" -- settles every fraction in its own favour, which
 * means keeping the fraction: an amount owed to it rounds up, an amount it hands out
 * rounds down. The direction of payment is the only thing that varies between its
 * amounts, so each kind of amount declares that and nothing else.
 */
function roundedInMHPCOsFavour(exactAmount: number, direction: DirectionOfPayment): number {
  return direction === "owed to the office" ? Math.ceil(exactAmount) : Math.floor(exactAmount);
}

/** A premium is money owed to the office, so its fraction is rounded up. */
export function premiumRoundedInMHPCOsFavour(exactPremium: number): number {
  return roundedInMHPCOsFavour(exactPremium, "owed to the office");
}

/**
 * A payout is money the office hands out, so its fraction is rounded down. Only the
 * final payout is rounded; the clauses before it keep their fractions.
 */
export function payoutRoundedInMHPCOsFavour(exactPayout: number): number {
  return roundedInMHPCOsFavour(exactPayout, "handed out by the office");
}
