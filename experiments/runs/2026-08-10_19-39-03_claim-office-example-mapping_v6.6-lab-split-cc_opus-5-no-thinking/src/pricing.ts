// What a policy costs. This module answers one question — given the items on
// a policy and the context the policy is written in, what premium does the
// customer pay? It knows nothing about scenarios, steps, or the order events
// happen in; see claim-office.ts for that. What a policy pays OUT is the
// mirror question, answered by coverage.ts.

import { roundUpInFavourOfMHPCO } from "./rounding.js";
import { quoteRejection } from "./rejection.js";

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;
const BASE_PREMIUM_BY_TYPE = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
} as const satisfies Record<string, number>;

export type KnownItemType = keyof typeof BASE_PREMIUM_BY_TYPE;

export interface Item {
  type: KnownItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const FIRST_INSURANCE_SURCHARGE = 0.1;

// The MHPCO's price list is closed: an item whose type is absent from it has
// no premium and no insurance value, so the quote is refused rather than
// guessed at. The type reaches here from parsed JSON, so the compiler's
// KnownItemType narrowing is not enough on its own.
const basePremiumOf = (item: Item): number => {
  const basePremium: number | undefined = BASE_PREMIUM_BY_TYPE[item.type];
  if (basePremium === undefined) {
    throw quoteRejection(
      `names a ${item.type}, which the MHPCO does not insure`,
    );
  }
  return basePremium;
};

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const groupByType = (items: Item[]): Item[][] => [
  ...items
    .reduce(
      (groups, item) =>
        groups.set(item.type, [...(groups.get(item.type) ?? []), item]),
      new Map<KnownItemType, Item[]>(),
    )
    .values(),
];

const sumOfBasePremiums = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumOf(item), 0);

// Exactly three alike components form a block at a reduced premium; any
// other count is priced per item.
//
// Deliberate simplification: "component" is not yet enforced, so three alike
// swords would also get the block. No test covers it and the spec gives no
// example — revisit when one does.
const groupBasePremiumOf = (group: Item[]): number =>
  group.length === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : sumOfBasePremiums(group);

const policyBasePremiumOf = (items: Item[]): number =>
  groupByType(items).reduce((sum, group) => sum + groupBasePremiumOf(group), 0);

const CURSE_SURCHARGE = 0.5;

// Item-specific modifiers are charged as a percentage of the affected item's
// OWN base premium. See withPolicyWideModifiers for the other scope.
const shareOfOwnBasePremium = (item: Item, rate: number): number =>
  basePremiumOf(item) * rate;

const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

// A rate the MHPCO charges or discounts, paired with the test for whether it
// applies to a given subject. Both scopes of modifier — item and policy-wide —
// are written this way, so both are collapsed by the same combinedRateOn.
interface Modifier<Subject> {
  applies: (subject: Subject) => boolean;
  rate: number;
}

// Every modifier rate in this domain combines additively, whether item-scoped
// or policy-wide: two rates of +50 % and +30 % make +80 %, never +95 %.
// Modifiers are never exclusive: all that apply are charged, which is why this
// sums the matches rather than taking the first.
const combinedRateOn = <Subject,>(
  modifiers: Modifier<Subject>[],
  subject: Subject,
): number =>
  modifiers.reduce(
    (total, { applies, rate }) => total + (applies(subject) ? rate : 0),
    0,
  );

// Both item modifiers can apply at once, and they stack additively: a cursed
// item with enchantment 5 pays 50 % + 30 % of its base premium.
const ITEM_SURCHARGES: Modifier<Item>[] = [
  { applies: (item) => item.cursed === true, rate: CURSE_SURCHARGE },
  { applies: isHighlyEnchanted, rate: HIGH_ENCHANTMENT_SURCHARGE },
];

const surchargeRateOn = (item: Item): number =>
  combinedRateOn(ITEM_SURCHARGES, item);

const surchargeOn = (item: Item): number =>
  shareOfOwnBasePremium(item, surchargeRateOn(item));

const itemSurchargesOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + surchargeOn(item), 0);

// Policy-wide modifiers scale the whole policy base premium, unlike item
// modifiers which are charged against the affected item's own base premium.
// They combine additively, so a policy carrying +10 % and -20 % pays 90 % of
// its base — not 110 % × 80 %.
const LOYALTY_DISCOUNT = -0.2;
const LOYALTY_THRESHOLD_YEARS = 2;

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const FOLLOW_UP_CONTRACT_DISCOUNT = -0.15;

// Everything about the policy's context that shifts its rates, as opposed to
// the items being priced. Travels as one value because every policy-wide
// modifier reads from it.
export interface PolicyContext {
  customer: Customer;
  isFollowUpContract: boolean;
}

const POLICY_WIDE_MODIFIERS: Modifier<PolicyContext>[] = [
  { applies: () => true, rate: FIRST_INSURANCE_SURCHARGE },
  { applies: ({ customer }) => isLoyal(customer), rate: LOYALTY_DISCOUNT },
  {
    applies: ({ isFollowUpContract }) => isFollowUpContract,
    rate: FOLLOW_UP_CONTRACT_DISCOUNT,
  },
];

const withPolicyWideModifiers = (
  policyBase: number,
  policy: PolicyContext,
): number =>
  policyBase * (1 + combinedRateOn(POLICY_WIDE_MODIFIERS, policy));

export const premiumFor = (items: Item[], policy: PolicyContext): number =>
  roundUpInFavourOfMHPCO(
    withPolicyWideModifiers(policyBasePremiumOf(items), policy) +
      itemSurchargesOf(items) +
      PROCESSING_FEE,
  );
